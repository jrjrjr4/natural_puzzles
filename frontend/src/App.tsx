import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import './index.css'

// Pages
import Home from './pages/Home'
import Puzzle from './pages/Puzzle'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ProfileTest from './components/ProfileTest'
import PuzzleTest from './components/PuzzleTest'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Context
import { AuthProvider } from './context/AuthContext'

// Types
import { Profile as ProfileType } from './types/supabase'

// Services
import profileService from './services/profileService'

// Supabase client
import supabase from './lib/supabaseClient'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log("Safety timeout triggered - forcing loading to false");
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout
    
    // Check for active session on load
    const checkSession = async () => {
      console.log("Checking session...")
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log("Session result:", session ? "Found session" : "No session")
        
        if (session) {
          setUser(session.user)
          
          // Fetch the user's profile
          console.log("Fetching profile for user:", session.user.id)
          try {
            const userProfile = await profileService.getProfile(session.user.id)
            console.log("Profile result:", userProfile ? "Profile found" : "No profile found")
            setProfile(userProfile)
          } catch (profileError) {
            console.error("Error fetching profile:", profileError)
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        console.log("Setting loading to false")
        setLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        
        if (session?.user) {
          // Fetch the user's profile when they log in
          const userProfile = await profileService.getProfile(session.user.id)
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // Clean up the timeout on unmount
    return () => {
      clearTimeout(safetyTimeout);
      subscription.unsubscribe()
    }
  }, [])

  console.log("App render - Loading state:", loading)
  console.log("App render - User state:", user ? "User logged in" : "No user")

  return (
    <AuthProvider value={{ user, profile, loading, supabase }}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/puzzle/:id" element={<Puzzle />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile-test" element={<ProfileTest />} />
              <Route path="/puzzle-test" element={<PuzzleTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App 