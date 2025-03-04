from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List


class UserProfile(BaseModel):
    """Schema for user profile information"""
    id: str = Field(..., description="User ID")
    email: EmailStr = Field(..., description="User email")
    is_admin: bool = Field(False, description="Whether the user has admin privileges")
    display_name: Optional[str] = Field(None, description="User display name")
    avatar_url: Optional[str] = Field(None, description="User avatar URL")


class TokenData(BaseModel):
    """Schema for JWT token data"""
    sub: str = Field(..., description="Subject (user ID)")
    exp: int = Field(..., description="Expiration timestamp")
    email: Optional[EmailStr] = Field(None, description="User email")
    roles: List[str] = Field(default_factory=list, description="User roles") 