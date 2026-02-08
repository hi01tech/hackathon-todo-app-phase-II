"""Environment configuration for the Task Management API."""

import os
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self):
        db_url = os.getenv(
            "DATABASE_URL",
            "postgresql+asyncpg://localhost/tasks"
        )
        # Convert postgresql:// to postgresql+asyncpg:// for async support
        if db_url.startswith("postgresql://"):
            db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

        # asyncpg uses 'ssl' instead of 'sslmode' - convert for Neon compatibility
        # Remove sslmode and channel_binding params (asyncpg handles SSL differently)
        if "sslmode=" in db_url:
            # Parse and rebuild URL without incompatible params
            from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
            parsed = urlparse(db_url)
            query_params = parse_qs(parsed.query)
            # Remove params that asyncpg doesn't support
            query_params.pop('sslmode', None)
            query_params.pop('channel_binding', None)
            # Rebuild URL
            new_query = urlencode(query_params, doseq=True)
            db_url = urlunparse((
                parsed.scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                new_query,
                parsed.fragment
            ))

        self.DATABASE_URL: str = db_url

        self.APP_ENV: str = os.getenv("APP_ENV", "development")
        self.DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

        # JWT Authentication settings
        self.JWT_SECRET: str = os.getenv("JWT_SECRET", "")
        self.JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
        self.JWT_EXPIRY_HOURS: int = int(os.getenv("JWT_EXPIRY_HOURS", "24"))

        # Better Auth JWKS URL for token verification
        self.BETTER_AUTH_URL: str = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")
        self.JWKS_URL: str = f"{self.BETTER_AUTH_URL}/api/auth/jwks"

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.APP_ENV == "production"

    def validate_jwt_config(self) -> bool:
        """Check if JWT configuration is valid."""
        return bool(self.JWT_SECRET and len(self.JWT_SECRET) >= 32)


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
