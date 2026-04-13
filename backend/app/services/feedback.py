import logging
import uuid
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

VALID_FEEDBACK_TYPES = {"wrong_price", "wrong_match", "broken_link", "other"}


class FeedbackService:
    def __init__(self):
        self._store: list[dict] = []

    async def submit(
        self,
        feedback_type: str,
        details: str,
        platform_product_id: str | None = None,
    ) -> dict:
        if feedback_type not in VALID_FEEDBACK_TYPES:
            feedback_type = "other"

        record = {
            "id": str(uuid.uuid4()),
            "feedback_type": feedback_type,
            "details": details,
            "platform_product_id": platform_product_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "pending",
        }

        self._store.append(record)
        logger.info(
            "Feedback received: type=%s, product=%s",
            feedback_type,
            platform_product_id or "N/A",
        )

        return {"id": record["id"], "status": "received"}

    async def list_pending(self, limit: int = 50) -> list[dict]:
        pending = [f for f in self._store if f["status"] == "pending"]
        return pending[:limit]

    async def resolve(self, feedback_id: str, resolution: str) -> dict | None:
        for record in self._store:
            if record["id"] == feedback_id:
                record["status"] = "resolved"
                record["resolution"] = resolution
                record["resolved_at"] = datetime.now(timezone.utc).isoformat()
                logger.info("Feedback %s resolved: %s", feedback_id, resolution)
                return record
        return None

    def get_stats(self) -> dict:
        total = len(self._store)
        by_type: dict[str, int] = {}
        by_status: dict[str, int] = {}

        for record in self._store:
            ft = record["feedback_type"]
            by_type[ft] = by_type.get(ft, 0) + 1
            st = record["status"]
            by_status[st] = by_status.get(st, 0) + 1

        return {"total": total, "by_type": by_type, "by_status": by_status}
