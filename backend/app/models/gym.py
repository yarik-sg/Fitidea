from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class Gym(Base):
    __tablename__ = "gyms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    brand = Column(String, nullable=True, index=True)
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True, index=True)
    country = Column(String, default="France")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    opened_24_7 = Column(Boolean, default=False)
    last_synced = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    offers = relationship("Offer", back_populates="gym", cascade="all, delete-orphan")
    programs = relationship("Program", back_populates="gym", cascade="all, delete-orphan")
