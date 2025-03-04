from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from typing import List, Optional
import logging
from src.user_progress.schemas import (
    UserProgress,
    UserProgressCreate,
    UserProgressUpdate,
    UserProgressList,
    UserProgressStats
)
from src.user_progress.service import (
    get_user_progress,
    get_user_progress_by_id,
    get_user_progress_for_puzzle,
    create_or_update_user_progress,
    update_user_progress,
    delete_user_progress,
    get_user_progress_stats
)
from src.auth.dependencies import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=UserProgressList)
async def list_user_progress(
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of entries to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    puzzle_id: Optional[int] = Query(None, ge=1, description="Filter by puzzle ID"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get the current user's progress entries.
    """
    progress_entries, total = await get_user_progress(
        user_id=current_user["id"],
        puzzle_id=puzzle_id,
        limit=limit,
        offset=offset
    )
    
    return UserProgressList(
        items=progress_entries,
        total=total
    )


@router.get("/stats", response_model=UserProgressStats)
async def get_stats(
    current_user: dict = Depends(get_current_user)
):
    """
    Get statistics about the current user's progress.
    """
    stats = await get_user_progress_stats(user_id=current_user["id"])
    return stats


@router.get("/puzzle/{puzzle_id}", response_model=Optional[UserProgress])
async def get_progress_for_puzzle(
    puzzle_id: int = Path(..., ge=1, description="Puzzle ID"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get the current user's progress for a specific puzzle.
    """
    progress = await get_user_progress_for_puzzle(
        user_id=current_user["id"],
        puzzle_id=puzzle_id
    )
    
    return progress


@router.get("/{progress_id}", response_model=UserProgress)
async def get_progress(
    progress_id: int = Path(..., ge=1, description="Progress ID"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific progress entry by ID.
    """
    progress = await get_user_progress_by_id(
        progress_id=progress_id,
        user_id=current_user["id"]
    )
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progress with ID {progress_id} not found"
        )
    
    return progress


@router.post("/", response_model=UserProgress, status_code=status.HTTP_201_CREATED)
async def save_progress(
    progress: UserProgressCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Save the current user's progress for a puzzle.
    If progress already exists for this puzzle, it will be updated.
    """
    try:
        result = await create_or_update_user_progress(
            user_id=current_user["id"],
            progress=progress
        )
        return result
    except Exception as e:
        logger.error(f"Error saving progress: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save progress"
        )


@router.put("/{progress_id}", response_model=UserProgress)
async def update_progress(
    progress: UserProgressUpdate,
    progress_id: int = Path(..., ge=1, description="Progress ID"),
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing progress entry.
    """
    updated_progress = await update_user_progress(
        progress_id=progress_id,
        user_id=current_user["id"],
        progress=progress
    )
    
    if not updated_progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progress with ID {progress_id} not found"
        )
    
    return updated_progress


@router.delete("/{progress_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_progress(
    progress_id: int = Path(..., ge=1, description="Progress ID"),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a progress entry.
    """
    success = await delete_user_progress(
        progress_id=progress_id,
        user_id=current_user["id"]
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progress with ID {progress_id} not found"
        )
    
    return None 