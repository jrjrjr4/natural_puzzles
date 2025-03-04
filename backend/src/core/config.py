from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application settings.
    
    Uses Pydantic's BaseSettings to load environment variables.
    """
    # API settings
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    
    # CORS settings
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"],
        description="List of allowed CORS origins"
    )
    
    # Supabase settings
    SUPABASE_URL: str = Field(
        default="",
        description="Supabase URL"
    )
    SUPABASE_KEY: SecretStr = Field(
        default="",
        description="Supabase service key"
    )
    
    # JWT settings
    JWT_SECRET: SecretStr = Field(
        default="",
        description="Secret key for JWT encoding/decoding"
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # Puzzle settings
    DEFAULT_PUZZLE_LIMIT: int = 10
    MAX_PUZZLE_LIMIT: int = 100
    
    # Spaced repetition settings
    MIN_INTERVAL_DAYS: int = 1
    MAX_INTERVAL_DAYS: int = 365
    DEFAULT_EASE_FACTOR: float = 2.5
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create settings instance
settings = Settings() 