# Setup Script for Chess Puzzle App Commands
# This script adds commands to your PowerShell profile

$profile_path = $PROFILE
$app_path = "$PSScriptRoot\start_app.ps1"

# Create profile if it doesn't exist
if (!(Test-Path $profile_path)) {
    New-Item -Path $profile_path -ItemType File -Force
    Write-Host "Created new PowerShell profile at $profile_path" -ForegroundColor Green
}

# Check if the command already exists
$profile_content = Get-Content $profile_path -Raw
if ($profile_content -and $profile_content.Contains("function chess-app")) {
    Write-Host "The chess-app command is already in your profile." -ForegroundColor Yellow
}
else {
    # Add the command to the profile
    $command = @"

# Chess Puzzle App command
function chess-app { & "$app_path" }
"@
    
    Add-Content -Path $profile_path -Value $command
    Write-Host "Added 'chess-app' command to your PowerShell profile!" -ForegroundColor Green
    Write-Host "You can now start the entire application by typing 'chess-app' from any directory." -ForegroundColor Cyan
    Write-Host "Note: You need to restart PowerShell or run '. `$PROFILE' for the changes to take effect." -ForegroundColor Yellow
}

Write-Host "`nSetup complete!" -ForegroundColor Green 