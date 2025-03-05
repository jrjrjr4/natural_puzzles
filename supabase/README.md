# Supabase Integration

This directory contains configuration files and SQL migrations for our Supabase project.

## Structure

- `/migrations`: SQL migration files to set up the database schema
  - See the README in that directory for more details on applying migrations

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project with a name like "chess-puzzles-app"
3. Note down the URL and anon key from the API settings

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Apply Database Migrations

Apply the SQL migrations as described in the migrations directory README.

### 4. Configure Authentication

In the Supabase dashboard:
1. Go to Authentication → Settings
2. Configure Email auth (enabled by default)
3. Optionally configure additional providers (Google, GitHub, etc.)

### 5. Testing the Setup

After completing the above steps, you should be able to:
1. Register and log in using Supabase Auth
2. Have user profiles automatically created
3. Update user profiles with the appropriate permissions

## Important Notes

- Supabase provides built-in Row Level Security (RLS) which is configured in our migrations
- All tables in the `public` schema have RLS enabled by default
- We're using triggers to auto-create user profiles when a user signs up 