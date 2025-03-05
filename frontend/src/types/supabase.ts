/**
 * Type definitions for Supabase tables
 */

/**
 * Profile table interface
 * Extends the Supabase auth.users table with additional fields
 */
export interface Profile {
  id: string; // UUID
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  rating: number;
  puzzles_solved: number;
  puzzles_attempted: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Database interfaces as they appear in Supabase
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      // Add other tables as they are created
    };
    // Add views, functions, etc. as needed
  };
} 