# Chess Puzzles Database Connectivity Test

This directory contains tools to verify connectivity with your Supabase database for the chess puzzles app.

## Running the Database Check

The database check script is working successfully! It provides a comprehensive test of your Supabase connectivity.

Run it from the frontend directory with:

```bash
npm run check-db
```

Or run it directly with:

```bash
node src/scripts/check-puzzles-db.js
```

### What the Database Check Does

The script:
- Checks if your environment variables are set correctly
- Tests connection to the puzzles table using direct REST API calls
- Retrieves and displays a sample puzzle
- Checks filtering by difficulty levels 1-5

When everything works correctly, you'll see output like this:

```
🔍 Starting puzzles database connectivity check...
-----------------------------------------------
📋 Checking environment variables:
✅ Environment variables are set correctly
🔗 Using Supabase URL: https://your-project-id.supabase.co
🔑 Anon key is set (length: xxx)
-----------------------------------------------
🔍 Testing direct API access...
🔍 Response status: 200
✅ SUCCESS: Retrieved 5 puzzles
📋 Sample puzzle: {...}
-----------------------------------------------
🔍 Testing puzzle filtering by difficulty...
✅ Difficulty 1: Found 2 puzzles
✅ Difficulty 2: Found 2 puzzles
✅ Difficulty 3: Found 2 puzzles
✅ Difficulty 4: Found 1 puzzles
✅ Difficulty 5: Found 1 puzzles
-----------------------------------------------
✅ All tests completed!
🎉 OVERALL RESULT: Database connection successful!
```

## Troubleshooting

If the database check fails, check the following:

1. **Environment Variables**: Make sure your `.env` file has the correct Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Database Tables**: Verify that the puzzles table exists in your Supabase project.

3. **RLS Policies**: Check that Row Level Security policies allow reading the puzzles table.

4. **CORS Settings**: Ensure CORS is configured correctly in your Supabase project settings.

5. **Network Access**: Make sure your network allows connections to the Supabase API.

## Running Automated Tests (Work in Progress)

The Jest tests are still being fixed to work with the current project setup. For now, use the database check script instead. 