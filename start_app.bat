@echo off
title Explee AI SDR - Autonomous B2B Outbound Engine
cd /d "%~dp0"
echo ========================================================
echo Starting Explee AI SDR (Full-Stack Engine)...
echo Web UI & API available at: http://localhost:5000
echo ========================================================
start http://localhost:5000
npm run server
pause
