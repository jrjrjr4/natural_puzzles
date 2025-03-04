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

describe('Landing Page', () => {
  beforeEach(() => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider value={{ user: null, supabase: {} as any }}>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    )
  })

  test('allows users to sign in', () => {
    // Email sign in should be available
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/password/i)
    const emailSignInButton = screen.getByRole('button', { name: /sign in with email/i })

    expect(emailInput).toBeEnabled()
    expect(passwordInput).toBeEnabled()
    expect(emailSignInButton).toBeEnabled()

    // Alternative sign in methods should be available
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeEnabled()
  })

  test('presents the app value proposition', () => {
    // Should have a main heading explaining the app
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
    
    // Should have an illustrative image
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  test('shows key features of the app', () => {
    // Should show multiple feature sections
    const features = screen.getAllByRole('heading', { level: 3 })
    expect(features.length).toBeGreaterThan(0)
  })
}) 