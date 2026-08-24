"""
NTFS USN Journal analysis module.

Reads the USN Journal for each drive, filters by date range, and extracts
various forensic indicators: deleted/renamed files, ADS streams, permission
changes, Unicode spoofing, recycle bin contents, and cheat replacement patterns.
"""

import os
import re
import subprocess
from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Optional, Tuple

from .config import (
    PAT_BINARY, PAT_EXE_JAR, PAT_MC_ACCOUNT_FILES,
    USN_FLAG_ADS, USN_FLAG_DACL, USN_FLAG_DELETE,
    USN_FLAG_RENAME_NEW, USN_FLAG_RENAME_OLD, USN_FLAG_ATTR_READONLY,
)
from .utils import (
    new_report_file, parse_usn_timestamp, show_step, write_block,
)


def read_journal(drive_letter: str) -> List[str]:
    """Read the USN Journal for a given drive letter using fsutil."""
    dl = drive_letter.upper().rstrip("\\")[0]
    try:
        result = subprocess.run(
            ["cmd", "/c", f"fsutil usn readjournal {dl}: csv"],
            capture_output=True, text=True, timeout=120,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        lines = [l for l in result.stdout.split("\n") if l.strip()]
        return lines
    except Exception:
        return []


def filter_journal_by_date(lines: List[str], date_limit: datetime) -> List[str]:
    """Filter journal lines to only include entries within the date range."""
    filtered = []
    for line in lines:
        m = re.search(r'(\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}:\d{2})', line)
        if m:
            try:
                dt = parse_usn_timestamp(m.group(1))
                if dt and dt >= date_limit:
                    filtered.append(line)
            except Exception:
                filtered.append(line)
        else:
            filtered.append(line)
    return filtered


def match_journal(lines: List[str], flags_pattern: str,
                  file_pattern: str = "") -> List[str]:
    """Filter journal lines by USN flags and optional file extension pattern."""
    flag_parts = flags_pattern.split("|")
    result = []
    for line in lines:
        if not any(fp in line for fp in flag_parts):
            continue
        if file_pattern:
            fp_re = re.compile(file_pattern, re.IGNORECASE)
            if not fp_re.search(line):
                continue
        result.append(line)
    return result


def _format_event(tag: str, line: str) -> str:
    """Format a journal event line."""
    return f"  [{tag}]  {line}"


def _get_parts(line: str) -> List[str]:
    """Split a USN CSV line into parts."""
    return [p.strip().strip('"') for p in line.split(",")]


def analyze_journal(drive_letter: str, date_limit: datetime, days: int,
                    root_dir: str, ts: str, win_name: str, win_build: int):
    """
    Complete NTFS Journal analysis for a single drive.
    Produces reports 01-10.
    """
    dl = drive_letter.upper().rstrip("\\")[0]
    show_step(f"JOURNAL [{dl}]", "Lettura USN Journal in corso...")

    raw_lines = read_journal(dl)
    if not raw_lines:
        show_step(f"JOURNAL [{dl}]", "Nessun dato Journal disponibile.", "yellow")
        return

    filtered = filter_journal_by_date(raw_lines, date_limit)
    show_step(f"JOURNAL [{dl}]", f"Totale: {len(raw_lines)} righe | Intervallo: {len(filtered)}", "gray")

    # ------ [01] Account Files ------
    out = os.path.join(root_dir, "01_AccountFiles", f"AccountFiles_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [01] - ACCOUNT FILES [{dl}]",
                    f"File MC/AccountSwitcher eliminati (FLAG: {USN_FLAG_DELETE})",
                    win_name, win_build, days, date_limit)
    rows = match_journal(filtered, USN_FLAG_DELETE)
    rows = [l for l in rows if PAT_MC_ACCOUNT_FILES.search(l)]
    if rows:
        write_block(out, [_format_event("DEL", l) for l in rows])
    else:
        write_block(out, ["  [--] Nessuna corrispondenza trovata."])

    # ------ [02] Deleted / Renamed ------
    out = os.path.join(root_dir, "02_DeletedRenamed", f"DeletedRenamed_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [02] - FILE ELIMINATI/RINOMINATI [{dl}]",
                    f"Exe/Jar/Pf (FLAG: DELETE | RENAME_OLD | RENAME_NEW)",
                    win_name, win_build, days, date_limit)
    all_flags = f"{USN_FLAG_DELETE}|{USN_FLAG_RENAME_OLD}|{USN_FLAG_RENAME_NEW}"
    rows = match_journal(filtered, all_flags)
    rows = [l for l in rows if PAT_EXE_JAR.search(l)]
    if rows:
        formatted = []
        for l in rows:
            if USN_FLAG_DELETE in l:
                tag = "DEL "
            elif USN_FLAG_RENAME_OLD in l:
                tag = "REN<"
            else:
                tag = "REN>"
            formatted.append(_format_event(tag, l))
        write_block(out, formatted)
    else:
        write_block(out, ["  [--] Nessuna corrispondenza trovata."])

    # ------ [03] JNativeHook ------
    out = os.path.join(root_dir, "03_JNativeHook", f"JNativeHook_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [03] - JNATIVEHOOK [{dl}]",
                    "Tracce autoclicker .jar (libreria nel %TEMP%)",
                    win_name, win_build, days, date_limit)
    rows = [l for l in filtered if "JNativeHook" in l.lower()]
    if rows:
        write_block(out, [f"  [!!!] {l}" for l in rows])
    else:
        write_block(out, ["  [--] Nessuna traccia JNativeHook."])

    # ------ [04] Prefetch Deleted ------
    out = os.path.join(root_dir, "04_PrefetchDel", f"PrefetchEliminato_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [04] - PREFETCH ELIMINATO [{dl}]",
                    f"File .pf rimossi manualmente (FLAG: {USN_FLAG_DELETE})",
                    win_name, win_build, days, date_limit)
    rows = match_journal(filtered, USN_FLAG_DELETE)
    rows = [l for l in rows if re.search(r'\.pf\b', l, re.IGNORECASE)]
    if rows:
        write_block(out, [f"  [!!!] {l}" for l in rows])
    else:
        write_block(out, ["  [OK] Nessun .pf eliminato rilevato."])

    # ------ [05] WMIC / ADS Stream ------
    out = os.path.join(root_dir, "05_WMIC_Stream", f"WMIC_Stream_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [05] - WMIC / ADS STREAM [{dl}]",
                    f"Bypass via stream NTFS alternativo (FLAG: {USN_FLAG_ADS})",
                    win_name, win_build, days, date_limit)
    ads_parts = USN_FLAG_ADS.split("|")
    rows = [l for l in filtered if any(p in l for p in ads_parts)]
    if rows:
        write_block(out, [f"  [!!!] {l}" for l in rows])
    else:
        write_block(out, ["  [OK] Nessun ADS stream rilevato."])

    # ------ [06] Read-Only Attribute ------
    out = os.path.join(root_dir, "06_SolaLettura", f"SolaLettura_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [06] - ATTRIBUTO SOLA LETTURA [{dl}]",
                    f"File readonly -> blocco aggiornamento Prefetch (FLAG: {USN_FLAG_ATTR_READONLY})",
                    win_name, win_build, days, date_limit)
    attr_parts = USN_FLAG_ATTR_READONLY.split("|")
    rows = [l for l in filtered if any(p in l for p in attr_parts)]
    if rows:
        write_block(out, [f"  [ATT] {l}" for l in rows])
    else:
        write_block(out, ["  [OK] Nessuna modifica attributo readonly."])

    # ------ [07] CACLS / DACL ------
    out = os.path.join(root_dir, "07_Cacls", f"Cacls_Prefetch_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [07] - MODIFICA PERMESSI PREFETCH [{dl}]",
                    f"DACL alterata su Prefetch per bloccare .pf (FLAG: {USN_FLAG_DACL})",
                    win_name, win_build, days, date_limit)
    dacl_parts = USN_FLAG_DACL.split("|")
    rows = [l for l in filtered
            if any(p in l for p in dacl_parts)
            and "Prefetch" in l]
    if rows:
        write_block(out, [f"  [!!!] {l}" for l in rows])
    else:
        write_block(out, ["  [OK] Nessuna modifica DACL su Prefetch."])

    # ------ [08] Spoofed Extensions (Unicode) ------
    out = os.path.join(root_dir, "08_ExtSpoofed", f"ExtSpoofed_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [08] - CARATTERI NON-ASCII / ESTENSIONI SPOOFATE [{dl}]",
                    "Nomi file con '?' = carattere Unicode non-ASCII",
                    win_name, win_build, days, date_limit)
    rows = [l for l in filtered if "?" in l]
    if rows:
        write_block(out, [f"  [!!!] {l}" for l in rows])
    else:
        write_block(out, ["  [OK] Nessun nome file sospetto."])

    # ------ [09] Executables Deleted + Recycle Bin ------
    out = os.path.join(root_dir, "09_CestinoExe", f"CestinoExe_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [09] - ESEGUIBILI ELIMINATI [{dl}]",
                    f"Exe/Jar/Dll rimossi senza cestino (FLAG: {USN_FLAG_DELETE})",
                    win_name, win_build, days, date_limit)
    rows = match_journal(filtered, USN_FLAG_DELETE)
    rows = [l for l in rows if PAT_BINARY.search(l)]
    if rows:
        write_block(out, [f"  [!!!] {l}" for l in rows])
    else:
        write_block(out, ["  [OK] Nessun eseguibile eliminato direttamente."])

    # Physical recycle bin scan
    out_bin = os.path.join(root_dir, "09_CestinoExe", f"Cestino_Fisico_{dl}_{ts}.txt")
    new_report_file(out_bin, f"CESTINO FISICO [{dl}]",
                    "File eseguibili ancora nel $Recycle.Bin",
                    win_name, win_build, days, date_limit)
    drive_root = drive_letter.rstrip("\\") + "\\"
    recycle_path = os.path.join(drive_root, "$Recycle.Bin")
    bin_items = []
    if os.path.exists(recycle_path):
        try:
            for dirpath, _, filenames in os.walk(recycle_path):
                for fn in filenames:
                    fp = os.path.join(dirpath, fn)
                    ext = os.path.splitext(fn)[1].lower()
                    if ext in (".exe", ".jar", ".dll", ".bat", ".cmd", ".zip", ".rar", ".pif"):
                        try:
                            mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                            if mtime >= date_limit:
                                bin_items.append((mtime, fn, fp))
                        except OSError:
                            pass
        except PermissionError:
            pass
    if bin_items:
        formatted = [
            f"  [!!!] {dt.strftime('%d/%m/%Y %H:%M:%S')}  |  {name}  |  {fp}"
            for dt, name, fp in sorted(bin_items, reverse=True)
        ]
        write_block(out_bin, formatted)
    else:
        write_block(out_bin, [f"  [OK] Cestino vuoto di eseguibili per drive {dl}."])

    # ------ [10] Replace Cheat -> Legit ------
    out = os.path.join(root_dir, "10_Replace", f"Replace_{dl}_{ts}.txt")
    new_report_file(out, f"JOURNAL [10] - REPLACE CHEAT->LEGIT [{dl}]",
                    "DELETE + RENAME sullo stesso filename (pattern sostituzione rapida)",
                    win_name, win_build, days, date_limit)

    # Group events by filename
    by_name: Dict[str, List[str]] = defaultdict(list)
    all_flags_re = f"{USN_FLAG_DELETE}|{USN_FLAG_RENAME_OLD}|{USN_FLAG_RENAME_NEW}"
    for line in filtered:
        if not any(p in line for p in ["0x80000200", "0x00001000", "0x00002000"]):
            continue
        if not re.search(r'\.(exe|jar|dll)\b', line, re.IGNORECASE):
            continue
        parts = _get_parts(line)
        if len(parts) >= 3:
            fname = os.path.basename(parts[2])
            if fname:
                by_name[fname].append(line)

    replace_lines = []
    replace_count = 0
    for fname, events in by_name.items():
        if len(events) >= 2:
            has_del = any(USN_FLAG_DELETE in e for e in events)
            has_ren = any(USN_FLAG_RENAME_OLD in e or USN_FLAG_RENAME_NEW in e for e in events)
            if has_del and has_ren:
                label = "[!!!] REPLACE PROBABILE (DELETE+RENAME)"
            else:
                label = "[ ? ] SOSPETTO (eventi multipli)"
            replace_lines.append(f"  {label} : {fname}  ({len(events)} eventi)")
            replace_lines.append(f"  {'-' * 60}")
            for ev in events:
                replace_lines.append(f"       {ev}")
            replace_lines.append("")
            replace_count += 1

    if replace_count > 0:
        write_block(out, replace_lines)
    else:
        write_block(out, [f"  [OK] Nessun replace rilevato per drive {dl}."])

    show_step(f"JOURNAL [{dl}]", "Completato. Sezioni 01-10 scritte.", "green")
