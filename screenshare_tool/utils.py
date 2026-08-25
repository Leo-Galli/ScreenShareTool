"""
Shared utility functions: file writing, progress display, HTML escaping, etc.
"""

import os
import sys
import time
from datetime import datetime
from typing import List, Optional


# ================================================================
#  CONSOLE HELPERS
# ================================================================

# ANSI color codes
class Color:
    RESET   = "\033[0m"
    RED     = "\033[91m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    BLUE    = "\033[94m"
    CYAN    = "\033[96m"
    WHITE   = "\033[97m"
    GRAY    = "\033[90m"
    BOLD    = "\033[1m"


def show_banner():
    """Print the application banner."""
    print()
    print(f"{Color.CYAN}      _____ _           _ _     _____     _         _           {Color.RESET}")
    print(f"{Color.CYAN}     |     | |_ ___ ___| |_|___| __  |___| |___ ___| |___ _ _   {Color.RESET}")
    print(f"{Color.CYAN}     |   --|   | .'|  _| | | -_|    -| . | | -_| . | | .'| | |  {Color.RESET}")
    print(f"{Color.CYAN}     |_____|_|_|__,|_| |_|_|___|__|__|___|_|___|  _|_|__,|_  |  {Color.RESET}")
    print(f"{Color.CYAN}                                               |_|       |___|  {Color.RESET}")
    print()
    print(f"        NETWORK: mc.charlieroleplay.it  |  Made by LeoGalli")
    print(f"        PLATFORM: Windows  |  Tool v3.0 Python Optimized")
    print(f"  {'_' * 66}")
    print()


def show_step(module: str, detail: str, color: str = "cyan"):
    """Display a progress step in the console."""
    c = getattr(Color, color.upper(), Color.CYAN)
    print(f"  {c}[ >> ]{Color.RESET} {Color.WHITE}{module:<18}{Color.RESET} {Color.GRAY}{detail}{Color.RESET}")


def show_info(text: str, color: str = "white"):
    """Display an info line."""
    c = getattr(Color, color.upper(), Color.WHITE)
    print(f"  {c}{text}{Color.RESET}")


def print_header(title: str, subtitle: str = ""):
    """Print a section header."""
    print()
    print(f"  {'=' * 66}")
    print(f"  {Color.CYAN}{title}{Color.RESET}")
    if subtitle:
        print(f"  {Color.GRAY}{subtitle}{Color.RESET}")
    print(f"  {'=' * 66}")
    print()


# ================================================================
#  FILE I/O HELPERS
# ================================================================

def write_block(path: str, lines: List[str]):
    """
    Write a list of lines to a file (append mode, UTF-8).
    Uses a single write operation for speed.
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    content = "\n".join(lines) + "\n" if lines else ""
    with open(path, "a", encoding="utf-8") as f:
        f.write(content)


def write_report_header(path: str, title: str, description: str,
                        win_name: str, win_build: int, days: int,
                        date_limit: datetime):
    """Write a standard report file header."""
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    date_limit_str = date_limit.strftime("%d/%m/%Y")
    header = [
        "=" * 64,
        f"  {title}",
        f"  {description}",
        "",
        f"  Sistema  : {win_name} (Build {win_build})",
        f"  Generato : {now_str}",
        f"  Intervallo: Ultimi {days} giorni  (dal {date_limit_str})",
        "=" * 64,
        "",
    ]
    # Truncate the file first (report headers are written fresh)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(header) + "\n")


def new_report_file(path: str, title: str, description: str,
                    win_name: str, win_build: int, days: int,
                    date_limit: datetime):
    """Create a fresh report file with a header (truncates existing)."""
    write_report_header(path, title, description, win_name, win_build, days, date_limit)


def read_log_lines(path: str) -> Optional[List[str]]:
    """Read a log file, handling .gz compression. Returns None on failure."""
    if not os.path.exists(path):
        return None
    try:
        if path.endswith(".gz"):
            import gzip
            with gzip.open(path, "rt", encoding="utf-8", errors="replace") as f:
                return f.read().split("\n")
        else:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                return f.readlines()
    except Exception:
        return None


# ================================================================
#  HTML HELPERS
# ================================================================

def html_escape(s) -> str:
    """Escape HTML special characters. Handles None and non-string values."""
    if s is None:
        return ""
    s = str(s)
    return (s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;")
             .replace('"', "&quot;"))


# ================================================================
#  REGISTRY HELPERS (Windows only)
# ================================================================

def safe_get_reg(path: str, name: str = None):
    """
    Safely read a Windows registry value.
    Returns the value or None on failure.
    """
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, path)
        try:
            if name:
                value, _ = winreg.QueryValueEx(key, name)
                return value
            else:
                return key
        finally:
            winreg.CloseKey(key)
    except Exception:
        return None


def safe_get_reg_hklm(path: str, name: str = None):
    """Safely read from HKEY_LOCAL_MACHINE."""
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, path)
        try:
            if name:
                value, _ = winreg.QueryValueEx(key, name)
                return value
            else:
                return key
        finally:
            winreg.CloseKey(key)
    except Exception:
        return None


def iter_reg_subkeys(path: str, hive="HKCU"):
    """Iterate over subkey names of a registry key."""
    try:
        import winreg
        hkey = winreg.HKEY_CURRENT_USER if hive == "HKCU" else winreg.HKEY_LOCAL_MACHINE
        key = winreg.OpenKey(hkey, path)
        try:
            i = 0
            while True:
                try:
                    name = winreg.EnumKey(key, i)
                    yield name
                    i += 1
                except OSError:
                    break
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass


def iter_reg_values(path: str, hive="HKCU"):
    """Iterate over (name, value, type) of a registry key's values."""
    try:
        import winreg
        hkey = winreg.HKEY_CURRENT_USER if hive == "HKCU" else winreg.HKEY_LOCAL_MACHINE
        key = winreg.OpenKey(hkey, path)
        try:
            i = 0
            while True:
                try:
                    name, value, vtype = winreg.EnumValue(key, i)
                    yield name, value, vtype
                    i += 1
                except OSError:
                    break
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass


# ================================================================
#  WMI / SYSTEM QUERY HELPERS
# ================================================================

def wmi_query(query: str, fields: List[str] = None) -> List[dict]:
    """
    Run a WMI query using subprocess (netsh/wmic) or PowerShell.
    Returns list of dicts with the requested fields.
    """
    try:
        import subprocess
        ps_cmd = f'Get-CimInstance -Query "{query}" | Select-Object {",".join(fields) if fields else "*"} | ConvertTo-Json -Compress'
        result = subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps_cmd],
            capture_output=True, text=True, timeout=15,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        if result.returncode == 0 and result.stdout.strip():
            import json
            data = json.loads(result.stdout.strip())
            if isinstance(data, list):
                return data
            return [data]
    except Exception:
        pass
    return []


def run_cmd(command: str, timeout: int = 30) -> List[str]:
    """Run a shell command and return output lines."""
    try:
        import subprocess
        result = subprocess.run(
            command, shell=True, capture_output=True, text=True,
            timeout=timeout, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        return [line for line in result.stdout.split("\n") if line.strip()]
    except Exception:
        return []


def run_ps(command: str, timeout: int = 30) -> str:
    """Run a PowerShell command and return stdout."""
    try:
        import subprocess
        result = subprocess.run(
            ["powershell", "-NoProfile", "-Command", command],
            capture_output=True, text=True, timeout=timeout,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        return result.stdout
    except Exception:
        return ""


# ================================================================
#  DATE / TIME HELPERS
# ================================================================

def parse_usn_timestamp(ts_str: str) -> Optional[datetime]:
    """Parse a USN Journal CSV timestamp like '1/15/2024 10:30:45'."""
    for fmt in ("%m/%d/%Y %H:%M:%S", "%d/%m/%Y %H:%M:%S", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(ts_str.strip(), fmt)
        except ValueError:
            continue
    return None


def format_timestamp(dt: datetime) -> str:
    """Format a datetime for display."""
    return dt.strftime("%d/%m/%Y %H:%M:%S")


def filetime_to_datetime(ft: int) -> Optional[datetime]:
    """Convert a Windows FILETIME (64-bit) to a Python datetime."""
    try:
        # FILETIME epoch is Jan 1, 1601
        EPOCH_DIFF = 116444736000000000  # 100-ns intervals from 1601 to 1970
        ts = (ft - EPOCH_DIFF) / 10000000
        return datetime.utcfromtimestamp(ts)
    except (ValueError, OSError, OverflowError):
        return None
