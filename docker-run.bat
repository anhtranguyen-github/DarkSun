@echo off
echo 🚀 Starting BlueMoon in Docker...

:: Try modern 'docker compose' first
docker compose version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using 'docker compose' (V2)...
    docker compose up --build -d
) else (
    echo Using 'docker-compose' (V1)...
    docker-compose up --build -d
)

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Failed to start Docker.
    echo Please ensure Docker Desktop is running!
    pause
    exit /b
)

echo.
echo ✅ Application is running!
echo    👉 Frontend: http://localhost:3000
echo    👉 Backend:  http://localhost:5000
echo.
echo To stop: docker compose down
pause
