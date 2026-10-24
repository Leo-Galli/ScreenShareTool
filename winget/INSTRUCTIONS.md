# Release GitHub + Winget

## 1. Build GUI

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build_gui.ps1
```

Produces:
- `dist\screensharetool.exe`
- `dist\CharlieRPScreenShareTool.exe` (winget nested name)
- `release\CharlieRPScreenShareTool-v4.0.0-GUI-x64.zip`
- SHA-256 printed for `installer.yaml`

## 2. GitHub Release

```powershell
gh release create v4.0.0 `
  release\CharlieRPScreenShareTool-v4.0.0-GUI-x64.zip `
  --title "v4.0.0 — ScreenShareTool GUI" `
  --notes-file CHANGELOG.md
```

Update `InstallerSha256` in `winget/.../4.0.0/*.installer.yaml` if the zip changed.

## 3. Winget PR (after release is public)

Package id stays `LeoGalli.CharlieRPScreenShareTool` (winget continuity).
Display name is **ScreenShareTool**.

```powershell
wingetcreate update LeoGalli.CharlieRPScreenShareTool `
  --version 4.0.0 `
  --urls "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v4.0.0/CharlieRPScreenShareTool-v4.0.0-GUI-x64.zip" `
  --submit
```

Or copy local manifests from `winget/LeoGalli.CharlieRPScreenShareTool/4.0.0/` into a winget-pkgs fork.

## Version history

| Version | Notes |
|---------|-------|
| 3.0.0 | Python rewrite |
| 3.1.0 | Dashboard + fixes |
| 4.0.0 | GUI + rename to ScreenShareTool |
