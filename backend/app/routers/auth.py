"""BetterAuth-compatible endpoints for authentication validation."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from ..auth.dependencies import get_current_user
from ..auth.better_auth_integration import decode_betterauth_token, security

router = APIRouter()


@router.get("/auth/me")
async def get_current_user_info(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """Get current user information from BetterAuth token.

    This endpoint validates that the user is authenticated with a BetterAuth token
    and returns user information including email from the token payload.

    Args:
        credentials: HTTP Authorization credentials (Bearer token)

    Returns:
        dict: User information including ID and email
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_betterauth_token(credentials.credentials)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Debug: Log the full payload to see what's available
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"JWT Payload: {payload}")

    # Extract user information from token payload
    user_id = payload.get("sub") or payload.get("user_id")
    email = payload.get("email") or payload.get("emailAddress")
    name = payload.get("name") or payload.get("username")

    response_data = {
        "user": {
            "id": user_id,
            "email": email,
            "name": name
        }
    }

    logger.info(f"Returning user data: {response_data}")

    return response_data


@router.get("/auth/verify")
async def verify_authentication(user_id: str = Depends(get_current_user)):
    """Verify that the authentication token is valid.

    This endpoint can be used by the frontend to check if the current token is valid
    without needing to make other API calls.

    Args:
        user_id: User ID extracted from BetterAuth JWT token (via dependency)

    Returns:
        dict: Verification status and user ID
    """
    return {
        "authenticated": True,
        "user_id": user_id
    }