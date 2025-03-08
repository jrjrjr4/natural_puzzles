import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import { AuthProvider } from '../context/AuthContext'

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    user: null,
    supabase: {
      auth: {
        signInWithPassword: jest.fn(),
        signInWithOAuth: jest.fn(),
      },
    },
  }),
}))

describe('Home Component', () => {
  test('renders the home page with sign in form when user is not logged in', () => {
    render(
      <BrowserRouter>
        <AuthProvider value={{ 
          user: null, 
          profile: null, 
          loading: false, 
          supabase: {} as any 
        }}>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    )
    
    // Check for heading
    expect(screen.getByText(/Improve Your Chess Skills/i)).toBeInTheDocument()
    
    // Check for sign in form
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign in with Email/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument()
  })
  
  test('renders the features section', () => {
    render(
      <BrowserRouter>
        <AuthProvider value={{ 
          user: null, 
          profile: null, 
          loading: false, 
          supabase: {} as any 
        }}>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    )
    
    // Check for feature headings
    expect(screen.getByText(/Tactical Training/i)).toBeInTheDocument()
    expect(screen.getByText(/Spaced Repetition/i)).toBeInTheDocument()
    expect(screen.getByText(/Progress Tracking/i)).toBeInTheDocument()
  })
}) 