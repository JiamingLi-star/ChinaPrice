import hashlib
import json
import logging
from datetime import date

import redis.asyncio as aioredis

from app.core.config import settings

logger = logging.getLogger(__name__)


class CacheService:
    def __init__(self) -> None:
        self._redis = aioredis.from_url(
            settings.REDIS_URL, decode_responses=True
        )

    async def get(self, key: str) -> dict | None:
        raw = await self._redis.get(key)
        if raw is None:
            return None
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            logger.warning("Corrupt cache entry for key=%s, ignoring", key)
            return None

    async def set(self, key: str, data: dict, ttl: int | None = None) -> None:
        payload = json.dumps(data, ensure_ascii=False)
        if ttl is not None:
            await self._redis.setex(key, ttl, payload)
        else:
            await self._redis.set(key, payload)

    async def delete(self, key: str) -> None:
        await self._redis.delete(key)

    # ------------------------------------------------------------------
    # Search result caching
    # ------------------------------------------------------------------

    @staticmethod
    def _search_key(query: str, page: int) -> str:
        digest = hashlib.md5(query.encode()).hexdigest()
        return f"search:{digest}:{page}"

    async def get_search_results(self, query: str, page: int) -> dict | None:
        return await self.get(self._search_key(query, page))

    async def set_search_results(
        self,
        query: str,
        page: int,
        results: dict,
        hot: bool = True,
    ) -> None:
        ttl = settings.CACHE_TTL_HOT if hot else settings.CACHE_TTL_COLD
        await self.set(self._search_key(query, page), results, ttl=ttl)

    async def invalidate_search(self, query: str) -> None:
        digest = hashlib.md5(query.encode()).hexdigest()
        pattern = f"search:{digest}:*"
        cursor: int | str = 0
        while True:
            cursor, keys = await self._redis.scan(
                cursor=cursor, match=pattern, count=100
            )
            if keys:
                await self._redis.delete(*keys)
            if cursor == 0:
                break

    # ------------------------------------------------------------------
    # AI cost tracking
    # ------------------------------------------------------------------

    @staticmethod
    def _ai_cost_key() -> str:
        return f"ai_cost:{date.today().isoformat()}"

    async def get_daily_ai_cost(self) -> float:
        raw = await self._redis.get(self._ai_cost_key())
        if raw is None:
            return 0.0
        try:
            return float(raw)
        except (ValueError, TypeError):
            return 0.0

    async def increment_ai_cost(self, amount: float) -> None:
        key = self._ai_cost_key()
        await self._redis.incrbyfloat(key, amount)
        await self._redis.expire(key, 48 * 3600)

    async def is_within_ai_budget(self) -> bool:
        current = await self.get_daily_ai_cost()
        return current < settings.AI_DAILY_BUDGET_USD

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def close(self) -> None:
        await self._redis.aclose()
