# Changelog

All notable changes to ScreenShareTool are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project follows [Semantic Versioning](https://semver.org/).

Website mirror: https://screenshare-guide.vercel.app/changelog

---

## [4.0.0] — 2026-10-24

### Added
- Modern glass GUI via pywebview (customtkinter fallback)
- Parallel scan engine shared by GUI and CLI
- Quick scan mode for faster shares
- Dedicated website changelog page
- Winget manifests for 4.0.0

### Changed
- Product name: ScreenShareTool (CharlieRP winget package id retained)
- Output directory: `ScreenShareTool_SS`
- HTML dashboard and website restyled to a shared black / white-pill design system

### Website
- Brand-first home, FAQ, richer download page, improved footer and 404

---

## [3.1.0] — 2026-10-14

### Fixed
- BAM parser import crash; doubled-backslash path regexes
- Minecraft log copy and Event Log parsing gaps
- Bash path exclusions, subshell counter loss, IAS switches, DAYS leading zeros, dashboard path
- Console UnicodeEncodeError on restrictive Windows codepages

### Changed
- HTML dashboard rebuilt (KPIs, tables, SVG charts, dark/light, offline)
- Console/report strings rewritten; website copy and nav fixes
- Removed redundant CI string-verify workflows

---

## [3.0.0] — 2026-08-25

### Added
- Complete Python rewrite (Windows / macOS / Linux), stdlib only
- Bash companion for UNIX
- 48 cheat clients tracked; AstroSS-grade BAM; whole-PC / USB / ADS scans
- Standalone `screensharetool.exe` and winget package
- Interactive HTML dashboard

### Fixed (3.0 line)
- Dashboard crash on integer DNS cache Type
- Winget zip installer + x86 installer entry

---

## [2.0.0] — 2026-06-28

### Added
- Portable `screensharetool.exe`
- `screensharetool.sh` shell asset
- Packaging path for winget

---

## [1.0.0] — 2026-06-04

### Added
- First official PowerShell release for CharlieRP staff
- Multi-thread RunspacePool scan; 18 modules; HTML dashboard
- Distributed as `.zip` / `.ps1`

---

[4.0.0]: https://github.com/Leo-Galli/ScreenShareTool/releases
[3.1.0]: https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v3.1.0
[3.0.0]: https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v3.0.0
[2.0.0]: https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v2.0.0
[1.0.0]: https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v1.0.0
