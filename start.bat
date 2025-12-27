@echo off
REM ============================================
REM BlueMoon Quick Setup Script for Windows
REM IT4082-BlueMoon-Nhom18
REM ============================================

echo =========================================
echo    BlueMoon Apartment Manager - Setup
echo =========================================
echo.

REM Store current directory
set ROOT_DIR=%~dp0

echo Checking dependencies...
echo.

REM Check and install backend dependencies
if not exist "%ROOT_DIR%backend\node_modules" (
    echo Installing backend dependencies...
    cd /d "%ROOT_DIR%backend"
    call npm install
) else (
    echo Backend dependencies already installed
)

REM Check and install frontend dependencies
if not exist "%ROOT_DIR%frontend\node_modules" (
    echo Installing frontend dependencies...
    cd /d "%ROOT_DIR%frontend"
    call npm install
) else (
    echo Frontend dependencies already installed
)

REM Create backend .env if it doesn't exist
if not exist "%ROOT_DIR%backend\.env" (
    echo Creating backend .env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo DB_HOST=dingleberries.ddns.net
        echo DB_NAME=bluemoon_db
        echo DB_USER=postgres
        echo DB_PASSWORD=98tV2v_!pT*:nuc^>
        echo DB_PORT=5432
        echo JWT_SECRET=a_very_long_and_random_secret_string_for_your_app_12345!@#$%
        echo JWT_EXPIRES_IN=1h
    ) > "%ROOT_DIR%backend\.env"
)

REM Create frontend .env if it doesn't exist
if not exist "%ROOT_DIR%frontend\.env" (
    echo Creating frontend .env file...
    echo VITE_API_BASE_URL=http://localhost:5000/api > "%ROOT_DIR%frontend\.env"
)

echo.
echo Checking/Creating demo accounts...
cd /d "%ROOT_DIR%backend"
call node create-demo-users.js
cd /d "%ROOT_DIR%"

echo.
echo Starting servers...
echo.

REM Start backend in a new window
echo Starting Backend (Express.js)...
start "BlueMoon Backend" cmd /c "cd /d %ROOT_DIR%backend && npm run dev"

REM Wait a bit
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
echo Starting Frontend (Vite + React)...
start "BlueMoon Frontend" cmd /c "cd /d %ROOT_DIR%frontend && npm run dev"

echo.
echo =========================================
echo    BlueMoon is running!
echo =========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000/api
echo.
echo   Login:
echo     Username: admin123
echo     Password: admin123
echo.
echo   Close the terminal windows to stop
echo =========================================
echo.

REM Open browser after a short delay
timeout /t 5 /nobreak > nul
start "" "http://localhost:5173"

pause
