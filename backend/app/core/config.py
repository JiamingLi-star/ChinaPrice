from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "ChinaPrice"
    API_PREFIX: str = "/api"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+asyncpg://chinaprice:chinaprice@postgres:5432/chinaprice"
    REDIS_URL: str = "redis://redis:6379/0"
    ELASTICSEARCH_URL: str = "http://elasticsearch:9200"

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    BING_API_KEY: str = ""
    BING_ENDPOINT: str = "https://api.bing.microsoft.com/v7.0/search"

    CACHE_TTL_HOT: int = 7200
    CACHE_TTL_COLD: int = 86400
    QUERY_CACHE_TTL: int = 604800

    AI_DAILY_BUDGET_USD: float = 5.0

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
