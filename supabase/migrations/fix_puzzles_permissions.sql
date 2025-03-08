-- Script to reset and fix permissions for the puzzles table

-- First, check if the puzzles table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'puzzles'
  ) THEN
    RAISE EXCEPTION 'The puzzles table does not exist in the public schema';
  ELSE
    RAISE NOTICE 'The puzzles table exists in the public schema';
  END IF;
END
$$;

-- Drop existing RLS policies on puzzles table to start fresh
DO $$
BEGIN
  -- Drop policies if they exist (wrapped in PL/pgSQL to avoid errors if they don't exist)
  BEGIN
    DROP POLICY IF EXISTS "Allow anonymous read access" ON public.puzzles;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Policy "Allow anonymous read access" does not exist or cannot be dropped';
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow admins to insert puzzles" ON public.puzzles;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Policy "Allow admins to insert puzzles" does not exist or cannot be dropped';
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow admins to update puzzles" ON public.puzzles;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Policy "Allow admins to update puzzles" does not exist or cannot be dropped';
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow admins to delete puzzles" ON public.puzzles;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Policy "Allow admins to delete puzzles" does not exist or cannot be dropped';
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to insert puzzles" ON public.puzzles;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Policy "Allow authenticated users to insert puzzles" does not exist or cannot be dropped';
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to update puzzles" ON public.puzzles;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Policy "Allow authenticated users to update puzzles" does not exist or cannot be dropped';
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow authenticated users to delete puzzles" ON public.puzzles;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Policy "Allow authenticated users to delete puzzles" does not exist or cannot be dropped';
  END;
END
$$;

-- Make sure RLS is enabled on the table
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous read access
DO $$
BEGIN
  BEGIN
    CREATE POLICY "Allow anonymous read access" ON public.puzzles
      FOR SELECT USING (true);
    RAISE NOTICE 'Created policy "Allow anonymous read access"';
  EXCEPTION 
    WHEN duplicate_object THEN
      ALTER POLICY "Allow anonymous read access" ON public.puzzles
        USING (true);
      RAISE NOTICE 'Modified existing policy "Allow anonymous read access"';
  END;
END
$$;

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT ON public.puzzles TO anon;
GRANT SELECT ON public.puzzles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.puzzles TO authenticated;

-- Check if we have any puzzle records
DO $$
DECLARE
  puzzle_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO puzzle_count FROM public.puzzles;
  RAISE NOTICE 'Current puzzle count: %', puzzle_count;
  
  IF puzzle_count = 0 THEN
    RAISE NOTICE 'No puzzles found in the database. You should run the sample_puzzles.sql script.';
  END IF;
END
$$; 