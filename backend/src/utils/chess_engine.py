import logging
from typing import List, Optional, Tuple
import chess
import chess.engine
import asyncio
import os
from pathlib import Path

logger = logging.getLogger(__name__)

# Path to Stockfish engine
# This assumes Stockfish is installed and available in the system PATH
# In a production environment, you might want to include Stockfish with your application
STOCKFISH_PATH = os.environ.get("STOCKFISH_PATH", "stockfish")

# Global engine instance
_engine = None


async def get_engine():
    """
    Get or initialize the chess engine.
    
    Returns:
        Chess engine instance
    """
    global _engine
    
    if _engine is None:
        try:
            # Check if Stockfish is available
            if not Path(STOCKFISH_PATH).exists() and "stockfish" not in STOCKFISH_PATH:
                logger.warning(f"Stockfish not found at {STOCKFISH_PATH}. Chess engine features will be limited.")
                return None
            
            # Initialize engine
            _engine = await chess.engine.popen_uci(STOCKFISH_PATH)
            logger.info(f"Chess engine initialized: {_engine.id['name']}")
        except Exception as e:
            logger.error(f"Failed to initialize chess engine: {e}")
            return None
    
    return _engine


async def close_engine():
    """Close the chess engine."""
    global _engine
    
    if _engine is not None:
        await _engine.quit()
        _engine = None
        logger.info("Chess engine closed")


async def analyze_position(
    fen: str,
    depth: int = 20,
    multipv: int = 3,
    time_limit: float = 1.0
) -> List[dict]:
    """
    Analyze a chess position using the engine.
    
    Args:
        fen: FEN notation of the position
        depth: Analysis depth
        multipv: Number of principal variations to calculate
        time_limit: Time limit in seconds
        
    Returns:
        List of analysis results
    """
    engine = await get_engine()
    
    if engine is None:
        logger.warning("Chess engine not available for analysis")
        return []
    
    try:
        board = chess.Board(fen)
        
        # Set up analysis with time limit and multipv
        limit = chess.engine.Limit(time=time_limit)
        
        # Run analysis
        analysis = await engine.analyse(
            board,
            limit,
            multipv=multipv,
            info=chess.engine.INFO_ALL
        )
        
        # Format results
        results = []
        for pv in analysis:
            # Get the principal variation (sequence of moves)
            moves = []
            if "pv" in pv:
                for move in pv["pv"]:
                    moves.append(board.san(move))
                    board.push(move)
                
                # Reset board
                for _ in range(len(moves)):
                    board.pop()
            
            # Add result
            results.append({
                "score": pv.get("score", chess.engine.Score(0)).relative.score(mate_score=10000),
                "mate": pv.get("score", chess.engine.Score(0)).relative.mate(),
                "depth": pv.get("depth", 0),
                "nodes": pv.get("nodes", 0),
                "time": pv.get("time", 0),
                "moves": moves
            })
        
        return results
    except Exception as e:
        logger.error(f"Error analyzing position: {e}")
        return []


async def validate_move(
    fen: str,
    move: str
) -> Tuple[bool, Optional[float]]:
    """
    Validate a chess move and get its evaluation.
    
    Args:
        fen: FEN notation of the position
        move: Move in UCI notation (e.g., "e2e4")
        
    Returns:
        Tuple of (is_valid, evaluation)
    """
    try:
        board = chess.Board(fen)
        
        # Check if move is valid
        try:
            chess_move = chess.Move.from_uci(move)
            is_valid = chess_move in board.legal_moves
        except ValueError:
            return False, None
        
        if not is_valid:
            return False, None
        
        # Make the move
        board.push(chess_move)
        
        # Get evaluation
        engine = await get_engine()
        
        if engine is None:
            logger.warning("Chess engine not available for move validation")
            return True, None
        
        # Analyze position after move
        limit = chess.engine.Limit(time=0.1)
        info = await engine.analyse(board, limit)
        
        # Get evaluation
        evaluation = info.get("score", chess.engine.Score(0)).relative.score(mate_score=10000)
        
        return True, evaluation
    except Exception as e:
        logger.error(f"Error validating move: {e}")
        return False, None


async def generate_puzzle(
    fen: str,
    difficulty: int = 1500
) -> Optional[dict]:
    """
    Generate a puzzle from a given position.
    
    Args:
        fen: FEN notation of the position
        difficulty: Target difficulty rating
        
    Returns:
        Puzzle data if a puzzle can be generated, None otherwise
    """
    try:
        board = chess.Board(fen)
        engine = await get_engine()
        
        if engine is None:
            logger.warning("Chess engine not available for puzzle generation")
            return None
        
        # Analyze position
        limit = chess.engine.Limit(depth=20)
        result = await engine.play(board, limit)
        
        # Make the best move
        best_move = result.move
        board.push(best_move)
        
        # Analyze new position to find tactical motifs
        analysis = await analyze_position(board.fen(), depth=20, multipv=1)
        
        if not analysis:
            return None
        
        # Check if there's a significant advantage
        score = analysis[0]["score"]
        
        # If there's a mate or significant advantage, create a puzzle
        if analysis[0]["mate"] is not None or abs(score) > 200:
            # Find the solution moves
            solution_moves = [best_move.uci()]
            
            # Add opponent's best response
            opponent_analysis = await analyze_position(board.fen(), depth=20, multipv=1)
            if opponent_analysis and "pv" in opponent_analysis[0]:
                opponent_move = opponent_analysis[0]["pv"][0]
                solution_moves.append(opponent_move.uci())
                board.push(opponent_move)
                
                # Add final move if there's a clear continuation
                final_analysis = await analyze_position(board.fen(), depth=20, multipv=1)
                if final_analysis and "pv" in final_analysis[0]:
                    final_move = final_analysis[0]["pv"][0]
                    solution_moves.append(final_move.uci())
            
            # Estimate difficulty based on depth and score
            estimated_difficulty = min(3000, max(800, 1500 + abs(score) // 10))
            
            # Create puzzle
            return {
                "fen": fen,
                "solution_moves": " ".join(solution_moves),
                "difficulty": estimated_difficulty,
                "themes": ["tactics", "advantage"]
            }
        
        return None
    except Exception as e:
        logger.error(f"Error generating puzzle: {e}")
        return None 