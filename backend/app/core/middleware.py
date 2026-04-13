import logging
from typing import Any, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.config import settings

logger = logging.getLogger(__name__)


class CostTrackingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: Any) -> None:
        super().__init__(app)
        self._cache = None

    def _get_cache(self):
        if self._cache is None:
            try:
                from app.services.cache import CacheService
                self._cache = CacheService()
            except Exception:
                pass
        return self._cache

    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        response: Response = await call_next(request)

        try:
            cache = self._get_cache()
            if cache is not None:
                daily_cost = await cache.get_daily_ai_cost()
                response.headers["X-AI-Cost-Today"] = f"{daily_cost:.4f}"

                if daily_cost >= settings.AI_DAILY_BUDGET_USD:
                    logger.warning(
                        "AI daily budget exceeded: $%.4f / $%.2f",
                        daily_cost,
                        settings.AI_DAILY_BUDGET_USD,
                    )
        except Exception:
            pass

        return response
