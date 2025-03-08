import React, { createContext, useContext } from 'react';

// Simplified types without external dependencies
interface User {
  id: string;
  email?: string;
}

interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  supabase: any; // Using any for simplicity
}

// Create context
const AuthContext = createContext(undefined);

export function AuthProvider({ children, value }: any) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 