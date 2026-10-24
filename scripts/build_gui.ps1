# ScreenShareTool v4.0.0 - PyInstaller GUI Build
# Run from repo root:
#   powershell -ExecutionPolicy Bypass -File scripts\build_gui.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $RepoRoot

Write-Host ""
Write-Host "=== ScreenShareTool - GUI Build ===" -ForegroundColor Cyan
Write-Host ("Repo: " + $RepoRoot)
Write-Host ""

Write-Host "[1/4] Installing build dependencies..." -ForegroundColor Yellow
pip install --quiet --upgrade pyinstaller pywebview customtkinter pillow

Write-Host "[2/4] Running PyInstaller..." -ForegroundColor Yellow

$pyArgs = @(
    "--name", "screensharetool",
    "--onefile",
    "--windowed",
    "--noconfirm",
    "--clean",
    "--add-data", "screenshare_tool;screenshare_tool",
    "--hidden-import", "webview",
    "--hidden-import", "webview.platforms.edgechromium",
    "--hidden-import", "customtkinter",
    "--hidden-import", "PIL",
    "--hidden-import", "PIL._imagingtk",
    "--collect-all", "webview",
    "--collect-all", "customtkinter",
    "screenshare_tool\__main__.py"
)

if (Test-Path "screenshare_tool\icon.ico") {
    $pyArgs = @("--icon=screenshare_tool\icon.ico") + $pyArgs
}

& pyinstaller @pyArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] PyInstaller failed." -ForegroundColor Red
    exit 1
}

$ExePath = "dist\screensharetool.exe"
if (-not (Test-Path $ExePath)) {
    Write-Host "[ERROR] Expected output not found: dist\screensharetool.exe" -ForegroundColor Red
    exit 1
}

$WingetExe = "dist\CharlieRPScreenShareTool.exe"
Copy-Item $ExePath $WingetExe -Force

$SizeMB = [math]::Round((Get-Item $ExePath).Length / 1MB, 1)
Write-Host ("[3/4] Built: dist\screensharetool.exe - " + $SizeMB.ToString() + " MB") -ForegroundColor Green
Write-Host ("      Alias: dist\CharlieRPScreenShareTool.exe") -ForegroundColor Green

Write-Host "[4/4] Creating release ZIP..." -ForegroundColor Yellow

$ZipName = "CharlieRPScreenShareTool-v4.0.0-GUI-x64.zip"
New-Item -ItemType Directory -Force "release" | Out-Null
$ZipPath = Join-Path "release" $ZipName

if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
Compress-Archive -Path $WingetExe -DestinationPath $ZipPath

$ZipSizeMB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 1)
Write-Host ("ZIP: release\" + $ZipName + " - " + $ZipSizeMB.ToString() + " MB") -ForegroundColor Green

$SHA256 = (Get-FileHash $ZipPath -Algorithm SHA256).Hash
Write-Host ""
Write-Host "SHA-256 (for winget installer.yaml):" -ForegroundColor Cyan
Write-Host $SHA256 -ForegroundColor Cyan
Write-Host ""
Write-Host "=== BUILD COMPLETE ===" -ForegroundColor Green
