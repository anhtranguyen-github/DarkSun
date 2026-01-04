@echo off
setlocal EnableExtensions DisableDelayedExpansion
title BlueMoon - Unified System Launcher v2.1
chcp 65001 >nul 2>&1

set ROOT_DIR=%~dp0
cd /d "%ROOT_DIR%"

echo =============================================================
echo    BLUE MOON - Apartment Management System
echo    Version 2.1 - Business Logic Enhanced
echo =============================================================
echo.

echo [1/5] Analyzing environment for stale processes...
for %%p in (5000 5173) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p ^| findstr LISTENING 2^>nul') do (
        echo    - Cleaning up process on port %%p ^(PID: %%a^)...
        taskkill /F /PID %%a >nul 2>&1
    )
)
echo    - Ports cleared.

echo [2/5] Validating Node.js dependencies...
if not exist "backend\node_modules" (
    echo    - Installing Backend dependencies...
    cd backend && call npm install --silent && cd ..
) else (
    echo    - Backend dependencies OK.
)

if not exist "frontend\node_modules" (
    echo    - Installing Frontend dependencies...
    cd frontend && call npm install --silent && cd ..
) else (
    echo    - Frontend dependencies OK.
)

echo [3/5] Syncing environment variables...
if not exist "backend\.env" (
    echo    - Creating backend .env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo DB_HOST=dingleberries.ddns.net
        echo DB_NAME=bluemoon_db
        echo DB_USER=postgres
        echo DB_PASSWORD=98tV2v_!pT*:nuc^>
        echo DB_PORT=5432
        echo JWT_SECRET=bluemoon_ultra_secure_secret_2024
        echo JWT_EXPIRES_IN=24h
    ) > "backend\.env"
) else (
    echo    - Backend .env already exists.
)

if not exist "frontend\.env" (
    echo    - Creating frontend .env file...
    echo VITE_API_BASE_URL=http://localhost:5000/api > "frontend\.env"
) else (
    echo    - Frontend .env already exists.
)

echo [4/5] Synchronizing database data...
echo    - Seeding RBAC and demo data...
cd backend
if exist "scripts\seed-rbac.js" call node scripts/seed-rbac.js >nul 2>&1
if exist "scripts\create-demo-users.js" call node scripts/create-demo-users.js >nul 2>&1
if exist "scripts\seed-fee-types.js" call node scripts/seed-fee-types.js >nul 2>&1
if exist "scripts\seed-full-data.js" call node scripts/seed-full-data.js >nul 2>&1
cd ..
echo    - Database synced.

echo [5/5] Launching services...
echo    - Starting Backend API...
start "BlueMoon - Backend API" cmd /c "cd backend && echo [BACKEND] Starting on port 5000... && npm run dev"
timeout /t 3 /nobreak > nul

echo    - Starting Frontend UI...
start "BlueMoon - Frontend UI" cmd /c "cd frontend && echo [FRONTEND] Starting on port 5173... && npm run dev"

echo.
echo =============================================================
echo    SYSTEM ONLINE - BLUE MOON IS READY
echo =============================================================
echo    Frontend:   http://localhost:5173
echo    Backend:    http://localhost:5000/api
echo    Health:     http://localhost:5000/health
echo.
echo    Demo Accounts:
echo    - Admin:      demo_admin / password123
echo    - Manager:    demo_manager / password123
echo    - Accountant: demo_accountant / password123
echo =============================================================
echo.
echo [INFO] Launching browser in 5 seconds...
timeout /t 5 /nobreak > nul
start "" "http://localhost:5173"
echo.
echo Press any key to exit the launcher (services will continue running)...
pause > nul
