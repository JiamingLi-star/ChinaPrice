import asyncio
import logging

from app.services.data_sources.base import DataSourceBase, RawProduct
from app.services.data_sources.bing_search import BingSearchSource
from app.services.data_sources.mock_platform import (
    create_mock_1688,
    create_mock_jd,
    create_mock_pdd,
    create_mock_taobao,
)

logger = logging.getLogger(__name__)

SOURCE_TIMEOUT = 15.0


class DataOrchestrator:
    def __init__(self) -> None:
        self._sources: list[DataSourceBase] = [
            BingSearchSource(),
            create_mock_jd(),
            create_mock_taobao(),
            create_mock_1688(),
            create_mock_pdd(),
        ]

    async def search(self, query_en: str) -> list[RawProduct]:
        query_variants = await self._translate_query(query_en)
        logger.info(
            "Translated query '%s' into %d variant(s)", query_en, len(query_variants)
        )

        tasks = []
        for source in self._sources:
            for variant in query_variants:
                tasks.append(self._search_with_timeout(source, variant))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        all_products: list[RawProduct] = []
        for idx, result in enumerate(results):
            if isinstance(result, BaseException):
                logger.warning("Source task %d failed: %s", idx, result)
                continue
            all_products.extend(result)

        deduplicated = self._deduplicate(all_products)
        logger.info(
            "Orchestrator collected %d raw, %d after dedup",
            len(all_products),
            len(deduplicated),
        )
        return deduplicated

    async def _translate_query(self, query_en: str) -> list[str]:
        try:
            from app.services.ai.query_translator import translate_query

            variants = await translate_query(query_en)
            if variants:
                return variants
        except ImportError:
            logger.warning(
                "AI query translator not available, using raw query"
            )
        except Exception:
            logger.exception("Query translation failed, falling back to raw query")
        return [query_en]

    async def _search_with_timeout(
        self, source: DataSourceBase, query_zh: str
    ) -> list[RawProduct]:
        try:
            return await asyncio.wait_for(
                source.search(query_zh), timeout=SOURCE_TIMEOUT
            )
        except asyncio.TimeoutError:
            logger.warning(
                "Source %s timed out after %.1fs for query=%s",
                type(source).__name__,
                SOURCE_TIMEOUT,
                query_zh,
            )
            return []

    @staticmethod
    def _deduplicate(products: list[RawProduct]) -> list[RawProduct]:
        seen: set[str] = set()
        unique: list[RawProduct] = []
        for p in products:
            if p.url not in seen:
                seen.add(p.url)
                unique.append(p)
        return unique
