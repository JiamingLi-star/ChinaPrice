import uuid

from fastapi import APIRouter, Query

from app.schemas.product import (
    CategorySchema,
    CompareSchema,
    FeedbackCreateSchema,
    HealthSchema,
    PlatformOfferSchema,
    ProductListSchema,
    ProductSchema,
    SearchResultSchema,
)

router = APIRouter()

MOCK_OFFER_TAOBAO = PlatformOfferSchema(
    id=str(uuid.uuid4()),
    platform="taobao",
    platform_product_id="tb-001",
    title_en="Wireless Bluetooth Headphones",
    url="https://item.taobao.com/item.htm?id=001",
    price=29.99,
    price_type="current",
    original_price=49.99,
    shipping_fee=0.0,
    rating=4.8,
    review_count=12500,
    sales_count=35000,
    seller_name="TopAudio Store",
    seller_age_days=1200,
    specs_en={"color": "black", "battery": "40h"},
    image_url="https://img.example.com/headphones.jpg",
    status="active",
)

MOCK_OFFER_JD = PlatformOfferSchema(
    id=str(uuid.uuid4()),
    platform="jd",
    platform_product_id="jd-001",
    title_en="Wireless Bluetooth Headphones Pro",
    url="https://item.jd.com/001.html",
    price=35.50,
    price_type="current",
    original_price=55.00,
    shipping_fee=0.0,
    rating=4.7,
    review_count=8400,
    sales_count=22000,
    seller_name="JD Self-operated",
    seller_age_days=3650,
    specs_en={"color": "white", "battery": "50h"},
    image_url="https://img.example.com/headphones-pro.jpg",
    status="active",
)

MOCK_OFFER_PDD = PlatformOfferSchema(
    id=str(uuid.uuid4()),
    platform="pinduoduo",
    platform_product_id="pdd-001",
    title_en="Budget Wireless Headphones",
    url="https://mobile.pinduoduo.com/goods.html?id=001",
    price=15.99,
    price_type="group_buy",
    original_price=39.99,
    shipping_fee=2.00,
    rating=4.5,
    review_count=45000,
    sales_count=120000,
    seller_name="ValueTech",
    seller_age_days=800,
    specs_en={"color": "blue", "battery": "20h"},
    image_url="https://img.example.com/headphones-budget.jpg",
    status="active",
)

MOCK_PRODUCT_IDS = [str(uuid.uuid4()) for _ in range(3)]

MOCK_PRODUCTS_LIST = [
    ProductListSchema(
        id=MOCK_PRODUCT_IDS[0],
        name_en="Wireless Bluetooth Headphones",
        category="electronics",
        brand="GenericAudio",
        best_price=15.99,
        best_price_platform="pinduoduo",
        image_url="https://img.example.com/headphones.jpg",
        platform_count=3,
    ),
    ProductListSchema(
        id=MOCK_PRODUCT_IDS[1],
        name_en="USB-C Hub 7-in-1",
        category="electronics",
        brand="TechConnect",
        best_price=12.50,
        best_price_platform="taobao",
        image_url="https://img.example.com/usbhub.jpg",
        platform_count=2,
    ),
    ProductListSchema(
        id=MOCK_PRODUCT_IDS[2],
        name_en="Portable Phone Stand",
        category="electronics",
        brand="HoldIt",
        best_price=3.99,
        best_price_platform="pinduoduo",
        image_url="https://img.example.com/phonestand.jpg",
        platform_count=2,
    ),
]

MOCK_FULL_PRODUCT = ProductSchema(
    id=MOCK_PRODUCT_IDS[0],
    name_en="Wireless Bluetooth Headphones",
    name_zh="Wireless Bluetooth Headphones",
    category="electronics",
    brand="GenericAudio",
    best_price=15.99,
    best_price_platform="pinduoduo",
    attributes_en={"type": "over-ear", "connectivity": "bluetooth 5.3"},
    platform_offers=[MOCK_OFFER_TAOBAO, MOCK_OFFER_JD, MOCK_OFFER_PDD],
)

MOCK_CATEGORIES = [
    CategorySchema(slug="electronics", name="Electronics", product_count=1520),
    CategorySchema(slug="home", name="Home & Garden", product_count=890),
    CategorySchema(slug="fashion", name="Fashion & Apparel", product_count=2340),
]


@router.get("/search", response_model=SearchResultSchema)
async def search_products(
    q: str = Query(..., min_length=1, description="Search query"),
    category: str | None = Query(None, description="Category filter"),
    sort: str = Query("best_value", description="Sort order"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
):
    return SearchResultSchema(
        products=MOCK_PRODUCTS_LIST,
        total=len(MOCK_PRODUCTS_LIST),
        page=page,
        page_size=page_size,
        query=q,
    )


@router.get("/products/{product_id}", response_model=ProductSchema)
async def get_product(product_id: str):
    return MOCK_FULL_PRODUCT


@router.get("/compare", response_model=CompareSchema)
async def compare_products(
    ids: str = Query(..., description="Comma-separated product IDs"),
):
    return CompareSchema(products=[MOCK_FULL_PRODUCT])


@router.get("/categories", response_model=list[CategorySchema])
async def list_categories():
    return MOCK_CATEGORIES


@router.post("/feedback")
async def submit_feedback(body: FeedbackCreateSchema):
    return {"status": "received"}


@router.get("/health", response_model=HealthSchema)
async def health_check():
    return HealthSchema(
        status="ok",
        database=True,
        redis=True,
        elasticsearch=True,
    )
