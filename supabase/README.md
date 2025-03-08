# Supabase Setup Instructions

This directory contains SQL scripts for setting up and managing your Supabase database for the Chess Puzzle app.

## Directory Structure

- `migrations/`: SQL scripts to create or modify database tables
- `seed_data/`: SQL scripts to populate the database with initial data

## How to Apply These Scripts

### Option 1: Using the Supabase Dashboard (Recommended for Development)

1. Log in to the [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to the SQL Editor
4. Copy and paste the contents of the SQL files from the `migrations/` directory
5. Run the scripts in order
6. After running the migration scripts, run the seed data scripts from the `seed_data/` directory

### Option 2: Using the Supabase CLI (Recommended for Production)

1. Install the Supabase CLI if not already installed:
   ```
   npm install -g supabase
   ```

2. Log in to Supabase:
   ```
   supabase login
   ```

3. Link your project:
   ```
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Apply migrations:
   ```
   supabase db push
   ```

## Database Schema

### Profiles Table

Extends the default Supabase auth.users table with additional user information:
- `id`: UUID (matches the auth.users id)
- `username`: Optional username
- `display_name`: Optional display name
- `avatar_url`: Optional URL to user's avatar
- `bio`: Optional user bio
- `rating`: User's puzzle rating
- `puzzles_solved`: Count of puzzles solved by the user
- `puzzles_attempted`: Count of puzzles attempted by the user
- `created_at`: Timestamp of when the profile was created
- `updated_at`: Timestamp of when the profile was last updated

### Puzzles Table

Stores chess puzzles:
- `id`: UUID
- `fen`: FEN notation of the puzzle position
- `moves`: PGN or algebraic notation of the solution moves
- `difficulty`: Difficulty level (1-5)
- `theme`: Puzzle theme (e.g., "mate in 2", "fork", "pin")
- `description`: Optional description or hints
- `popularity`: Number of times the puzzle has been attempted
- `success_rate`: Percentage of successful solutions
- `source`: Optional source of the puzzle
- `created_at`: Timestamp of when the puzzle was created
- `updated_at`: Timestamp of when the puzzle was last updated

## Security and RLS Policies

The scripts include Row Level Security (RLS) policies:

- Puzzles:
  - Anyone can read puzzles
  - Only admins can insert, update, or delete puzzles 