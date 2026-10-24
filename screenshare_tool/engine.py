"""
ScreenShareTool v4.0.0 — Scan Engine
Parallel orchestration for CLI and GUI.
"""

from __future__ import annotations

import os
import sys
import platform
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta
from typing import Any, Callable, Dict, List, Optional, Tuple

IS_WINDOWS = sys.platform == "win32"

MODULE_JOURNAL = "journal"
MODULE_REGISTRY = "registry"
MODULE_BAM = "bam"
MODULE_PREFETCH = "prefetch"
MODULE_MACRO = "macro"
MODULE_MINECRAFT = "minecraft"
MODULE_EVENTS = "events"
MODULE_SYSTEM = "system"
MODULE_NETWORK = "network"
MODULE_CHEAT = "cheat"
MODULE_NICKS = "nicks"
MODULE_DASHBOARD = "dashboard"

ALL_MODULES: List[str] = [
    MODULE_JOURNAL, MODULE_REGISTRY, MODULE_BAM, MODULE_PREFETCH,
    MODULE_MACRO, MODULE_MINECRAFT, MODULE_EVENTS, MODULE_SYSTEM,
    MODULE_NETWORK, MODULE_CHEAT, MODULE_NICKS, MODULE_DASHBOARD,
]


def _list_drives() -> List[str]:
    if not IS_WINDOWS:
        return []
    drives = []
    for letter in "CDEFGHIJKLMNOPQRSTUVWXYZ":
        root = f"{letter}:\\"
        if os.path.isdir(root):
            drives.append(root)
    return drives


def run_scan(
    days: int,
    output_dir: str = "",
    quick: bool = False,
    on_progress: Optional[Callable[[str, str, str], None]] = None,
    on_log: Optional[Callable[[str], None]] = None,
) -> Dict[str, Any]:
    def _log(msg: str) -> None:
        if on_log:
            on_log(msg)

    def _progress(module_id: str, status: str, detail: str = "") -> None:
        if on_progress:
            on_progress(module_id, status, detail)

    from .config import OUTPUT_DIRS

    date_limit = datetime.now() - timedelta(days=days)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    if IS_WINDOWS:
        win_ver = platform.version()
        _build_str = win_ver.split(".")[-1]
        win_build = int(_build_str) if _build_str.isdigit() else 0
        win_name = f"Windows {platform.release()}"
        _rel = platform.release().split(".")[0]
        is_win10 = int(_rel) >= 10 if _rel.isdigit() else False
    else:
        win_build = 0
        win_name = f"{platform.system()} {platform.release()}"
        is_win10 = False

    root_dir = output_dir.strip() if output_dir.strip() else (
        os.path.join(os.environ.get("SystemDrive", "C:"), "ScreenShareTool_SS")
        if IS_WINDOWS else "/tmp/ScreenShareTool_SS"
    )

    for d in OUTPUT_DIRS:
        os.makedirs(os.path.join(root_dir, d), exist_ok=True)

    _log(f"Cartella di output : {root_dir}")
    _log(f"Intervallo         : ultimi {days} giorni")
    _log(f"Piattaforma        : {win_name}")
    if quick:
        _log("Modalita           : rapida")

    results: Dict[str, Any] = {
        "root_dir": root_dir,
        "days": days,
        "date_limit": date_limit,
        "win_name": win_name,
        "win_build": win_build,
        "bam_total": 0,
        "pf_in_range": 0,
        "macro_data": {},
        "mc_data": {},
        "event_data": {},
        "sys_info": {},
        "net_data": {},
        "cheat_alerts": [],
        "global_nicks": [],
        "dashboard_path": None,
        "success": True,
        "errors": [],
    }

    drives = _list_drives()

    # ── Phase 1: independent modules in parallel ───────────────────────────
    def job_journal():
        if not IS_WINDOWS:
            _progress(MODULE_JOURNAL, "skipped", "Solo Windows")
            return None
        if quick:
            _progress(MODULE_JOURNAL, "skipped", "Saltato (scan rapido)")
            return None
        from .journal import analyze_journal
        _progress(MODULE_JOURNAL, "running", f"Analisi {len(drives)} drive…")
        # Parallel per-drive journal reads
        with ThreadPoolExecutor(max_workers=min(4, max(1, len(drives)))) as pool:
            futs = [
                pool.submit(analyze_journal, drv, date_limit, days, root_dir, ts, win_name, win_build)
                for drv in drives
            ]
            for f in as_completed(futs):
                f.result()
        _progress(MODULE_JOURNAL, "done", f"{len(drives)} drive")
        return None

    def job_registry():
        if not IS_WINDOWS:
            _progress(MODULE_REGISTRY, "skipped", "Solo Windows")
            return None
        from .registry import analyze_registry
        _progress(MODULE_REGISTRY, "running", "Registro…")
        analyze_registry(date_limit, days, root_dir, ts, win_name, win_build, is_win10)
        _progress(MODULE_REGISTRY, "done", "OK")
        return None

    def job_bam():
        if not IS_WINDOWS:
            _progress(MODULE_BAM, "skipped", "Solo Windows")
            return 0
        from .bam import analyze_bam
        _progress(MODULE_BAM, "running", "BAM…")
        total = analyze_bam(date_limit, days, root_dir, ts, win_name, win_build) or 0
        _progress(MODULE_BAM, "done", f"{total} esecuzioni")
        return total

    def job_prefetch():
        if not IS_WINDOWS:
            _progress(MODULE_PREFETCH, "skipped", "Solo Windows")
            return 0
        from .prefetch import analyze_prefetch
        _progress(MODULE_PREFETCH, "running", "Prefetch…")
        n = analyze_prefetch(date_limit, days, root_dir, ts, win_name, win_build) or 0
        _progress(MODULE_PREFETCH, "done", f"{n} file")
        return n

    def job_macro():
        from .macro import analyze_macros
        _progress(MODULE_MACRO, "running", "Macro…")
        data = analyze_macros(date_limit, days, root_dir, ts, win_name, win_build) or {}
        n = len(data.get("found", [])) if isinstance(data, dict) else 0
        _progress(MODULE_MACRO, "done", f"{n} rilevati" if n else "Nessuno")
        return data

    def job_minecraft():
        from .minecraft import analyze_minecraft
        _progress(MODULE_MINECRAFT, "running", "Minecraft…")
        data = analyze_minecraft(date_limit, days, root_dir, ts, win_name, win_build) or {}
        n_acc = len(data.get("all_accounts", []))
        n_ias = data.get("total_ias", 0)
        _progress(MODULE_MINECRAFT, "done", f"{n_acc} account, {n_ias} IAS")
        return data

    def job_events():
        if not IS_WINDOWS:
            _progress(MODULE_EVENTS, "skipped", "Solo Windows")
            return {}
        if quick:
            _progress(MODULE_EVENTS, "skipped", "Saltato (scan rapido)")
            return {}
        from .events import analyze_events
        _progress(MODULE_EVENTS, "running", "Event log…")
        data = analyze_events(date_limit, days, root_dir, ts, win_name, win_build) or {}
        _progress(MODULE_EVENTS, "done", "OK")
        return data

    def job_system():
        from .system import get_system_info, analyze_system
        _progress(MODULE_SYSTEM, "running", "Sistema…")
        info = get_system_info() or {}
        analyze_system(date_limit, days, root_dir, ts, win_name, win_build, info)
        _progress(MODULE_SYSTEM, "done", "OK")
        return info

    def job_network():
        from .network import analyze_network
        _progress(MODULE_NETWORK, "running", "Rete…")
        data = analyze_network(date_limit, days, root_dir, ts, win_name, win_build) or {}
        _progress(MODULE_NETWORK, "done", "OK")
        return data

    jobs = [
        (MODULE_JOURNAL, job_journal),
        (MODULE_REGISTRY, job_registry),
        (MODULE_BAM, job_bam),
        (MODULE_PREFETCH, job_prefetch),
        (MODULE_MACRO, job_macro),
        (MODULE_MINECRAFT, job_minecraft),
        (MODULE_EVENTS, job_events),
        (MODULE_SYSTEM, job_system),
        (MODULE_NETWORK, job_network),
    ]

    workers = min(8, max(4, (os.cpu_count() or 4)))
    with ThreadPoolExecutor(max_workers=workers) as pool:
        future_map = {pool.submit(fn): mid for mid, fn in jobs}
        for fut in as_completed(future_map):
            mid = future_map[fut]
            try:
                value = fut.result()
                if mid == MODULE_BAM:
                    results["bam_total"] = value or 0
                elif mid == MODULE_PREFETCH:
                    results["pf_in_range"] = value or 0
                elif mid == MODULE_MACRO:
                    results["macro_data"] = value or {}
                elif mid == MODULE_MINECRAFT:
                    results["mc_data"] = value or {}
                elif mid == MODULE_EVENTS:
                    results["event_data"] = value or {}
                elif mid == MODULE_SYSTEM:
                    results["sys_info"] = value or {}
                elif mid == MODULE_NETWORK:
                    results["net_data"] = value or {}
            except Exception as exc:
                results["errors"].append((mid, str(exc)))
                _log(f"[ {mid} ] ERRORE: {exc}")
                _progress(mid, "error", str(exc)[:80])

    # ── Phase 2: cheat (needs drives) ──────────────────────────────────────
    _progress(MODULE_CHEAT, "running", "Cheat / autodistruzione…")
    try:
        from .cheat import analyze_cheat_selfdestruct
        results["cheat_alerts"] = analyze_cheat_selfdestruct(
            date_limit, days, root_dir, ts, win_name, win_build, drives
        ) or []
        n_cheat = len(results["cheat_alerts"])
        _progress(MODULE_CHEAT, "done", f"{n_cheat} alert" if n_cheat else "Nessun alert")
    except Exception as exc:
        results["errors"].append(("cheat", str(exc)))
        _progress(MODULE_CHEAT, "error", str(exc)[:80])

    # ── Phase 3: nicks (needs mc_data) ─────────────────────────────────────
    _progress(MODULE_NICKS, "running", "Nickname…")
    try:
        from .nick_search import search_nicks
        mc = results["mc_data"]
        results["global_nicks"] = search_nicks(
            mc.get("all_accounts", []),
            mc.get("ias_log_entries", []),
            mc.get("found_launchers", []),
            date_limit,
            quick=quick,
        ) or []
        _progress(MODULE_NICKS, "done", f"{len(results['global_nicks'])} nick")
    except Exception as exc:
        results["errors"].append(("nicks", str(exc)))
        _progress(MODULE_NICKS, "error", str(exc)[:80])

    # ── Phase 4: dashboard ─────────────────────────────────────────────────
    _progress(MODULE_DASHBOARD, "running", "Report HTML…")
    try:
        from .dashboard import generate_dashboard
        results["dashboard_path"] = generate_dashboard(
            mc_data=results["mc_data"],
            bam_total=results["bam_total"],
            pf_in_range=results["pf_in_range"],
            event_data=results["event_data"],
            sys_info=results["sys_info"],
            net_data=results["net_data"],
            cheat_alerts=results["cheat_alerts"],
            global_nicks=results["global_nicks"],
            macro_data=results["macro_data"],
            win_name=win_name,
            win_build=win_build,
            days=days,
            date_limit=date_limit,
            root_dir=root_dir,
            ts=ts,
        )
        _progress(MODULE_DASHBOARD, "done", "OK")
    except Exception as exc:
        results["errors"].append(("dashboard", str(exc)))
        _progress(MODULE_DASHBOARD, "error", str(exc)[:80])

    if results["errors"]:
        results["success"] = False

    return results
