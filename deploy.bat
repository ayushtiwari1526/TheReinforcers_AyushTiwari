@echo off
echo ============================================================
echo   GROW MY TRADE - DEPLOYMENT SETUP WIZARD
echo ============================================================
echo.

:: Check Java
echo [1/5] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed!
    echo Please download from: https://adoptium.net/
    pause
    exit /b 1
)
echo [OK] Java found!
echo.

:: Check Python
echo [2/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please download from: https://www.python.org/
    pause
    exit /b 1
)
echo [OK] Python found!
echo.

:: Check Maven
echo [3/5] Checking Maven installation...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Maven not found - will use pre-built JAR
    echo If backend doesn't start, install Maven from: https://maven.apache.org/
) else (
    echo [OK] Maven found!
)
echo.

:: Check if JAR exists
echo [4/5] Checking backend JAR...
if not exist "backend\target\trading-signal-engine-1.0.0.jar" (
    echo [INFO] JAR not found - building from source...
    cd backend
    call mvn clean install -DskipTests
    cd ..
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed! Please install Maven and try again.
        pause
        exit /b 1
    )
    echo [OK] Build successful!
) else (
    echo [OK] JAR file found!
)
echo.

:: Install Python dependencies
echo [5/5] Installing Python dependencies...
cd ai-service
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Some dependencies may have failed to install
    echo Please check error messages above
) else (
    echo [OK] Python dependencies installed!
)
cd ..
echo.

echo ============================================================
echo   SETUP COMPLETE!
echo ============================================================
echo.
echo Next steps:
echo 1. Get your API keys (see DEPLOYMENT_GUIDE.md)
echo 2. Configure application.properties
echo 3. Run: start.bat
echo.
echo For detailed deployment instructions, see:
echo - DEPLOYMENT_GUIDE.md
echo - README.md
echo.
pause
