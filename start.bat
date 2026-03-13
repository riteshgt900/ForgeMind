@echo off
title ForgeMind Launcher
echo ===============================
echo   ForgeMind - Starting up...
echo ===============================
echo.

:: Start ngrok tunnel in a new window
echo [1/2] Starting ngrok tunnel...
start "ForgeMind - ngrok tunnel" cmd /k "cd /d %~dp0 && node ngrok-tunnel.js"

:: Wait 4 seconds for ngrok to establish tunnel
timeout /t 4 /nobreak >nul

:: Start ForgeMind server in a new window
echo [2/2] Starting ForgeMind server...
start "ForgeMind - Server (port 3000)" cmd /k "cd /d %~dp0 && node_modules\.bin\ts-node-dev.cmd --respawn --transpile-only --ignore-watch src src/index.ts"

echo.
echo ===============================
echo   Both services are starting!
echo   - ngrok:  see "ForgeMind - ngrok tunnel" window
echo   - Server: see "ForgeMind - Server" window
echo ===============================
echo.
pause
