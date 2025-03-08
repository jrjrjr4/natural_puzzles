import supabase from '../lib/supabaseClient';
import { Puzzle } from '../types/supabase';

/**
 * Service to interact with chess puzzles in Supabase
 */
export const puzzleService = {
  /**
   * Get all puzzles
   * @param limit Optional limit for number of puzzles to fetch
   * @param offset Optional offset for pagination
   * @returns Array of puzzles or empty array if none found
   */
  async getPuzzles(limit = 10, offset = 0): Promise<Puzzle[]> {
    try {
      console.log(`PuzzleService: Fetching puzzles (limit: ${limit}, offset: ${offset})...`);
      
      // First log what we're about to do
      console.log('PuzzleService: Will run query:', 
        `supabase.from('puzzles').select('*').range(${offset}, ${offset + limit - 1}).order('id', { ascending: true })`);
      
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('id', { ascending: true });
      
      console.log('PuzzleService: Query completed');
      
      if (error) {
        console.error('PuzzleService: Error fetching puzzles:', error.message, error.details, error.hint, error.code);
        return [];
      }
      
      if (!data) {
        console.log('PuzzleService: No data returned (data is null)');
        return [];
      }
      
      if (data.length === 0) {
        console.log('PuzzleService: Data array is empty (length = 0)');
        return [];
      }
      
      console.log(`PuzzleService: Successfully fetched ${data.length} puzzles:`, data);
      return data as Puzzle[];
    } catch (e) {
      console.error('PuzzleService: Unexpected error in getPuzzles:', e);
      return [];
    }
  },

  /**
   * Get a puzzle by ID
   * @param id Puzzle ID
   * @returns Puzzle or null if not found
   */
  async getPuzzleById(id: string): Promise<Puzzle | null> {
    try {
      console.log(`PuzzleService: Fetching puzzle with ID ${id}...`);
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('PuzzleService: Error fetching puzzle:', error.message, error.details, error.hint);
        return null;
      }
      
      if (!data) {
        console.log(`PuzzleService: No puzzle found with ID ${id}`);
        return null;
      }
      
      console.log('PuzzleService: Puzzle fetched successfully:', data);
      return data as Puzzle;
    } catch (e) {
      console.error('PuzzleService: Unexpected error in getPuzzleById:', e);
      return null;
    }
  },

  /**
   * Get puzzles by difficulty level
   * @param difficulty Difficulty level (1-5)
   * @param limit Optional limit for number of puzzles to fetch
   * @param offset Optional offset for pagination
   * @returns Array of puzzles or empty array if none found
   */
  async getPuzzlesByDifficulty(difficulty: number, limit = 10, offset = 0): Promise<Puzzle[]> {
    try {
      console.log(`PuzzleService: Fetching puzzles with difficulty ${difficulty}...`);
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('difficulty', difficulty)
        .range(offset, offset + limit - 1)
        .order('id', { ascending: true });
      
      if (error) {
        console.error('PuzzleService: Error fetching puzzles by difficulty:', error.message, error.details, error.hint);
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log(`PuzzleService: No puzzles found with difficulty ${difficulty}`);
        return [];
      }
      
      console.log(`PuzzleService: Successfully fetched ${data.length} puzzles with difficulty ${difficulty}:`, data);
      return data as Puzzle[];
    } catch (e) {
      console.error('PuzzleService: Unexpected error in getPuzzlesByDifficulty:', e);
      return [];
    }
  },

  /**
   * Debug method: Check if the puzzles table exists and is accessible
   * @returns Boolean indicating if the table is accessible
   */
  async checkTableAccess(): Promise<boolean> {
    try {
      console.log('PuzzleService: Checking table access...');
      console.log('PuzzleService: Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'not set');
      console.log('PuzzleService: Anon key length:', (import.meta.env.VITE_SUPABASE_ANON_KEY || '').length > 0 ? 'Key exists' : 'Key not set');
      
      // Use a super simple query to just check connectivity
      console.log('PuzzleService: Attempting simple query...');
      const result = await supabase.from('puzzles').select('id').limit(1);
      
      // More explicit error handling with destructuring after the await
      console.log('PuzzleService: Query completed, checking result');
      const { data, error } = result;
      
      if (error) {
        console.error('PuzzleService: Error accessing puzzles table:', error);
        console.error('PuzzleService: Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return false;
      }
      
      if (!data) {
        console.log('PuzzleService: No data returned (null)');
        return false;
      }
      
      console.log('PuzzleService: Successfully accessed puzzles table, found rows:', data.length);
      return true;
    } catch (e) {
      console.error('PuzzleService: Unexpected error checking table access:', e);
      if (e instanceof Error) {
        console.error('PuzzleService: Error name:', e.name);
        console.error('PuzzleService: Error message:', e.message);
        console.error('PuzzleService: Error stack:', e.stack);
      }
      return false;
    }
  }
};

export default puzzleService; 