from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class RawProduct:
    platform: str
    platform_product_id: str
    title: str
    url: str
    price: float | None = None
    price_type: str | None = None
    original_price: float | None = None
    shipping_fee: float | None = None
    image_url: str | None = None
    rating: float | None = None
    review_count: int | None = None
    sales_count: int | None = None
    seller_name: str | None = None
    seller_age_days: int | None = None
    specs: dict = field(default_factory=dict)
    snippet: str | None = None


class DataSourceBase(ABC):
    @abstractmethod
    async def search(
        self, query_zh: str, page: int = 1, page_size: int = 20
    ) -> list[RawProduct]:
        ...

    @abstractmethod
    async def get_product(self, product_id: str) -> RawProduct | None:
        ...

    async def check_health(self) -> bool:
        return True
