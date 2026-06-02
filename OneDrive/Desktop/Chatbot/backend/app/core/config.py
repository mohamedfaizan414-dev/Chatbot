from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    GROQ_API_KEY: str
    APP_ENV: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000"

    GROQ_MODEL: str = "llama3-70b-8192"
    MAX_TOKENS: int = 1024
    TEMPERATURE: float = 0.7
    MAX_HISTORY_MESSAGES: int = 20

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()
