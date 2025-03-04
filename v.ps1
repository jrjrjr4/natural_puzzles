# Quick virtual environment activation script
# Usage: Simply run '.\v.ps1' in PowerShell from your project directory
# This will activate the Python virtual environment for this project

Write-Host "Activating Python virtual environment..." -ForegroundColor Green
& "$PSScriptRoot\backend\venv_312\Scripts\Activate.ps1"
Write-Host "Virtual environment activated! You can now run Python commands." -ForegroundColor Green
Write-Host "To deactivate, simply type 'deactivate'" -ForegroundColor Yellow 