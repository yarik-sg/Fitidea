from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    project_name: str = "Fitidea API"
    api_prefix: str = "/api"
    backend_cors_origins: List[str] = ["*"]

    db_url: str = Field(default="sqlite:///./app.db", alias="DATABASE_URL")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    secret_key: str = Field(default="CHANGE_ME", alias="SECRET_KEY")
    serpapi_key: str | None = Field(default=None, alias="SERPAPI_KEY")
    dev_seed: bool = Field(default=False, alias="DEV_SEED")

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin]
        return value

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore"
    }


settings = Settings()
