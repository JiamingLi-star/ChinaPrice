import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

WEIGHT_PRICE = 0.30
WEIGHT_TRUST = 0.25
WEIGHT_REVIEW = 0.20
WEIGHT_FRESHNESS = 0.15
WEIGHT_LINK = 0.10

MAX_SELLER_AGE_DAYS = 3650
MAX_REVIEW_COUNT = 10000
MAX_FRESHNESS_DAYS = 90


class ProductScorer:
    def score(self, products: list[dict]) -> list[dict]:
        if not products:
            return []

        prices = [
            p.get("price") for p in products if _is_positive(p.get("price"))
        ]
        min_price = min(prices) if prices else 0
        max_price = max(prices) if prices else 0
        price_range = max_price - min_price if max_price > min_price else 1.0

        now = datetime.now(timezone.utc)

        for product in products:
            breakdown = {
                "price_score": self._price_score(product, min_price, price_range),
                "trust_score": self._trust_score(product),
                "review_score": self._review_score(product),
                "freshness_score": self._freshness_score(product, now),
                "link_score": self._link_score(product),
            }

            composite = (
                breakdown["price_score"] * WEIGHT_PRICE
                + breakdown["trust_score"] * WEIGHT_TRUST
                + breakdown["review_score"] * WEIGHT_REVIEW
                + breakdown["freshness_score"] * WEIGHT_FRESHNESS
                + breakdown["link_score"] * WEIGHT_LINK
            )

            product["score"] = round(composite, 1)
            product["score_breakdown"] = {k: round(v, 1) for k, v in breakdown.items()}

        return products

    def sort(
        self, products: list[dict], sort_by: str = "best_value"
    ) -> list[dict]:
        sort_fns = {
            "best_value": lambda p: p.get("score", 0),
            "lowest_price": lambda p: -(p.get("price") or float("inf")),
            "best_rated": lambda p: p.get("rating") or 0,
            "most_popular": lambda p: p.get("sales_count") or 0,
        }
        key_fn = sort_fns.get(sort_by, sort_fns["best_value"])
        return sorted(products, key=key_fn, reverse=True)

    @staticmethod
    def _price_score(product: dict, min_price: float, price_range: float) -> float:
        price = product.get("price")
        if not _is_positive(price):
            return 0.0
        percentile = 1.0 - ((price - min_price) / price_range)
        return max(0.0, min(100.0, percentile * 100))

    @staticmethod
    def _trust_score(product: dict) -> float:
        rating = product.get("rating")
        seller_age = product.get("seller_age_days")

        rating_part = 0.0
        if rating is not None and rating > 0:
            rating_part = min(rating / 5.0, 1.0) * 50

        age_part = 0.0
        if seller_age is not None and seller_age > 0:
            age_part = min(seller_age / MAX_SELLER_AGE_DAYS, 1.0) * 50

        return rating_part + age_part

    @staticmethod
    def _review_score(product: dict) -> float:
        rating = product.get("rating")
        count = product.get("review_count")

        rating_part = 0.0
        if rating is not None and rating > 0:
            rating_part = min(rating / 5.0, 1.0) * 50

        count_part = 0.0
        if count is not None and count > 0:
            count_part = min(count / MAX_REVIEW_COUNT, 1.0) * 50

        return rating_part + count_part

    @staticmethod
    def _freshness_score(product: dict, now: datetime) -> float:
        updated = product.get("price_updated_at")
        if updated is None:
            return 50.0

        if isinstance(updated, str):
            try:
                updated = datetime.fromisoformat(updated)
            except ValueError:
                return 50.0

        if updated.tzinfo is None:
            updated = updated.replace(tzinfo=timezone.utc)

        age_days = (now - updated).total_seconds() / 86400
        if age_days < 0:
            return 100.0
        return max(0.0, (1.0 - age_days / MAX_FRESHNESS_DAYS) * 100)

    @staticmethod
    def _link_score(product: dict) -> float:
        status = product.get("link_status", "active")
        return 100.0 if status == "active" else 0.0


def _is_positive(value) -> bool:
    return value is not None and isinstance(value, (int, float)) and value > 0
