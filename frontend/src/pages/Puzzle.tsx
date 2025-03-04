import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { useAuth } from '../context/AuthContext'

interface PuzzleData {
  id: number
  fen: string
  solution_moves: string
  difficulty?: number
  themes?: string[]
}

const Puzzle = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null)
  const [game, setGame] = useState<Chess>(new Chess())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    const fetchPuzzle = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // In a real app, we would fetch from the API based on the ID
        // For now, we'll use dummy data
        const puzzleData: PuzzleData = {
          id: parseInt(id || '1'),
          fen: id === '2' 
            ? 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'
            : 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
          solution_moves: id === '2' ? 'd2d3' : 'd2d4',
          difficulty: id === '2' ? 1300 : 1200,
          themes: id === '2' ? ['opening', 'development'] : ['opening', 'development'],
        }
        
        setPuzzle(puzzleData)
        
        // Initialize the chess game with the puzzle position
        const newGame = new Chess(puzzleData.fen)
        setGame(newGame)
        setMoveHistory([])
        setCurrentStep(0)
        setMessage({ text: "Your turn to move. Find the best move!", type: 'info' })
      } catch (err) {
        setError('Failed to load puzzle. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPuzzle()
  }, [id])

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!puzzle) return false
    
    try {
      // Make the move
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      })
      
      // If the move is invalid, return false
      if (!move) return false
      
      // Update the game state
      setGame(new Chess(game.fen()))
      
      // Add the move to history
      const moveNotation = `${sourceSquare}${targetSquare}`
      setMoveHistory([...moveHistory, moveNotation])
      setCurrentStep(currentStep + 1)
      
      // Check if the move matches the solution
      const expectedMove = puzzle.solution_moves
      
      if (moveNotation === expectedMove) {
        setMessage({ text: 'Correct! Well done!', type: 'success' })
        
        // In a real app, we would save the progress to the backend
        if (user) {
          // Example API call (commented out)
          // saveProgress(puzzle.id, true)
        }
      } else {
        setMessage({ text: 'Incorrect. Try again!', type: 'error' })
        
        // In a real app, we would save the failed attempt
        if (user) {
          // Example API call (commented out)
          // saveProgress(puzzle.id, false)
        }
      }
      
      return true
    } catch (error) {
      console.error('Move error:', error)
      return false
    }
  }

  const resetPuzzle = () => {
    if (!puzzle) return
    
    const newGame = new Chess(puzzle.fen)
    setGame(newGame)
    setMoveHistory([])
    setCurrentStep(0)
    setMessage({ text: "Your turn to move. Find the best move!", type: 'info' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md">
        {error}
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Puzzle not found</h2>
        <p className="text-gray-600 dark:text-gray-300">
          The requested puzzle could not be found. Please try another one.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Chess Puzzle #{puzzle.id}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
            Difficulty: {puzzle.difficulty || 'Unknown'}
          </span>
          {puzzle.themes?.map((theme) => (
            <span 
              key={theme}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            >
              {theme}
            </span>
          ))}
        </div>
        
        {message && (
          <div 
            className={`p-3 rounded-md mb-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                : message.type === 'error'
                ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                : 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="aspect-square w-full max-w-md mx-auto">
            <Chessboard 
              position={game.fen()} 
              onPieceDrop={onDrop}
              boardOrientation={game.turn() === 'w' ? 'white' : 'black'}
            />
          </div>
        </div>
        
        <div className="card h-fit">
          <h2 className="text-lg font-semibold mb-3">Puzzle Information</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Position (FEN):</p>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs font-mono overflow-x-auto">
              {puzzle.fen}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your moves:</p>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded min-h-10">
              {moveHistory.length > 0 ? (
                <div className="text-sm font-mono">
                  {moveHistory.map((move, index) => (
                    <span key={index} className="mr-2">
                      {move}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No moves yet
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={resetPuzzle}
              className="btn btn-secondary text-sm flex-1"
            >
              Reset Puzzle
            </button>
            
            <button
              onClick={() => {
                // In a real app, this would navigate to the next puzzle
                window.location.href = `/puzzle/${parseInt(id || '1') + 1}`
              }}
              className="btn btn-primary text-sm flex-1"
            >
              Next Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Puzzle 