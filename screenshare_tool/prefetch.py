"""
Prefetch analysis module.

Checks EnablePrefetcher status, lists .pf files with date filtering,
and detects read-only files in the Prefetch directory.
"""

import os
import subprocess
from datetime import datetime
from typing import List

from .utils import (
    new_report_file, run_cmd, show_step, write_block,
    safe_get_reg_hklm,
)


def analyze_prefetch(date_limit: datetime, days: int,
                     root_dir: str, ts: str, win_name: str, win_build: int) -> int:
    """
    Run all Prefetch analysis (12a-12c).
    Returns the count of .pf files in the date range.
    """
    show_step("PREFETCH", "Stato abilitazione e lista .pf...")

    pf_dir = r"C:\Windows\Prefetch"

    # ---- [12a] EnablePrefetcher status ----
    out = os.path.join(root_dir, "12_Prefetch", f"Status_{ts}.txt")
    new_report_file(out, "PREFETCH [12a] - STATO ABILITAZIONE",
                    r"HKLM\...\PrefetchParameters -> EnablePrefetcher",
                    win_name, win_build, days, date_limit)

    pf_val = safe_get_reg_hklm(
        r"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters",
        "EnablePrefetcher"
    )
    if pf_val is None:
        pf_val = -1

    pf_desc_map = {
        0: "[!!!] DISABILITATO - ALTAMENTE SOSPETTO (nasconde tutti gli avvii .exe)",
        1: "[ATT] Solo applicazioni (non standard)",
        2: "[ATT] Solo boot (non standard)",
        3: "[OK]  Abilitato normalmente (default Windows)",
    }
    pf_desc = pf_desc_map.get(pf_val, f"[ATT] Valore anomalo: {pf_val}")
    write_block(out, [
        f"  Valore EnablePrefetcher : {pf_val}",
        f"  Stato                  : {pf_desc}"
    ])

    # ---- [12b] Read-only files ----
    out = os.path.join(root_dir, "12_Prefetch", f"SolaLettura_{ts}.txt")
    new_report_file(out, "PREFETCH [12b] - FILE IN SOLA LETTURA",
                    f"dir /Ar {pf_dir}",
                    win_name, win_build, days, date_limit)
    ro_output = run_cmd(f'dir /Ar "{pf_dir}"')
    write_block(out, [f"  {l}" for l in ro_output] if ro_output else ["  [--] Nessun file in sola lettura."])

    # ---- [12c] Complete .pf list ----
    out = os.path.join(root_dir, "12_Prefetch", f"Lista_{ts}.txt")
    new_report_file(out, "PREFETCH [12c] - LISTA COMPLETA .PF",
                    f"{pf_dir} - dal piu' recente",
                    win_name, win_build, days, date_limit)

    pf_lines = []
    pf_in_range = 0
    if os.path.exists(pf_dir):
        pf_files = []
        for fn in os.listdir(pf_dir):
            if fn.lower().endswith(".pf"):
                fp = os.path.join(pf_dir, fn)
                try:
                    mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                    pf_files.append((mtime, fn))
                except OSError:
                    pass
        pf_files.sort(key=lambda x: x[0], reverse=True)

        for mtime, fn in pf_files:
            in_range = mtime >= date_limit
            if in_range:
                pf_in_range += 1
                tag = "[>>>]"
            else:
                tag = " [  ]"
            pf_lines.append(f"  {tag}  {mtime.strftime('%d/%m/%Y %H:%M:%S')}  |  {fn}")

    pf_lines.append("")
    pf_lines.append(f"  File .pf nell'intervallo ({days} gg): {pf_in_range}")
    write_block(out, pf_lines)

    show_step("PREFETCH", f"Completato. {pf_in_range} .pf nell'intervallo.", "green")
    return pf_in_range
