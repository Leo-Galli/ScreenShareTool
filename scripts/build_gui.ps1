# ScreenShareTool - PyInstaller GUI Build
# Run from repo root:
#   powershell -ExecutionPolicy Bypass -File scripts\build_gui.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $RepoRoot

$Version = "4.0.1"

Write-Host ""
Write-Host "=== ScreenShareTool - GUI Build ===" -ForegroundColor Cyan
Write-Host ("Repo: " + $RepoRoot)
Write-Host ("Version: " + $Version)
Write-Host ""

Write-Host "[1/4] Installing build dependencies..." -ForegroundColor Yellow
pip install --quiet --upgrade pyinstaller pywebview customtkinter pillow

Write-Host "[2/4] Running PyInstaller..." -ForegroundColor Yellow

$pyArgs = @(
    "--name", "sstool",
    "--onefile",
    "--windowed",
    "--noconfirm",
    "--clean",
    "--paths", ".",
    "--hidden-import", "screenshare_tool",
    "--hidden-import", "screenshare_tool.__main__",
    "--hidden-import", "screenshare_tool.gui",
    "--hidden-import", "screenshare_tool.engine",
    "--hidden-import", "screenshare_tool.utils",
    "--hidden-import", "screenshare_tool.config",
    "--hidden-import", "webview",
    "--hidden-import", "webview.platforms.edgechromium",
    "--hidden-import", "customtkinter",
    "--hidden-import", "PIL",
    "--hidden-import", "PIL._imagingtk",
    "--collect-submodules", "screenshare_tool",
    "--collect-all", "webview",
    "--collect-all", "customtkinter",
    "sstool_entry.py"
)

if (Test-Path "screenshare_tool\icon.ico") {
    $pyArgs = @("--icon=screenshare_tool\icon.ico") + $pyArgs
}

& pyinstaller @pyArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] PyInstaller failed." -ForegroundColor Red
    exit 1
}

$ExePath = "dist\sstool.exe"
if (-not (Test-Path $ExePath)) {
    Write-Host "[ERROR] Expected output not found: dist\sstool.exe" -ForegroundColor Red
    exit 1
}

$SizeMB = [math]::Round((Get-Item $ExePath).Length / 1MB, 1)
Write-Host ("[3/4] Built: dist\sstool.exe - " + $SizeMB.ToString() + " MB") -ForegroundColor Green

Write-Host "[4/4] Creating release ZIP..." -ForegroundColor Yellow

$ZipName = "ScreenShareTool-v$Version-GUI-x64.zip"
New-Item -ItemType Directory -Force "release" | Out-Null
$ZipPath = Join-Path "release" $ZipName

if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
Compress-Archive -Path $ExePath -DestinationPath $ZipPath

$ZipSizeMB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 1)
Write-Host ("ZIP: release\" + $ZipName + " - " + $ZipSizeMB.ToString() + " MB") -ForegroundColor Green

$SHA256 = (Get-FileHash $ZipPath -Algorithm SHA256).Hash
Write-Host ""
Write-Host "SHA-256 (for winget installer.yaml):" -ForegroundColor Cyan
Write-Host $SHA256 -ForegroundColor Cyan
Write-Host ""
Write-Host "=== BUILD COMPLETE ===" -ForegroundColor Green
