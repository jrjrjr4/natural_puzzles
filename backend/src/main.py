from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from typing import AsyncGenerator

# Import routers
from src.auth.router import router as auth_router
from src.puzzles.router import router as puzzles_router
from src.user_progress.router import router as user_progress_router

# Import config
from src.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan context manager for FastAPI app.
    Handles startup and shutdown events.
    """
    # Startup: Initialize connections and resources
    logger.info("Starting up Chess Puzzle API")
    # Initialize Supabase client or other resources here
    
    yield
    
    # Shutdown: Close connections and clean up resources
    logger.info("Shutting down Chess Puzzle API")
    # Close connections and clean up resources here

# Initialize FastAPI app
app = FastAPI(
    title="Chess Puzzle API",
    description="API for chess puzzle app with spaced repetition learning",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(puzzles_router, prefix="/puzzles", tags=["Puzzles"])
app.include_router(user_progress_router, prefix="/user-progress", tags=["User Progress"])

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Welcome to the Chess Puzzle API"} 