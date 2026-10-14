"""
CharlieRP ScreenShareTool v3.1 — Main Entry Point

Usage:
    python -m screenshare_tool
    python -m screenshare_tool --days 7
    python -m screenshare_tool --output C:\\MyOutput
"""

import os
import sys
import time
import argparse
from datetime import datetime, timedelta

from . import __version__
from .config import OUTPUT_DIRS


def _fix_console_encoding():
    """
    Force UTF-8 output on stdout/stderr so accented Italian characters
    (à, è, ì, ò, ù) never raise UnicodeEncodeError on a legacy Windows
    console codepage or a frozen executable. Safe no-op everywhere else
    (redirected output, older Python without reconfigure, non-TTY streams).
    """
    for stream_name in ("stdout", "stderr"):
        stream = getattr(sys, stream_name, None)
        if stream is None:
            continue
        try:
            if hasattr(stream, "reconfigure"):
                stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            # Never let an encoding tweak crash the tool.
            pass


def main():
    """Main entry point for the ScreenShareTool."""

    # Must run before any print(): guarantees accented characters never
    # crash the console, even on a frozen .exe with a legacy codepage.
    _fix_console_encoding()

    # Parse CLI arguments
    parser = argparse.ArgumentParser(
        description="CharlieRP ScreenShareTool — Analisi forense anti-cheat",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--days", "-d", type=int, default=0,
                        help="Numero di giorni da analizzare (se 0, viene richiesto a schermo)")
    parser.add_argument("--output", "-o", type=str, default="",
                        help="Cartella di output principale (default: C:\\CharlieRP_SS)")
    parser.add_argument("--quick", action="store_true",
                        help="Salta i moduli più lenti (journal, cronologia browser, ricerca nickname completa)")
    parser.add_argument("--version", "-v", action="store_true",
                        help="Stampa la versione ed esce")
    args = parser.parse_args()

    if args.version:
        print(f"CharlieRP ScreenShareTool v{__version__}")
        sys.exit(0)

    # Ensure Windows
    if sys.platform != "win32":
        print("  [ERRORE] Questo strumento funziona solo su Windows.")
        sys.exit(1)

    # Ensure admin
    try:
        import ctypes
        if not ctypes.windll.shell32.IsUserAnAdmin():
            print("  [ERRORE] Avvia lo script come Amministratore.")
            sys.exit(1)
    except Exception:
        print("  [ERRORE] Impossibile verificare i privilegi di amministratore.")
        sys.exit(1)

    # Enable ANSI colors on Windows 10+ consoles
    try:
        os.system("")
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

    show_info(f"Sistema rilevato : {win_name} (Build {win_build})")
    print()

    # Get analysis interval
    days = args.days
    if days <= 0:
        while True:
            try:
                inp = input("  Quanti giorni indietro vuoi analizzare? (es. 1, 7, 30, 90): ").strip()
                days = int(inp)
                if days > 0:
                    break
            except (ValueError, EOFError):
                pass
            print("  Inserisci un numero intero positivo.")

    date_limit = datetime.now() - timedelta(days=days)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    print()
    show_info(f"Intervallo: dal {date_limit.strftime('%d/%m/%Y %H:%M:%S')}  -->  oggi  ({days} giorni)")
    print()

    # Create output directories
    root_dir = args.output if args.output else os.path.join(
        os.environ.get("SystemDrive", "C:"), "CharlieRP_SS"
    )
    for d in OUTPUT_DIRS:
        os.makedirs(os.path.join(root_dir, d), exist_ok=True)

    show_step("SISTEMA", f"Cartella di output: {root_dir}")
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
    #  MODULE 11b: BAM / ULTIME ESECUZIONI (parser avanzato stile AstroSS)
    # ================================================================
    from .bam import analyze_bam
    bam_total = analyze_bam(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 12: Prefetch
    # ================================================================
    from .prefetch import analyze_prefetch
    pf_in_range = analyze_prefetch(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 13: Software macro/gaming
    # ================================================================
    from .macro import analyze_macros
    macro_data = analyze_macros(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 14: Minecraft
    # ================================================================
    from .minecraft import analyze_minecraft
    mc_data = analyze_minecraft(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 15: Varie (Event log, cronologia PowerShell, utenti, ecc.)
    # ================================================================
    from .events import analyze_events
    event_data = analyze_events(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 16: Informazioni di sistema
    # ================================================================
    from .system import get_system_info, analyze_system
    sys_info = get_system_info()
    analyze_system(date_limit, days, root_dir, ts, win_name, win_build, sys_info)

    # ================================================================
    #  MODULE 17: Rete
    # ================================================================
    from .network import analyze_network
    net_data = analyze_network(date_limit, days, root_dir, ts, win_name, win_build)

    # ================================================================
    #  MODULE 18: Autodistruzione cheat client
    # ================================================================
    from .cheat import analyze_cheat_selfdestruct
    cheat_alerts = analyze_cheat_selfdestruct(
        date_limit, days, root_dir, ts, win_name, win_build, drives
    )

    # ================================================================
    #  RICERCA NICKNAME
    # ================================================================
    from .nick_search import search_nicks
    global_nicks = search_nicks(
        mc_data.get("all_accounts", []),
        mc_data.get("ias_log_entries", []),
        mc_data.get("found_launchers", []),
        date_limit,
    )

    # ================================================================
    #  DASHBOARD HTML FINALE
    # ================================================================
    from .dashboard import generate_dashboard

    dashboard_path = None
    try:
        dashboard_path = generate_dashboard(
            mc_data=mc_data,
            bam_total=bam_total,
            pf_in_range=pf_in_range,
            event_data=event_data,
            sys_info=sys_info,
            net_data=net_data,
            cheat_alerts=cheat_alerts,
            global_nicks=global_nicks,
            macro_data=macro_data,
            win_name=win_name,
            win_build=win_build,
            days=days,
            date_limit=date_limit,
            root_dir=root_dir,
            ts=ts,
        )
        show_step("DASHBOARD", f"Report HTML generato: {dashboard_path}", "green")
    except Exception as exc:
        show_step("DASHBOARD", f"Impossibile generare la dashboard HTML ({exc}).", "yellow")

    if dashboard_path:
        try:
            if hasattr(os, "startfile"):
                os.startfile(dashboard_path)  # type: ignore[attr-defined]
            else:
                import webbrowser
                webbrowser.open(f"file://{dashboard_path}")
        except Exception:
            # Never let the inability to open a browser abort the scan.
            show_step("DASHBOARD", "Apertura automatica non riuscita, apri il file manualmente.", "yellow")

    # ================================================================
    #  RIEPILOGO FINALE
    # ================================================================
    print()
    print(f"  {'_' * 66}")
    print()
    print(f"  {Color.GREEN}[ COMPLETATO ]{Color.RESET} Tutti i moduli sono stati eseguiti con successo.")
    print()
    print(f"  Sistema    : {win_name} (Build {win_build})")
    print(f"  Intervallo : ultimi {days} giorni")
    print(f"  Output     : {root_dir}")
    if dashboard_path:
        print(f"  Dashboard  : {dashboard_path}")
    print()

    # Key findings summary
    print(f"  {Color.CYAN}{'=' * 66}{Color.RESET}")
    print(f"  {Color.CYAN}  RIEPILOGO RISULTATI{Color.RESET}")
    print(f"  {Color.CYAN}{'=' * 66}{Color.RESET}")
    print()

    n_accounts = len(mc_data.get("all_accounts", []))
    n_ias = mc_data.get("total_ias", 0)
    n_nicks = len(global_nicks)
    n_cheat = len(cheat_alerts)

    print(f"  Account launcher trovati  : {n_accounts}")
    print(f"  Cambi account IAS         : {n_ias}")
    print(f"  Nickname univoci trovati  : {n_nicks}")
    print(f"  Alert di autodistruzione  : {n_cheat}")
    print()

    if n_accounts > 1:
        print(f"  {Color.YELLOW}[!] Attenzione: rilevati più account launcher - verificare possibile multiaccounting.{Color.RESET}")
    if n_ias > 1:
        print(f"  {Color.YELLOW}[!] Attenzione: rilevati cambi account IAS nei log - verificare.{Color.RESET}")
    if n_cheat > 0:
        print(f"  {Color.RED}[!!!] Rilevate {n_cheat} tracce di cheat/autodistruzione.{Color.RESET}")
        for a in cheat_alerts[:15]:
            print(f"        - [{a.get('tipo', '')}] {a.get('cheat', '')} | {a.get('dettaglio', '')}")

    print()
    print(f"  Report completi salvati in: {Color.CYAN}{root_dir}{Color.RESET}")
    print(f"  Apri la cartella per consultare tutti i file generati,")
    print(f"  oppure consulta la dashboard HTML per una vista riassuntiva.")
    print()

    input("\n  Premi Invio per chiudere...")


if __name__ == "__main__":
    main()
