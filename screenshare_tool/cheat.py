"""
Cheat self-destruction detection module.

Detects traces of known cheat clients that use self-deletion mechanisms:
- NTFS Journal DELETE/RENAME on .jar with cheat names
- BAM / MuiCache / Store registry entries
- Prefetch .pf files with cheat names
- Ghost folders (empty or with cheat names)
- Cleanup/self-destruct scripts (.bat/.cmd/.ps1)
- JumpList traces
- Temp DLL files
- Running JVM suspicious arguments
- DNS cache with cheat server domains
- Browser history with cheat-related downloads
"""

import os
import re
import struct
import subprocess
from datetime import datetime
from typing import Any, Dict, List, Optional, Set

from .config import (
    BROWSER_DIRS, CHEAT_RE, CLEANUP_SCRIPT_RE, KNOWN_CHEATS,
    SUSPICIOUS_DOMAINS,
)
from .journal import filter_journal_by_date, read_journal
from .config import identify_cheat
from .utils import (
    filetime_to_datetime, format_timestamp, show_step,
    write_block,
)


def analyze_cheat_selfdestruct(date_limit: datetime, days: int,
                                root_dir: str, ts: str, win_name: str,
                                win_build: int, drives: List[str]) -> List[Dict]:
    """
    Run all cheat self-destruction detection (18a-18l).
    Returns list of alert dicts for dashboard.
    """
    show_step("CHEAT SELFDESTR", "Rilevazione autodistruzione cheat client...")

    out = os.path.join(root_dir, "15_Misc", f"CheatSelfDestruct_{ts}.txt")
    lines = []
    alerts: List[Dict[str, str]] = []

    # --- [18a] Journal NTFS - DELETE/RENAME on cheat .jar ---
    lines.append("=" * 64)
    lines.append("  [18a] JOURNAL NTFS - DELETE/RENAME su .jar cheat")
    lines.append("=" * 64)
    j_count = 0
    for drive in drives:
        dl = drive.upper().rstrip("\\")[0]
        raw = read_journal(dl)
        if not raw:
            continue
        filtered = filter_journal_by_date(raw, date_limit)
        for line in filtered:
            if ".jar" not in line.lower():
                continue
            if not any(p in line for p in ["0x80000200", "0x00001000", "0x00002000"]):
                continue
            if not CHEAT_RE.search(line):
                continue
            cname = identify_cheat(line) or "Sconosciuto"
            if "0x80000200" in line:
                flag = "DELETE"
            elif "0x00001000" in line:
                flag = "REN<"
            else:
                flag = "REN>"
            lines.append(f"  [!!!] [{flag}] [{cname}] {line}")
            parts = [p.strip().strip('"') for p in line.split(",")]
            detail = parts[2] if len(parts) >= 3 else line
            alerts.append({"tipo": f"Journal {flag}", "cheat": cname, "dettaglio": detail, "drive": dl})
            j_count += 1
    if j_count == 0:
        lines.append("  [OK]  Nessuna traccia Journal per cheat noti.")

    # --- [18b] BAM - cheat executables ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18b] BAM - Eseguibili cheat avviati")
    lines.append("=" * 64)
    bam_count = 0
    try:
        import winreg
        bam_base = r"SYSTEM\CurrentControlSet\Services\bam\State\UserSettings"
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, bam_base)
        try:
            i = 0
            while True:
                try:
                    sid = winreg.EnumKey(key, i)
                    sub_key = winreg.OpenKey(key, sid)
                    try:
                        j = 0
                        while True:
                            try:
                                name, value, _ = winreg.EnumValue(sub_key, j)
                                if name.startswith("PS"):
                                    j += 1
                                    continue
                                if CHEAT_RE.search(name):
                                    dt_str = "N/A"
                                    if isinstance(value, bytes) and len(value) >= 8:
                                        ft = struct.unpack("<q", value[:8])[0]
                                        dt_obj = filetime_to_datetime(ft)
                                        if dt_obj:
                                            dt_str = format_timestamp(dt_obj)
                                    cname = identify_cheat(name) or "Sconosciuto"
                                    lines.append(f"  [!!!] BAM cheat avviato: {name}")
                                    lines.append(f"        Cheat           : {cname}")
                                    lines.append(f"        Ultimo avvio    : {dt_str}")
                                    lines.append("")
                                    alerts.append({"tipo": "BAM Esecuzione", "cheat": cname, "dettaglio": name, "drive": "-"})
                                    bam_count += 1
                                j += 1
                            except OSError:
                                break
                    finally:
                        winreg.CloseKey(sub_key)
                    i += 1
                except OSError:
                    break
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass
    if bam_count == 0:
        lines.append("  [OK]  Nessuna voce BAM per cheat noti.")

    # --- [18c] MuiCache ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18c] MUICACHE - Applicazioni cheat rilevate")
    lines.append("=" * 64)
    mui_count = 0
    try:
        import winreg
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache"
        )
        try:
            i = 0
            while True:
                try:
                    name, value, _ = winreg.EnumValue(key, i)
                    if not name.startswith("PS") and CHEAT_RE.search(name):
                        cname = identify_cheat(name) or "Sconosciuto"
                        lines.append(f"  [!!!] MuiCache: {name} (Nome UI: {value})")
                        alerts.append({"tipo": "MuiCache", "cheat": cname, "dettaglio": name, "drive": "-"})
                        mui_count += 1
                    i += 1
                except OSError:
                    break
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass
    if mui_count == 0:
        lines.append("  [OK]  Nessun cheat in MuiCache.")

    # --- [18d] Prefetch cheat .pf ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18d] PREFETCH - File .pf con nomi cheat")
    lines.append("=" * 64)
    pf_count = 0
    pf_dir = r"C:\Windows\Prefetch"
    if os.path.isdir(pf_dir):
        for fn in os.listdir(pf_dir):
            if not fn.lower().endswith(".pf"):
                continue
            if not CHEAT_RE.search(fn):
                continue
            fp = os.path.join(pf_dir, fn)
            try:
                mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                in_range = mtime >= date_limit
                tag = "[>>>] NELL'INTERVALLO" if in_range else "[ - ] fuori intervallo"
                cname = identify_cheat(fn) or "Sconosciuto"
                lines.append(f"  [!!!] {tag} {fn}  |  {mtime.strftime('%d/%m/%Y %H:%M:%S')}")
                alerts.append({"tipo": "Prefetch .pf", "cheat": cname, "dettaglio": mtime.strftime('%d/%m/%Y %H:%M:%S'), "drive": "C"})
                pf_count += 1
            except OSError:
                pass
    if pf_count == 0:
        lines.append("  [OK]  Nessun .pf cheat trovato.")

    # --- [18e] Ghost folders / cheat configs ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18e] CARTELLE GHOST / CONFIG residue nei path Minecraft")
    lines.append("=" * 64)
    ghost_count = 0
    mc_paths = [
        os.path.join(os.environ.get("APPDATA", ""), ".minecraft", "mods"),
        os.path.join(os.environ.get("APPDATA", ""), ".minecraft", "config"),
        os.path.join(os.environ.get("APPDATA", ""), ".minecraft"),
        os.environ.get("LOCALAPPDATA", ""),
        os.environ.get("APPDATA", ""),
        os.environ.get("TEMP", ""),
    ]
    for mp in mc_paths:
        if not os.path.isdir(mp):
            continue
        try:
            for entry in os.scandir(mp):
                if not CHEAT_RE.search(entry.name):
                    continue
                cname = identify_cheat(entry.name) or "Sconosciuto"
                try:
                    is_dir = entry.is_dir()
                    if is_dir:
                        sub_count = sum(1 for _ in os.scandir(entry.path))
                        is_empty = sub_count == 0
                        empty_tag = " [VUOTA - autodistruzione probabile]" if is_empty else ""
                    else:
                        is_empty = False
                        empty_tag = ""
                    mtime = datetime.fromtimestamp(entry.stat().st_mtime)
                    lines.append(f"  [!!!] [{cname}] {entry.path}  |  Mod: {mtime.strftime('%d/%m/%Y %H:%M:%S')}{empty_tag}")
                    tipo = "Cartella Ghost" if is_empty and is_dir else "Cartella/File Cheat"
                    alerts.append({"tipo": tipo, "cheat": cname, "dettaglio": entry.path, "drive": "-"})
                    ghost_count += 1
                except OSError:
                    pass
        except PermissionError:
            pass
    if ghost_count == 0:
        lines.append("  [OK]  Nessuna cartella/file ghost trovata.")

    # --- [18f] Cleanup scripts ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18f] SCRIPT DI CLEANUP / AUTODISTRUZIONE rilevati")
    lines.append("=" * 64)
    script_count = 0
    script_search = [
        os.environ.get("TEMP", ""),
        os.environ.get("APPDATA", ""),
        os.environ.get("LOCALAPPDATA", ""),
        os.path.join(os.environ.get("USERPROFILE", ""), "Desktop"),
        os.path.join(os.environ.get("USERPROFILE", ""), "Downloads"),
    ]
    for sp in script_search:
        if not os.path.isdir(sp):
            continue
        try:
            for entry in os.scandir(sp):
                if not entry.is_file():
                    continue
                ext = os.path.splitext(entry.name)[1].lower()
                if ext not in (".bat", ".cmd", ".ps1", ".vbs"):
                    continue
                try:
                    mtime = datetime.fromtimestamp(entry.stat().st_mtime)
                    if mtime < date_limit:
                        continue
                except OSError:
                    continue
                try:
                    with open(entry.path, "r", encoding="utf-8", errors="replace") as f:
                        content = f.read()
                    has_cheat = bool(CHEAT_RE.search(content) or CHEAT_RE.search(entry.name))
                    has_cleanup = bool(CLEANUP_SCRIPT_RE.search(content))
                    if has_cheat or has_cleanup:
                        cname = identify_cheat(f"{entry.name} {content}") if has_cheat else "Script Cleanup"
                        lines.append(f"  [!!!] Script sospetto [{cname}]: {entry.path}  |  {mtime.strftime('%d/%m/%Y %H:%M:%S')}")
                        alerts.append({"tipo": "Script Cleanup", "cheat": cname, "dettaglio": entry.path, "drive": "-"})
                        script_count += 1
                except Exception:
                    pass
        except PermissionError:
            pass
    if script_count == 0:
        lines.append("  [OK]  Nessuno script di cleanup/autodistruzione trovato.")

    # --- [18g] Store registro cheat ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18g] STORE REGISTRO - Exe cheat nel Compatibility Store")
    lines.append("=" * 64)
    store_count = 0
    try:
        import winreg
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Store"
        )
        try:
            i = 0
            while True:
                try:
                    name, _, _ = winreg.EnumValue(key, i)
                    if not name.startswith("PS") and CHEAT_RE.search(name):
                        cname = identify_cheat(name) or "Sconosciuto"
                        lines.append(f"  [!!!] Store registro cheat: {name}  |  Cheat: {cname}")
                        alerts.append({"tipo": "Store Registro", "cheat": cname, "dettaglio": name, "drive": "-"})
                        store_count += 1
                    i += 1
                except OSError:
                    break
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass
    if store_count == 0:
        lines.append("  [OK]  Nessun cheat nello Store registro.")

    # --- [18h] JumpLists ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18h] JUMPLISTS - Esecuzioni registrate in AutomaticDestinations")
    lines.append("=" * 64)
    jl_count = 0
    jl_path = os.path.join(os.environ.get("APPDATA", ""), "Microsoft", "Windows", "Recent", "AutomaticDestinations")
    if os.path.isdir(jl_path):
        for fn in os.listdir(jl_path):
            fp = os.path.join(jl_path, fn)
            try:
                with open(fp, "rb") as f:
                    data = f.read()
                text = data.decode("utf-16-le", errors="replace")
                if CHEAT_RE.search(text):
                    cname = identify_cheat(text) or "Sconosciuto"
                    lines.append(f"  [!!!] Traccia in JumpList: {fn}  |  Cheat: {cname}")
                    alerts.append({"tipo": "JumpList Traccia", "cheat": cname, "dettaglio": fn, "drive": "-"})
                    jl_count += 1
            except Exception:
                pass
    if jl_count == 0:
        lines.append("  [OK]  Nessun cheat nelle JumpLists.")

    # --- [18i] Temp DLL ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18i] TEMP DLL - Librerie native JNI in Local\\Temp")
    lines.append("=" * 64)
    temp_dll = 0
    temp_dir = os.environ.get("TEMP", "")
    if os.path.isdir(temp_dir):
        for fn in os.listdir(temp_dir):
            if not fn.lower().endswith(".dll"):
                continue
            fp = os.path.join(temp_dir, fn)
            try:
                mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                if mtime >= date_limit:
                    lines.append(f"  [!!!] DLL recente in Temp: {fp}  |  Modificato: {mtime.strftime('%d/%m/%Y %H:%M:%S')}")
                    alerts.append({"tipo": "Temp DLL Recente", "cheat": "Possibile Injector / Native JNI", "dettaglio": fp, "drive": "-"})
                    temp_dll += 1
            except OSError:
                pass
    if temp_dll == 0:
        lines.append("  [OK]  Nessuna DLL sospetta in Temp.")

    # --- [18j] Running JVM args ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18j] RUNNING JVM - Argomenti di avvio Java (javaagent, noverify)")
    lines.append("=" * 64)
    jvm_count = 0
    try:
        result = subprocess.run(
            ["powershell", "-NoProfile", "-Command",
             'Get-CimInstance Win32_Process -Filter "Name LIKE \'java%\'" | Select-Object CommandLine | ConvertTo-Json -Compress'],
            capture_output=True, text=True, timeout=15,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        if result.returncode == 0 and result.stdout.strip():
            import json
            procs = json.loads(result.stdout.strip())
            if isinstance(procs, dict):
                procs = [procs]
            for p in procs:
                cmd = p.get("CommandLine", "")
                if re.search(r'-javaagent|-noverify|-XX:-UseSplitVerifier|-Xbootclasspath|org\.lwjgl\.librarypath', cmd, re.IGNORECASE):
                    lines.append(f"  [!!!] JVM Args Sospetti: {cmd}")
                    alerts.append({"tipo": "JVM Args Sospetti", "cheat": "Sconosciuto", "dettaglio": cmd, "drive": "-"})
                    jvm_count += 1
    except Exception:
        pass
    if jvm_count == 0:
        lines.append("  [OK]  Nessun parametro JVM sospetto rilevato.")

    # --- [18k] DNS Cache ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18k] DNS CACHE - Record DNS server cheat monitorati")
    lines.append("=" * 64)
    dns_count = 0
    try:
        result = subprocess.run(
            ["powershell", "-NoProfile", "-Command",
             "Get-DnsClientCache | ConvertTo-Json -Compress"],
            capture_output=True, text=True, timeout=15,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        if result.returncode == 0 and result.stdout.strip():
            import json
            cache = json.loads(result.stdout.strip())
            if isinstance(cache, dict):
                cache = [cache]
            for entry in cache:
                entry_name = entry.get("Entry", "")
                for domain in SUSPICIOUS_DOMAINS:
                    if domain.lower() in entry_name.lower():
                        cname = identify_cheat(entry_name) or "Sconosciuto"
                        lines.append(f"  [!!!] Traccia DNS Cache: {entry_name}  ->  {entry.get('Data', '?')}")
                        alerts.append({"tipo": "DNS Cache Cheat", "cheat": cname, "dettaglio": entry_name, "drive": "-"})
                        dns_count += 1
                        break
    except Exception:
        pass
    if dns_count == 0:
        lines.append("  [OK]  Nessun record DNS di cheat monitorato.")

    # --- [18l] Browser History ---
    lines.append("")
    lines.append("=" * 64)
    lines.append("  [18l] BROWSER HISTORY - Download o pagine web cheat visitate")
    lines.append("=" * 64)
    browser_count = 0
    all_browser_dirs = list(BROWSER_DIRS)
    # Add Firefox profiles
    ff_dir = os.path.join(os.environ.get("APPDATA", ""), "Mozilla", "Firefox", "Profiles")
    if os.path.isdir(ff_dir):
        for entry in os.scandir(ff_dir):
            if entry.is_dir():
                all_browser_dirs.append(entry.path)

    for bd in all_browser_dirs:
        hist_files = [os.path.join(bd, "History"), os.path.join(bd, "places.sqlite")]
        for hf in hist_files:
            if not os.path.exists(hf):
                continue
            try:
                # Copy to temp to avoid lock issues
                import tempfile
                tmp = tempfile.mktemp()
                import shutil
                shutil.copy2(hf, tmp)
                with open(tmp, "rb") as f:
                    data = f.read()
                text = data.decode("utf-8", errors="replace")
                if CHEAT_RE.search(text):
                    cname = identify_cheat(text) or "Sconosciuto"
                    lines.append(f"  [!!!] Traccia Browser History ({cname}): {hf}")
                    alerts.append({"tipo": "Browser History", "cheat": cname, "dettaglio": hf, "drive": "-"})
                    browser_count += 1
                os.unlink(tmp)
            except Exception:
                pass
    if browser_count == 0:
        lines.append("  [OK]  Nessuna traccia cheat nelle cronologie browser.")

    lines.append("")
    lines.append("=" * 64)
    lines.append(f"  TOTALE ALERT AUTODISTRUZIONE: {len(alerts)}")
    lines.append("=" * 64)

    write_block(out, lines)
    color = "yellow" if alerts else "green"
    show_step("CHEAT SELFDESTR", f"Completato. {len(alerts)} alert autodistruzione.", color)

    return alerts
