import uuid
from datetime import datetime

from sqlalchemy import (
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class CanonicalProduct(Base):
    __tablename__ = "canonical_products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name_en: Mapped[str] = mapped_column(String(512), nullable=False)
    name_zh: Mapped[str] = mapped_column(String(512), nullable=False)
    category: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    attributes_en: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    attributes_zh: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    brand: Mapped[str | None] = mapped_column(String(256), nullable=True)
    best_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    best_price_platform: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    platform_products: Mapped[list["PlatformProduct"]] = relationship(
        back_populates="canonical_product", lazy="selectin"
    )


class PlatformProduct(Base):
    __tablename__ = "platform_products"
    __table_args__ = (
        UniqueConstraint("platform", "platform_product_id", name="uq_platform_pid"),
        Index("ix_platform_canonical_id", "canonical_id"),
        Index("ix_platform_status", "status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    canonical_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("canonical_products.id"), nullable=True
    )
    platform: Mapped[str] = mapped_column(String(64), nullable=False)
    platform_product_id: Mapped[str] = mapped_column(String(256), nullable=False)
    title_zh: Mapped[str] = mapped_column(String(1024), nullable=False)
    title_en: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    price_type: Mapped[str | None] = mapped_column(String(32), nullable=True)
    original_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    shipping_fee: Mapped[float | None] = mapped_column(Float, nullable=True)
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    review_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sales_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    seller_name: Mapped[str | None] = mapped_column(String(256), nullable=True)
    seller_age_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    specs_zh: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    specs_en: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    price_updated_at: Mapped[datetime | None] = mapped_column(nullable=True)
    crawled_at: Mapped[datetime | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    canonical_product: Mapped["CanonicalProduct | None"] = relationship(
        back_populates="platform_products"
    )
    price_snapshots: Mapped[list["PriceSnapshot"]] = relationship(
        back_populates="platform_product", lazy="selectin"
    )


class PriceSnapshot(Base):
    __tablename__ = "price_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    platform_product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("platform_products.id"), nullable=False
    )
    price: Mapped[float] = mapped_column(Float, nullable=False)
    price_type: Mapped[str | None] = mapped_column(String(32), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(server_default=func.now())

    platform_product: Mapped["PlatformProduct"] = relationship(
        back_populates="price_snapshots"
    )


class SearchCache(Base):
    __tablename__ = "search_cache"

    query_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    results: Mapped[dict] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    ttl_seconds: Mapped[int] = mapped_column(Integer, nullable=False)


class UserFeedback(Base):
    __tablename__ = "user_feedback"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    platform_product_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("platform_products.id"), nullable=True
    )
    feedback_type: Mapped[str] = mapped_column(String(64), nullable=False)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
