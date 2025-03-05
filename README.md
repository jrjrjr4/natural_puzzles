# Chess Puzzle App

A web application for practicing chess puzzles with spaced repetition learning.

## Project Structure

This is a monorepo containing:
- `frontend/`: React application with Tailwind CSS and chess board visualization
- `backend/`: FastAPI server providing puzzle data and user progress tracking

## Quick Start

For the easiest way to start the entire application (both backend and frontend) with a single command, use:

```
chess-app
```

This command starts both servers in separate windows. To set up this command, run:

```
.\setup_commands.ps1
```

Then restart PowerShell or run `. $PROFILE` to load the new command.

## Setup Instructions

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   ```

5. Start the development server:
   ```
   uvicorn main:app --reload
   ```

## Quick Virtual Environment Activation

For convenience, several methods are available to quickly activate the Python virtual environment:

1. **Global PowerShell Command (Fastest Method)**:
   ```
   vpuzzle
   ```
   This command works from anywhere, even outside the project directory.
   
   To set this up:
   - Open your PowerShell profile with: `notepad $PROFILE` (create it if it doesn't exist)
   - Add this line to the profile:
     ```powershell
     function vpuzzle { & "C:\Users\jason\natural_puzzles\backend\venv_312\Scripts\Activate.ps1" }
     ```
   - Save and restart PowerShell
   - Now you can simply type `vpuzzle` from anywhere to activate the environment

2. **Simple PowerShell Command (When in Project Directory)**:
   ```
   .\v.ps1
   ```
   Just run this short command in PowerShell from the project root to activate the environment.

3. **Batch File for Windows**:
   Double-click `activate.bat` in the project root to open a new command prompt with the virtual environment activated.

4. **Custom PowerShell Script**:
   ```
   .\activate_env.ps1
   ```
   A more verbose script that also activates the environment from PowerShell.

To deactivate the virtual environment when you're done, simply type `deactivate`.

## Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Fly.io, Heroku, Render, or Railway

## License
MIT 
