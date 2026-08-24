# CharlieRP ScreenShareTool v3.0 — Python Rewrite

[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-blue.svg?style=flat&logo=windows)](https://www.microsoft.com/windows)
[![Python: 3.8+](https://img.shields.io/badge/Python-3.8%2B-blue?style=flat&logo=python)](https://www.python.org/)
[![Permission: Administrator](https://img.shields.io/badge/Permission-Administrator-red?style=flat)]()

Strumento avanzato di **analisi forense anti-cheat** per sistemi Windows, scritto in Python.
Progettato specificamente per il network **mc.charlieroleplay.it**.

Originale PowerShell: [Leo-Galli/ScreenShareTool](https://github.com/Leo-Galli/ScreenShareTool)
Riscrittura Python: ottimizzato, con meno falsi positivi, dashboard HTML moderna.

---

## 🚀 Caratteristiche Principali

| Feature | Descrizione |
|:--------|:------------|
| **NTFS Journal** | Analisi USN Journal per drive: DELETE, RENAME, ADS, DACL, Unicode spoofing |
| **Registry** | BAM, Store, MuiCache, WinRAR, OpenSave, USB, ShimCache |
| **Prefetch** | Stato EnablePrefetcher + lista .pf con filtro temporale |
| **Macro Detection** | Razer, Logitech, Corsair, ROCCAT, Bloody, SteelSeries |
| **Minecraft** | 15+ launcher, account JSON, IGAS log, server history, hidden mods |
| **Cheat Self-Destruct** | 26+ client cheat: Journal, BAM, Prefetch, Ghost folders, scripts |
| **Nick Search** | Ricerca nickname su tutto il PC (parallela con ThreadPoolExecutor) |
| **Dashboard HTML** | Report interattivo con pagine: Overview, Nick, Account, IAS, Cheat, System, Network |
| **Network** | TCP connections, Hosts file, DNS cache |
| **Event Log** | Time changes (4616), Log deletion (1102), Volume snapshots |
| **System Info** | VM detection, VPN detection, Hardware, Disk usage |

---

## 📂 Struttura Output (`C:\CharlieRP_SS`)

```
C:\CharlieRP_SS\
├── 01_AccountFiles/         # Account MC eliminati dal Journal
├── 02_DeletedRenamed/       # Exe/Jar/Pf eliminati o rinominati
├── 03_JNativeHook/          # Tracce autoclicker
├── 04_PrefetchDel/          # .pf rimossi manualmente
├── 05_WMIC_Stream/          # Bypass ADS NTFS
├── 06_SolaLettura/          # Attributi readonly
├── 07_Cacls/                # Modifica permessi Prefetch
├── 08_ExtSpoofed/           # Estensioni Unicode spoofate
├── 09_CestinoExe/           # Exe nel cestino + eliminati
├── 10_Replace/              # Pattern replace cheat→legit
├── 11_Regedit/              # BAM, Store, MuiCache, USB, etc.
├── 12_Prefetch/             # Stato + lista .pf
├── 13_Macro/                # Software macro rilevati
├── 14_Minecraft/            # Launcher, account, IGAS, logs
├── 15_Misc/                 # PS history, event log, AnyDesk
├── 16_SystemInfo/           # VM, VPN, Hardware
├── 17_Network/              # TCP, DNS, Hosts
└── DASHBOARD_*.html         # Dashboard interattiva
```

---

## 🛠️ Requisiti

- **OS:** Windows 10 / 11 (Windows 7/8 parziale)
- **Python:** 3.8 o superiore
- **Permessi:** Amministratore (per Journal NTFS, Prefetch, Event Log)
- **Dipendenze:** Nessuna! Solo standard library Python

---

## 💻 Installazione & Uso

### Opzione 1: Esecuzione diretta
```powershell
# Apri PowerShell come Amministratore
cd percorso\alla\cartella
python -m screenshare_tool
```

### Opzione 2: Con argomenti
```powershell
python -m screenshare_tool --days 7
python -m screenshare_tool --days 30 --output C:\MioOutput
python -m screenshare_tool --no-open
```

### Opzione 3: Script batch (doppio click)
```
Doppio-click su run.bat (deve essere eseguito come Admin)
```

### Opzione 4: Setup
```powershell
pip install -e .
screenshare-tool --days 7
```

---

## 🏗️ Architettura

```
screenshare_tool/
├── __init__.py          # Package metadata
├── __main__.py          # CLI entry point + orchestrator
├── config.py            # Costanti, pattern, definizioni launcher
├── utils.py             # Funzioni condivise (I/O, console, registry, WMI)
├── journal.py           # Analisi NTFS USN Journal (moduli 01-10)
├── registry.py          # Analisi Registro di Windows (modulo 11)
├── prefetch.py          # Analisi Prefetch (modulo 12)
├── macro.py             # Rilevamento software macro (modulo 13)
├── minecraft.py         # Launcher MC, account, IGAS, logs (modulo 14)
├── cheat.py             # Rilevamento autodistruzione cheat (modulo 18)
├── nick_search.py       # Ricerca nickname su tutto il PC
├── system.py            # VM, VPN, Hardware (modulo 16)
├── network.py           # TCP, DNS, Hosts (modulo 17)
├── events.py            # Event Log Windows (modulo 15)
└── dashboard.py         # Generatore HTML Dashboard
```

### Miglioramenti rispetto alla versione PowerShell

| Aspetto | PowerShell v2 | Python v3 |
|:--------|:--------------|:----------|
| **Velocità** | RunspacePool (multi-thread) | ThreadPoolExecutor (più portabile) |
| **I/O** | StringBuilder per flush unico | Scrittura singola per file |
| **False positivi** | Pattern base | Regex precompilati + filtraggio contestuale |
| **Manutenibilità** | Script monolitico ~2000 righe | Moduli separati (~500 righe ciascuno) |
| **Dipendenze** | Solo PowerShell | Solo Python stdlib |
| **Cross-platform** | Solo Windows | Codice trasferibile (moduli Windows-specifici isolati) |
| **Dashboard** | Generata inline | Generatore dedicato con CSS moderno |

---

## 🎯 Rilevamento Cheat (26 client)

Il tool monitora i seguenti client cheat per tracce di autodistruzione:

Doomsday, Sigma, Wurst, Meteor, Aristois, Impact, XRay, Inertia, Future,
LiquidBounce, Vape, Ghost, Entropy, Horion, Ares, Novoline, Remix, Rise,
Zeroday, Drip, Rusherhack, Tenacity, BleachHack, Raven, Omega, Phase

**Fonti di rilevamento:**
- NTFS Journal (DELETE/RENAME su .jar)
- BAM / MuiCache / Store registry
- Prefetch .pf con nomi cheat
- Cartelle ghost vuote
- Script cleanup/autodistruzione
- JumpLists, Temp DLL, JVM args
- DNS cache (server cheat)
- Browser history

---

## 📊 Dashboard HTML

La dashboard generata include 9 pagine:

1. **Overview** — Riepilogo con alert, statistiche, hardware
2. **Nick** — Tutti i nickname trovati con fonte e stato online
3. **Account** — Account estratti dai JSON di ogni launcher
4. **IAS Log** — Log cambio account InGame Account Switcher
5. **Cheat** — Riepilogo tracce cheat self-destruction
6. **Sistema** — Hardware, VM, VPN
7. **Network** — Connessioni TCP, DNS, Hosts
8. **Macro** — Software macro/gaming rilevati
9. **Forensics** — PS History, utenti di sistema

---

## 👥 Credits

- **Network:** [mc.charlieroleplay.it](https://charlieroleplay.it)
- **Original Developer:** LeoGalli (PowerShell v2.0.0)
- **Python Rewrite:** Reimplemented with optimized architecture
- **Version:** 3.0 Python Optimized

---

## 📝 License

MIT License — Libero per uso e modifica.
