from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class PuzzleBase(BaseModel):
    """Base Puzzle schema with common attributes"""
    fen: str = Field(..., description="FEN notation of the puzzle position")
    solution_moves: str = Field(..., description="Solution moves in algebraic notation")
    difficulty: Optional[int] = Field(None, description="Puzzle difficulty rating")
    themes: Optional[List[str]] = Field(None, description="List of puzzle themes")


class PuzzleCreate(PuzzleBase):
    """Schema for creating a new puzzle"""
    pass


class PuzzleUpdate(BaseModel):
    """Schema for updating an existing puzzle"""
    fen: Optional[str] = None
    solution_moves: Optional[str] = None
    difficulty: Optional[int] = None
    themes: Optional[List[str]] = None


class PuzzleInDB(PuzzleBase):
    """Schema for puzzle as stored in the database"""
    id: int = Field(..., description="Unique puzzle ID")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: Optional[str] = Field(None, description="Last update timestamp")


class Puzzle(PuzzleInDB):
    """Schema for puzzle response"""
    pass


class PuzzleList(BaseModel):
    """Schema for a list of puzzles"""
    items: List[Puzzle]
    total: int
    page: int
    size: int
    pages: int


class PuzzleFilter(BaseModel):
    """Schema for filtering puzzles"""
    min_difficulty: Optional[int] = Field(None, description="Minimum difficulty rating")
    max_difficulty: Optional[int] = Field(None, description="Maximum difficulty rating")
    themes: Optional[List[str]] = Field(None, description="List of themes to filter by")
    
    @field_validator("min_difficulty", "max_difficulty")
    @classmethod
    def validate_difficulty(cls, value: Optional[int]) -> Optional[int]:
        """Validate difficulty is within reasonable bounds"""
        if value is not None and (value < 0 or value > 3000):
            raise ValueError("Difficulty must be between 0 and 3000")
        return value 