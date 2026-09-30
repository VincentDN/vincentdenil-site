@echo off
REM vTinyShell — double-click this to start a local server for this site.
REM The server runs in its own window (title "vTinyShell") so you can
REM close it later, or press Ctrl+C in that window, when you're done.
cd /d "%~dp0"
for %%A in ("%~dp0..") do set "REPO_ROOT=%%~fA"
start "vTinyShell" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0vTinyShell.ps1" -Root "%REPO_ROOT%"
timeout /t 2 /nobreak >nul
start "" http://localhost:8000/projects/
