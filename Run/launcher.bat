@echo off
:: Move to project root
cd /d "%~dp0.."

echo Starting Project Dashboard...
node scripts/launcher.mjs
if %errorlevel% neq 0 (
    echo Error starting launcher. Make sure Node.js is installed.
    pause
)
