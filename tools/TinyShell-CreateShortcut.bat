@echo off
chcp 65001 >nul
REM TinyShell 🐚 — run this once to add a "TinyShell 🐚" shortcut to your
REM Desktop (shell-emoji icon included), so you don't need to dig into this
REM tools/ folder every time. Safe to run again if you ever move this repo.
set "SCRIPT_DIR=%~dp0"
set "DESKTOP=%USERPROFILE%\Desktop"

powershell -NoProfile -Command ^
  "$s = (New-Object -ComObject WScript.Shell).CreateShortcut('%DESKTOP%\TinyShell.lnk');" ^
  "$s.TargetPath = '%SCRIPT_DIR%TinyShell.bat';" ^
  "$s.IconLocation = '%SCRIPT_DIR%TinyShell.ico';" ^
  "$s.WorkingDirectory = '%SCRIPT_DIR%';" ^
  "$s.Description = 'TinyShell - local server + comment API';" ^
  "$s.Save()"

echo.
echo Desktop shortcut created: %DESKTOP%\TinyShell.lnk
echo Double-click it any time to start TinyShell.
pause
