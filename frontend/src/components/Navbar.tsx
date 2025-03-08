import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, supabase } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-primary-600 dark:text-primary-400'
      : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/chess-knight.svg"
                alt="Chess Puzzle App"
              />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Chess Puzzles
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/') === 'text-primary-600 dark:text-primary-400'
                    ? 'border-primary-500'
                    : 'border-transparent'
                } ${isActive('/')}`}
              >
                Home
              </Link>
              <Link
                to="/puzzle"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/puzzle') === 'text-primary-600 dark:text-primary-400'
                    ? 'border-primary-500'
                    : 'border-transparent'
                } ${isActive('/puzzle')}`}
              >
                Puzzles
              </Link>
              <Link
                to="/puzzle-test"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/puzzle-test') === 'text-primary-600 dark:text-primary-400'
                    ? 'border-primary-500'
                    : 'border-transparent'
                } ${isActive('/puzzle-test')}`}
              >
                Puzzle Test
              </Link>
              {user && (
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    isActive('/profile') === 'text-primary-600 dark:text-primary-400'
                      ? 'border-primary-500'
                      : 'border-transparent'
                  } ${isActive('/profile')}`}
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">
                  {user.email}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary text-sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-secondary text-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                isActive('/') === 'text-primary-600 dark:text-primary-400'
                  ? 'border-primary-500 bg-primary-50 dark:bg-gray-700'
                  : 'border-transparent'
              } ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              to="/puzzle"
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                isActive('/puzzle') === 'text-primary-600 dark:text-primary-400'
                  ? 'border-primary-500 bg-primary-50 dark:bg-gray-700'
                  : 'border-transparent'
              } ${isActive('/puzzle')}`}
            >
              Puzzles
            </Link>
            <Link
              to="/puzzle-test"
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                isActive('/puzzle-test') === 'text-primary-600 dark:text-primary-400'
                  ? 'border-primary-500 bg-primary-50 dark:bg-gray-700'
                  : 'border-transparent'
              } ${isActive('/puzzle-test')}`}
            >
              Puzzle Test
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`block pl-3 pr-4 py-2 border-l-4 ${
                  isActive('/profile') === 'text-primary-600 dark:text-primary-400'
                    ? 'border-primary-500 bg-primary-50 dark:bg-gray-700'
                    : 'border-transparent'
                } ${isActive('/profile')}`}
              >
                Profile
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center">
                    <span className="text-primary-800 font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {user.email}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <Link to="/login" className="btn btn-secondary block text-center">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary block text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 