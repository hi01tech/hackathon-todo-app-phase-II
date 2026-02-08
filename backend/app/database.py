"""Database engine and session management for async SQLModel."""

import ssl
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from .config import get_settings

settings = get_settings()

# Create SSL context for Neon PostgreSQL
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Create async engine with connection pool settings
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,  # Verify connections before use
    connect_args={"ssl": ssl_context},  # Enable SSL for Neon
)

# Async session factory
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db() -> None:
    """Initialize database tables.

    Creates all tables defined in SQLModel metadata.
    Should be called once during application startup.
    """
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides an async database session.

    Session is automatically closed after the request completes.
    Use with FastAPI's Depends() for dependency injection.

    Yields:
        AsyncSession: Database session for the current request
    """
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
