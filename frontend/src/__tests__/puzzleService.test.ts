import { puzzleService } from '../services/puzzleService';

// Skip all tests by default since they require backend connectivity
// Only run these when specifically testing database connectivity
describe('Puzzle Service Database Connectivity Tests', () => {
  beforeEach(() => {
    // Silence console logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * This test checks if we can connect to the Supabase database
   * and access the puzzles table
   */
  test.skip('should connect to puzzles table and verify it exists', async () => {
    const isAccessible = await puzzleService.checkTableAccess();
    expect(isAccessible).toBe(true);
  });

  /**
   * This test fetches puzzles to verify we can retrieve data
   */
  test.skip('should retrieve puzzles from database', async () => {
    const puzzles = await puzzleService.getPuzzles(10, 0);
    expect(puzzles).toBeDefined();
    expect(Array.isArray(puzzles)).toBe(true);
  });

  /**
   * This test checks if we can filter puzzles by difficulty
   */
  test.skip('should filter puzzles by difficulty', async () => {
    // Test difficulty level 1
    const easyPuzzles = await puzzleService.getPuzzlesByDifficulty(1);
    expect(easyPuzzles).toBeDefined();
    expect(Array.isArray(easyPuzzles)).toBe(true);
  });
});

/**
 * Simple tests that don't require connectivity
 */
describe('Puzzle Service Basic Tests', () => {
  test('puzzleService should be defined', () => {
    expect(puzzleService).toBeDefined();
    expect(typeof puzzleService.getPuzzles).toBe('function');
    expect(typeof puzzleService.getPuzzleById).toBe('function');
    expect(typeof puzzleService.getPuzzlesByDifficulty).toBe('function');
  });
});

/**
 * Direct REST API Test - This is a backup test that uses fetch directly
 * in case there are issues with the Supabase client
 */
describe('Direct REST API Connectivity Tests', () => {
  test('should access puzzles via direct REST API', async () => {
    try {
      const apiUrl = `${process.env.VITE_SUPABASE_URL}/rest/v1/puzzles?select=id&limit=1`;
      const apiKey = process.env.VITE_SUPABASE_ANON_KEY || '';
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    } catch (err) {
      fail('Direct API test failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  });
});

/**
 * Puzzle Data Structure Tests
 */
describe('Puzzle Data Structure Tests', () => {
  test('puzzles should have the correct structure', async () => {
    const puzzles = await puzzleService.getPuzzles(1, 0);
    
    if (puzzles.length > 0) {
      const puzzle = puzzles[0];
      
      // Check required fields
      expect(puzzle).toHaveProperty('id');
      expect(puzzle).toHaveProperty('fen');
      expect(puzzle).toHaveProperty('moves');
      expect(puzzle).toHaveProperty('difficulty');
      expect(puzzle).toHaveProperty('theme');
      
      // Check types
      expect(typeof puzzle.id).toBe('string');
      expect(typeof puzzle.fen).toBe('string');
      expect(typeof puzzle.moves).toBe('string');
      expect(typeof puzzle.difficulty).toBe('number');
      expect(typeof puzzle.theme).toBe('string');
      
      // Difficulty should be between 1 and 5
      expect(puzzle.difficulty).toBeGreaterThanOrEqual(1);
      expect(puzzle.difficulty).toBeLessThanOrEqual(5);
    }
  });
}); 