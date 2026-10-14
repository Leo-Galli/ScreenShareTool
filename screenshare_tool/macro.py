"""
Macro software detection module.

Scans for known gaming/macro software installations:
Razer Synapse, Logitech G HUB, Corsair iCUE, ROCCAT, Bloody, etc.
"""

import os
from datetime import datetime
from typing import Dict, List, Optional

from .config import MACRO_PATHS
from .utils import new_report_file, show_step, write_block


def analyze_macros(date_limit: datetime, days: int,
                   root_dir: str, ts: str, win_name: str, win_build: int
                   ) -> List[Dict[str, object]]:
    """
    Scan for macro/gaming software installations.
    Returns the list of detected entries (used by the final HTML dashboard):
    [{"name", "path", "found", "in_range", "date"}, ...]
    """
    show_step("MACRO", "Ricerca software macro/gaming...")

    out = os.path.join(root_dir, "13_Macro", f"Macro_{ts}.txt")
    new_report_file(out, "MACRO [13] - SOFTWARE RILEVATO",
                    "Razer, Logitech, Corsair, ROCCAT, BY-COMBO2, JM01, Bloody",
                    win_name, win_build, days, date_limit)

    lines = []
    macro_data: List[Dict[str, object]] = []
    for path, name in MACRO_PATHS.items():
        if os.path.exists(path):
            try:
                stat = os.stat(path)
                mtime = datetime.fromtimestamp(stat.st_mtime)
                in_range = mtime >= date_limit
                tag = "[!!!] MODIFICATO NELL'INTERVALLO" if in_range else "[ - ] Trovato (fuori intervallo)"
                lines.append(f"  {tag}")
                lines.append(f"        Software        : {name}")
                lines.append(f"        Percorso        : {path}")
                lines.append(f"        Ultima modifica : {mtime.strftime('%d/%m/%Y %H:%M:%S')}")
                lines.append("")
                macro_data.append({
                    "name": name, "path": path, "found": True,
                    "in_range": in_range,
                    "date": mtime.strftime("%d/%m/%Y %H:%M:%S"),
                })
            except OSError:
                lines.append(f"  [ ?? ] Errore di lettura : {name}")
                macro_data.append({
                    "name": name, "path": path, "found": True,
                    "in_range": False, "date": "N/D",
                })
        else:
            lines.append(f"  [    ] Assente : {name}")

    write_block(out, lines)
    show_step("MACRO", "Completato.", "green")
    return macro_data
