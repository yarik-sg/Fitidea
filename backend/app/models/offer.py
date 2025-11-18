from __future__ import annotations

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    gym_id = Column(Integer, ForeignKey("gyms.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    product = relationship("Product", back_populates="offers")
    gym = relationship("Gym", back_populates="offers")
    creator = relationship("User", back_populates="offers")
