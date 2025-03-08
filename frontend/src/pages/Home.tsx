import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'
import supabase from '../lib/supabaseClient'

const Home = () => {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Profile testing
  const [profile, setProfile] = useState<any>(null)
  const [profileMessage, setProfileMessage] = useState<string>('')

  // Load profile when user is available
  useEffect(() => {
    if (user) {
      console.log("Home: User available, loading profile...");
      loadProfile();
    } else {
      console.log("Home: No user available");
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      console.log("Home: Calling profileService.getCurrentProfile...");
      const data = await profileService.getCurrentProfile();
      console.log("Home: Profile loaded result:", data ? "Success" : "No profile");
      setProfile(data);
      setProfileMessage(data ? 'Profile loaded successfully' : 'No profile found');
    } catch (error: any) {
      console.error("Home: Error loading profile:", error);
      setProfileMessage(`Error loading profile: ${error.message}`);
    }
  }

  const updateBio = async () => {
    if (!user) return
    
    try {
      const updatedProfile = await profileService.updateProfile(user.id, {
        bio: "Chess enthusiast and puzzle solver!",
        display_name: "Chess Master"
      })
      setProfile(updatedProfile)
      setProfileMessage('Profile updated successfully')
    } catch (error: any) {
      setProfileMessage(`Error updating profile: ${error.message}`)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      })
      
      if (error) throw error
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Improve Your Chess Skills with Spaced Repetition
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Train your tactical vision and calculation abilities with our curated collection of chess puzzles,
            optimized for efficient learning using spaced repetition algorithms.
          </p>
          
          {user ? (
            <>
              <Link to="/puzzle" className="btn btn-primary inline-block">
                Start Solving Puzzles
              </Link>
              
              {/* Profile testing section */}
              <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Profile Test</h2>
                <p className="text-sm mb-4">{profileMessage}</p>
                
                {profile && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-1">Current Profile:</h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(profile, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button 
                    onClick={loadProfile} 
                    className="btn btn-sm btn-secondary"
                  >
                    Refresh Profile
                  </button>
                  <button 
                    onClick={updateBio} 
                    className="btn btn-sm btn-primary"
                  >
                    Update Bio
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sign In</h2>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in with Email'}
                  </button>
                </form>
                
                <div className="mt-4 flex items-center">
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                  <span className="px-2 text-sm text-gray-500 dark:text-gray-400">OR</span>
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                </div>
                
                <button
                  onClick={handleGoogleSignIn}
                  className="mt-4 w-full flex items-center justify-center btn btn-secondary"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1560174038-594a6e2e8b28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80"
            alt="Chess pieces"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <div className="text-primary-600 dark:text-primary-400 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Tactical Training</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Improve your pattern recognition and calculation skills with our curated collection of tactical puzzles.
          </p>
        </div>
        
        <div className="card">
          <div className="text-primary-600 dark:text-primary-400 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Spaced Repetition</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Our algorithm adapts to your performance, showing you puzzles at optimal intervals for maximum retention.
          </p>
        </div>
        
        <div className="card">
          <div className="text-primary-600 dark:text-primary-400 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Progress Tracking</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your improvement over time with detailed statistics and performance analytics.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home 