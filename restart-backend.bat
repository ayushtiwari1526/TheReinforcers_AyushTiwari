@echo off
echo ========================================
echo Restarting Backend with New API Key...
echo ========================================
echo.

REM Kill existing Java process
echo Stopping existing backend...
taskkill /F /FI "WINDOWTITLE eq Backend*" >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start backend
echo Starting Spring Boot Backend on port 8080...
echo.
start "Backend (Spring Boot)" cmd /k "cd backend && mvnw spring-boot:run"

echo.
echo Backend is starting...
echo Wait 15-20 seconds for it to fully start
echo.
echo Then refresh your browser and click "Fetch Live News"
echo.
pause
