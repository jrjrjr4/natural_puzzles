from datetime import date, timedelta
from typing import Tuple
import logging
from src.core.config import settings

logger = logging.getLogger(__name__)


def calculate_next_review(
    ease_factor: float,
    interval: int,
    quality: int
) -> Tuple[date, float, int]:
    """
    Calculate the next review date using the SuperMemo-2 spaced repetition algorithm.
    
    Args:
        ease_factor: Current ease factor
        interval: Current interval in days
        quality: Quality of the response (0-5, where 0 is complete blackout, 5 is perfect)
        
    Returns:
        Tuple of (next review date, new ease factor, new interval)
    """
    # Ensure quality is within bounds
    quality = max(0, min(5, quality))
    
    # Calculate new ease factor
    new_ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    # Ensure ease factor doesn't go below minimum
    new_ease_factor = max(1.3, new_ease_factor)
    
    # Calculate new interval
    if quality < 3:
        # If quality is less than 3, reset interval
        new_interval = settings.MIN_INTERVAL_DAYS
    else:
        # Otherwise, increase interval
        if interval == 1:
            new_interval = 6
        elif interval == 6:
            new_interval = 15
        else:
            new_interval = int(interval * new_ease_factor)
        
        # Ensure interval doesn't exceed maximum
        new_interval = min(new_interval, settings.MAX_INTERVAL_DAYS)
    
    # Calculate next review date
    next_review_date = date.today() + timedelta(days=new_interval)
    
    return next_review_date, new_ease_factor, new_interval


def quality_from_performance(
    solved: bool,
    attempts: int,
    time_taken: int = None
) -> int:
    """
    Convert puzzle performance to a quality rating (0-5).
    
    Args:
        solved: Whether the puzzle was solved
        attempts: Number of attempts
        time_taken: Time taken to solve in seconds (optional)
        
    Returns:
        Quality rating (0-5)
    """
    if not solved:
        # If not solved, quality is 0-2 depending on attempts
        return min(2, max(0, 3 - attempts))
    
    # If solved, quality is 3-5
    base_quality = 3
    
    # Add 1 for solving on first attempt
    if attempts == 1:
        base_quality += 1
    
    # Add 1 for solving quickly (if time data is available)
    if time_taken is not None and time_taken < 30:  # Less than 30 seconds
        base_quality += 1
    
    return min(5, base_quality) 