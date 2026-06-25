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

:: Check for nub
where nub >nul 2>&1
if %errorlevel% equ 0 (
    set NUB_FOUND=1
    set NUB_CMD=nub
) else (
    if exist "%USERPROFILE%\.nub\bin\nub.exe" (
        set NUB_FOUND=1
        set NUB_CMD="%USERPROFILE%\.nub\bin\nub.exe"
    ) else (
        set NUB_FOUND=0
        set NUB_CMD=
    )
)

:: Check for node_modules
if exist node_modules (
    set MODULES_FOUND=1
) else (
    set MODULES_FOUND=0
)

:: If everything is already there
if %NODE_FOUND%==1 if %NUB_FOUND%==1 if %MODULES_FOUND%==1 (
    echo ✨ Requirements already exist and are up to date for running in Windows.
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

:: Install nub if missing
if %NUB_FOUND%==0 (
    echo 📦 nub not found. 
    echo Attempting to install nub via PowerShell...
    powershell -Command "irm https://nubjs.com/install.ps1 | iex"
    if exist "%USERPROFILE%\.nub\bin\nub.exe" (
        set NUB_FOUND=1
        set NUB_CMD="%USERPROFILE%\.nub\bin\nub.exe"
    ) else (
        where npm >nul 2>&1
        if !errorlevel! equ 0 (
            echo Attempting to install nub via npm...
            call npm install -g --ignore-scripts=false @nubjs/nub
            where nub >nul 2>&1
            if !errorlevel! equ 0 (
                set NUB_FOUND=1
                set NUB_CMD=nub
            )
        )
    )
    if !NUB_FOUND!==0 (
        echo ❌ nub installation failed.
        echo Please install nub manually from: https://nubjs.com/
        pause
        exit /b 1
    )
    echo ✅ nub installed successfully.
) else (
    echo ✅ nub is already installed.
)

:: Install node modules
if %MODULES_FOUND%==0 (
    echo 📦 Installing node modules... This may take a minute.
    call !NUB_CMD! install
    if !errorlevel! neq 0 (
        echo ❌ nub install failed.
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
