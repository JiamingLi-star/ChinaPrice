import json
import logging
import re

import openai

from app.core.config import settings

logger = logging.getLogger(__name__)

PRICE_PATTERNS = [
    re.compile(r"[\$\u00a5\uffe5]\s*([\d,]+\.?\d*)"),      # $123 or currency symbols
    re.compile(r"([\d,]+\.?\d*)\s*(?:yuan|rmb)", re.I),     # 123 yuan / 123 RMB
    re.compile(r"price[:\s]*([\d,]+\.?\d*)", re.I),         # price: 123
]

RATING_PATTERNS = [
    re.compile(r"([\d.]+)\s*(?:stars?|/\s*5)", re.I),       # 4.8 stars or 4.8/5
    re.compile(r"rating[:\s]*([\d.]+)", re.I),              # rating: 4.8
]

SALES_PATTERNS = [
    re.compile(r"([\d,]+)\+?\s*(?:sold|sales|pcs)", re.I),  # 1000+ sold
    re.compile(r"monthly\s*sales?[:\s]*([\d,]+)", re.I),    # monthly sales: 500
]

LLM_PARSE_PROMPT = (
    "You are a structured data extractor for e-commerce product listings. "
    "Given a list of product snippets, extract for each:\n"
    "- product_name (str)\n"
    "- price (float or null)\n"
    "- price_type (str: 'original', 'coupon', 'group_buy', 'flash_sale', 'member')\n"
    "- rating (float or null, 0-5 scale)\n"
    "- specs (dict of key-value pairs, e.g. {\"color\": \"red\", \"size\": \"XL\"})\n\n"
    "Return a JSON array with one object per snippet. "
    "If a field cannot be determined, use null. "
    "Return ONLY the JSON array."
)


class DataParser:
    def __init__(self) -> None:
        self._openai = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def parse_snippets(self, snippets: list[dict]) -> list[dict]:
        if not snippets:
            return []

        results: list[dict] = []
        needs_llm: list[tuple[int, dict]] = []

        for idx, snippet in enumerate(snippets):
            parsed = self._rule_based_parse(snippet)
            if parsed is not None:
                results.append(parsed)
            else:
                needs_llm.append((idx, snippet))
                results.append({})

        if needs_llm:
            try:
                llm_items = [item for _, item in needs_llm]
                llm_results = await self._llm_batch_parse(llm_items)
                for i, (idx, _) in enumerate(needs_llm):
                    if i < len(llm_results):
                        results[idx] = llm_results[i]
            except Exception:
                logger.exception("LLM batch parse failed for %d snippets", len(needs_llm))

        return results

    def _rule_based_parse(self, snippet: dict) -> dict | None:
        text = snippet.get("snippet", "") or snippet.get("title", "") or ""
        if not text:
            return None

        price = self._extract_first(PRICE_PATTERNS, text)
        if price is None:
            return None

        rating = self._extract_first(RATING_PATTERNS, text)
        sales = self._extract_first(SALES_PATTERNS, text)

        return {
            "product_name": snippet.get("title", ""),
            "price": price,
            "price_type": "original",
            "rating": min(rating, 5.0) if rating is not None else None,
            "sales_count": int(sales) if sales is not None else None,
            "specs": {},
            "source": "rule_based",
        }

    async def _llm_batch_parse(self, snippets: list[dict]) -> list[dict]:
        user_content = json.dumps(snippets, ensure_ascii=False, default=str)
        response = await self._openai.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": LLM_PARSE_PROMPT},
                {"role": "user", "content": user_content},
            ],
            temperature=0.0,
            max_tokens=2048,
        )
        content = response.choices[0].message.content or "[]"
        content = content.strip().removeprefix("```json").removesuffix("```").strip()
        result = json.loads(content)
        if not isinstance(result, list):
            raise ValueError(f"Unexpected LLM parse format: {content!r}")

        for item in result:
            item["source"] = "llm"

        return result

    @staticmethod
    def _extract_first(patterns: list[re.Pattern], text: str) -> float | None:
        for pattern in patterns:
            match = pattern.search(text)
            if match:
                raw = match.group(1).replace(",", "")
                try:
                    return float(raw)
                except ValueError:
                    continue
        return None
