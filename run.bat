@echo off
setlocal
title BlueMoon Unified Launcher

set ROOT_DIR=%~dp0
cd /d "%ROOT_DIR%"

echo =============================================================
echo    🌙  BLUE MOON - UNIFIED SYSTEM LAUNCHER
echo =============================================================
echo.

echo [1/5] Analyzing environment for stale processes...
for %%p in (5000 5173) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p ^| findstr LISTENING') do (
        echo.   - Cleaning up zombie process on port %%p (PID: %%a)...
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo [2/5] Validating Node.js dependencies...
if not exist "backend\node_modules" (
    echo      - Installing Backend dependencies...
    cd backend && call npm install --silent && cd ..
)
if not exist "frontend\node_modules" (
    echo      - Installing Frontend dependencies...
    cd frontend && call npm install --silent && cd ..
)

echo [3/5] Syncing environment variables...
if not exist "backend\.env" (
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo DB_HOST=dingleberries.ddns.net
        echo DB_NAME=bluemoon_db
        echo DB_USER=postgres
        echo DB_PASSWORD=98tV2v_!pT*:nuc^>
        echo DB_PORT=5432
        echo JWT_SECRET=bluemoon_ultra_secure_secret_2024_dark_infinity
        echo JWT_EXPIRES_IN=24h
    ) > "backend\.env"
)
if not exist "frontend\.env" (
    echo VITE_API_BASE_URL=http://localhost:5000/api > "frontend\.env"
)

echo [4/5] Synchronizing database data...
cd backend
call node scripts/seed-rbac.js >nul 2>&1
call node scripts/create-demo-users.js >nul 2>&1
call node scripts/seed-fee-types.js >nul 2>&1
call node scripts/seed-full-data.js >nul 2>&1
cd ..

echo [5/5] Launching services...
start "BlueMoon - Backend API" cmd /c "cd backend && echo [BACKEND] Starting... && npm run dev"
timeout /t 2 /nobreak > nul
start "BlueMoon - Frontend UI" cmd /c "cd frontend && echo [FRONTEND] Starting... && npm run dev"

echo.
echo =============================================================
echo    v SYSTEM ONLINE - BLUE MOON IS READY
echo =============================================================
echo    Frontend:   http://localhost:5173
echo    Backend:    http://localhost:5000/api
echo    Admin:      admin123 / password123
echo =============================================================
echo.
timeout /t 5 /nobreak > nul
start "" "http://localhost:5173"
pause
