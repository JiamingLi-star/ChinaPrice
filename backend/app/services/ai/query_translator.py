import hashlib
import json
import logging

import openai
import redis.asyncio as redis

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a translation assistant for e-commerce product search. "
    "Given an English product search query, translate it into 4-6 Chinese "
    "e-commerce search query variants. Consider different ways Chinese sellers "
    "might list the same product, including brand transliterations, common "
    "abbreviations, and alternative product names used on platforms like "
    "Taobao, JD, 1688, and Pinduoduo. "
    "Return ONLY a JSON array of strings, no explanation."
)


class QueryTranslator:
    def __init__(self) -> None:
        self._openai = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._redis = redis.from_url(settings.REDIS_URL, decode_responses=True)

    async def translate(self, query_en: str) -> list[str]:
        query_hash = hashlib.md5(query_en.lower().encode()).hexdigest()
        cache_key = f"qt:{query_hash}"

        cached = await self._try_cache(cache_key)
        if cached is not None:
            return cached

        try:
            translations = await self._call_llm(query_en)
            await self._set_cache(cache_key, translations)
            logger.info(
                "Translated query '%s' into %d variants", query_en, len(translations)
            )
            return translations
        except Exception:
            logger.exception("OpenAI translation failed for query '%s'", query_en)
            return [query_en]

    async def _try_cache(self, cache_key: str) -> list[str] | None:
        try:
            raw = await self._redis.get(cache_key)
            if raw is not None:
                logger.debug("Cache hit for %s", cache_key)
                return json.loads(raw)
        except Exception:
            logger.warning("Redis read error for key %s", cache_key, exc_info=True)
        return None

    async def _set_cache(self, cache_key: str, translations: list[str]) -> None:
        try:
            await self._redis.set(
                cache_key,
                json.dumps(translations, ensure_ascii=False),
                ex=settings.QUERY_CACHE_TTL,
            )
        except Exception:
            logger.warning("Redis write error for key %s", cache_key, exc_info=True)

    async def _call_llm(self, query_en: str) -> list[str]:
        response = await self._openai.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query_en},
            ],
            temperature=0.3,
            max_tokens=512,
        )
        content = response.choices[0].message.content or "[]"
        content = content.strip().removeprefix("```json").removesuffix("```").strip()
        result = json.loads(content)
        if not isinstance(result, list) or not all(isinstance(s, str) for s in result):
            raise ValueError(f"Unexpected LLM response format: {content!r}")
        return result
