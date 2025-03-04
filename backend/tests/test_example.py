from fastapi.testclient import TestClient
import pytest
import sys
import os

# Add the parent directory to the path so we can import the main module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


def test_read_root():
    """Test the root endpoint returns the expected message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Chess Puzzle API"}


def test_get_puzzles():
    """Test that the puzzles endpoint returns a list of puzzles."""
    response = client.get("/puzzles")
    assert response.status_code == 200
    puzzles = response.json()
    assert isinstance(puzzles, list)
    assert len(puzzles) > 0
    
    # Check that each puzzle has the expected structure
    for puzzle in puzzles:
        assert "id" in puzzle
        assert "fen" in puzzle
        assert "solution_moves" in puzzle


def test_get_puzzle_by_id():
    """Test that we can get a specific puzzle by ID."""
    # First get all puzzles to find a valid ID
    response = client.get("/puzzles")
    puzzles = response.json()
    puzzle_id = puzzles[0]["id"]
    
    # Now request that specific puzzle
    response = client.get(f"/puzzles/{puzzle_id}")
    assert response.status_code == 200
    puzzle = response.json()
    assert puzzle["id"] == puzzle_id


def test_get_nonexistent_puzzle():
    """Test that requesting a nonexistent puzzle returns 404."""
    response = client.get("/puzzles/9999")
    assert response.status_code == 404


def test_save_user_progress():
    """Test that we can save user progress."""
    progress_data = {
        "user_id": "test-user-123",
        "puzzle_id": 1,
        "solved": True,
        "time_taken": 45,
        "attempts": 1
    }
    
    response = client.post("/user-progress", json=progress_data)
    assert response.status_code == 201
    assert response.json()["status"] == "success" 