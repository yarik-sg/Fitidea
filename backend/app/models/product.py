from __future__ import annotations

from sqlalchemy import JSON, Column, DateTime, Float, Integer, Numeric, String, Text, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    brand = Column(String, nullable=True)
    category = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    reviews_count = Column(Integer, nullable=True)
    images = Column(JSON, nullable=True)
    url = Column(String, unique=True, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    offers = relationship("Offer", back_populates="product", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="product", cascade="all, delete-orphan")
