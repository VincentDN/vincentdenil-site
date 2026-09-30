@echo off
REM vTinyShell — run this once to add a "vTinyShell" shortcut to your
REM Desktop, so you don't need to dig into this tools/ folder every time.
REM Safe to run again if you ever move this repo.
set "SCRIPT_DIR=%~dp0"
set "DESKTOP=%USERPROFILE%\Desktop"

powershell -NoProfile -Command ^
  "$s = (New-Object -ComObject WScript.Shell).CreateShortcut('%DESKTOP%\vTinyShell.lnk');" ^
  "$s.TargetPath = '%SCRIPT_DIR%vTinyShell.bat';" ^
  "$s.WorkingDirectory = '%SCRIPT_DIR%';" ^
  "$s.Description = 'vTinyShell - local server + comment API';" ^
  "$s.Save()"

echo.
echo Desktop shortcut created: %DESKTOP%\vTinyShell.lnk
echo Double-click it any time to start vTinyShell.
pause
