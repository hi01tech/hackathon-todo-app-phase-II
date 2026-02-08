"""Test cases for authentication endpoints."""

import pytest
from httpx import AsyncClient
from sqlmodel import select
from app.models.user import User
from app.database import get_session
from app.config import get_settings
import jwt


@pytest.mark.asyncio
async def test_signup_success(async_client: AsyncClient, db_session):
    """Test successful user registration."""
    signup_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = await async_client.post("/api/auth/sign-up", json=signup_data)

    assert response.status_code == 200  # BetterAuth-compatible endpoints return 200

    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["name"] == "Test User"
    assert "id" in data["user"]

    # Verify user was created in database
    statement = select(User).where(User.email == "test@example.com")
    result = await db_session.execute(statement)
    user = result.scalar_one_or_none()
    assert user is not None
    assert user.email == "test@example.com"
    assert user.name == "Test User"


@pytest.mark.asyncio
async def test_signup_duplicate_email(async_client: AsyncClient, db_session):
    """Test signup with duplicate email."""
    # First signup
    signup_data = {
        "email": "duplicate@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }
    response = await async_client.post("/api/auth/sign-up", json=signup_data)
    assert response.status_code == 200  # BetterAuth-compatible endpoints return 200

    # Second signup with same email
    response = await async_client.post("/api/auth/sign-up", json=signup_data)
    assert response.status_code == 409
    assert "Email already registered" in response.json()["detail"]


@pytest.mark.asyncio
async def test_signup_invalid_data(async_client: AsyncClient):
    """Test signup with invalid data."""
    signup_data = {
        "email": "",  # Invalid email
        "password": "short",  # Too short password
        "name": "Test User"
    }

    response = await async_client.post("/api/auth/sign-up", json=signup_data)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_signin_success(async_client: AsyncClient, test_user):
    """Test successful user authentication."""
    signin_data = {
        "email": test_user.email,
        "password": "testpassword123"
    }

    response = await async_client.post("/api/auth/sign-in", json=signin_data)

    assert response.status_code == 200

    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == test_user.email
    assert data["user"]["id"] == test_user.id


@pytest.mark.asyncio
async def test_signin_invalid_credentials(async_client: AsyncClient):
    """Test signin with invalid credentials."""
    signin_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }

    response = await async_client.post("/api/auth/sign-in", json=signin_data)
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_signin_wrong_password(async_client: AsyncClient, test_user):
    """Test signin with wrong password."""
    signin_data = {
        "email": test_user.email,
        "password": "wrongpassword"
    }

    response = await async_client.post("/api/auth/sign-in", json=signin_data)
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_token_validity(async_client: AsyncClient, test_user):
    """Test that generated tokens are valid and contain correct claims."""
    signin_data = {
        "email": test_user.email,
        "password": "testpassword123"
    }

    response = await async_client.post("/api/auth/sign-in", json=signin_data)
    assert response.status_code == 200

    data = response.json()
    token = data["token"]  # BetterAuth-compatible uses "token" field

    # Decode and verify token
    settings = get_settings()
    decoded = jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM]
    )

    assert "sub" in decoded
    assert decoded["sub"] == test_user.id
    assert "exp" in decoded
    assert "iat" in decoded
    assert decoded["type"] == "access"


@pytest.mark.asyncio
async def test_signup_without_name(async_client: AsyncClient):
    """Test signup without providing name (optional field)."""
    signup_data = {
        "email": "no_name@example.com",
        "password": "securepassword123"
        # No name provided
    }

    response = await async_client.post("/api/auth/sign-up", json=signup_data)

    assert response.status_code == 200  # BetterAuth-compatible endpoints return 200

    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "no_name@example.com"
    # Name can be None when not provided
    assert "id" in data["user"]