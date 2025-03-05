# Supabase Migrations

This directory contains SQL migrations for the Supabase project.

## Applying Migrations

To apply these migrations to your Supabase project, you have two options:

### Option 1: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of each migration file
4. Paste into the SQL editor and run the queries

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db push
```

## Migration Folders

- `20250304_create_user_profile_table`: Creates the user profiles table that extends the default Supabase auth.users table with chess-specific user data.

## Schema Design

### Profiles Table
Extends the auth.users table with additional user information:
- `id`: UUID (Primary key, references auth.users.id)
- `username`: Text (Unique)
- `display_name`: Text
- `avatar_url`: Text
- `bio`: Text
- `rating`: Integer (Default: 1200)
- `puzzles_solved`: Integer (Default: 0)
- `puzzles_attempted`: Integer (Default: 0)
- `created_at`: Timestamp with timezone
- `updated_at`: Timestamp with timezone

The profile is automatically created when a new user signs up through Supabase Auth.

## Row Level Security (RLS)

The profiles table has RLS enabled with the following policies:
- Anyone can view any profile
- Users can only update their own profiles 