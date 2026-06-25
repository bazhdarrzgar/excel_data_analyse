@echo off
:: Move to project root
cd /d "%~dp0.."

:: Find nub or node
set RUN_CMD=
where nub >nul 2>&1
if %errorlevel% equ 0 (
    set RUN_CMD=nub
) else (
    if exist "%USERPROFILE%\.nub\bin\nub.exe" (
        set RUN_CMD="%USERPROFILE%\.nub\bin\nub.exe"
    ) else (
        where node >nul 2>&1
        if %errorlevel% equ 0 (
            set RUN_CMD=node
        )
    )
)

if "%RUN_CMD%"=="" (
    echo Error starting launcher. Make sure Node.js or nub is installed.
    pause
    exit /b 1
)

echo Building the application...
if "%RUN_CMD%"=="node" (
    call npm run build
) else (
    call %RUN_CMD% run build
)

if %errorlevel% neq 0 (
    echo Error building the application.
    pause
    exit /b 1
)

echo Starting Project Dashboard in Build/Production Mode...
%RUN_CMD% scripts/launcher.mjs --prod
if %errorlevel% neq 0 (
    echo Error starting launcher.
    pause
)
