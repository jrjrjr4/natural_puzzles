from typing import List, Optional, Dict, Any, Tuple
import logging
from datetime import datetime, date, timedelta
from src.db.client import execute_query
from src.user_progress.schemas import (
    UserProgress,
    UserProgressCreate,
    UserProgressUpdate,
    UserProgressStats
)
from src.core.config import settings

logger = logging.getLogger(__name__)

# Table name
USER_PROGRESS_TABLE = "user_progress"


async def get_user_progress(
    user_id: str,
    puzzle_id: Optional[int] = None,
    limit: int = 100,
    offset: int = 0
) -> Tuple[List[UserProgress], int]:
    """
    Get user progress entries.
    
    Args:
        user_id: User ID
        puzzle_id: Optional puzzle ID to filter by
        limit: Maximum number of entries to return
        offset: Offset for pagination
        
    Returns:
        Tuple of (progress entries, total count)
    """
    # Build query filters
    filters = [("user_id", "eq", user_id)]
    
    if puzzle_id is not None:
        filters.append(("puzzle_id", "eq", puzzle_id))
    
    # Get count first
    count_result = await execute_query(
        USER_PROGRESS_TABLE,
        lambda q: q.select("count", count="exact"),
        filters=filters
    )
    
    total = count_result[0]["count"] if count_result else 0
    
    # Get progress entries
    progress_data = await execute_query(
        USER_PROGRESS_TABLE,
        lambda q: q.select("*"),
        filters=filters,
        order=["updated_at", True],  # Order by updated_at descending
        limit=limit,
        offset=offset
    )
    
    # Convert to UserProgress objects
    progress_entries = [UserProgress.model_validate(entry) for entry in progress_data]
    
    return progress_entries, total


async def get_user_progress_by_id(
    progress_id: int,
    user_id: str
) -> Optional[UserProgress]:
    """
    Get a user progress entry by ID.
    
    Args:
        progress_id: Progress entry ID
        user_id: User ID (for authorization)
        
    Returns:
        UserProgress if found, None otherwise
    """
    result = await execute_query(
        USER_PROGRESS_TABLE,
        lambda q: q.select("*"),
        filters=[("id", "eq", progress_id), ("user_id", "eq", user_id)]
    )
    
    if not result:
        return None
    
    return UserProgress.model_validate(result[0])


async def get_user_progress_for_puzzle(
    user_id: str,
    puzzle_id: int
) -> Optional[UserProgress]:
    """
    Get a user's progress for a specific puzzle.
    
    Args:
        user_id: User ID
        puzzle_id: Puzzle ID
        
    Returns:
        UserProgress if found, None otherwise
    """
    result = await execute_query(
        USER_PROGRESS_TABLE,
        lambda q: q.select("*"),
        filters=[("user_id", "eq", user_id), ("puzzle_id", "eq", puzzle_id)]
    )
    
    if not result:
        return None
    
    return UserProgress.model_validate(result[0])


async def create_or_update_user_progress(
    user_id: str,
    progress: UserProgressCreate
) -> UserProgress:
    """
    Create or update user progress for a puzzle.
    
    Args:
        user_id: User ID
        progress: Progress data
        
    Returns:
        Created or updated progress entry
    """
    # Check if progress already exists for this user and puzzle
    existing_progress = await get_user_progress_for_puzzle(user_id, progress.puzzle_id)
    
    if existing_progress:
        # Update existing progress
        update_data = progress.model_dump()
        
        # Calculate next review date using spaced repetition algorithm
        next_review_date, ease_factor, interval = calculate_next_review(
            existing_progress.ease_factor,
            existing_progress.interval,
            progress.solved
        )
        
        update_data.update({
            "next_review_date": next_review_date.isoformat(),
            "ease_factor": ease_factor,
            "interval": interval,
            "updated_at": datetime.now().isoformat()
        })
        
        result = await execute_query(
            USER_PROGRESS_TABLE,
            lambda q: q.update(update_data),
            filters=[("id", "eq", existing_progress.id)]
        )
    else:
        # Create new progress entry
        create_data = progress.model_dump()
        create_data.update({
            "user_id": user_id,
            "next_review_date": (date.today() + timedelta(days=1)).isoformat(),  # Default to tomorrow
            "ease_factor": settings.DEFAULT_EASE_FACTOR,
            "interval": settings.MIN_INTERVAL_DAYS,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        })
        
        result = await execute_query(
            USER_PROGRESS_TABLE,
            lambda q: q.insert(create_data)
        )
    
    if not result:
        raise Exception("Failed to create or update user progress")
    
    return UserProgress.model_validate(result[0])


async def update_user_progress(
    progress_id: int,
    user_id: str,
    progress: UserProgressUpdate
) -> Optional[UserProgress]:
    """
    Update an existing user progress entry.
    
    Args:
        progress_id: Progress entry ID
        user_id: User ID (for authorization)
        progress: Updated progress data
        
    Returns:
        Updated progress entry if found, None otherwise
    """
    # Check if progress exists and belongs to the user
    existing_progress = await get_user_progress_by_id(progress_id, user_id)
    
    if not existing_progress:
        return None
    
    # Remove None values
    update_data = {k: v for k, v in progress.model_dump().items() if v is not None}
    
    if not update_data:
        # Nothing to update
        return existing_progress
    
    # If solved status is being updated, recalculate spaced repetition parameters
    if "solved" in update_data:
        next_review_date, ease_factor, interval = calculate_next_review(
            existing_progress.ease_factor,
            existing_progress.interval,
            update_data["solved"]
        )
        
        update_data.update({
            "next_review_date": next_review_date.isoformat(),
            "ease_factor": ease_factor,
            "interval": interval
        })
    
    # Add updated_at timestamp
    update_data["updated_at"] = datetime.now().isoformat()
    
    result = await execute_query(
        USER_PROGRESS_TABLE,
        lambda q: q.update(update_data),
        filters=[("id", "eq", progress_id)]
    )
    
    if not result:
        return None
    
    return UserProgress.model_validate(result[0])


async def delete_user_progress(
    progress_id: int,
    user_id: str
) -> bool:
    """
    Delete a user progress entry.
    
    Args:
        progress_id: Progress entry ID
        user_id: User ID (for authorization)
        
    Returns:
        True if deleted, False otherwise
    """
    # Check if progress exists and belongs to the user
    existing_progress = await get_user_progress_by_id(progress_id, user_id)
    
    if not existing_progress:
        return False
    
    result = await execute_query(
        USER_PROGRESS_TABLE,
        lambda q: q.delete(),
        filters=[("id", "eq", progress_id)]
    )
    
    return bool(result)


async def get_user_progress_stats(user_id: str) -> UserProgressStats:
    """
    Get statistics about a user's progress.
    
    Args:
        user_id: User ID
        
    Returns:
        UserProgressStats object
    """
    # Get all progress entries for the user
    progress_entries, _ = await get_user_progress(user_id, limit=1000)
    
    # Calculate statistics
    total_puzzles_attempted = len(progress_entries)
    total_puzzles_solved = sum(1 for entry in progress_entries if entry.solved)
    
    success_rate = total_puzzles_solved / total_puzzles_attempted if total_puzzles_attempted > 0 else 0
    
    # Calculate average time and attempts
    times = [entry.time_taken for entry in progress_entries if entry.time_taken is not None]
    attempts = [entry.attempts for entry in progress_entries if entry.attempts is not None]
    
    average_time = sum(times) / len(times) if times else None
    average_attempts = sum(attempts) / len(attempts) if attempts else None
    
    # Count puzzles due for review
    today = date.today()
    puzzles_due_for_review = sum(
        1 for entry in progress_entries 
        if entry.next_review_date is not None and entry.next_review_date <= today
    )
    
    return UserProgressStats(
        total_puzzles_solved=total_puzzles_solved,
        total_puzzles_attempted=total_puzzles_attempted,
        success_rate=success_rate,
        average_time=average_time,
        average_attempts=average_attempts,
        puzzles_due_for_review=puzzles_due_for_review
    )


def calculate_next_review(
    current_ease_factor: float,
    current_interval: int,
    solved: bool
) -> Tuple[date, float, int]:
    """
    Calculate the next review date using the SuperMemo-2 spaced repetition algorithm.
    
    Args:
        current_ease_factor: Current ease factor
        current_interval: Current interval in days
        solved: Whether the puzzle was solved correctly
        
    Returns:
        Tuple of (next review date, new ease factor, new interval)
    """
    if solved:
        # If solved correctly, increase interval and adjust ease factor
        if current_interval == 1:
            new_interval = 6
        elif current_interval == 6:
            new_interval = 15
        else:
            new_interval = int(current_interval * current_ease_factor)
        
        # Ensure interval doesn't exceed maximum
        new_interval = min(new_interval, settings.MAX_INTERVAL_DAYS)
        
        # Increase ease factor slightly
        new_ease_factor = current_ease_factor + 0.1
    else:
        # If not solved correctly, reset interval and decrease ease factor
        new_interval = settings.MIN_INTERVAL_DAYS
        
        # Decrease ease factor
        new_ease_factor = max(1.3, current_ease_factor - 0.2)
    
    # Calculate next review date
    next_review_date = date.today() + timedelta(days=new_interval)
    
    return next_review_date, new_ease_factor, new_interval 