/**
 * Script to check database connectivity with the puzzles table
 * 
 * Run with: node src/scripts/check-puzzles-db.js
 */

// This script uses JavaScript instead of TypeScript to avoid compilation issues
// Import from built files to ensure compatibility
import('dotenv/config')
  .then(() => {
    console.log('🔍 Starting puzzles database connectivity check...');
    console.log('-----------------------------------------------');
    
    // Check if environment variables are set
    console.log('📋 Checking environment variables:');
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      console.error('❌ ERROR: VITE_SUPABASE_URL is not set in the environment');
      process.exit(1);
    }
    
    if (!supabaseKey) {
      console.error('❌ ERROR: VITE_SUPABASE_ANON_KEY is not set in the environment');
      process.exit(1);
    }
    
    console.log('✅ Environment variables are set correctly');
    console.log(`🔗 Using Supabase URL: ${supabaseUrl}`);
    console.log(`🔑 Anon key is set (length: ${supabaseKey.length})`);
    console.log('-----------------------------------------------');
    
    // Use a direct fetch to check connectivity
    checkDirectApiAccess();
  });

async function checkDirectApiAccess() {
  try {
    console.log('🔍 Testing direct API access...');
    const apiUrl = `${process.env.VITE_SUPABASE_URL}/rest/v1/puzzles?select=*&limit=5`;
    const apiKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    console.log(`🔗 API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`🔍 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ERROR: API error:', errorText);
      process.exit(1);
    }
    
    const data = await response.json();
    console.log(`✅ SUCCESS: Retrieved ${data.length} puzzles`);
    
    if (data.length > 0) {
      console.log('📋 Sample puzzle:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Test filtering by each difficulty level
      await testFilterByDifficulty();
    } else {
      console.warn('⚠️ WARNING: No puzzles found in the database');
    }
    
    console.log('-----------------------------------------------');
    console.log('✅ All tests completed!');
    console.log('🎉 OVERALL RESULT: Database connection successful!');
  } catch (err) {
    console.error('❌ ERROR: Direct API access error:', err);
    process.exit(1);
  }
}

async function testFilterByDifficulty() {
  console.log('-----------------------------------------------');
  console.log('🔍 Testing puzzle filtering by difficulty...');
  
  for (let difficulty = 1; difficulty <= 5; difficulty++) {
    try {
      const apiUrl = `${process.env.VITE_SUPABASE_URL}/rest/v1/puzzles?select=id&difficulty=eq.${difficulty}`;
      const apiKey = process.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`❌ ERROR: Could not test difficulty ${difficulty}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`✅ Difficulty ${difficulty}: Found ${data.length} puzzles`);
    } catch (error) {
      console.error(`❌ ERROR: Exception while fetching puzzles with difficulty ${difficulty}`, error);
    }
  }
} 