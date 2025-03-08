-- Create puzzles table
CREATE TABLE IF NOT EXISTS public.puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fen TEXT NOT NULL,
  moves TEXT NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  theme TEXT NOT NULL,
  description TEXT,
  popularity INTEGER NOT NULL DEFAULT 0,
  success_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on difficulty to optimize search by difficulty level
CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON public.puzzles (difficulty);

-- Create index on theme to optimize search by puzzle theme
CREATE INDEX IF NOT EXISTS idx_puzzles_theme ON public.puzzles (theme);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read puzzles
CREATE POLICY "Allow anonymous read access" 
  ON public.puzzles FOR SELECT 
  USING (true);

-- Only allow admins to insert, update, or delete puzzles
CREATE POLICY "Allow admins to insert puzzles" 
  ON public.puzzles FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE username = 'admin'
  ));

CREATE POLICY "Allow admins to update puzzles" 
  ON public.puzzles FOR UPDATE 
  USING (auth.role() = 'authenticated' AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE username = 'admin'
  ))
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE username = 'admin'
  ));

CREATE POLICY "Allow admins to delete puzzles" 
  ON public.puzzles FOR DELETE 
  USING (auth.role() = 'authenticated' AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE username = 'admin'
  ));

-- Create a function to update the 'updated_at' field
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the 'updated_at' field
CREATE TRIGGER update_puzzles_updated_at
  BEFORE UPDATE ON public.puzzles
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column(); 