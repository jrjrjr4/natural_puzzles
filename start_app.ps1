# Chess Puzzle App Starter Script
# This script starts both the backend and frontend servers

Write-Host "Starting Chess Puzzle App..." -ForegroundColor Green

# Activate virtual environment first
& "C:\Users\jason\natural_puzzles\backend\venv_312\Scripts\Activate.ps1"

# Start the backend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn main:app --reload"

# Start the frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Servers started!" -ForegroundColor Green
Write-Host "Backend server: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend server: http://localhost:3000" -ForegroundColor Cyan
Write-Host "To stop the servers, close the opened PowerShell windows" -ForegroundColor Yellow 