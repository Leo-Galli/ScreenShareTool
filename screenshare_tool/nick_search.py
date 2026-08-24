"""
Nickname search module.

Searches for Minecraft usernames across the entire system:
- Account JSON files (already collected)
- IAS log entries (reused from module 14d)
- Usercache.json
- Prefetch files (.pf)
- MuiCache / BAM registry
- server.properties
- Desktop/Documents/Downloads/AppData files (parallelized with ThreadPoolExecutor)
"""

import os
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from typing import Dict, List, Set, Tuple

from .config import NICK_IN_FILE_RE, NICK_VALID_RE, PF_STRIP_RE
from .utils import show_step


class NickSearch:
    """Collects and deduplicates Minecraft nicknames found across the system."""

    def __init__(self):
        self.nicks: List[Dict[str, str]] = []
        self._seen: Set[str] = set()

    def add(self, nick: str, source: str, path: str = "",
            date: str = "", note: str = ""):
        """Add a nick if valid and not already seen (per source)."""
        if not nick or not nick.strip():
            return
        nick = nick.strip()
        if not NICK_VALID_RE.match(nick):
            return
        key = f"{nick.lower()}|{source}"
        if key in self._seen:
            return
        self._seen.add(key)
        self.nicks.append({
            "nick": nick,
            "source": source,
            "path": path,
            "date": date,
            "note": note,
        })

    @property
    def count(self):
        return len(self.nicks)

    def unique_names(self) -> List[str]:
        """Return sorted unique nick names."""
        return sorted({n["nick"] for n in self.nicks})


def search_nicks(all_accounts: List[Dict],
                 ias_log_entries: List[Dict],
                 found_launchers: List[Dict],
                 date_limit: datetime) -> List[Dict]:
    """
    Run the full nickname search across the system.
    Returns the list of nick dicts found.
    """
    show_step("NICK SEARCH", "Ricerca nick su tutto il PC...")
    ns = NickSearch()

    # --- [1] From account JSONs ---
    for a in all_accounts:
        ns.add(
            a["name"], "Account JSON", a.get("file", ""),
            note=f"Launcher: {a.get('launcher', '?')} | UUID: {a.get('uuid', '?')} | Online: {a.get('online', '?')}"
        )

    # --- [2] From IAS log entries (reused from module 14d) ---
    for blk in ias_log_entries:
        ns.add(
            blk["name"], "IAS Log", blk.get("log_file", ""),
            blk.get("time", ""),
            note=f"UUID: {blk.get('uuid', '?')} | Online: {blk.get('online', '?')}"
        )

    # --- [3] From usercache.json ---
    for launcher in found_launchers:
        uc_path = os.path.join(launcher["root"], "usercache.json")
        _scan_usercache(ns, uc_path)
    default_uc = os.path.join(os.environ.get("APPDATA", ""), ".minecraft", "usercache.json")
    _scan_usercache(ns, default_uc)

    # --- [4] From Prefetch ---
    _scan_prefetch_nicks(ns, date_limit)

    # --- [5] From MuiCache ---
    _scan_mucache_nicks(ns)

    # --- [6] From BAM ---
    _scan_bam_nicks(ns)

    # --- [7] From server.properties ---
    _scan_server_properties(ns)

    # --- [8] Parallel file search in Desktop/Documents/Downloads/AppData ---
    _parallel_file_search(ns, date_limit)

    show_step("NICK SEARCH", f"Trovati {ns.count} nick univoci da {len(ns._seen)} fonti.", "green")
    return ns.nicks


# ================================================================
#  HELPER: usercache
# ================================================================

def _scan_usercache(ns: NickSearch, path: str):
    if not os.path.exists(path):
        return
    try:
        import json
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            data = json.loads(f.read())
        if isinstance(data, list):
            for entry in data:
                if isinstance(entry, dict):
                    ns.add(entry.get("name", ""), "Usercache", path,
                           note=f"UUID: {entry.get('uuid', '?')}")
    except Exception:
        pass


# ================================================================
#  HELPER: Prefetch nicks
# ================================================================

def _scan_prefetch_nicks(ns: NickSearch, date_limit: datetime):
    pf_dir = r"C:\Windows\Prefetch"
    if not os.path.isdir(pf_dir):
        return
    for fn in os.listdir(pf_dir):
        if not fn.lower().endswith(".pf"):
            continue
        fp = os.path.join(pf_dir, fn)
        try:
            mtime = datetime.fromtimestamp(os.path.getmtime(fp))
            if mtime < date_limit:
                continue
            exe_name = PF_STRIP_RE.sub("", fn)
            ns.add(exe_name, "Prefetch", fp, mtime.strftime('%d/%m/%Y %H:%M:%S'), "Exe avviato")
        except OSError:
            pass


# ================================================================
#  HELPER: MuiCache
# ================================================================

def _scan_mucache_nicks(ns: NickSearch):
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
                    if not name.startswith("PS"):
                        basename = os.path.splitext(os.path.basename(name))[0]
                        ns.add(basename, "MuiCache", name, note=f"Valore: {value}")
                    i += 1
                except OSError:
                    break
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass


# ================================================================
#  HELPER: BAM
# ================================================================

def _scan_bam_nicks(ns: NickSearch):
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
                                name, _, _ = winreg.EnumValue(sub_key, j)
                                if not name.startswith("PS"):
                                    basename = os.path.splitext(os.path.basename(name))[0]
                                    ns.add(basename, "BAM", name)
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


# ================================================================
#  HELPER: server.properties
# ================================================================

def _scan_server_properties(ns: NickSearch):
    drives = []
    for letter in "CDEFGHIJKLMNOPQRSTUVWXYZ":
        root = f"{letter}:\\"
        if os.path.isdir(root):
            drives.append(root)

    for drive in drives:
        try:
            for dirpath, _, filenames in os.walk(drive):
                depth = dirpath.replace(drive, "").count(os.sep)
                if depth > 4:
                    continue
                if "server.properties" in filenames:
                    fp = os.path.join(dirpath, "server.properties")
                    try:
                        if os.path.getsize(fp) > 50000:
                            continue
                        with open(fp, "r", encoding="utf-8", errors="replace") as f:
                            for line in f:
                                line = line.strip()
                                if line.startswith("ops="):
                                    ops = line[4:].split(",")
                                    for op in ops:
                                        ns.add(op.strip(), "server.properties ops", fp)
                    except Exception:
                        pass
        except PermissionError:
            pass


# ================================================================
#  HELPER: Parallel file search
# ================================================================

def _parallel_file_search(ns: NickSearch, date_limit: datetime):
    """Search for nicknames in text files using parallel threads."""
    quick_dirs = [
        (os.path.join(os.environ.get("USERPROFILE", ""), "Desktop"), 3),
        (os.path.join(os.environ.get("USERPROFILE", ""), "Documents"), 3),
        (os.path.join(os.environ.get("USERPROFILE", ""), "Downloads"), 3),
        (os.path.join(os.environ.get("USERPROFILE", ""), "AppData", "Roaming"), 2),
        (os.path.join(os.environ.get("USERPROFILE", ""), "AppData", "Local"), 2),
    ]

    # Collect files to scan
    files_to_scan = []
    extensions = (".txt", ".json", ".cfg", ".properties")

    for qd, max_depth in quick_dirs:
        if not os.path.isdir(qd):
            continue
        try:
            for dirpath, dirnames, filenames in os.walk(qd):
                depth = dirpath.replace(qd, "").count(os.sep)
                if depth > max_depth:
                    dirnames.clear()
                    continue
                for fn in filenames:
                    if any(fn.lower().endswith(ext) for ext in extensions):
                        fp = os.path.join(dirpath, fn)
                        try:
                            if os.path.getsize(fp) < 500000:
                                files_to_scan.append(fp)
                        except OSError:
                            pass
        except PermissionError:
            pass

    # Parallel scanning
    max_workers = min(8, os.cpu_count() or 4)
    results = []

    def _scan_file(fp):
        found = []
        try:
            with open(fp, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()
            if not content:
                return found
            for m in NICK_IN_FILE_RE.finditer(content):
                found.append((m.group(1), fp))
        except Exception:
            pass
        return found

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(_scan_file, fp): fp for fp in files_to_scan}
        for future in as_completed(futures):
            try:
                result = future.result(timeout=30)
                results.extend(result)
            except Exception:
                pass

    for nick, path in results:
        ext = os.path.splitext(path)[1]
        try:
            mtime = datetime.fromtimestamp(os.path.getmtime(path))
            date_str = mtime.strftime('%d/%m/%Y %H:%M:%S')
        except OSError:
            date_str = ""
        ns.add(nick, f"File ({ext})", path, date_str)
