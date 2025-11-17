from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from redis import Redis

from app.core.config import settings


class Base(DeclarativeBase):
    pass


def get_database_url() -> str:
    return (
        f"postgresql+psycopg2://{settings.postgres_user}:{settings.postgres_password}"
        f"@{settings.postgres_host}:{settings.postgres_port}/{settings.postgres_db}"
    )


database_engine = create_engine(get_database_url(), future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=database_engine)

redis_client = Redis.from_url(settings.redis_url, decode_responses=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_redis() -> Redis:
    return redis_client
