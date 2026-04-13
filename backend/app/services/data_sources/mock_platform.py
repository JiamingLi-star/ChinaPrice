import hashlib
import logging

from app.services.data_sources.base import DataSourceBase, RawProduct

logger = logging.getLogger(__name__)

_MOCK_TEMPLATES: dict[str, dict] = {
    "jd": {
        "domain": "https://item.jd.com",
        "seller_prefix": "JD-Store",
        "base_price": 199.0,
        "rating_base": 4.5,
    },
    "taobao": {
        "domain": "https://item.taobao.com",
        "seller_prefix": "TB-Shop",
        "base_price": 149.0,
        "rating_base": 4.3,
    },
    "1688": {
        "domain": "https://detail.1688.com",
        "seller_prefix": "1688-Factory",
        "base_price": 89.0,
        "rating_base": 4.0,
    },
    "pdd": {
        "domain": "https://mobile.yangkeduo.com",
        "seller_prefix": "PDD-Merchant",
        "base_price": 79.0,
        "rating_base": 4.1,
    },
}


def _deterministic_int(seed: str, modulus: int, offset: int = 0) -> int:
    digest = hashlib.sha256(seed.encode()).hexdigest()
    return (int(digest[:8], 16) + offset) % modulus


def _deterministic_float(seed: str, low: float, high: float) -> float:
    n = _deterministic_int(seed, 10000)
    return round(low + (high - low) * (n / 10000.0), 2)


class MockPlatformSource(DataSourceBase):
    def __init__(self, platform: str) -> None:
        self._platform = platform
        self._tpl = _MOCK_TEMPLATES.get(platform, _MOCK_TEMPLATES["jd"])

    async def search(
        self, query_zh: str, page: int = 1, page_size: int = 20
    ) -> list[RawProduct]:
        count = _deterministic_int(
            f"{self._platform}:{query_zh}:count", 6, offset=5
        )

        products: list[RawProduct] = []
        for i in range(count):
            seed = f"{self._platform}:{query_zh}:{page}:{i}"
            pid = hashlib.md5(seed.encode()).hexdigest()[:12]
            price_mult = _deterministic_float(f"{seed}:price", 0.5, 3.0)
            price = round(self._tpl["base_price"] * price_mult, 2)
            original_mult = _deterministic_float(f"{seed}:orig", 1.05, 1.40)
            original_price = round(price * original_mult, 2)
            shipping = _deterministic_float(f"{seed}:ship", 0.0, 15.0)
            rating = round(
                min(
                    5.0,
                    self._tpl["rating_base"]
                    + _deterministic_float(f"{seed}:rate", -0.3, 0.5),
                ),
                1,
            )
            reviews = _deterministic_int(f"{seed}:rev", 50000)
            sales = _deterministic_int(f"{seed}:sales", 100000)
            seller_idx = _deterministic_int(f"{seed}:seller", 999)
            seller_age = _deterministic_int(f"{seed}:age", 2000, offset=60)

            products.append(
                RawProduct(
                    platform=self._platform,
                    platform_product_id=pid,
                    title=f"{query_zh} - {self._platform.upper()} Item #{i + 1}",
                    url=f"{self._tpl['domain']}/item.html?id={pid}",
                    price=price,
                    price_type="current",
                    original_price=original_price,
                    shipping_fee=shipping,
                    image_url=f"https://placehold.co/400x400?text={self._platform}_{pid[:6]}",
                    rating=rating,
                    review_count=reviews,
                    sales_count=sales,
                    seller_name=f"{self._tpl['seller_prefix']}-{seller_idx}",
                    seller_age_days=seller_age,
                    specs={
                        "color": ["Red", "Blue", "Black"][
                            _deterministic_int(f"{seed}:color", 3)
                        ],
                        "weight": f"{_deterministic_float(f'{seed}:wt', 0.1, 5.0)}kg",
                    },
                    snippet=f"Mock listing for {query_zh} on {self._platform}",
                )
            )

        logger.info(
            "Mock source %s returned %d results for query=%s",
            self._platform,
            len(products),
            query_zh,
        )
        return products

    async def get_product(self, product_id: str) -> RawProduct | None:
        seed = f"{self._platform}:single:{product_id}"
        price = round(
            self._tpl["base_price"]
            * _deterministic_float(f"{seed}:price", 0.8, 2.0),
            2,
        )
        return RawProduct(
            platform=self._platform,
            platform_product_id=product_id,
            title=f"{self._platform.upper()} Product {product_id}",
            url=f"{self._tpl['domain']}/item.html?id={product_id}",
            price=price,
            price_type="current",
            original_price=round(price * 1.2, 2),
            shipping_fee=0.0,
            image_url=f"https://placehold.co/400x400?text={self._platform}_{product_id[:6]}",
            rating=self._tpl["rating_base"],
            review_count=1000,
            sales_count=5000,
            seller_name=f"{self._tpl['seller_prefix']}-001",
            seller_age_days=365,
            specs={},
            snippet=f"Single product lookup on {self._platform}",
        )

    async def check_health(self) -> bool:
        return True


def create_mock_jd() -> MockPlatformSource:
    return MockPlatformSource("jd")


def create_mock_taobao() -> MockPlatformSource:
    return MockPlatformSource("taobao")


def create_mock_1688() -> MockPlatformSource:
    return MockPlatformSource("1688")


def create_mock_pdd() -> MockPlatformSource:
    return MockPlatformSource("pdd")
