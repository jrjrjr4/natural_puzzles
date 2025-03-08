/**
 * Script to check database connectivity with the puzzles table
 * 
 * Run with: npx ts-node src/scripts/check-puzzles-db.ts
 * 
 * Note: You may need to install ts-node first:
 * npm install -g ts-node
 */

import { puzzleService } from '../services/puzzleService';
import { config } from 'dotenv';

// Load environment variables
config();

async function checkPuzzlesDatabase() {
  console.log('🔍 Starting puzzles database connectivity check...');
  console.log('-----------------------------------------------');
  
  // Check if environment variables are set
  console.log('📋 Checking environment variables:');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    console.error('❌ ERROR: VITE_SUPABASE_URL is not set in the environment');
    return false;
  }
  
  if (!supabaseKey) {
    console.error('❌ ERROR: VITE_SUPABASE_ANON_KEY is not set in the environment');
    return false;
  }
  
  console.log('✅ Environment variables are set correctly');
  console.log(`🔗 Using Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Anon Key is set (length: ${supabaseKey.length})`);
  console.log('-----------------------------------------------');
  
  // Check table access
  console.log('🔍 Checking access to puzzles table...');
  try {
    const isAccessible = await puzzleService.checkTableAccess();
    
    if (!isAccessible) {
      console.error('❌ ERROR: Could not access the puzzles table');
      return false;
    }
    
    console.log('✅ Successfully connected to puzzles table');
  } catch (error) {
    console.error('❌ ERROR: Exception while checking table access', error);
    return false;
  }
  console.log('-----------------------------------------------');
  
  // Fetch puzzles
  console.log('🔍 Attempting to fetch puzzles...');
  try {
    const puzzles = await puzzleService.getPuzzles(5, 0);
    
    if (!puzzles || puzzles.length === 0) {
      console.warn('⚠️ WARNING: No puzzles found in the database');
    } else {
      console.log(`✅ Successfully fetched ${puzzles.length} puzzles`);
      console.log('📋 Sample puzzle:');
      console.log(JSON.stringify(puzzles[0], null, 2));
    }
  } catch (error) {
    console.error('❌ ERROR: Exception while fetching puzzles', error);
    return false;
  }
  console.log('-----------------------------------------------');
  
  // Test filtering
  console.log('🔍 Testing puzzle filtering by difficulty...');
  for (let difficulty = 1; difficulty <= 5; difficulty++) {
    try {
      const puzzles = await puzzleService.getPuzzlesByDifficulty(difficulty);
      console.log(`✅ Difficulty ${difficulty}: Found ${puzzles.length} puzzles`);
    } catch (error) {
      console.error(`❌ ERROR: Exception while fetching puzzles with difficulty ${difficulty}`, error);
    }
  }
  console.log('-----------------------------------------------');
  
  console.log('✅ All tests completed!');
  return true;
}

// Run the check function
checkPuzzlesDatabase()
  .then(success => {
    if (success) {
      console.log('🎉 OVERALL RESULT: Database connection successful!');
      process.exit(0);
    } else {
      console.error('❌ OVERALL RESULT: Database connection failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ FATAL ERROR:', error);
    process.exit(1);
  }); 