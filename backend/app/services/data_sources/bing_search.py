import asyncio
import hashlib
import logging
import re
from urllib.parse import urlparse

import httpx

from app.core.config import settings
from app.services.data_sources.base import DataSourceBase, RawProduct

logger = logging.getLogger(__name__)

PLATFORM_DOMAINS = {
    "taobao.com": "taobao",
    "jd.com": "jd",
    "1688.com": "1688",
    "pinduoduo.com": "pdd",
}

PRICE_PATTERN = re.compile(
    r"(?:\u00a5|RMB|CNY)\s*(\d+(?:\.\d{1,2})?)"
    r"|(\d+(?:\.\d{1,2})?)\s*(?:yuan|RMB|\u5143)"
)

REQUEST_TIMEOUT = 10.0


def _detect_platform(url: str) -> str | None:
    hostname = urlparse(url).hostname or ""
    for domain, name in PLATFORM_DOMAINS.items():
        if hostname.endswith(domain):
            return name
    return None


def _extract_price(text: str) -> float | None:
    match = PRICE_PATTERN.search(text)
    if not match:
        return None
    raw = match.group(1) or match.group(2)
    try:
        return float(raw)
    except (ValueError, TypeError):
        return None


def _url_hash(url: str) -> str:
    return hashlib.md5(url.encode()).hexdigest()[:16]


class BingSearchSource(DataSourceBase):
    def __init__(self) -> None:
        self._endpoint = settings.BING_ENDPOINT
        self._api_key = settings.BING_API_KEY
        self._headers = {"Ocp-Apim-Subscription-Key": self._api_key}

    async def search(
        self, query_zh: str, page: int = 1, page_size: int = 20
    ) -> list[RawProduct]:
        tasks = [
            self._search_platform(query_zh, domain, page, page_size)
            for domain in PLATFORM_DOMAINS
        ]
        results_per_platform = await asyncio.gather(*tasks, return_exceptions=True)

        products: list[RawProduct] = []
        for idx, result in enumerate(results_per_platform):
            domain = list(PLATFORM_DOMAINS.keys())[idx]
            if isinstance(result, BaseException):
                logger.warning(
                    "Bing search failed for domain=%s: %s", domain, result
                )
                continue
            products.extend(result)

        return products

    async def _search_platform(
        self, query_zh: str, domain: str, page: int, page_size: int
    ) -> list[RawProduct]:
        query = f"{query_zh} site:{domain} price"
        offset = (page - 1) * page_size
        params = {
            "q": query,
            "count": page_size,
            "offset": offset,
            "mkt": "zh-CN",
        }

        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            resp = await client.get(
                self._endpoint, headers=self._headers, params=params
            )
            resp.raise_for_status()

        data = resp.json()
        web_pages = data.get("webPages", {}).get("value", [])
        platform_name = PLATFORM_DOMAINS.get(domain, domain)

        products: list[RawProduct] = []
        for item in web_pages:
            url = item.get("url", "")
            title = item.get("name", "")
            snippet = item.get("snippet", "")

            detected = _detect_platform(url)
            if detected is None:
                detected = platform_name

            price = _extract_price(snippet) or _extract_price(title)

            products.append(
                RawProduct(
                    platform=detected,
                    platform_product_id=_url_hash(url),
                    title=title,
                    url=url,
                    price=price,
                    snippet=snippet,
                )
            )

        logger.info(
            "Bing search domain=%s returned %d results", domain, len(products)
        )
        return products

    async def get_product(self, product_id: str) -> RawProduct | None:
        return None

    async def check_health(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                resp = await client.get(
                    self._endpoint,
                    headers=self._headers,
                    params={"q": "test", "count": 1},
                )
                resp.raise_for_status()
            return True
        except Exception:
            logger.exception("Bing health check failed")
            return False
