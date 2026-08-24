"""
CharlieRP ScreenShareTool v3.0 — Main Entry Point

Usage:
    python -m screenshare_tool
    python -m screenshare_tool --days 7
    python -m screenshare_tool --output C:\\MyOutput
"""

import os
import sys
import time
import argparse
from datetime import datetime

from . import __version__
from .config import OUTPUT_DIRS, MACRO_PATHS


def main():
    """Main entry point for the ScreenShareTool."""

    # Parse CLI arguments
    parser = argparse.ArgumentParser(
        description="CharlieRP ScreenShareTool — Analisi forense anti-cheat",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--days", "-d", type=int, default=0,
                        help="Number of days to analyze (if 0, prompts user)")
    parser.add_argument("--output", "-o", type=str, default="",
                        help="Output root directory (default: C:\\CharlieRP_SS)")
    parser.add_argument("--no-open", action="store_true",
                        help="Don't auto-open the dashboard in browser")
    parser.add_argument("--version", "-v", action="store_true",
                        help="Print version and exit")
    args = parser.parse_args()

    if args.version:
        print(f"CharlieRP ScreenShareTool v{__version__}")
        sys.exit(0)

    # Ensure Windows
    if sys.platform != "win32":
        print("ERROR: This tool only runs on Windows.")
        sys.exit(1)

    # Ensure admin
    try:
        import ctypes
        if not ctypes.windll.shell32.IsUserAnAdmin():
            print("  [ERRORE] Avvia lo script come Amministratore.")
            sys.exit(1)
    except Exception:
        print("  [ERRORE] Impossibile verificare privilegi amministratore.")
        sys.exit(1)

    # Set console encoding
    try:
        os.system("")  # Enable ANSI on Windows 10+
    except Exception:
        pass

    from .utils import show_banner, show_step, show_info, Color

    show_banner()

    # Get Windows version info
    import platform
    win_ver = platform.version()
    win_build = int(win_ver.split(".")[-1]) if win_ver.split(".")[-1].isdigit() else 0
    win_name = f"Windows {platform.release()}"
    is_win10 = int(platform.release().split(".")[0]) >= 10 if platform.release().split(".")[0].isdigit() else False

    show_info(f"Sistema: {win_name} (Build {win_build})")
    print()

    # Get analysis interval
    days = args.days
    if days <= 0:
        while True:
            try:
                inp = input("  Quanti giorni indietro? (es. 1, 7, 30, 90): ").strip()
                days = int(inp)
                if days > 0:
                    break
            except (ValueError, EOFError):
                pass
            print("  Inserisci un numero positivo.")

    date_limit = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    from datetime import timedelta
    date_limit = datetime.now() - timedelta(days=days)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    print()
    show_info(f"Dal: {date_limit.strftime('%d/%m/%Y %H:%M:%S')}  -->  Oggi  ({days} giorni)")
    print()

    # Create output directories
    root_dir = args.output if args.output else os.path.join(
        os.environ.get("SystemDrive", "C:"), "CharlieRP_SS"
    )
    for d in OUTPUT_DIRS:
        os.makedirs(os.path.join(root_dir, d), exist_ok=True)

    show_step("SISTEMA", f"Output: {root_dir}")
    print()

    # ================================================================
    #  MODULE 1-10: NTFS Journal (per drive)
    # ================================================================
    from .journal import analyze_journal

    # Detect available drives
    drives = []
    for letter in "CDEFGHIJKLMNOPQRSTUVWXYZ":
        root_path = f"{letter}:\\"
        if os.path.isdir(root_path):
            drives.append(root_path)

    show_step("SISTEMA", f"Drive rilevati: {' | '.join(drives)}", "green")
    print()

    for drive in drives:
        analyze_journal(drive, date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 11: Registry
    # ================================================================
    from .registry import analyze_registry
    analyze_registry(date_limit, days, root_dir, ts, win_name, win_build, is_win10)

    # ================================================================
    #  MODULE 12: Prefetch
    # ================================================================
    from .prefetch import analyze_prefetch
    pf_in_range = analyze_prefetch(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 13: Macro Software
    # ================================================================
    from .macro import analyze_macros

    macro_data = []
    for path, name in MACRO_PATHS.items():
        if os.path.exists(path):
            try:
                mtime = datetime.fromtimestamp(os.path.getmtime(path))
                macro_data.append({
                    "name": name, "path": path,
                    "in_range": mtime >= date_limit,
                    "date": mtime.strftime("%d/%m/%Y %H:%M:%S"),
                })
            except OSError:
                pass

    analyze_macros(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 14: Minecraft
    # ================================================================
    from .minecraft import analyze_minecraft
    mc_data = analyze_minecraft(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 15: Misc (Events, PS History, etc.)
    # ================================================================
    from .events import analyze_events
    event_data = analyze_events(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 16: System Info
    # ================================================================
    from .system import get_system_info, analyze_system
    sys_info = get_system_info()
    analyze_system(date_limit, days, root_dir, ts, win_name, win_build, sys_info)

    # ================================================================
    #  MODULE 17: Network
    # ================================================================
    from .network import analyze_network
    net_data = analyze_network(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 18: Cheat Self-Destruction
    # ================================================================
    from .cheat import analyze_cheat_selfdestruct
    cheat_alerts = analyze_cheat_selfdestruct(
        date_limit, days, root_dir, ts, win_name, win_build, drives
    )

    # ================================================================
    #  NICK SEARCH
    # ================================================================
    from .nick_search import search_nicks
    global_nicks = search_nicks(
        mc_data.get("all_accounts", []),
        mc_data.get("ias_log_entries", []),
        mc_data.get("found_launchers", []),
        date_limit,
    )

    # ================================================================
    #  DASHBOARD HTML
    # ================================================================
    from .dashboard import generate_dashboard
    dash_path = generate_dashboard(
        date_limit, days, win_name, win_build, root_dir, ts,
        sys_info, net_data, mc_data, event_data,
        cheat_alerts, global_nicks, macro_data, pf_in_range,
    )

    # ================================================================
    #  FINAL SUMMARY
    # ================================================================
    print()
    print(f"  {'_' * 66}")
    print()
    print(f"  {Color.GREEN}[ COMPLETATO ]{Color.RESET} Tutti i moduli eseguiti con successo.")
    print()
    print(f"  Sistema   : {win_name}")
    print(f"  Intervallo: Ultimi {days} giorni")
    print(f"  Output    : {root_dir}")
    print(f"  Dashboard : {Color.CYAN}{dash_path}{Color.RESET}")
    print()

    # Auto-open dashboard
    if not args.no_open:
        try:
            os.startfile(dash_path)
        except Exception:
            pass

    input("\n  Premi Invio per chiudere...")


if __name__ == "__main__":
    main()
