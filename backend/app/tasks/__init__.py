from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "chinaprice",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "refresh-top-products": {
            "task": "refresh_top_products",
            "schedule": 7200.0,
        },
        "check-link-health": {
            "task": "check_link_health",
            "schedule": 86400.0,
        },
        "clean-expired-cache": {
            "task": "clean_expired_cache",
            "schedule": 21600.0,
        },
        "reindex-elasticsearch": {
            "task": "reindex_elasticsearch",
            "schedule": 43200.0,
        },
    },
)

from app.tasks.periodic import (  # noqa: E402, F401
    check_link_health,
    clean_expired_cache,
    refresh_top_products,
    reindex_elasticsearch,
)
