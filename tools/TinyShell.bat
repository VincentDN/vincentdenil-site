@echo off
chcp 65001 >nul
REM TinyShell 🐚 — double-click this to start a local server for this site.
REM The server runs in its own window (title "TinyShell 🐚") so you can
REM close it later, or press Ctrl+C in that window, when you're done.
cd /d "%~dp0"
start "TinyShell 🐚" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0TinyShell.ps1"
timeout /t 2 /nobreak >nul
start "" http://localhost:8000/projects/
