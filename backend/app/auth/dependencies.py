"""FastAPI authentication dependencies for protected endpoints."""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from .better_auth_integration import decode_betterauth_token, security


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> str:
    """Extract and validate user identity from JWT token.

    This dependency should be used on all protected endpoints.
    It extracts the JWT from the Authorization header, validates it,
    and returns the user ID from the token's 'sub' claim.

    Args:
        credentials: HTTP Authorization credentials (Bearer token)

    Returns:
        str: User ID extracted from JWT payload

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        payload = decode_betterauth_token(token)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # BetterAuth typically uses 'sub' for user ID, but may also use 'user_id'
    user_id = payload.get("sub") or payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload - missing user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[str]:
    """Optionally extract user identity from JWT token.

    Unlike get_current_user, this does not raise an error if no token is provided.
    Useful for endpoints that behave differently for authenticated vs unauthenticated users.

    Args:
        credentials: HTTP Authorization credentials (Bearer token)

    Returns:
        str: User ID if valid token provided, None otherwise
    """
    if credentials is None:
        return None

    try:
        payload = decode_betterauth_token(credentials.credentials)
        if payload:
            return payload.get("sub") or payload.get("user_id")
    except (ExpiredSignatureError, InvalidTokenError):
        pass

    return None
