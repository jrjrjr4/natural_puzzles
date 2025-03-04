from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, date


class UserProgressBase(BaseModel):
    """Base schema for user progress"""
    puzzle_id: int = Field(..., description="Puzzle ID")
    solved: bool = Field(..., description="Whether the puzzle was solved")
    time_taken: Optional[int] = Field(None, description="Time taken to solve in seconds")
    attempts: Optional[int] = Field(None, description="Number of attempts")


class UserProgressCreate(UserProgressBase):
    """Schema for creating user progress"""
    pass


class UserProgressUpdate(BaseModel):
    """Schema for updating user progress"""
    solved: Optional[bool] = None
    time_taken: Optional[int] = None
    attempts: Optional[int] = None
    next_review_date: Optional[date] = None
    
    @field_validator("time_taken")
    @classmethod
    def validate_time_taken(cls, value: Optional[int]) -> Optional[int]:
        """Validate time taken is positive"""
        if value is not None and value < 0:
            raise ValueError("Time taken must be positive")
        return value
    
    @field_validator("attempts")
    @classmethod
    def validate_attempts(cls, value: Optional[int]) -> Optional[int]:
        """Validate attempts is positive"""
        if value is not None and value < 0:
            raise ValueError("Attempts must be positive")
        return value


class UserProgressInDB(UserProgressBase):
    """Schema for user progress as stored in the database"""
    id: int = Field(..., description="Unique progress ID")
    user_id: str = Field(..., description="User ID")
    next_review_date: Optional[date] = Field(None, description="Next review date based on spaced repetition")
    ease_factor: float = Field(2.5, description="Ease factor for spaced repetition")
    interval: int = Field(1, description="Interval in days for spaced repetition")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")


class UserProgress(UserProgressInDB):
    """Schema for user progress response"""
    pass


class UserProgressList(BaseModel):
    """Schema for a list of user progress entries"""
    items: list[UserProgress]
    total: int


class UserProgressStats(BaseModel):
    """Schema for user progress statistics"""
    total_puzzles_solved: int = Field(..., description="Total number of puzzles solved")
    total_puzzles_attempted: int = Field(..., description="Total number of puzzles attempted")
    success_rate: float = Field(..., description="Success rate (puzzles solved / puzzles attempted)")
    average_time: Optional[float] = Field(None, description="Average time taken to solve puzzles")
    average_attempts: Optional[float] = Field(None, description="Average number of attempts per puzzle")
    puzzles_due_for_review: int = Field(..., description="Number of puzzles due for review")
    
    @field_validator("success_rate")
    @classmethod
    def validate_success_rate(cls, value: float) -> float:
        """Validate success rate is between 0 and 1"""
        if value < 0 or value > 1:
            raise ValueError("Success rate must be between 0 and 1")
        return value 