import hashlib
import json
import logging
from pathlib import Path

import openai
import redis.asyncio as redis

from app.core.config import settings
from app.services.translation.spec_templates import SPEC_KEY_TEMPLATES

logger = logging.getLogger(__name__)

DICTIONARIES_DIR = Path(__file__).parent / "dictionaries"

TRANSLATION_CACHE_TTL = 60 * 60 * 24 * 7  # 7 days

SYSTEM_PROMPT = (
    "You are a professional e-commerce product translator. "
    "Translate the following Chinese product texts into natural, accurate English. "
    "Preserve brand names, model numbers, and technical specs as-is. "
    "Return ONLY a JSON array of translated strings in the same order as the input. "
    "No explanations."
)


class FieldTranslator:
    """Three-tier translation: dictionary -> template -> LLM."""

    def __init__(self) -> None:
        self._openai = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self._dictionaries: dict[str, dict[str, str]] = {}
        self._load_dictionaries()

    def _load_dictionaries(self) -> None:
        if not DICTIONARIES_DIR.is_dir():
            logger.warning("Dictionaries directory not found: %s", DICTIONARIES_DIR)
            return
        for path in DICTIONARIES_DIR.glob("*.json"):
            try:
                with open(path, encoding="utf-8") as f:
                    data = json.load(f)
                self._dictionaries[path.stem] = data
                logger.debug("Loaded dictionary '%s' with %d entries", path.stem, len(data))
            except Exception:
                logger.exception("Failed to load dictionary %s", path)

    def _dictionary_translate(self, text: str) -> str | None:
        text_stripped = text.strip()
        for entries in self._dictionaries.values():
            if text_stripped in entries:
                return entries[text_stripped]
        return None

    def _template_translate(self, specs: dict, category: str) -> dict:
        template = SPEC_KEY_TEMPLATES.get(category, {})
        translated: dict[str, str] = {}
        for key, value in specs.items():
            en_key = template.get(key, key)
            en_value = self._dictionary_translate(value) if isinstance(value, str) else None
            translated[en_key] = en_value if en_value is not None else value
        return translated

    async def _llm_translate(self, texts: list[str]) -> list[str]:
        if not texts:
            return []

        cached_results: dict[int, str] = {}
        uncached_indices: list[int] = []
        uncached_texts: list[str] = []

        for i, text in enumerate(texts):
            cached = await self._get_cache(text)
            if cached is not None:
                cached_results[i] = cached
            else:
                uncached_indices.append(i)
                uncached_texts.append(text)

        if uncached_texts:
            try:
                translated = await self._call_llm(uncached_texts)
                for idx, original, result in zip(
                    uncached_indices, uncached_texts, translated
                ):
                    cached_results[idx] = result
                    await self._set_cache(original, result)
            except Exception:
                logger.exception("LLM translation failed for %d texts", len(uncached_texts))
                for idx, original in zip(uncached_indices, uncached_texts):
                    cached_results[idx] = original

        return [cached_results[i] for i in range(len(texts))]

    async def translate_product(self, product: dict) -> dict:
        result = dict(product)
        category = product.get("category", "")

        if "specs" in product and isinstance(product["specs"], dict):
            result["specs_en"] = self._template_translate(product["specs"], category)

        texts_to_translate: list[str] = []
        field_map: list[tuple[str, str]] = []

        for field, en_field in [("title", "title_en"), ("description", "description_en")]:
            value = product.get(field)
            if value and isinstance(value, str):
                dict_result = self._dictionary_translate(value)
                if dict_result is not None:
                    result[en_field] = dict_result
                else:
                    texts_to_translate.append(value)
                    field_map.append((field, en_field))

        if texts_to_translate:
            translations = await self._llm_translate(texts_to_translate)
            for (_, en_field), translated in zip(field_map, translations):
                result[en_field] = translated

        return result

    async def translate_batch(self, products: list[dict]) -> list[dict]:
        if not products:
            return []

        results: list[dict] = []
        all_texts: list[str] = []
        product_field_indices: list[list[tuple[str, int]]] = []

        for product in products:
            result = dict(product)
            category = product.get("category", "")

            if "specs" in product and isinstance(product["specs"], dict):
                result["specs_en"] = self._template_translate(product["specs"], category)

            indices: list[tuple[str, int]] = []
            for field, en_field in [("title", "title_en"), ("description", "description_en")]:
                value = product.get(field)
                if value and isinstance(value, str):
                    dict_result = self._dictionary_translate(value)
                    if dict_result is not None:
                        result[en_field] = dict_result
                    else:
                        indices.append((en_field, len(all_texts)))
                        all_texts.append(value)

            results.append(result)
            product_field_indices.append(indices)

        if all_texts:
            translations = await self._llm_translate(all_texts)
            for result, indices in zip(results, product_field_indices):
                for en_field, text_idx in indices:
                    result[en_field] = translations[text_idx]

        logger.info(
            "Batch translated %d products (%d LLM calls)",
            len(products),
            len(all_texts),
        )
        return results

    async def _get_cache(self, text: str) -> str | None:
        cache_key = self._cache_key(text)
        try:
            return await self._redis.get(cache_key)
        except Exception:
            logger.warning("Redis read error for translation cache", exc_info=True)
            return None

    async def _set_cache(self, text: str, translation: str) -> None:
        cache_key = self._cache_key(text)
        try:
            await self._redis.set(
                cache_key,
                translation,
                ex=TRANSLATION_CACHE_TTL,
            )
        except Exception:
            logger.warning("Redis write error for translation cache", exc_info=True)

    @staticmethod
    def _cache_key(text: str) -> str:
        text_hash = hashlib.md5(text.encode()).hexdigest()
        return f"tr:{text_hash}"

    async def _call_llm(self, texts: list[str]) -> list[str]:
        user_content = json.dumps(texts, ensure_ascii=False)
        response = await self._openai.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            temperature=0.2,
            max_tokens=2048,
        )
        content = response.choices[0].message.content or "[]"
        content = content.strip().removeprefix("```json").removesuffix("```").strip()
        result = json.loads(content)
        if not isinstance(result, list) or len(result) != len(texts):
            raise ValueError(
                f"LLM returned {len(result) if isinstance(result, list) else type(result)} "
                f"items, expected {len(texts)}"
            )
        return result
