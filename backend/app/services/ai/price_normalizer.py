import logging

logger = logging.getLogger(__name__)

INTERNATIONAL_MARKUP = 1.15

PRICE_TYPE_KEYWORDS: dict[str, str] = {
    "coupon": "coupon",
    "group": "group_buy",
    "tuan": "group_buy",
    "member": "member",
    "vip": "member",
    "flash": "flash_sale",
    "seckill": "flash_sale",
}


class PriceNormalizer:
    def normalize(self, raw_products: list) -> list:
        normalized = []
        for product in raw_products:
            try:
                normalized.append(self._normalize_one(product))
            except Exception:
                logger.exception("Failed to normalize product: %s", product)
                normalized.append(product)
        return normalized

    def detect_price_type(self, text: str) -> str:
        if not text:
            return "original"
        lowered = text.lower()
        for keyword, price_type in PRICE_TYPE_KEYWORDS.items():
            if keyword in lowered:
                return price_type
        return "original"

    def _normalize_one(self, product: dict) -> dict:
        result = dict(product)

        text = " ".join(
            filter(None, [result.get("title", ""), result.get("snippet", "")])
        )
        if not result.get("price_type"):
            result["price_type"] = self.detect_price_type(text)

        result["price"] = self._safe_price(result.get("price"))
        result["original_price"] = self._safe_price(result.get("original_price"))

        if result["original_price"] is None and result["price"] is not None:
            result["original_price"] = result["price"]

        if result["price"] is not None:
            result["estimated_international_price"] = round(
                result["price"] * INTERNATIONAL_MARKUP, 2
            )
        else:
            result["estimated_international_price"] = None

        return result

    @staticmethod
    def _safe_price(value) -> float | None:
        if value is None:
            return None
        try:
            price = float(value)
        except (TypeError, ValueError):
            return None
        if price <= 0:
            return None
        return round(price, 2)
