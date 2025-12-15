@echo off
setlocal

:: Controllo se Python è installato
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python non trovato. Scaricamento e installazione...
    set PYTHON_INSTALLER=%TEMP%\python_installer.exe
    powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.12.2/python-3.12.2-amd64.exe -OutFile '%PYTHON_INSTALLER%'"
    echo Installazione di Python...
    start /wait "" "%PYTHON_INSTALLER%" /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    if %errorlevel% neq 0 (
        echo Errore durante l'installazione di Python.
        pause
        exit /b 1
    )
    del "%PYTHON_INSTALLER%"
    echo Python installato correttamente.
)

:: Aggiorna pip
python -m ensurepip
python -m pip install --upgrade pip

:: Creazione cartella temporanea per download
set DOWNLOAD_DIR=%TEMP%\ss_temp
if not exist "%DOWNLOAD_DIR%" mkdir "%DOWNLOAD_DIR%"

:: Scarico i file da GitHub
set FILE1_URL=https://raw.githubusercontent.com/Leo-Galli/ScreenShareTool/main/ss.py
set FILE2_URL=https://raw.githubusercontent.com/Leo-Galli/ScreenShareTool/main/config.py

powershell -Command "Invoke-WebRequest -Uri '%FILE1_URL%' -OutFile '%DOWNLOAD_DIR%\ss.py'"
powershell -Command "Invoke-WebRequest -Uri '%FILE2_URL%' -OutFile '%DOWNLOAD_DIR%\config.py'"

:: Installazione dipendenze
python -m pip install --upgrade psutil requests

:: Esecuzione del file ss.py
cd /d "%DOWNLOAD_DIR%"
python ss.py

pause
endlocal