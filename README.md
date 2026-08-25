<div align="center">

# CharlieRP ScreenShareTool

### Advanced Forensic Anti-Cheat Analysis Tool

[![Version](https://img.shields.io/badge/Version-3.0.0-blue?style=for-the-badge&logo=github)](https://github.com/Leo-Galli/ScreenShareTool/releases)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blueviolet?style=for-the-badge&logo=windows&logoColor=white)]()
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)]()
[![PowerShell](https://img.shields.io/badge/PowerShell-5.1%2B-5391FE?style=for-the-badge&logo=powershell&logoColor=white)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)]()
[![winget](https://img.shields.io/badge/winget-Available-yellow?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/microsoft/winget-pkgs/pull/423780)
[![Website](https://img.shields.io/badge/Website-screenshare-guide.vercel.app-cyan?style=for-the-badge&logo=vercel&logoColor=white)](https://screenshare-guide.vercel.app)

**Network:** mc.charlieroleplay.it | **Developer:** LeoGalli

---

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Guide](https://screenshare-guide.vercel.app/guide) • [Modules](#-modules) • [Cheat Detection](#-cheat-detection) • [Contributing](#-contributing)

---

</div>

## Overview

CharlieRP ScreenShareTool is a comprehensive forensic analysis tool designed for Minecraft server administration. It detects multi-accounting, cheat self-destruction, registry alterations, suspicious deletions, and account switches across multiple Minecraft launchers.

Originally written in PowerShell, v3.0 has been completely rewritten in **Python** (Windows/macOS/Linux) and **Bash** (macOS/Linux/FreeBSD) with optimized performance, reduced false positives, and clean organized text reports.

<div align="center">

| Platform | Method | Command |
|:---------|:-------|:--------|
| **Windows** | `.exe` (standalone) | Double-click `screensharetool.exe` |
| **Windows** | Python | `python -m screenshare_tool --days 7` |
| **macOS/Linux** | Bash | `sudo bash ss_tool_unix.sh` |
| **winget** | Package Manager | `winget install LeoGalli.CharlieRPScreenShareTool` |

</div>

---

## Features

<div align="center">

| Module | Description |
|:-------|:------------|
| **NTFS Journal** | USN Journal analysis: DELETE, RENAME, ADS streams, DACL changes, Unicode spoofing |
| **Registry** | Compatibility Store, MuiCache, WinRAR history, OpenSave MRU, USB devices, ShimCache |
| **BAM (AstroSS-grade)** | Last-execution timestamps + Authenticode signature verification + timezone + user resolution |
| **Prefetch** | EnablePrefetcher status, .pf file listing with date filtering |
| **Macro Detection** | Razer, Logitech, Corsair, ROCCAT, Bloody, SteelSeries, AutoKey, xdotool |
| **Minecraft Forensics** | 15+ launchers, account extraction, IGAS logs, server history, hidden mods |
| **Cheat Self-Destruct** | 48 known cheat clients monitored for traces of self-deletion |
| **Whole-PC Scan** | Finds cheat files/folders across all user areas + last executions |
| **USB Forensics** | USBSTOR history with last-connection timestamps |
| **ADS Detection** | Alternate Data Streams (file hiding spots for exploits) |
| **Nickname Search** | Parallel search across entire filesystem with ThreadPoolExecutor |
| **System Info** | VM detection, VPN/Tunnel detection, hardware profiling |
| **Network** | TCP connections, hosts file, DNS cache analysis |
| **Event Logs** | Security event monitoring (4616, 1102, 3079, Volume Snapshots) |

</div>

---

## Installation

### Option 1: winget (Recommended)

```powershell
winget install LeoGalli.CharlieRPScreenShareTool
```

### Option 2: Download .exe

Download the latest `screensharetool.exe` from [Releases](https://github.com/Leo-Galli/ScreenShareTool/releases) and run it directly. No Python installation required.

### Option 3: Python

```bash
# Clone the repository
git clone https://github.com/Leo-Galli/ScreenShareTool.git
cd ScreenShareTool

# Run directly
python -m screenshare_tool --days 7

# Or install as a package
pip install -e .
screenshare-tool --days 7
```

### Option 4: Bash (macOS/Linux)

```bash
# Download and run
curl -O https://raw.githubusercontent.com/Leo-Galli/ScreenShareTool/main/ss_tool_unix.sh
sudo bash ss_tool_unix.sh
```

---

## Usage

### Windows

```powershell
# Run as Administrator
python -m screenshare_tool

# With parameters
python -m screenshare_tool --days 7
python -m screenshare_tool --days 30 --output C:\MyOutput
python -m screenshare_tool --quick  # Skip slow modules (journal, full nick search)
```

### macOS/Linux

```bash
# Run as root
sudo bash ss_tool_unix.sh

# When prompted, enter the number of days to analyze
# Example: 7 for last week, 30 for last month
```

### Command Line Options

| Option | Description |
|:-------|:------------|
| `--days N` | Analyze last N days (prompts if not specified) |
| `--output PATH` | Custom output directory |
| `--quick` | Skip slow modules (journal, full nick search) |
| `--version` | Show version and exit |

---

## Output Structure

All reports are saved to `C:\CharlieRP_SS\` (Windows) or `/tmp/CharlieRP_SS\` (macOS/Linux):

```
CharlieRP_SS/
├── 01_AccountFiles/         # MC account files found/modified
├── 02_DeletedRenamed/       # Deleted/renamed executables
├── 03_JNativeHook/          # Autoclicker traces
├── 04_PrefetchDel/          # Deleted .pf files
├── 05_WMIC_Stream/          # ADS stream bypass attempts
├── 06_SolaLettura/          # Immutable/read-only files
├── 07_Cacls/                # Permission changes
├── 08_ExtSpoofed/           # Unicode spoofed extensions
├── 09_CestinoExe/           # Executables in trash
├── 10_Replace/              # Cheat-to-legit replacement patterns
├── 11_Regedit/              # Registry analysis (BAM, Store, MuiCache, USB)
├── 12_Prefetch/             # Prefetch status and file list
├── 13_Macro/                # Macro software detection
├── 14_Minecraft/            # Launcher analysis, accounts, logs
├── 15_Misc/                 # Crash dumps, event logs, AnyDesk
├── 16_SystemInfo/           # VM, VPN, hardware info
└── 17_Network/              # TCP connections, DNS, hosts
```

---

## Modules

### NTFS Journal Analysis (01-10)

Reads the USN Journal for each drive and filters by date range to extract:

- **Account Files**: Minecraft account JSON files deleted/modified
- **Deleted/Renamed**: Executables with suspicious delete+rename patterns
- **JNativeHook**: Autoclicker library traces in temp directories
- **Prefetch Deleted**: .pf files manually removed to hide execution
- **ADS Streams**: Alternate Data Stream bypass attempts
- **Read-Only**: Forced immutable attributes on Prefetch
- **Permissions**: DACL changes on Prefetch directory
- **Unicode Spoofing**: Non-ASCII characters in filenames
- **Trash Analysis**: Executables found in recycle bin
- **Replace Patterns**: DELETE+RENAME on same file (cheat→legit swap)

### Registry Analysis (11)

- **Store**: Compatibility Assistant (never-launched executables)
- **MuiCache**: Application name cache
- **WinRAR History**: Recent archive operations
- **OpenSave**: File dialog history
- **FileExts**: Non-standard registered extensions
- **USB Devices + USBSTOR**: Connected peripherals with last-connection timestamps
- **ShimCache**: Application compatibility cache

### BAM / Last Executions (AstroSS-grade)

A dedicated parser (based on [AstroSS](https://github.com/Jammy108/AstroSS/)) extracts every executable's **last run time** from the BAM registry key with:

- **Timezone correction** (ActiveTimeBias / DaylightBias)
- **SID → username** resolution
- **Drive path reconstruction** (`\Device\HarddiskVolumeN` → `C:\`)
- **Authenticode signature verification** of each executable
- Both BAM key variants (`bam\State` and `bam\UserSettings`)

### Minecraft Forensics (14)

Supports **15+ launchers**:

| Launcher | Platform |
|:---------|:---------|
| Mojang Launcher | Windows, macOS, Linux |
| Modrinth | Windows, macOS, Linux |
| Prism Launcher | Windows, macOS, Linux |
| MultiMC | Windows, macOS, Linux |
| Lunar Client | Windows, macOS, Linux |
| CurseForge | Windows |
| ATLauncher | Windows, Linux |
| GDLauncher Carbon | Windows, Linux |
| TLauncher | Windows, macOS, Linux |
| BadLion Client | Windows |
| Feather Client | Windows |
| PvP Lounge | Windows |
| PolyMC | Windows |
| SKLauncher | Windows |
| Minecraft Bedrock | Windows |

Features:
- Account extraction from JSON files
- InGame Account Switcher (IGAS) detection
- Log analysis for account switches
- Server history (servers.dat parsing)
- Hidden mod detection
- Chat keyword scanning

### Cheat Self-Destruct Detection (18)

Monitors **48 known cheat clients** for traces of self-deletion:

<div align="center">

| | | | | |
|:---|:---|:---|:---|:---|
| Doomsday | Sigma | Wurst | Meteor | Aristois |
| Impact | XRay | Inertia | Future | LiquidBounce |
| Vape | Ghost | Entropy | Horion | Ares |
| Novoline | Remix | Rise | Zeroday | Drip |
| Rusherhack | Tenacity | BleachHack | Raven | Omega |
| Phase | Astolfo | Kami | SalHack | Seppuku |
| Phobos | Azura | NightX | Flux | Snow |
| Moon | Skid | Zues | Sensation | Gamesense |
| Oldfag | Abyss | AutoClicker | JNativeHook | Injector |
| KillAura | Reach | Velocity | | |

</div>

Detection sources:
- NTFS Journal (DELETE/RENAME on .jar files)
- BAM / MuiCache / Store registry entries
- UserAssist last-execution timestamps
- Prefetch .pf files with cheat names
- **Whole-PC scan** of all user areas (Desktop, Downloads, AppData, Temp...)
- Ghost folders (empty after self-deletion)
- Cleanup/self-destruct scripts
- JumpList traces
- Temp DLL files
- JVM suspicious arguments
- DNS cache (cheat server domains)
- Browser history (download traces)
- **Alternate Data Streams (ADS)** hiding spots
- **Authenticode signature verification** of found executables

---

## Architecture

```
screenshare_tool/           # Python package (Windows + macOS + Linux)
├── __init__.py             # Package metadata
├── __main__.py             # CLI entry point + orchestrator
├── config.py               # Cross-platform paths, patterns, definitions
├── utils.py                # I/O, console, registry, WMI helpers
├── journal.py              # NTFS USN Journal analysis (Windows)
├── registry.py             # Registry analysis (Windows)
├── bam.py                  # AstroSS-grade BAM last-execution parser
├── prefetch.py             # Prefetch analysis (Windows)
├── macro.py                # Macro software detection (cross-platform)
├── minecraft.py            # Launcher detection + account extraction
├── cheat.py                # Cheat self-destruction detection
├── nick_search.py          # Parallel nickname search
├── system.py               # VM/VPN/hardware detection
├── network.py              # TCP/DNS/hosts analysis
└── events.py               # Windows Event Log analysis

ss_tool_unix.sh             # Bash script (macOS/Linux/FreeBSD)
```

---

## Requirements

<div align="center">

| Platform | Requirements |
|:---------|:-------------|
| **Windows** | Windows 10/11, Python 3.8+ (or .exe), Administrator privileges |
| **macOS** | macOS 10.15+, root access |
| **Linux** | Any modern distribution, root access |
| **Dependencies** | None! Python stdlib only |

</div>

---

## Comparison with v2.0

| Aspect | v2.0 (PowerShell) | v3.0 (Python + Bash) |
|:-------|:-------------------|:----------------------|
| **Platform** | Windows only | Windows, macOS, Linux |
| **Language** | PowerShell | Python 3.8+ / Bash |
| **Architecture** | Monolithic script | 15 modular files |
| **False Positives** | Higher | Reduced with compiled regex + context filtering |
| **Performance** | RunspacePool | ThreadPoolExecutor |
| **Output** | Basic HTML | Clean organized text reports |
| **Dependencies** | PowerShell 5.1+ | None (stdlib only) |
| **Distribution** | .exe only | .exe, .zip, pip, winget |
| **Cheat Database** | ~20 clients | 48 clients |
| **Launcher Support** | ~10 launchers | 15+ launchers |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Credits

<div align="center">

| Role | Name |
|:-----|:-----|
| **Network** | [mc.charlieroleplay.it](https://charlieroleplay.it) |
| **Guide** | [screenshare-guide.vercel.app](https://screenshare-guide.vercel.app) |
| **Original Developer** | LeoGalli (PowerShell v2.0.0) |
| **Python/Bash Rewrite** | Complete cross-platform rewrite |
| **Version** | 3.0.0 |

---

**If this tool helps your server, consider giving it a ⭐**

</div>
