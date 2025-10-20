@echo off
setlocal ENABLEDELAYEDEXPANSION

set SCRIPT_DIR=%~dp0
set PS1=%SCRIPT_DIR%Sync-ecvjob.ps1

if not exist "%PS1%" (
  echo Nie znaleziono skryptu PowerShell: %PS1%
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Mirror %*

endlocal
