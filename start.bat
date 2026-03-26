@echo off
title Veera's Learning World
echo.
echo  *** Starting Veera's Learning World ***
echo.
echo  Desktop : http://localhost:3000
echo  Mobile  : http://YOUR-PC-IP:3000  (find your IP with: ipconfig)
echo.
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run dev
pause
