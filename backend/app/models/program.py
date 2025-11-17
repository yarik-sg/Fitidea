from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime

from app.db import Base


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    level = Column(String, nullable=False, default="intermediate")
    duration_weeks = Column(Integer, default=4)
    created_at = Column(DateTime, default=datetime.utcnow)
