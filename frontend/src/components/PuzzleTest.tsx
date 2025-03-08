import React, { useEffect, useState } from 'react';
import puzzleService from '../services/puzzleService';
import { Puzzle } from '../types/supabase';

const PuzzleTest: React.FC = () => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<number>(0);
  const [tableAccessible, setTableAccessible] = useState<boolean | null>(null);
  const [directTestResult, setDirectTestResult] = useState<string | null>(null);

  // Direct REST API test that bypasses the Supabase client library
  const testDirectApiAccess = async () => {
    try {
      console.log('PuzzleTest: Testing direct API access...');
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/puzzles?select=*&limit=10`;
      const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('PuzzleTest: API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('PuzzleTest: Direct API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('PuzzleTest: Direct API error:', errorText);
        setDirectTestResult(`API Error: ${response.status} - ${errorText}`);
        return false;
      }
      
      const data = await response.json();
      console.log('PuzzleTest: Direct API success, data:', data);
      setDirectTestResult(`API Success: ${data.length} items returned`);
      
      // Immediately set puzzles if we got data
      if (data && data.length > 0) {
        console.log('PuzzleTest: Setting puzzles directly from API response');
        setPuzzles(data);
        setLoading(false);
        setTableAccessible(true); // Mark table as accessible since we got data
        return true;
      }
      
      return data && data.length > 0;
    } catch (err) {
      console.error('PuzzleTest: Direct API access error:', err);
      setDirectTestResult(`API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  const checkTableAccess = async () => {
    console.log('PuzzleTest: Starting table access check...');
    
    // Add a timeout to prevent hanging if the check never completes
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        console.log('PuzzleTest: Table access check timed out after 5 seconds');
        resolve(false);
      }, 5000);
    });
    
    try {
      // Race the actual check against the timeout
      const accessible = await Promise.race([
        puzzleService.checkTableAccess(),
        timeoutPromise
      ]);
      
      console.log('PuzzleTest: Table access check result:', accessible);
      setTableAccessible(accessible);
      
      if (!accessible) {
        setError('The puzzles table is not accessible. This could be due to table not existing, RLS policies, or database connection issues.');
      } else {
        console.log('PuzzleTest: Table is accessible, proceeding to fetch puzzles');
      }
    } catch (err) {
      console.error('PuzzleTest: Error during table access check:', err);
      setError(`Table access check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setTableAccessible(false);
    }
  };

  const fetchPuzzles = async () => {
    setLoading(true);
    try {
      if (tableAccessible === false) {
        console.log('PuzzleTest: Skipping fetch because table is not accessible');
        setLoading(false);
        return;
      }
      
      console.log('PuzzleTest: Starting to fetch puzzles, difficulty:', difficulty);
      let fetchedPuzzles: Puzzle[];
      if (difficulty > 0) {
        fetchedPuzzles = await puzzleService.getPuzzlesByDifficulty(difficulty);
      } else {
        fetchedPuzzles = await puzzleService.getPuzzles();
      }
      
      console.log('PuzzleTest: Fetch completed, got puzzles:', fetchedPuzzles.length);
      setPuzzles(fetchedPuzzles);
      
      if (fetchedPuzzles.length === 0) {
        setError(difficulty > 0 
          ? `No puzzles found with difficulty level ${difficulty}. Have you added sample data to your database?` 
          : 'No puzzles found. Have you added sample data to your database?');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('PuzzleTest: Error fetching puzzles:', err);
      setError(`Failed to load puzzles: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setPuzzles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log('PuzzleTest: Initializing...');
      
      // Run the direct API test first
      const directApiSucceeded = await testDirectApiAccess();
      
      // Only proceed with normal flow if direct API failed
      if (!directApiSucceeded) {
        console.log('PuzzleTest: Direct API test failed, falling back to Supabase client');
        if (tableAccessible === null) {
          await checkTableAccess();
        }
        fetchPuzzles();
      }
      
      console.log('PuzzleTest: Initialization complete');
    };
    
    init();
  }, [difficulty, tableAccessible]);

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(parseInt(e.target.value));
  };
  
  const handleRetry = () => {
    setTableAccessible(null);
    setError(null);
    checkTableAccess();
  };

  const renderDebugInfo = () => {
    return (
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
        <ul className="list-disc pl-5">
          <li>Table Access Check: {tableAccessible === null ? 'Checking...' : tableAccessible ? 'Successful' : 'Failed'}</li>
          <li>Current Error: {error || 'None'}</li>
          <li>Puzzles Count: {puzzles.length}</li>
          <li>Current Difficulty Filter: {difficulty === 0 ? 'All' : difficulty}</li>
          <li>Loading State: {loading ? 'Loading' : 'Idle'}</li>
          <li>Supabase URL Set: {Boolean(import.meta.env.VITE_SUPABASE_URL) ? 'Yes' : 'No'}</li>
          <li>Supabase Anon Key Set: {Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) ? 'Yes' : 'No'}</li>
          <li>Direct API Test: {directTestResult || 'Not run yet'}</li>
        </ul>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Troubleshooting Steps:</h4>
          <ol className="list-decimal pl-5">
            <li>Verify the puzzles table was created in Supabase (confirmed)</li>
            <li>Verify sample data was inserted (we confirmed this with 8 rows)</li>
            <li>Check Supabase RLS policies (run the fix_puzzles_permissions.sql script)</li>
            <li>Verify your .env file has the correct Supabase URL and anon key</li>
            <li>Try restarting your frontend development server</li>
            <li>Check browser console for CORS or network errors</li>
          </ol>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold mb-1">Common Errors:</h4>
          <ul className="list-disc pl-5 text-sm">
            <li><strong>RLS policy error:</strong> If you see "new row violates row-level security policy" or similar, run the fix_puzzles_permissions.sql script</li>
            <li><strong>CORS error:</strong> If you see CORS errors, check your Supabase project settings → API → CORS configuration</li>
            <li><strong>Authentication error:</strong> If you see "JWT expired" or similar, try logging in again</li>
          </ul>
        </div>
        
        <div className="mt-4 flex space-x-4">
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Connection
          </button>
          
          <button 
            onClick={() => testDirectApiAccess()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Direct API
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold mb-1">CORS Configuration Check:</h4>
          <p className="text-sm mb-2">
            Make sure your Supabase project has the correct CORS settings:
          </p>
          <ol className="list-decimal pl-5 text-sm">
            <li>Go to your Supabase dashboard → Project Settings → API</li>
            <li>In the CORS section, ensure you have either "*" or your specific domain</li>
            <li>For local development, add "http://localhost:3000" and "http://localhost:5173"</li>
          </ol>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Puzzle Test</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Difficulty:</label>
        <select 
          value={difficulty} 
          onChange={handleDifficultyChange}
          className="border rounded p-2 w-full max-w-xs"
          disabled={loading || tableAccessible === false}
        >
          <option value={0}>All Difficulties</option>
          <option value={1}>1 - Easy</option>
          <option value={2}>2 - Medium</option>
          <option value={3}>3 - Hard</option>
          <option value={4}>4 - Very Hard</option>
          <option value={5}>5 - Expert</option>
        </select>
      </div>

      {loading && <p className="text-gray-600">Loading puzzles...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && puzzles.length === 0 && (
        <p className="text-gray-600">No puzzles found.</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{puzzle.theme}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                Difficulty: {puzzle.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 mb-3">
              {puzzle.description || 'No description available'}
            </p>
            
            <div className="bg-gray-100 p-3 rounded mb-3 font-mono text-sm overflow-x-auto">
              <div><strong>FEN:</strong> {puzzle.fen}</div>
              <div><strong>Solution:</strong> {puzzle.moves}</div>
            </div>
            
            <div className="text-sm text-gray-500 mt-2 flex justify-between">
              <span>Popularity: {puzzle.popularity}</span>
              <span>Success Rate: {puzzle.success_rate}%</span>
            </div>
            
            {puzzle.source && (
              <div className="text-xs text-gray-500 mt-2">
                Source: {puzzle.source}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {renderDebugInfo()}
    </div>
  );
};

export default PuzzleTest; 