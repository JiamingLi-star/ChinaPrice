import logging
from typing import Any

from elasticsearch import AsyncElasticsearch

from app.core.config import settings

logger = logging.getLogger(__name__)

SORT_OPTIONS: dict[str, list[dict[str, Any]]] = {
    "best_value": [{"_score": {"order": "desc"}}],
    "lowest_price": [{"best_price": {"order": "asc"}}],
    "best_rated": [{"rating": {"order": "desc"}}],
    "most_popular": [{"sales_count": {"order": "desc"}}],
}

INDEX_MAPPINGS: dict[str, Any] = {
    "properties": {
        "name_en": {"type": "text", "analyzer": "standard"},
        "name_zh": {"type": "text"},
        "category": {"type": "keyword"},
        "brand": {"type": "keyword"},
        "best_price": {"type": "float"},
        "best_price_platform": {"type": "keyword"},
        "platforms": {"type": "keyword"},
        "rating": {"type": "float"},
        "review_count": {"type": "integer"},
        "sales_count": {"type": "integer"},
        "image_url": {"type": "keyword"},
        "updated_at": {"type": "date"},
    }
}


class ElasticsearchService:
    INDEX_NAME = "products"

    def __init__(self) -> None:
        self._es = AsyncElasticsearch(settings.ELASTICSEARCH_URL)

    async def ensure_index(self) -> None:
        exists = await self._es.indices.exists(index=self.INDEX_NAME)
        if not exists:
            await self._es.indices.create(
                index=self.INDEX_NAME,
                body={"mappings": INDEX_MAPPINGS},
            )
            logger.info("Created Elasticsearch index '%s'", self.INDEX_NAME)

    async def index_product(self, product_id: str, data: dict) -> None:
        await self._es.index(
            index=self.INDEX_NAME, id=product_id, body=data, refresh="wait_for"
        )

    async def index_bulk(self, products: list[dict]) -> None:
        if not products:
            return
        actions: list[dict] = []
        for product in products:
            pid = product.get("id", product.get("product_id", ""))
            actions.append({"index": {"_index": self.INDEX_NAME, "_id": pid}})
            actions.append(product)
        await self._es.bulk(body=actions, refresh="wait_for")
        logger.info("Bulk indexed %d products", len(products))

    async def search(
        self,
        query: str,
        category: str | None = None,
        price_min: float | None = None,
        price_max: float | None = None,
        platforms: list[str] | None = None,
        sort: str = "best_value",
        page: int = 1,
        page_size: int = 20,
    ) -> dict:
        must = [
            {
                "multi_match": {
                    "query": query,
                    "fields": ["name_en^3", "name_zh^2", "brand"],
                }
            }
        ]

        filters: list[dict] = []
        if category:
            filters.append({"term": {"category": category}})
        if price_min is not None or price_max is not None:
            price_range: dict[str, Any] = {}
            if price_min is not None:
                price_range["gte"] = price_min
            if price_max is not None:
                price_range["lte"] = price_max
            filters.append({"range": {"best_price": price_range}})
        if platforms:
            filters.append({"terms": {"platforms": platforms}})

        body: dict[str, Any] = {
            "query": {
                "bool": {
                    "must": must,
                    "filter": filters,
                }
            },
            "sort": SORT_OPTIONS.get(sort, SORT_OPTIONS["best_value"]),
            "from": (page - 1) * page_size,
            "size": page_size,
        }

        result = await self._es.search(index=self.INDEX_NAME, body=body)
        hits = result.get("hits", {})
        return {
            "total": hits.get("total", {}).get("value", 0),
            "hits": [
                {"id": h["_id"], "score": h["_score"], **h["_source"]}
                for h in hits.get("hits", [])
            ],
        }

    async def delete_product(self, product_id: str) -> None:
        await self._es.delete(
            index=self.INDEX_NAME, id=product_id, refresh="wait_for"
        )

    async def close(self) -> None:
        await self._es.close()
