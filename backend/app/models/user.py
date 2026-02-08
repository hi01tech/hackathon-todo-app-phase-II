"""User model and Pydantic schemas for authentication."""

import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from passlib.context import CryptContext

# Password hashing context - using argon2 which is more reliable
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


class UserBase(SQLModel):
    """Base schema with shared user fields."""

    email: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="User email address"
    )


class UserCreate(UserBase):
    """Schema for creating a new user (signup request body)."""

    password: str = Field(
        ...,
        min_length=8,
        max_length=72,  # bcrypt limitation
        description="User password (min 8 characters, max 72)"
    )
    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Optional user display name"
    )


class UserUpdate(SQLModel):
    """Schema for updating user information."""

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Updated user display name"
    )


class User(UserBase, table=True):
    """User database model (SQLModel table)."""

    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        nullable=False,
        description="Unique user identifier"
    )
    hashed_password: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Hashed password"
    )
    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="User display name"
    )
    is_active: bool = Field(
        default=True,
        nullable=False,
        description="Account active status"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Account creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Last update timestamp (UTC)"
    )

    def verify_password(self, plain_password: str) -> bool:
        """Verify a plaintext password against the stored hash.

        Args:
            plain_password: Plaintext password to verify

        Returns:
            bool: True if password matches, False otherwise
        """
        return pwd_context.verify(plain_password, self.hashed_password)


class UserRead(UserBase):
    """Schema for user responses (includes all fields except password)."""

    id: str
    name: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserSignIn(SQLModel):
    """Schema for user sign-in request."""

    email: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="User email address"
    )
    password: str = Field(
        ...,
        min_length=1,
        max_length=72,  # bcrypt limitation
        description="User password"
    )


class TokenResponse(SQLModel):
    """Schema for authentication token responses."""

    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    name: Optional[str] = None