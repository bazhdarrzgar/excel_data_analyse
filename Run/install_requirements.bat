@echo off
title Project Requirements Installer
setlocal enabledelayedexpansion

:: Move to project root
cd /d "%~dp0.."

echo ====================================================
echo    🚀 Project Requirements Installer (Windows)   
echo ====================================================
echo.

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    set NODE_FOUND=1
    for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
) else (
    set NODE_FOUND=0
)

:: Check for npm
where npm >nul 2>&1
if %errorlevel% equ 0 (
    set NPM_FOUND=1
) else (
    set NPM_FOUND=0
)

:: Check for node_modules
if exist node_modules (
    set MODULES_FOUND=1
) else (
    set MODULES_FOUND=0
)

:: If everything is already there
if %NODE_FOUND%==1 if %NPM_FOUND%==1 if %MODULES_FOUND%==1 (
    echo ✨ Requirements is already exist and up to date for running it in windows.
    echo.
    echo You can start the project by double-clicking Run\launcher.bat
    echo.
    pause
    exit /b 0
)

:: Install Node.js if missing
if %NODE_FOUND%==0 (
    echo 📦 Node.js not found. 
    echo Attempting to install Node.js via winget...
    winget install OpenJS.NodeJS.LTS
    if %errorlevel% neq 0 (
        echo ❌ Winget installation failed. 
        echo Please download and install Node.js manually from: https://nodejs.org/
        pause
        exit /b 1
    )
    echo ✅ Node.js installed. Please restart this script.
    pause
    exit /b 0
) else (
    echo ✅ Node.js is already installed: %NODE_VER%
)

:: npm usually comes with Node, but check just in case
if %NPM_FOUND%==0 (
    echo 📦 npm not found. It should have been installed with Node.js.
    echo Please ensure Node.js is correctly installed.
    pause
    exit /b 1
)

:: Install node modules
if %MODULES_FOUND%==0 (
    echo 📦 Installing node modules... This may take a minute.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ npm install failed.
        pause
        exit /b 1
    )
    echo ✅ Node modules installed successfully.
) else (
    echo ✅ Node modules are already present.
)

echo.
echo ✨ Requirements is already exist and up to date for running it in windows.
echo ====================================================
echo 🚀 You're all set! Run Run\launcher.bat to start the app.
echo.
pause
