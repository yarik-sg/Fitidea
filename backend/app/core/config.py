from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    app_name: str = "Fitidea API"
    debug: bool = False
    secret_key: str = Field("super-secret-key-change-me", env="SECRET_KEY")
    access_token_expire_minutes: int = 60 * 24

    postgres_user: str = Field("fitidea", env="POSTGRES_USER")
    postgres_password: str = Field("fitidea", env="POSTGRES_PASSWORD")
    postgres_db: str = Field("fitidea", env="POSTGRES_DB")
    postgres_host: str = Field("localhost", env="POSTGRES_HOST")
    postgres_port: int = Field(5432, env="POSTGRES_PORT")

    redis_url: str = Field("redis://localhost:6379/0", env="REDIS_URL")
    serpapi_key: str = Field("", env="SERPAPI_KEY")
    scrapapi_key: str = Field("", env="SCRAPAPI_KEY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
