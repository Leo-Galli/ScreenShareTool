# Release GitHub + Winget

## 1. Build GUI

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build_gui.ps1
```

Produces:
- `dist\sstool.exe`
- `release\ScreenShareTool-v4.0.1-GUI-x64.zip`
- SHA-256 printed for `installer.yaml`

## 2. GitHub Release

```powershell
gh release create v4.0.1 `
  release\ScreenShareTool-v4.0.1-GUI-x64.zip `
  --title "v4.0.1 — ScreenShareTool" `
  --notes-file CHANGELOG.md
```

Update `InstallerSha256` in `winget/.../4.0.1/*.installer.yaml` after the zip is built.

## 3. Winget PR (after release is public)

Package id stays `LeoGalli.CharlieRPScreenShareTool` (winget continuity).
Display name: **ScreenShareTool**. Command: **sstool**.

```powershell
wingetcreate update LeoGalli.CharlieRPScreenShareTool `
  --version 4.0.1 `
  --urls "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v4.0.1/ScreenShareTool-v4.0.1-GUI-x64.zip" `
  --submit
```

Or copy local manifests from `winget/LeoGalli.CharlieRPScreenShareTool/4.0.1/` into a winget-pkgs fork.

## Version history

| Version | Notes |
|---------|-------|
| 3.0.0 | Python rewrite |
| 3.1.0 | Dashboard + fixes |
| 4.0.0 | GUI + rename to ScreenShareTool |
| 4.0.1 | Fix packaged import crash; command `sstool` |
