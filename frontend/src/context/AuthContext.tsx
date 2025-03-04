import { createContext, useContext, ReactNode } from 'react'
import { SupabaseClient, User } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  supabase: SupabaseClient
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children, 
  value 
}: { 
  children: ReactNode
  value: AuthContextType 
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 