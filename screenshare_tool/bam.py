"""
BAM (Background Activity Moderator) analysis — AstroSS-grade parser.

Extracts last-execution timestamps for every executable from the BAM
registry key, with:
  - Timezone correction (ActiveTimeBias / DaylightBias)
  - SID -> username resolution
  - Drive path reconstruction (\\Device\\HarddiskVolumeN -> C:\\)
  - Authenticode signature verification of the executable
  - Both BAM key variants (bam\\State and bam\\UserSettings)

Based on the AstroSS tool (github.com/Jammy108/AstroSS) and the original
PowerShell BAM extraction, rewritten in pure Python (stdlib only).
"""

import os
import re
import struct
from datetime import datetime, timedelta
from typing import List, Optional, Tuple

from .utils import (
    filetime_to_datetime, format_timestamp, new_report_file,
    run_ps, show_step, write_block,
)

# Both known BAM key variants
BAM_BASES = [
    r"SYSTEM\CurrentControlSet\Services\bam\State\UserSettings",
    r"SYSTEM\CurrentControlSet\Services\bam\UserSettings",
]

# Device path -> drive letter mapping, built from the mounted volumes
_DRIVE_MAP: Optional[dict] = None


def _build_drive_map() -> dict:
    """Map \\Device\\HarddiskVolumeN -> drive letter using mount points."""
    global _DRIVE_MAP
    if _DRIVE_MAP is not None:
        return _DRIVE_MAP
    mapping = {}
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,
                             r"SYSTEM\MountedDevices")
        i = 0
        while True:
            try:
                name, value, _ = winreg.EnumValue(key, i)
                # Name like: \\DosDevices\\C:  or  \\??\\C:
                m = re.match(r"\\\\[?DosDevices]*\\([A-Z]):", name)
                if m and isinstance(value, bytes):
                    vol = value.decode("utf-16-le", errors="replace").strip("\\x00")
                    if vol:
                        mapping[vol.lower()] = f"{m.group(1)}:"
                i += 1
            except OSError:
                break
        winreg.CloseKey(key)
    except Exception:
        pass
    _DRIVE_MAP = mapping
    return mapping


def _resolve_device_path(device_path: str) -> str:
    """Convert a \\Device\\HarddiskVolumeN\\path into a drive-letter path."""
    if not device_path:
        return ""
    low = device_path.lower()
    mapping = _build_drive_map()
    for vol, letter in mapping.items():
        if low.startswith(vol.lower()):
            rest = device_path[len(vol):]
            return f"{letter}\\{rest.lstrip('\\\\')}"
    # Fallback: strip the device prefix
    m = re.match(r"\\\\Device\\\\[^\\\\]+(?:\\(\\d+))?\\\\?(.*)", device_path)
    if m:
        return m.group(2).replace("\\\\", "\\")
    return device_path


def _get_timezone_bias() -> Tuple[int, int]:
    """Return (active_bias_minutes, daylight_bias_minutes) from the registry."""
    try:
        import winreg
        key = winreg.OpenKey(
            winreg.HKEY_LOCAL_MACHINE,
            r"SYSTEM\CurrentControlSet\Control\TimeZoneInformation")
        active = 0
        daylight = 0
        try:
            active, _ = winreg.QueryValueEx(key, "ActiveTimeBias")
        except OSError:
            pass
        try:
            daylight, _ = winreg.QueryValueEx(key, "DaylightBias")
        except OSError:
            pass
        winreg.CloseKey(key)
        # Values are signed 32-bit in minutes
        def _signed(v):
            if v is None:
                return 0
            return v - 0x100000000 if v >= 0x80000000 else v
        return _signed(active), _signed(daylight)
    except Exception:
        return 0, 0


def _sid_to_username(sid: str) -> str:
    """Resolve a SID string to a username (e.g. DESKTOP\\User)."""
    if not sid:
        return ""
    try:
        import subprocess
        result = subprocess.run(
            ["powershell", "-NoProfile", "-Command",
             f"(New-Object System.Security.Principal.SecurityIdentifier('{sid}')).Translate([System.Security.Principal.NTAccount]).Value"],
            capture_output=True, text=True, timeout=10,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except Exception:
        pass
    return ""


def _get_signature(path: str) -> str:
    """Verify the Authenticode signature of an executable (AstroSS-style)."""
    if not path or not os.path.isfile(path):
        return "File non trovato"
    try:
        result = run_ps(
            f"(Get-AuthenticodeSignature -FilePath '{path}' -ErrorAction SilentlyContinue).Status",
            timeout=15)
        status = result.strip()
        if not status:
            return "N/D"
        if status == "Valid":
            return "FIRMA VALIDA"
        if status == "NotSigned":
            return "NON FIRMATO"
        if status == "HashMismatch":
            return "FIRMA NON VALIDA (HashMismatch)"
        if status == "NotTrusted":
            return "FIRMA NON VALIDA (NotTrusted)"
        return f"FIRMA NON VALIDA ({status})"
    except Exception:
        return "N/D"


def _iter_bam_entries() -> List[dict]:
    """Extract all BAM entries: {sid, user, path, filetime}."""
    entries = []
    try:
        import winreg
        for base in BAM_BASES:
            try:
                root_key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, base)
            except OSError:
                continue
            try:
                i = 0
                while True:
                    try:
                        sid = winreg.EnumKey(root_key, i)
                    except OSError:
                        break
                    try:
                        user_key = winreg.OpenKey(root_key, sid)
                    except OSError:
                        i += 1
                        continue
                    try:
                        j = 0
                        while True:
                            try:
                                name, value, _ = winreg.EnumValue(user_key, j)
                            except OSError:
                                break
                            if name.startswith("PS"):
                                j += 1
                                continue
                            ft = None
                            if isinstance(value, bytes) and len(value) >= 8:
                                try:
                                    ft = struct.unpack("<q", value[:8])[0]
                                except Exception:
                                    ft = None
                            entries.append({
                                "sid": sid,
                                "user": "",
                                "path": name,
                                "filetime": ft,
                            })
                            j += 1
                    finally:
                        winreg.CloseKey(user_key)
                    i += 1
            finally:
                winreg.CloseKey(root_key)
    except Exception:
        pass
    return entries


def analyze_bam(date_limit: datetime, days: int,
                root_dir: str, ts: str, win_name: str, win_build: int) -> int:
    """
    Extract BAM last-execution entries with timezone + signature info.
    Returns the total number of entries found in the interval.
    """
    show_step("BAM", "Ultime esecuzioni (AstroSS parser) + firme...")

    out = os.path.join(root_dir, "11_Regedit", f"BAM_AstroSS_{ts}.txt")
    new_report_file(out, "BAM [11b] - ULTIME ESECUZIONI (AstroSS parser)",
                    "BAM: ultima esecuzione di ogni eseguibile + firma Authenticode",
                    win_name, win_build, days, date_limit)

    lines = []
    active_bias, daylight_bias = _get_timezone_bias()
    try:
        tz_name = run_ps(
            "(Get-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation').TimeZoneKeyName",
            timeout=10).strip()
    except Exception:
        tz_name = ""

    lines.append(f"  Timezone        : {tz_name}")
    lines.append(f"  ActiveBias      : {active_bias} min")
    lines.append(f"  DaylightBias    : {daylight_bias} min")
    lines.append("")

    all_entries = _iter_bam_entries()
    if not all_entries:
        lines.append("  [--] Chiavi BAM non disponibili (richiede Win10+).")
        write_block(out, lines)
        show_step("BAM", "Completato. Nessuna voce BAM.", "yellow")
        return 0

    # Resolve users once per SID
    user_cache = {}
    for e in all_entries:
        sid = e["sid"]
        if sid not in user_cache:
            user_cache[sid] = _sid_to_username(sid)

    in_range_count = 0
    total_entries = 0
    for e in all_entries:
        total_entries += 1
        e["user"] = user_cache.get(e["sid"], "")
        if e["filetime"] is None:
            continue

        # FILETIME -> UTC -> adjusted to local with bias
        dt_utc = filetime_to_datetime(e["filetime"])
        if not dt_utc:
            continue
        # Bias is minutes to ADD (ActiveTimeBias is negative of UTC offset)
        try:
            dt_local = dt_utc + timedelta(minutes=active_bias)
        except Exception:
            dt_local = dt_utc

        e["dt"] = dt_local
        if dt_local >= date_limit:
            in_range_count += 1

    # Sort: in-range first, then by time desc
    def _sort_key(x):
        dt = x.get("dt")
        if dt is None:
            return (1, datetime.min)
        return (0 if dt >= date_limit else 1, dt)

    all_entries.sort(key=_sort_key, reverse=True)

    lines.append(f"  Voci BAM totali           : {total_entries}")
    lines.append(f"  Voci nell'intervallo      : {in_range_count}")
    lines.append("")

    shown = 0
    for e in all_entries:
        dt = e.get("dt")
        if dt is None:
            continue
        in_range = dt >= date_limit
        if in_range:
            tag = "[>>>]"
        else:
            tag = "[ - ]"
            # Only show a bounded number of out-of-range entries
            if shown >= 400:
                continue

        # Reconstruct the path and verify the signature only for in-range
        path = _resolve_device_path(e["path"])
        sig = _get_signature(path) if in_range else ""
        lines.append(f"  {tag}  {format_timestamp(dt)}  |  {os.path.basename(path) or e['path']}")
        lines.append(f"        Path      : {path or e['path']}")
        if e["user"]:
            lines.append(f"        Utente    : {e['user']}  ({e['sid']})")
        else:
            lines.append(f"        SID       : {e['sid']}")
        if sig:
            lines.append(f"        Firma     : {sig}")
        lines.append("")
        shown += 1

    if shown == 0:
        lines.append("  [--] Nessuna esecuzione registrata nell'intervallo.")

    write_block(out, lines)
    color = "yellow" if in_range_count else "green"
    show_step("BAM", f"Completato. {in_range_count} esecuzioni nell'intervallo.", color)
    return in_range_count
