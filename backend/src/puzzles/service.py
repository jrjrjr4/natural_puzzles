from typing import List, Optional, Dict, Any, Tuple
import logging
from src.db.client import execute_query
from src.puzzles.schemas import Puzzle, PuzzleCreate, PuzzleUpdate, PuzzleFilter
from src.core.config import settings

logger = logging.getLogger(__name__)

# Table name
PUZZLES_TABLE = "puzzles"


async def get_puzzles(
    page: int = 1,
    size: int = settings.DEFAULT_PUZZLE_LIMIT,
    filters: Optional[PuzzleFilter] = None
) -> Tuple[List[Puzzle], int]:
    """
    Get a paginated list of puzzles with optional filtering.
    
    Args:
        page: Page number (1-indexed)
        size: Page size
        filters: Optional filters
        
    Returns:
        Tuple of (puzzles list, total count)
    """
    # Ensure size doesn't exceed maximum
    if size > settings.MAX_PUZZLE_LIMIT:
        size = settings.MAX_PUZZLE_LIMIT
    
    # Calculate offset
    offset = (page - 1) * size
    
    # Build query filters
    query_filters = []
    
    if filters:
        if filters.min_difficulty is not None:
            query_filters.append(("difficulty", "gte", filters.min_difficulty))
        
        if filters.max_difficulty is not None:
            query_filters.append(("difficulty", "lte", filters.max_difficulty))
        
        if filters.themes:
            # This assumes themes are stored as an array in Supabase
            # The exact implementation depends on how themes are stored
            for theme in filters.themes:
                query_filters.append(("themes", "cs", f"{{{theme}}}"))
    
    # Get count first
    count_result = await execute_query(
        PUZZLES_TABLE,
        lambda q: q.select("count", count="exact"),
        filters=query_filters
    )
    
    total = count_result[0]["count"] if count_result else 0
    
    # Get puzzles
    puzzles_data = await execute_query(
        PUZZLES_TABLE,
        lambda q: q.select("*"),
        filters=query_filters,
        order=["difficulty", True],  # Order by difficulty ascending
        limit=size,
        offset=offset
    )
    
    # Convert to Puzzle objects
    puzzles = [Puzzle.model_validate(puzzle) for puzzle in puzzles_data]
    
    return puzzles, total


async def get_puzzle_by_id(puzzle_id: int) -> Optional[Puzzle]:
    """
    Get a puzzle by ID.
    
    Args:
        puzzle_id: Puzzle ID
        
    Returns:
        Puzzle if found, None otherwise
    """
    result = await execute_query(
        PUZZLES_TABLE,
        lambda q: q.select("*"),
        filters=[("id", "eq", puzzle_id)]
    )
    
    if not result:
        return None
    
    return Puzzle.model_validate(result[0])


async def create_puzzle(puzzle: PuzzleCreate) -> Puzzle:
    """
    Create a new puzzle.
    
    Args:
        puzzle: Puzzle data
        
    Returns:
        Created puzzle
    """
    result = await execute_query(
        PUZZLES_TABLE,
        lambda q: q.insert(puzzle.model_dump())
    )
    
    if not result:
        raise Exception("Failed to create puzzle")
    
    return Puzzle.model_validate(result[0])


async def update_puzzle(puzzle_id: int, puzzle: PuzzleUpdate) -> Optional[Puzzle]:
    """
    Update an existing puzzle.
    
    Args:
        puzzle_id: Puzzle ID
        puzzle: Updated puzzle data
        
    Returns:
        Updated puzzle if found, None otherwise
    """
    # Remove None values
    update_data = {k: v for k, v in puzzle.model_dump().items() if v is not None}
    
    if not update_data:
        # Nothing to update
        return await get_puzzle_by_id(puzzle_id)
    
    result = await execute_query(
        PUZZLES_TABLE,
        lambda q: q.update(update_data),
        filters=[("id", "eq", puzzle_id)]
    )
    
    if not result:
        return None
    
    return Puzzle.model_validate(result[0])


async def delete_puzzle(puzzle_id: int) -> bool:
    """
    Delete a puzzle.
    
    Args:
        puzzle_id: Puzzle ID
        
    Returns:
        True if deleted, False otherwise
    """
    result = await execute_query(
        PUZZLES_TABLE,
        lambda q: q.delete(),
        filters=[("id", "eq", puzzle_id)]
    )
    
    return bool(result)


async def get_recommended_puzzles(
    user_id: str,
    count: int = 5
) -> List[Puzzle]:
    """
    Get recommended puzzles for a user based on their progress and the spaced repetition algorithm.
    
    Args:
        user_id: User ID
        count: Number of puzzles to recommend
        
    Returns:
        List of recommended puzzles
    """
    # This is a simplified implementation
    # In a real app, you would:
    # 1. Get the user's progress
    # 2. Apply the spaced repetition algorithm
    # 3. Select puzzles that are due for review or new puzzles at the appropriate difficulty
    
    # For now, just return some puzzles
    puzzles, _ = await get_puzzles(size=count)
    return puzzles 