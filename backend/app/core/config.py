from typing import List

from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    project_name: str = "Fitidea API"
    api_prefix: str = "/api"
    backend_cors_origins: List[str] = ["*"]

    db_url: str = Field("sqlite:///./app.db", env="DB_URL")
    redis_url: str = Field("redis://localhost:6379/0", env="REDIS_URL")
    secret_key: str = Field("CHANGE_ME", env="SECRET_KEY")
    serpapi_key: str | None = Field(None, env="SERPAPI_KEY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @validator("backend_cors_origins", pre=True)
    def assemble_cors_origins(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin]
        return value


settings = Settings()
