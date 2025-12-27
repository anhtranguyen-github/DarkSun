@echo off
echo Starting BlueMoon in Docker...
docker-compose up --build -d
echo.
echo Application is running!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo To stop: docker-compose down
pause
