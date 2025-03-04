import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface UserStats {
  totalPuzzlesSolved: number
  currentStreak: number
  averageTime: number
  rating: number
  puzzlesByDifficulty: {
    easy: number
    medium: number
    hard: number
  }
}

const Profile = () => {
  const { user, supabase } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats>({
    totalPuzzlesSolved: 0,
    currentStreak: 0,
    averageTime: 0,
    rating: 1200,
    puzzlesByDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  })

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/')
      return
    }

    const fetchUserStats = async () => {
      setLoading(true)
      
      try {
        // In a real app, we would fetch user stats from the API
        // For now, we'll use dummy data
        setTimeout(() => {
          setStats({
            totalPuzzlesSolved: 42,
            currentStreak: 5,
            averageTime: 28,
            rating: 1350,
            puzzlesByDifficulty: {
              easy: 25,
              medium: 15,
              hard: 2,
            },
          })
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('Error fetching user stats:', error)
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [user, navigate])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Hello, {user?.email || 'User'}! Here&apos;s your chess puzzle progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p className="font-mono text-sm truncate">{user?.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
              <p className="font-medium">
                {user?.created_at 
                  ? new Date(user.created_at).toLocaleDateString() 
                  : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleSignOut}
              className="btn btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Puzzles Solved</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.totalPuzzlesSolved}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.currentStreak} days
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Time</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.averageTime}s
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Puzzle Rating</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.rating}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Puzzles by Difficulty</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Easy</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.puzzlesByDifficulty.easy} puzzles
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (stats.puzzlesByDifficulty.easy / (stats.totalPuzzlesSolved || 1)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Medium</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.puzzlesByDifficulty.medium} puzzles
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (stats.puzzlesByDifficulty.medium / (stats.totalPuzzlesSolved || 1)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Hard</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.puzzlesByDifficulty.hard} puzzles
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (stats.puzzlesByDifficulty.hard / (stats.totalPuzzlesSolved || 1)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Based on your performance, we recommend focusing on these puzzle types:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
              <span>Pins and Skewers</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
              <span>Knight Forks</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
              <span>Endgame Tactics</span>
            </div>
          </div>
          
          <div className="mt-4">
            <a 
              href="/puzzle" 
              className="btn btn-primary inline-block"
            >
              Start Practice Session
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 