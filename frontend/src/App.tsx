import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import './index.css'

// Pages
import Home from './pages/Home'
import Puzzle from './pages/Puzzle'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import Login from './pages/Login'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Context
import { AuthProvider } from './context/AuthContext'

// Types
import { Profile as ProfileType } from './types/supabase'

// Services
import profileService from './services/profileService'

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setUser(session.user)
          
          // Fetch the user's profile
          const userProfile = await profileService.getProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
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

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <AuthProvider value={{ user, profile, loading, supabase }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/puzzle/:id" element={<Puzzle />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App 