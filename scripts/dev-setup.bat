@echo off
:: ==============================================================================
:: FraudShield AI — Local Environment Setup Script (Windows)
:: ==============================================================================

echo ======================================================
echo Initializing FraudShield AI Workspace Foundation...
echo ======================================================

:: 1. Check prerequisites
echo | set /p ="Checking Node.js... "
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo OK
) else (
    echo FAILED! Node.js is required to build/run the frontend client.
    exit /b 1
)

echo | set /p ="Checking Python... "
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo OK
) else (
    echo FAILED! Python 3.11+ is required for ML and backend services.
    exit /b 1
)

echo | set /p ="Checking Docker... "
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo OK
) else (
    echo Warning: Docker not found. Container execution will be unavailable, but local runs will work.
)

:: 2. Replicate environmental variables
if not exist .env (
    echo Copying .env.example -> .env...
    copy .env.example .env
) else (
    echo .env configuration already exists. Skipping copy.
)

:: 3. Setup Frontend dependencies
echo Installing frontend client dependencies...
cd frontend
call npm install --legacy-peer-deps
cd ..

echo ======================================================
echo Setup Complete! You can run the following commands:
echo   - docker-compose up --build  ^(Starts database, backend, and frontend^)
echo   - npm run dev:frontend       ^(Runs Vite frontend locally^)
echo   - npm run dev:backend        ^(Runs Flask backend locally^)
echo ======================================================
