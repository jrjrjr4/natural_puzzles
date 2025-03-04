from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from typing import List, Optional
import logging
from src.puzzles.schemas import Puzzle, PuzzleCreate, PuzzleUpdate, PuzzleList, PuzzleFilter
from src.puzzles.service import (
    get_puzzles,
    get_puzzle_by_id,
    create_puzzle,
    update_puzzle,
    delete_puzzle,
    get_recommended_puzzles
)
from src.auth.dependencies import get_current_user
from src.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=PuzzleList)
async def list_puzzles(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(settings.DEFAULT_PUZZLE_LIMIT, ge=1, le=settings.MAX_PUZZLE_LIMIT, description="Page size"),
    min_difficulty: Optional[int] = Query(None, ge=0, le=3000, description="Minimum difficulty rating"),
    max_difficulty: Optional[int] = Query(None, ge=0, le=3000, description="Maximum difficulty rating"),
    themes: Optional[List[str]] = Query(None, description="List of themes to filter by")
):
    """
    Get a paginated list of puzzles with optional filtering.
    """
    # Create filter object
    filters = PuzzleFilter(
        min_difficulty=min_difficulty,
        max_difficulty=max_difficulty,
        themes=themes
    )
    
    # Get puzzles
    puzzles, total = await get_puzzles(page=page, size=size, filters=filters)
    
    # Calculate total pages
    pages = (total + size - 1) // size
    
    return PuzzleList(
        items=puzzles,
        total=total,
        page=page,
        size=size,
        pages=pages
    )


@router.get("/recommended", response_model=List[Puzzle])
async def get_recommended(
    count: int = Query(5, ge=1, le=20, description="Number of puzzles to recommend"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get recommended puzzles for the current user based on their progress and the spaced repetition algorithm.
    """
    puzzles = await get_recommended_puzzles(user_id=current_user["id"], count=count)
    return puzzles


@router.get("/{puzzle_id}", response_model=Puzzle)
async def get_puzzle(
    puzzle_id: int = Path(..., ge=1, description="Puzzle ID")
):
    """
    Get a puzzle by ID.
    """
    puzzle = await get_puzzle_by_id(puzzle_id)
    
    if not puzzle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puzzle with ID {puzzle_id} not found"
        )
    
    return puzzle


@router.post("/", response_model=Puzzle, status_code=status.HTTP_201_CREATED)
async def create_new_puzzle(
    puzzle: PuzzleCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new puzzle.
    Requires admin privileges.
    """
    # Check if user has admin privileges
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create puzzles"
        )
    
    try:
        created_puzzle = await create_puzzle(puzzle)
        return created_puzzle
    except Exception as e:
        logger.error(f"Error creating puzzle: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create puzzle"
        )


@router.put("/{puzzle_id}", response_model=Puzzle)
async def update_existing_puzzle(
    puzzle: PuzzleUpdate,
    puzzle_id: int = Path(..., ge=1, description="Puzzle ID"),
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing puzzle.
    Requires admin privileges.
    """
    # Check if user has admin privileges
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update puzzles"
        )
    
    # Check if puzzle exists
    existing_puzzle = await get_puzzle_by_id(puzzle_id)
    
    if not existing_puzzle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puzzle with ID {puzzle_id} not found"
        )
    
    # Update puzzle
    updated_puzzle = await update_puzzle(puzzle_id, puzzle)
    
    if not updated_puzzle:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update puzzle"
        )
    
    return updated_puzzle


@router.delete("/{puzzle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_puzzle(
    puzzle_id: int = Path(..., ge=1, description="Puzzle ID"),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a puzzle.
    Requires admin privileges.
    """
    # Check if user has admin privileges
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete puzzles"
        )
    
    # Check if puzzle exists
    existing_puzzle = await get_puzzle_by_id(puzzle_id)
    
    if not existing_puzzle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puzzle with ID {puzzle_id} not found"
        )
    
    # Delete puzzle
    success = await delete_puzzle(puzzle_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete puzzle"
        )
    
    return None 