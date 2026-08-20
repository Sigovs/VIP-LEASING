@echo off
REM Double-click me. Starts the dev server and opens the site.
REM Windows twin of preview.command — same job, same port.
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies for the first run...
  call npm install
)

echo Starting the dev server...
start "vip-leasing dev" cmd /c "npm run dev"

echo Waiting for http://localhost:3000 ...
for /l %%i in (1,1,60) do (
  timeout /t 1 /nobreak >nul
  curl -s -o nul --max-time 2 http://localhost:3000 && goto :open
)

:open
start "" http://localhost:3000
