@echo off
title BlueMoon Launcher

echo =============================================================
echo    🌙  BLUE MOON - UNIFIED SYSTEM LAUNCHER
echo =============================================================
echo.

echo Choose your deployment mode:
echo   [1] Native (Runs via Node.js locally - Fast ^& Flexible)
echo   [2] Docker (Isolated containers - Clean ^& Consistent)
echo.

set /p mode="Selection [1-2]: "

if "%mode%"=="1" (
    echo.
    echo Launching Native environment...
    call start.bat
) else if "%mode%"=="2" (
    echo.
    echo Launching Docker containers...
    call docker-run.bat
) else (
    echo.
    echo Invalid selection. Exiting.
    pause
)
