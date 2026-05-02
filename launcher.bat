@echo off
echo Starting Project Dashboard...
node scripts/launcher.mjs
if %errorlevel% neq 0 (
    echo Error starting launcher. Make sure Node.js is installed.
    pause
)
