"""
BetterAuth-compatible API endpoints for user management
These endpoints simulate what a real BetterAuth backend would provide
"""

from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from ..models.user import User, UserCreate, UserSignIn, TokenResponse, pwd_context
from ..config import get_settings
from ..auth.better_auth_integration import decode_betterauth_token, security

router = APIRouter()

settings = get_settings()


def create_betterauth_compatible_token(user_id: str) -> str:
    """
    Create a JWT token compatible with BetterAuth expectations.

    Args:
        user_id: Unique identifier of the user

    Returns:
        str: Encoded JWT token
    """
    from datetime import datetime, timedelta, timezone

    expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS)
    to_encode = {
        "sub": user_id,  # User ID in 'sub' claim as expected by get_current_user
        "exp": expire.timestamp(),
        "iat": datetime.now(timezone.utc).timestamp(),
        "type": "access"
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    """Retrieve a user by email address.

    Args:
        session: Database session
        email: Email address to search for

    Returns:
        User object if found, None otherwise
    """
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    return result.scalar_one_or_none()


@router.post("/auth/sign-up")
async def betterauth_signup(
    request: Request,
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    """
    BetterAuth-compatible signup endpoint.
    This endpoint mimics what BetterAuth expects for user registration.
    """
    # Check if user with this email already exists
    existing_user = await get_user_by_email(session, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = pwd_context.hash(user_data.password)

    # Create new user
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name
    )

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)

    # Generate BetterAuth-compatible token
    access_token = create_betterauth_compatible_token(user_id=db_user.id)

    # Return in BetterAuth-compatible format
    return {
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "createdAt": db_user.created_at.isoformat(),
            "updatedAt": db_user.updated_at.isoformat(),
        },
        "session": {
            "id": f"sess_{db_user.id}",  # Simulate session ID
            "expiresAt": (datetime.now() + timedelta(hours=settings.JWT_EXPIRY_HOURS)).isoformat(),
            "token": access_token
        },
        "token": access_token
    }


@router.post("/auth/sign-in")
async def betterauth_signin(
    request: Request,
    user_data: UserSignIn,
    session: AsyncSession = Depends(get_session)
):
    """
    BetterAuth-compatible signin endpoint.
    This endpoint mimics what BetterAuth expects for user authentication.
    """
    # Find user by email
    user = await get_user_by_email(session, user_data.email)
    if not user:
        # Don't reveal whether email exists to prevent enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not user.verify_password(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account deactivated"
        )

    # Generate BetterAuth-compatible token
    access_token = create_betterauth_compatible_token(user_id=user.id)

    # Return in BetterAuth-compatible format
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "createdAt": user.created_at.isoformat(),
            "updatedAt": user.updated_at.isoformat(),
        },
        "session": {
            "id": f"sess_{user.id}",  # Simulate session ID
            "expiresAt": (datetime.now() + timedelta(hours=settings.JWT_EXPIRY_HOURS)).isoformat(),
            "token": access_token
        },
        "token": access_token
    }


@router.get("/auth/session")
async def get_session(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    BetterAuth-compatible session endpoint.
    This endpoint mimics what BetterAuth expects for session retrieval.
    """
    if not credentials:
        return {"user": None, "session": None}

    token = credentials.credentials

    try:
        payload = decode_betterauth_token(token)
        if not payload:
            return {"user": None, "session": None}

        user_id = payload.get("sub")
        if not user_id:
            return {"user": None, "session": None}

        # In a real implementation, you'd fetch user details from the database
        # For now, we'll return basic session info
        return {
            "user": {
                "id": user_id,
                "email": "user@example.com",  # Would come from DB in real impl
                "name": "User Name"           # Would come from DB in real impl
            },
            "session": {
                "id": f"sess_{user_id}",
                "expiresAt": payload.get("exp"),
                "token": token
            }
        }
    except:
        return {"user": None, "session": None}


@router.post("/auth/sign-out")
async def betterauth_signout():
    """
    BetterAuth-compatible signout endpoint.
    """
    return {"success": True}