"""
Macro software detection module.

Scans for known gaming/macro software installations:
Razer Synapse, Logitech G HUB, Corsair iCUE, ROCCAT, Bloody, etc.
"""

import os
from datetime import datetime
from typing import List, Optional

from .config import MACRO_PATHS
from .utils import new_report_file, show_step, write_block


def analyze_macros(date_limit: datetime, days: int,
                   root_dir: str, ts: str, win_name: str, win_build: int):
    """Scan for macro/gaming software installations."""
    show_step("MACRO", "Ricerca software macro/gaming...")

    out = os.path.join(root_dir, "13_Macro", f"Macro_{ts}.txt")
    new_report_file(out, "MACRO [13] - SOFTWARE RILEVATO",
                    "Razer, Logitech, Corsair, ROCCAT, BY-COMBO2, JM01, Bloody",
                    win_name, win_build, days, date_limit)

    lines = []
    for path, name in MACRO_PATHS.items():
        if os.path.exists(path):
            try:
                stat = os.stat(path)
                mtime = datetime.fromtimestamp(stat.st_mtime)
                in_range = mtime >= date_limit
                tag = "[!!!] MODIFICATO NELL'INTERVALLO" if in_range else "[ - ] trovato (fuori intervallo)"
                lines.append(f"  {tag}")
                lines.append(f"        Software        : {name}")
                lines.append(f"        Path            : {path}")
                lines.append(f"        Ultima modifica : {mtime.strftime('%d/%m/%Y %H:%M:%S')}")
                lines.append("")
            except OSError:
                lines.append(f"  [   ] errore lettura : {name}")
        else:
            lines.append(f"  [   ] assente : {name}")

    write_block(out, lines)
    show_step("MACRO", "Completato.", "green")
