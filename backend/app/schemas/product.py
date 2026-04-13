from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PlatformOfferSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    platform: str
    platform_product_id: str
    title_en: str | None = None
    url: str
    price: float
    price_type: str | None = None
    original_price: float | None = None
    shipping_fee: float | None = None
    rating: float | None = None
    review_count: int | None = None
    sales_count: int | None = None
    seller_name: str | None = None
    seller_age_days: int | None = None
    specs_en: dict | None = None
    image_url: str | None = None
    status: str = "active"
    price_updated_at: datetime | None = None


class ProductSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name_en: str
    name_zh: str
    category: str
    brand: str | None = None
    best_price: float | None = None
    best_price_platform: str | None = None
    attributes_en: dict | None = None
    platform_offers: list[PlatformOfferSchema] = []
    updated_at: datetime | None = None


class ProductListSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name_en: str
    category: str
    brand: str | None = None
    best_price: float | None = None
    best_price_platform: str | None = None
    image_url: str | None = None
    platform_count: int = 0
    updated_at: datetime | None = None


class SearchResultSchema(BaseModel):
    products: list[ProductListSchema]
    total: int
    page: int
    page_size: int
    query: str


class CompareSchema(BaseModel):
    products: list[ProductSchema]


class CategorySchema(BaseModel):
    slug: str
    name: str
    product_count: int


class FeedbackCreateSchema(BaseModel):
    platform_product_id: str | None = None
    feedback_type: str
    details: str


class HealthSchema(BaseModel):
    status: str
    database: bool
    redis: bool
    elasticsearch: bool
