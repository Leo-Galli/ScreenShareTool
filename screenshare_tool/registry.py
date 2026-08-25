"""
Windows Registry analysis module.

Checks: Store (compatibility assistant), BAM, WinRAR history,
MuiCache, OpenSavePidlMRU, LastVisited, FileExts, USB Devices, ShimCache.
"""

import os
import struct
from datetime import datetime
from typing import List

from .config import KNOWN_EXTENSIONS
from .utils import (
    filetime_to_datetime, format_timestamp, new_report_file,
    show_step, write_block, iter_reg_values, iter_reg_subkeys,
    safe_get_reg, safe_get_reg_hklm,
)


def analyze_registry(date_limit: datetime, days: int,
                     root_dir: str, ts: str, win_name: str, win_build: int,
                     is_win10: bool):
    """Run all registry analysis modules (11a-11i)."""
    show_step("REGEDIT", "Analisi chiavi registro...")

    # ---- [11a] Store (exe mai eseguiti) ----
    out = os.path.join(root_dir, "11_Regedit", f"Store_{ts}.txt")
    new_report_file(out, "REGEDIT [11a] - STORE",
                    "HKCU\\...\\AppCompatFlags\\Compatibility Assistant\\Store",
                    win_name, win_build, days, date_limit)
    store_path = r"Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Store"
    entries = []
    for name, value, _ in iter_reg_values(store_path):
        if not name.startswith("PS"):
            entries.append(f"  [EXE] {name}")
    if entries:
        write_block(out, entries)
    else:
        write_block(out, ["  [--] Chiave Store non trovata."])

    # ---- [11b] BAM (handled by the dedicated AstroSS-grade parser module) ----
    out = os.path.join(root_dir, "11_Regedit", f"BAM_{ts}.txt")
    new_report_file(out, "REGEDIT [11b] - BAM",
                    "Ultime esecuzioni - vedi report BAM_AstroSS_* (modulo dedicato)",
                    win_name, win_build, days, date_limit)
    write_block(out, ["  [OK]  Analisi BAM completa eseguita dal modulo dedicato (BAM_AstroSS_*)."])

    # ---- [11c] WinRAR History ----
    out = os.path.join(root_dir, "11_Regedit", f"WinRAR_{ts}.txt")
    new_report_file(out, "REGEDIT [11c] - WINRAR HISTORY",
                    r"HKCU\SOFTWARE\WinRAR\ArcHistory",
                    win_name, win_build, days, date_limit)
    rar_entries = []
    for name, value, _ in iter_reg_values(r"SOFTWARE\WinRAR\ArcHistory"):
        if not name.startswith("PS"):
            rar_entries.append(f"  [ARC] {value}")
    if rar_entries:
        write_block(out, rar_entries)
    else:
        write_block(out, ["  [--] Nessuna history WinRAR."])

    # ---- [11d] MuiCache ----
    out = os.path.join(root_dir, "11_Regedit", f"MuiCache_{ts}.txt")
    new_report_file(out, "REGEDIT [11d] - MUICACHE",
                    r"HKCU\...\Shell\MuiCache (nome descrittivo programmi)",
                    win_name, win_build, days, date_limit)
    mui_entries = []
    import re as _re
    mui_re = _re.compile(r'\.(exe|jar|dll|pif|cmd|bat)', _re.IGNORECASE)
    for name, value, _ in iter_reg_values(
        r"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache"
    ):
        if not name.startswith("PS") and mui_re.search(name):
            mui_entries.append(f"  [APP] {name}\n        Nome : {value}")
    if mui_entries:
        write_block(out, mui_entries)
    else:
        write_block(out, ["  [--] MuiCache non trovato."])

    # ---- [11e] OpenSavePidlMRU ----
    out = os.path.join(root_dir, "11_Regedit", f"Estensioni_OpenSave_{ts}.txt")
    new_report_file(out, "REGEDIT [11e] - OPENSAVE ESTENSIONI",
                    "HKCU\\...\\ComDlg32\\OpenSavePidlMRU",
                    win_name, win_build, days, date_limit)
    ext_entries = []
    for subkey in iter_reg_subkeys(
        r"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU"
    ):
        ext_entries.append(f"  [EXT] .{subkey}")
    if ext_entries:
        write_block(out, ext_entries)
    else:
        write_block(out, ["  [--] Nessuna estensione trovata."])

    # ---- [11f] LastVisitedPidlMRU ----
    out = os.path.join(root_dir, "11_Regedit", f"LastVisited_{ts}.txt")
    new_report_file(out, "REGEDIT [11f] - LASTVISITED (cartelle dialogo file)",
                    r"HKCU\...\ComDlg32\LastVisitedPidlMRU",
                    win_name, win_build, days, date_limit)
    lv_entries = []
    for name, value, _ in iter_reg_values(
        r"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\LastVisitedPidlMRU"
    ):
        if not name.startswith("PS"):
            lv_entries.append(f"  {name} = {value}")
    if lv_entries:
        write_block(out, lv_entries)
    else:
        write_block(out, ["  [--] Chiave non trovata."])

    # ---- [11g] FileExts non standard ----
    out = os.path.join(root_dir, "11_Regedit", f"FileExts_Spoofate_{ts}.txt")
    new_report_file(out, "REGEDIT [11g] - FILEEXTS NON STANDARD",
                    "Estensioni non comuni registrate nel sistema",
                    win_name, win_build, days, date_limit)
    fe_entries = []
    for subkey in iter_reg_subkeys(
        r"Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts"
    ):
        ext = subkey if subkey.startswith(".") else f".{subkey}"
        if ext.lower() not in KNOWN_EXTENSIONS:
            fe_entries.append(f"  [!!!] EXT NON STANDARD : {ext}")
        else:
            fe_entries.append(f"  [ - ] Nota            : {ext}")
    write_block(out, fe_entries if fe_entries else ["  [--] Nessuna estensione trovata."])

    # ---- [11h] USB Devices + USBSTOR (ultima connessione) ----
    out = os.path.join(root_dir, "11_Regedit", f"USB_{ts}.txt")
    new_report_file(out, "REGEDIT [11h] - USB DEVICES",
                    r"HKLM\SYSTEM\ControlSet001\Enum\USB + USBSTOR (timestamps)",
                    win_name, win_build, days, date_limit)
    usb_entries = _scan_usb_devices()
    usb_entries.append("")
    usb_entries.append("  ---- USBSTOR - ULTIMA CONNESSIONE ----")
    usb_entries.extend(_scan_usbstor())
    write_block(out, usb_entries if usb_entries else ["  [--] Nessun dispositivo USB trovato."])

    # ---- [11i] ShimCache ----
    out = os.path.join(root_dir, "11_Regedit", f"ShimCache_{ts}.txt")
    new_report_file(out, "REGEDIT [11i] - SHIMCACHE / APPCOMPATCACHE",
                    r"HKLM\...\AppCompatCache (parsing avanzato)",
                    win_name, win_build, days, date_limit)
    shim_val = safe_get_reg_hklm(
        r"SYSTEM\CurrentControlSet\Control\Session Manager\AppCompatCache",
        "AppCompatCache"
    )
    if shim_val and isinstance(shim_val, bytes):
        write_block(out, [
            f"  [OK]  Chiave trovata. Dimensione raw: {len(shim_val)} byte.",
            "  [NB]  Per analisi completa: AppCompatCacheParser.exe (Zimmermann tools)"
        ])
    else:
        write_block(out, ["  [--] Chiave ShimCache non trovata."])

    show_step("REGEDIT", "Completato. Sezioni 11a-11i scritte.", "green")


def _analyze_bam(date_limit: datetime) -> List[str]:
    """Analyze BAM (Background Activity Moderator) registry entries."""
    entries = []
    bam_base = r"SYSTEM\CurrentControlSet\Services\bam\State\UserSettings"
    for sid in iter_reg_subkeys(bam_base, hive="HKLM"):
        bam_key = f"{bam_base}\\{sid}"
        for name, value, _ in iter_reg_values(bam_key, hive="HKLM"):
            if name.startswith("PS"):
                continue
            import re as _re
            if not _re.search(r'\.(exe|jar|dll|bat|cmd|pif)', name, _re.IGNORECASE):
                continue
            dt = "N/A"
            in_range = True
            if isinstance(value, bytes) and len(value) >= 8:
                ft = struct.unpack("<q", value[:8])[0]
                dt_obj = filetime_to_datetime(ft)
                if dt_obj:
                    dt = format_timestamp(dt_obj)
                    in_range = dt_obj >= date_limit
            if in_range:
                entries.append(f"  [RUN] {name}")
                entries.append(f"        Ultima esec : {dt}")
                entries.append(f"        SID        : {sid}")
                entries.append("")
    return entries


def _scan_usb_devices() -> List[str]:
    """Scan USB devices from the registry."""
    entries = []
    usb_base = r"SYSTEM\ControlSet001\Enum\USB"
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, usb_base)
        try:
            _scan_usb_recursive(key, usb_base, entries)
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass
    return entries


def _scan_usb_recursive(key, base_path: str, entries: List[str], depth: int = 0):
    """Recursively scan USB registry entries."""
    if depth > 5:
        return
    import winreg
    try:
        i = 0
        while True:
            try:
                sub_name = winreg.EnumKey(key, i)
                sub_path = f"{base_path}\\{sub_name}"
                try:
                    sub_key = winreg.OpenKey(key, sub_name)
                    try:
                        j = 0
                        while True:
                            try:
                                val_name, val_data, _ = winreg.EnumValue(sub_key, j)
                                if val_name.lower() == "friendlyname" and isinstance(val_data, str):
                                    entries.append(f"  [USB] {val_data}")
                                j += 1
                            except OSError:
                                break
                        # Recurse
                        _scan_usb_recursive(sub_key, sub_path, entries, depth + 1)
                    finally:
                        winreg.CloseKey(sub_key)
                except Exception:
                    pass
                i += 1
            except OSError:
                break
    except Exception:
        pass


def _scan_usbstor() -> List[str]:
    """Scan USBSTOR for storage devices with last-connection timestamps."""
    entries = []
    try:
        import winreg
        base = r"SYSTEM\CurrentControlSet\Enum\USBSTOR"
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, base)
        try:
            i = 0
            while True:
                try:
                    dev = winreg.EnumKey(key, i)
                except OSError:
                    break
                try:
                    dev_key = winreg.OpenKey(key, dev)
                    try:
                        j = 0
                        while True:
                            try:
                                inst = winreg.EnumKey(dev_key, j)
                            except OSError:
                                break
                            try:
                                inst_key = winreg.OpenKey(dev_key, inst)
                                try:
                                    friendly = ""
                                    last = "N/A"
                                    try:
                                        friendly, _ = winreg.QueryValueEx(inst_key, "FriendlyName")
                                    except OSError:
                                        pass
                                    try:
                                        last_val, _ = winreg.QueryValueEx(inst_key, "LastWrite")
                                        if isinstance(last_val, bytes) and len(last_val) >= 8:
                                            ft = struct.unpack("<q", last_val[:8])[0]
                                            dt = filetime_to_datetime(ft)
                                            if dt:
                                                last = format_timestamp(dt)
                                    except OSError:
                                        pass
                                    entries.append(f"  [USBSTOR] {friendly or dev}  |  Ultima connessione: {last}")
                                finally:
                                    winreg.CloseKey(inst_key)
                            except OSError:
                                pass
                            j += 1
                    finally:
                        winreg.CloseKey(dev_key)
                    i += 1
                except OSError:
                    i += 1
        finally:
            winreg.CloseKey(key)
    except Exception:
        pass
    return entries
