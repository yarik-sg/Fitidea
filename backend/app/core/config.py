from typing import List

from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    project_name: str = "Fitidea API"
    api_prefix: str = "/api"
    backend_cors_origins: List[str] = ["*"]
    database_url: str = "sqlite:///./app.db"
    redis_url: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @validator("backend_cors_origins", pre=True)
    def assemble_cors_origins(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin]
        return value


settings = Settings()
