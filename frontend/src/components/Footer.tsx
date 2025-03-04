import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              className="h-6 w-auto"
              src="/chess-knight.svg"
              alt="Chess Puzzle App"
            />
            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
              Chess Puzzle App
            </span>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link to="/puzzle" className="hover:text-gray-900 dark:hover:text-white">
              Puzzles
            </Link>
            <a 
              href="https://github.com/jrjrjr4/natural_puzzles" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {currentYear} Chess Puzzle App. All rights reserved.</p>
          <p className="mt-1">
            Built with React, Tailwind CSS, FastAPI, and Supabase.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 