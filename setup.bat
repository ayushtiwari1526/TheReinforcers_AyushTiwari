@echo off
echo ========================================
echo AI Trading Signal Engine - Setup
echo ========================================
echo.

REM Check Java installation
echo [1/5] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher from: https://adoptium.net/
    pause
    exit /b 1
)
echo Java found!
echo.

REM Check Maven installation
echo [2/5] Checking Maven installation...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo Maven found!
echo.

REM Check Python installation
echo [3/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from: https://www.python.org/
    pause
    exit /b 1
)
echo Python found!
echo.

REM Install Python dependencies
echo [4/5] Installing Python dependencies...
cd ai-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..
echo Python dependencies installed!
echo.

REM Build Spring Boot backend
echo [5/5] Building Spring Boot backend...
cd backend
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Spring Boot application
    pause
    exit /b 1
)
cd ..
echo Spring Boot backend built successfully!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Get API Keys (FREE):
echo    - NewsAPI.org: https://newsapi.org/register
echo    - Finnhub.io: https://finnhub.io/register
echo.
echo 2. Add your API keys to:
echo    backend\src\main\resources\application.properties
echo.
echo 3. Run the application:
echo    start.bat
echo.
pause
