import React, { createContext, useContext, ReactNode } from 'react'
import { SupabaseClient, User } from '@supabase/supabase-js'

interface Profile {
  id: string
  user_id: string
  display_name?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  supabase: SupabaseClient
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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