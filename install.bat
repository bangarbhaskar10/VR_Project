@echo off
title Installing Veera App
echo.
echo  *** Installing dependencies (one-time setup) ***
echo.
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" install
echo.
echo  Done! Now double-click start.bat to launch the app.
pause
