from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Dict, Optional
import logging
from src.core.config import settings
from src.db.client import get_supabase_client

logger = logging.getLogger(__name__)

# Security scheme for JWT authentication
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict:
    """
    Dependency to get the current authenticated user from the JWT token.
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        User data from the JWT token
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        # Get token from credentials
        token = credentials.credentials
        
        # Verify token with Supabase
        client = get_supabase_client()
        response = client.auth.get_user(token)
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Return user data
        return {
            "id": response.user.id,
            "email": response.user.email,
            "is_admin": is_admin_user(response.user.id),
            # Add other user data as needed
        }
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def is_admin_user(user_id: str) -> bool:
    """
    Check if a user has admin privileges.
    
    In a real app, this would check against a database or other source.
    For now, we'll use a simple hardcoded check.
    
    Args:
        user_id: User ID to check
        
    Returns:
        True if the user is an admin, False otherwise
    """
    # In a real app, you would check against a database or other source
    # For now, we'll use a simple hardcoded check
    admin_users = ["admin-user-id-1", "admin-user-id-2"]
    return user_id in admin_users 