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
 * Puzzle table interface
 * Stores chess puzzles for users to solve
 */
export interface Puzzle {
  id: string; // UUID
  fen: string; // FEN notation of the puzzle position
  moves: string; // PGN or algebraic notation of the solution moves
  difficulty: number; // 1-5 difficulty rating
  theme: string; // Puzzle theme (e.g., "mate in 2", "fork", "pin")
  description: string | null; // Optional description or hints
  popularity: number; // Number of times the puzzle has been attempted
  success_rate: number; // Percentage of successful solutions
  source: string | null; // Source of the puzzle (e.g., game, composer)
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
      puzzles: {
        Row: Puzzle;
        Insert: Omit<Puzzle, 'created_at' | 'updated_at' | 'popularity' | 'success_rate'>;
        Update: Partial<Omit<Puzzle, 'id' | 'created_at' | 'updated_at'>>;
      };
      // Add other tables as they are created
    };
    // Add views, functions, etc. as needed
  };
} 