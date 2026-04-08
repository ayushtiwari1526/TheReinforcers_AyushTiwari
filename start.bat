@echo off
echo ========================================
echo Starting AI Trading Signal Engine...
echo ========================================
echo.

REM Start Flask AI Service
echo [1/2] Starting Python Flask AI Service on port 5000...
echo This may take a moment to load the FinBERT model...
echo.
start "AI Service (Python Flask)" cmd /k "cd ai-service && python app.py"

echo Waiting 10 seconds for AI model to load...
timeout /t 10 /nobreak >nul

echo.
echo [2/2] Starting Spring Boot Backend on port 8080...
echo.
start "Backend (Spring Boot)" cmd /k "cd backend && mvn spring-boot:run"

echo.
echo Waiting 15 seconds for Spring Boot to start...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo Application Started!
echo ========================================
echo.
echo Services Running:
echo   - AI Service (Python Flask): http://localhost:5000
echo   - Backend API (Spring Boot): http://localhost:8080
echo   - Frontend UI: Opening in browser...
echo.
echo API Endpoints:
echo   - POST http://localhost:8080/api/analyze
echo   - GET  http://localhost:8080/api/news/latest
echo   - GET  http://localhost:8080/api/health
echo.
echo Press Ctrl+C in service windows to stop
echo ========================================
echo.

REM Open frontend in default browser
timeout /t 3 /nobreak >nul
start http://localhost:8080
start frontend\index.html

pause
