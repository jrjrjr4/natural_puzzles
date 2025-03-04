@echo off
echo Activating Python virtual environment...
cd %~dp0
start cmd /k "%~dp0backend\venv_312\Scripts\activate.bat && cd %~dp0" 