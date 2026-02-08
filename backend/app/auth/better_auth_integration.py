"""
BetterAuth compatible authentication handlers for FastAPI backend
This module provides JWT validation compatible with BetterAuth's token format
"""

import logging
from typing import Optional
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from fastapi.security import HTTPBearer

from ..config import get_settings

# Configure logging
logger = logging.getLogger(__name__)

# Shared HTTP Bearer token extractor (used across auth module)
security = HTTPBearer(auto_error=False)

settings = get_settings()

# Supported JWT algorithms (BetterAuth may use EdDSA or HS256)
SUPPORTED_ALGORITHMS = ["HS256", "EdDSA"]


def verify_betterauth_token(token: str) -> bool:
    """
    Verify JWT token in BetterAuth-compatible format.

    Args:
        token: JWT token string

    Returns:
        bool: True if token is valid, False otherwise
    """
    try:
        jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=SUPPORTED_ALGORITHMS
        )
        return True
    except (ExpiredSignatureError, InvalidTokenError):
        return False


def decode_betterauth_token(token: str) -> Optional[dict]:
    """
    Decode BetterAuth-compatible JWT token and return payload.

    Supports multiple algorithms including HS256 and EdDSA.

    Args:
        token: JWT token string

    Returns:
        dict: Token payload if valid

    Raises:
        ExpiredSignatureError: If token has expired
        InvalidTokenError: If token is malformed or signature is invalid
    """
    try:
        # Decode and verify token with supported algorithms
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=SUPPORTED_ALGORITHMS
        )
        logger.debug(f"Token decoded successfully for user: {payload.get('sub', 'unknown')}")
        return payload
    except ExpiredSignatureError:
        logger.warning("JWT token expired")
        raise
    except InvalidTokenError as e:
        logger.error(f"Invalid JWT token: {str(e)}")
        raise


def extract_user_id_from_betterauth_token(token: str) -> Optional[str]:
    """
    Extract user ID from BetterAuth-compatible JWT token.

    Args:
        token: JWT token string

    Returns:
        str: User ID from token's 'sub' claim, None if invalid
    """
    try:
        payload = decode_betterauth_token(token)
        if payload:
            # BetterAuth typically uses 'sub' for user ID
            return payload.get("sub")
        return None
    except (ExpiredSignatureError, InvalidTokenError):
        return None