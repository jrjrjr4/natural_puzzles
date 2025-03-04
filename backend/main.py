from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Chess Puzzle API",
    description="API for chess puzzle app with spaced repetition learning",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase integration (placeholder)
# In a real implementation, you would initialize the Supabase client here
# from supabase import create_client
# supabase_url = os.getenv("SUPABASE_URL")
# supabase_key = os.getenv("SUPABASE_KEY")
# supabase = create_client(supabase_url, supabase_key)


# Models
class Puzzle(BaseModel):
    id: int
    fen: str
    solution_moves: str
    difficulty: Optional[int] = None
    themes: Optional[List[str]] = None


class UserProgress(BaseModel):
    user_id: str
    puzzle_id: int
    solved: bool
    time_taken: Optional[int] = None
    attempts: Optional[int] = None
    next_review_date: Optional[str] = None


# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the Chess Puzzle API"}


@app.get("/puzzles", response_model=List[Puzzle])
async def get_puzzles():
    """
    Get a list of chess puzzles.
    
    In a real implementation, this would fetch puzzles from Supabase
    based on the user's skill level and spaced repetition algorithm.
    """
    # Dummy puzzle data
    puzzles = [
        {
            "id": 1,
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
            "solution_moves": "d2d4",
            "difficulty": 1200,
            "themes": ["opening", "development"]
        },
        {
            "id": 2,
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
            "solution_moves": "d2d3",
            "difficulty": 1300,
            "themes": ["opening", "development"]
        },
        {
            "id": 3,
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 5",
            "solution_moves": "e8g8",
            "difficulty": 1400,
            "themes": ["opening", "castling"]
        },
    ]
    return puzzles


@app.get("/puzzles/{puzzle_id}", response_model=Puzzle)
async def get_puzzle(puzzle_id: int):
    """Get a specific puzzle by ID."""
    # In a real implementation, fetch from Supabase
    puzzles = await get_puzzles()
    for puzzle in puzzles:
        if puzzle["id"] == puzzle_id:
            return puzzle
    raise HTTPException(status_code=404, detail="Puzzle not found")


@app.post("/user-progress", status_code=status.HTTP_201_CREATED)
async def save_user_progress(progress: UserProgress):
    """
    Save user's progress on a puzzle.
    
    In a real implementation, this would:
    1. Validate the user's JWT token
    2. Update the user's progress in Supabase
    3. Apply spaced repetition algorithm to determine next review date
    """
    logger.info(f"Saving progress for user {progress.user_id} on puzzle {progress.puzzle_id}")
    
    # Placeholder for Supabase integration
    # supabase.table("user_progress").insert(progress.dict()).execute()
    
    return {"status": "success", "message": "Progress saved successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 