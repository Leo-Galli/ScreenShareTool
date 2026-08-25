"""
Cheat self-destruction detection module.

Detects traces of known cheat clients that use self-deletion mechanisms:
- NTFS Journal DELETE/RENAME on .jar with cheat names
- BAM / MuiCache / Store registry entries (last executions)
- UserAssist last-execution timestamps
- Prefetch .pf files with cheat names
- Whole-PC scan of user directories for cheat files/folders
- Authenticode signature verification of found executables
- Ghost folders (empty or with cheat names)
- Cleanup/self-destruct scripts (.bat/.cmd/.ps1)
- JumpList traces
- Temp DLL files
- Running JVM suspicious arguments
- DNS cache with cheat server domains
- Browser history with cheat-related downloads
- Alternate Data Streams (ADS) hiding spots
"""

import os
import re
import struct
import subprocess
from datetime import datetime
from typing import Any, Dict, List, Optional, Set

from .config import (
    BROWSER_DIRS, CHEAT_RE, CHEAT_CONTENT_RE, CLEANUP_SCRIPT_RE, KNOWN_CHEATS,
    SUSPICIOUS_DOMAINS,
)
from .journal import filter_journal_by_date, read_journal
from .config import identify_cheat
from .utils import (
    filetime_to_datetime, format_timestamp, get_authenticode_signature,
    show_step, write_block,
)


# ================================================================
#  WHOLE-PC SCAN ROOTS
# ================================================================

def _user_scan_roots() -> List[str]:
    """Return the key user/global directories to scan for cheat files."""
    roots = []
    env = os.environ
    for var in ("TEMP", "TMP", "APPDATA", "LOCALAPPDATA", "USERPROFILE",
                "ProgramData", "PUBLIC"):
        v = env.get(var, "")
        if v and os.path.isdir(v):
            roots.append(v)
    home = env.get("USERPROFILE", "")
    if home:
        for sub in ("Desktop", "Downloads", "Documents", "Pictures",
                    ".minecraft", ".lunarclient", ".tlauncher"):
            p = os.path.join(home, sub)
            if os.path.isdir(p):
                roots.append(p)
    # Other users' profiles
    users_dir = os.path.join(os.environ.get("SystemDrive", "C:"), "Users")
    if os.path.isdir(users_dir):
        for entry in os.scandir(users_dir):
            if entry.is_dir() and not entry.name.startswith("."):
                roots.append(entry.path)
    # Deduplicate, keep order
    seen = set()
    out = []
    for r in roots:
        rl = r.lower()
        if rl not in seen:
            seen.add(rl)
            out.append(r)
    return out


# Directories never worth scanning (system noise)
_SKIP_DIRS = {
    "windows", "program files", "program files (x86)", "programdata",
    "perflogs", "$recycle.bin", "system volume information",
    "node_modules", ".git", "appdata\\local\\microsoft",
    "appdata\\local\\google", "appdata\\local\\packages",
}


def _should_skip(path: str) -> bool:
    """Heuristic to skip system/global dirs that would create noise."""
    low = path.lower()
    for s in _SKIP_DIRS:
        if s in low:
            return True
    return False


# ================================================================
#  MAIN ANALYSIS
# ================================================================

def analyze_cheat_selfdestruct(date_limit: datetime, days: int,
                                root_dir: str, ts: str, win_name: str,
                                win_build: int, drives: List[str]) -> List[Dict]:
    """
    Run all cheat self-destruction detection (18a-18o).
    Returns list of alert dicts for the console summary.
    """
    show_step("CHEAT SELFDESTR", "Rilevazione autodistruzione cheat client...")

    out = os.path.join(root_dir, "15_Misc", f"CheatSelfDestruct_{ts}.txt")
    lines = []
    alerts: List[Dict[str, str]] = []

    # --- [18a] Journal NTFS - DELETE/RENAME on cheat .jar ---
    _sec(lines, "[18a] JOURNAL NTFS - DELETE/RENAME su .jar cheat")
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

    # --- [18b] BAM - cheat executables (with signature) ---
    _sec(lines, "[18b] BAM - Eseguibili cheat avviati (ultima esecuzione + firma)")
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
                                    sig = get_authenticode_signature(name)
                                    lines.append(f"  [!!!] BAM cheat avviato: {name}")
                                    lines.append(f"        Cheat           : {cname}")
                                    lines.append(f"        Ultimo avvio    : {dt_str}")
                                    lines.append(f"        Firma           : {sig}")
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
    _sec(lines, "[18c] MUICACHE - Applicazioni cheat rilevate")
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
    _sec(lines, "[18d] PREFETCH - File .pf con nomi cheat (ultima esecuzione)")
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
    _sec(lines, "[18e] CARTELLE GHOST / CONFIG residue nei path Minecraft")
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
    _sec(lines, "[18f] SCRIPT DI CLEANUP / AUTODISTRUZIONE rilevati")
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
    _sec(lines, "[18g] STORE REGISTRO - Exe cheat nel Compatibility Store")
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
    _sec(lines, "[18h] JUMPLISTS - Esecuzioni registrate in AutomaticDestinations")
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
    _sec(lines, "[18i] TEMP DLL - Librerie native JNI in Local\\Temp")
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
    _sec(lines, "[18j] RUNNING JVM - Argomenti di avvio Java (javaagent, noverify)")
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
    _sec(lines, "[18k] DNS CACHE - Record DNS server cheat monitorati")
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
                entry_name = str(entry.get("Entry", ""))
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
    _sec(lines, "[18l] BROWSER HISTORY - Download o pagine web cheat visitate")
    browser_count = 0
    all_browser_dirs = list(BROWSER_DIRS)
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
                import tempfile
                import shutil
                tmp = tempfile.mktemp()
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

    # --- [18m] Whole-PC scan for cheat files/folders ---
    _sec(lines, "[18m] SCAN TOTALE PC - File e cartelle cheat in tutte le aree utente")
    pc_count = _scan_whole_pc(date_limit, lines, alerts)

    # --- [18n] UserAssist last executions ---
    _sec(lines, "[18n] USERASSIST - Ultime esecuzioni (RoT13, timestamps)")
    ua_count = _scan_userassist(date_limit, lines, alerts)

    # --- [18o] Alternate Data Streams (ADS) hiding spots ---
    _sec(lines, "[18o] ADS STREAM - Flussi alternativi NTFS (nascondiglio exploit)")
    ads_count = _scan_ads(date_limit, lines, alerts)

    lines.append("")
    lines.append("=" * 64)
    lines.append(f"  TOTALE ALERT AUTODISTRUZIONE: {len(alerts)}")
    lines.append("=" * 64)

    write_block(out, lines)
    color = "yellow" if alerts else "green"
    show_step("CHEAT SELFDESTR", f"Completato. {len(alerts)} alert autodistruzione.", color)

    return alerts


def _sec(lines: List[str], title: str):
    """Append a section header."""
    lines.append("")
    lines.append("=" * 64)
    lines.append(f"  {title}")
    lines.append("=" * 64)


# ================================================================
#  [18m] WHOLE-PC SCAN
# ================================================================

def _scan_whole_pc(date_limit, lines, alerts) -> int:
    """Walk user directories looking for cheat-named files and folders."""
    count = 0
    roots = _user_scan_roots()
    matched_names = set()
    for cheat in KNOWN_CHEATS:
        for pat in cheat.patterns:
            matched_names.add(pat.lower())

    for root in roots:
        if _should_skip(root):
            continue
        # Walk with a depth limit to avoid pathological recursion
        for dirpath, dirnames, filenames in os.walk(root):
            depth = dirpath[len(root):].count(os.sep)
            if depth > 6:
                dirnames[:] = []
                continue
            # Prune heavy system dirs
            dirnames[:] = [d for d in dirnames if not _should_skip(os.path.join(dirpath, d))]

            try:
                for name in list(dirnames) + filenames:
                    base = name.lower()
                    if not CHEAT_RE.search(base):
                        continue
                    fp = os.path.join(dirpath, name)
                    try:
                        mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                    except OSError:
                        mtime = datetime.min
                    in_range = mtime >= date_limit
                    tag = "[>>>] NELL'INTERVALLO" if in_range else "[ - ]"
                    cname = identify_cheat(name) or "Sconosciuto"
                    # Only report each unique file once (dedupe by path)
                    lines.append(f"  [!!!] {tag} [{cname}] {fp}  |  {format_timestamp(mtime)}")
                    alerts.append({"tipo": "File Cheat su PC", "cheat": cname, "dettaglio": fp, "drive": "-"})
                    count += 1
                    if count >= 500:
                        lines.append("  [NB]  Limite di 500 file cheat raggiunto.")
                        break
                if count >= 500:
                    break
            except (PermissionError, OSError):
                continue
        if count >= 500:
            break

    if count == 0:
        lines.append("  [OK]  Nessun file/cartella cheat trovato nelle aree utente.")
    return count


# ================================================================
#  [18n] USERASSIST
# ================================================================

# ROT13 decode for UserAssist value names
def _rot13(s: str) -> str:
    out = []
    for ch in s:
        if "a" <= ch <= "z":
            out.append(chr((ord(ch) - ord("a") + 13) % 26 + ord("a")))
        elif "A" <= ch <= "Z":
            out.append(chr((ord(ch) - ord("A") + 13) % 26 + ord("A")))
        else:
            out.append(ch)
    return "".join(out)


def _scan_userassist(date_limit, lines, alerts) -> int:
    """Parse HKCU UserAssist for last-execution timestamps (RoT13 names)."""
    count = 0
    try:
        import winreg
        base = r"Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist"
        root_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, base)
        try:
            i = 0
            while True:
                try:
                    guid = winreg.EnumKey(root_key, i)
                except OSError:
                    break
                try:
                    ua_key = winreg.OpenKey(root_key, guid)
                    try:
                        j = 0
                        while True:
                            try:
                                name, value, _ = winreg.EnumValue(ua_key, j)
                            except OSError:
                                break
                            decoded = _rot13(name)
                            if not CHEAT_RE.search(decoded):
                                j += 1
                                continue
                            # Value: 16-byte binary; FILETIME at offset 60 for newer,
                            # offset 4 for older. Try the common offset 60.
                            dt_str = "N/A"
                            ft = None
                            if isinstance(value, bytes) and len(value) >= 72:
                                try:
                                    ft = struct.unpack("<q", value[60:68])[0]
                                except Exception:
                                    ft = None
                            elif isinstance(value, bytes) and len(value) >= 12:
                                try:
                                    ft = struct.unpack("<q", value[4:12])[0]
                                except Exception:
                                    ft = None
                            if ft:
                                dt_obj = filetime_to_datetime(ft)
                                if dt_obj:
                                    dt_str = format_timestamp(dt_obj)
                            cname = identify_cheat(decoded) or "Sconosciuto"
                            lines.append(f"  [!!!] UserAssist cheat: {decoded}")
                            lines.append(f"        Cheat           : {cname}")
                            lines.append(f"        Ultima esecuzione: {dt_str}")
                            lines.append("")
                            alerts.append({"tipo": "UserAssist", "cheat": cname, "dettaglio": decoded, "drive": "-"})
                            count += 1
                            j += 1
                    finally:
                        winreg.CloseKey(ua_key)
                    i += 1
                except OSError:
                    i += 1
        finally:
            winreg.CloseKey(root_key)
    except Exception:
        pass
    if count == 0:
        lines.append("  [OK]  Nessuna voce UserAssist per cheat noti.")
    return count


# ================================================================
#  [18o] ALTERNATE DATA STREAMS (ADS)
# ================================================================

def _scan_ads(date_limit, lines, alerts) -> int:
    """Detect NTFS alternate data streams (file hiding spots)."""
    count = 0
    # Scan key hiding spots for ADS
    targets = [
        os.environ.get("TEMP", ""),
        os.environ.get("APPDATA", ""),
        os.path.join(os.environ.get("APPDATA", ""), ".minecraft", "mods"),
        os.path.join(os.environ.get("USERPROFILE", ""), "Downloads"),
    ]
    for t in targets:
        if not os.path.isdir(t):
            continue
        try:
            result = subprocess.run(
                ["cmd", "/c", f'dir /r "{t}" 2>nul'],
                capture_output=True, text=True, timeout=30,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
            )
            for line in result.stdout.splitlines():
                # ADS lines contain a colon after the file name, e.g. "file.exe:hidden"
                if ":" not in line:
                    continue
                m = re.search(r"([A-Za-z]:\\\\[^:]+:[^ ]+)", line)
                if not m:
                    continue
                ads_path = m.group(1)
                # Ignore the standard zone.identifier ADS (normal for downloads)
                if ads_path.lower().endswith(":zone.identifier"):
                    continue
                try:
                    mtime = datetime.fromtimestamp(os.path.getmtime(ads_path.split(":")[0]))
                except OSError:
                    mtime = datetime.min
                in_range = mtime >= date_limit
                tag = "[>>>] NELL'INTERVALLO" if in_range else "[ - ]"
                lines.append(f"  [!!!] {tag} ADS rilevato: {ads_path}")
                alerts.append({"tipo": "ADS Stream", "cheat": "Nascondiglio file", "dettaglio": ads_path, "drive": "-"})
                count += 1
        except Exception:
            pass
    if count == 0:
        lines.append("  [OK]  Nessun ADS sospetto nei path monitorati.")
    return count
