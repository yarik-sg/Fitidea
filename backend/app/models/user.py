from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship
from passlib.context import CryptContext

from app.db.session import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    offers = relationship("Offer", back_populates="creator", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    programs = relationship("Program", back_populates="owner", cascade="all, delete-orphan")
    favorite_programs = relationship("FavoriteProgram", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password: str) -> None:
        self.hashed_password = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)
