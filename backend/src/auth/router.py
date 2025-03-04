from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict
import logging
from src.auth.dependencies import get_current_user
from src.auth.schemas import UserProfile

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: Dict = Depends(get_current_user)
):
    """
    Get the current user's profile.
    """
    return UserProfile(
        id=current_user["id"],
        email=current_user["email"],
        is_admin=current_user.get("is_admin", False)
    )


@router.get("/verify", response_model=Dict)
async def verify_token(
    current_user: Dict = Depends(get_current_user)
):
    """
    Verify that the current token is valid.
    """
    return {"valid": True, "user_id": current_user["id"]}


# Note: For Supabase auth, most authentication endpoints (sign up, sign in, etc.)
# are handled directly by the Supabase client on the frontend.
# The backend only needs to verify tokens and provide user information. 