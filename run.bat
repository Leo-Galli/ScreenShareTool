@echo off
:: CharlieRP ScreenShareTool v3.0 — Launcher
:: Auto-elevates to Administrator if needed

title CharlieRP ScreenShareTool v3.0

:: Check if already admin
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :run
) else (
    goto :elevate
)

:elevate
echo [INFO] Richiedi privilegi Amministratore...
powershell -Command "Start-Process '%~f0' -Verb RunAs"
exit /b

:run
echo.
echo ================================================================
echo   CharlieRP ScreenShareTool v3.0 — Python
echo   mc.charlieroleplay.it
echo ================================================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Python trovato.
    echo.
    cd /d "%~dp0"
    python -m screenshare_tool %*
    goto :end
)

python3 --version >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Python3 trovato.
    echo.
    cd /d "%~dp0"
    python3 -m screenshare_tool %*
    goto :end
)

echo [ERRORE] Python non trovato!
echo.
echo Installa Python da: https://www.python.org/downloads/
echo Assicurati che sia aggiunto al PATH di sistema.
echo.
pause
exit /b 1

:end
echo.
pause
