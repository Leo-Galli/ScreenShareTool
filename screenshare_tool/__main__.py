"""
CharlieRP ScreenShareTool v4.0.0 — Main Entry Point

Usage:
    python -m screenshare_tool                 # Auto-detects GUI when available
    python -m screenshare_tool --gui           # Force GUI
    python -m screenshare_tool --days 7        # CLI mode
    python -m screenshare_tool --days 7 --gui  # GUI mode with preset
"""

import os
import sys
import argparse
from datetime import datetime, timedelta

from . import __version__


def _fix_console_encoding() -> None:
    """Force UTF-8 on stdout/stderr to prevent UnicodeEncodeError on legacy consoles."""
    for stream_name in ("stdout", "stderr"):
        stream = getattr(sys, stream_name, None)
        if stream is None:
            continue
        try:
            if hasattr(stream, "reconfigure"):
                stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass


def _launch_gui(initial_days: int = 0) -> None:
    """Attempt to launch the CustomTkinter GUI; fall back to CLI on ImportError."""
    try:
        from .gui import launch_gui
        launch_gui()
    except ImportError as exc:
        print(f"  [!] GUI non disponibile: {exc}")
        print("  Installa: pip install customtkinter")
        print("  Avvio in modalita CLI...")
        _run_cli(days=initial_days, output="", quick=False)


def _run_cli(days: int, output: str, quick: bool) -> None:
    """Run the full scan in CLI / console mode."""
    # Windows-only: require admin
    if sys.platform == "win32":
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

    # Get days interactively if not provided
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
    show_info(f"Intervallo: dal {date_limit.strftime('%d/%m/%Y %H:%M:%S')}  -->  oggi  ({days} giorni)")
    print()

    # CLI-mode callbacks
    def cli_on_log(msg: str) -> None:
        show_info(msg)

    def cli_on_progress(module_id: str, status: str, detail: str) -> None:
        color_map = {
            "done":    "green",
            "error":   "red",
            "skipped": "yellow",
            "running": "cyan",
        }
        show_step(module_id.upper(), f"[{status.upper()}] {detail}",
                  color_map.get(status, "cyan"))

    from .engine import run_scan
    results = run_scan(
        days=days,
        output_dir=output,
        quick=quick,
        on_progress=cli_on_progress,
        on_log=cli_on_log,
    )

    # ── Final summary ──────────────────────────────────────────────────────
    mc_data    = results.get("mc_data", {})
    n_accounts = len(mc_data.get("all_accounts", []))
    n_ias      = mc_data.get("total_ias", 0)
    n_nicks    = len(results.get("global_nicks", []))
    n_cheat    = len(results.get("cheat_alerts", []))
    root_dir   = results.get("root_dir", "")
    dashboard  = results.get("dashboard_path")

    print()
    print(f"  {'_' * 66}")
    print()
    print(f"  {Color.GREEN}[ COMPLETATO ]{Color.RESET} Tutti i moduli sono stati eseguiti.")
    print()
    print(f"  Sistema    : {results.get('win_name', sys.platform)}")
    print(f"  Intervallo : ultimi {days} giorni")
    print(f"  Output     : {root_dir}")
    if dashboard:
        print(f"  Dashboard  : {dashboard}")
    print()
    print(f"  {Color.CYAN}{'=' * 66}{Color.RESET}")
    print(f"  {Color.CYAN}  RIEPILOGO RISULTATI{Color.RESET}")
    print(f"  {Color.CYAN}{'=' * 66}{Color.RESET}")
    print()
    print(f"  Account launcher trovati  : {n_accounts}")
    print(f"  Cambi account IAS         : {n_ias}")
    print(f"  Nickname univoci trovati  : {n_nicks}")
    print(f"  Alert di autodistruzione  : {n_cheat}")
    print()

    if n_accounts > 1:
        print(f"  {Color.YELLOW}[!] Rilevati piu account launcher — possibile multiaccounting.{Color.RESET}")
    if n_ias > 1:
        print(f"  {Color.YELLOW}[!] Cambi account IAS nei log — verificare.{Color.RESET}")
    if n_cheat > 0:
        print(f"  {Color.RED}[!!!] Rilevate {n_cheat} tracce di cheat/autodistruzione.{Color.RESET}")
        for alert in results.get("cheat_alerts", [])[:15]:
            print(f"        - [{alert.get('tipo', '')}] {alert.get('cheat', '')} | {alert.get('dettaglio', '')}")

    print()
    print(f"  Report completi in: {Color.CYAN}{root_dir}{Color.RESET}")
    print()

    # Open dashboard automatically
    if dashboard:
        try:
            if hasattr(os, "startfile"):
                os.startfile(dashboard)  # type: ignore[attr-defined]
            else:
                import webbrowser
                webbrowser.open(f"file:///{dashboard}")
        except Exception:
            pass

    input("\n  Premi Invio per chiudere...")


def main() -> None:
    """Primary entry point."""
    _fix_console_encoding()

    parser = argparse.ArgumentParser(
        description="ScreenShareTool — Analisi forense anti-cheat",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--days", "-d", type=int, default=0,
                        help="Giorni da analizzare (0 = richiede input)")
    parser.add_argument("--output", "-o", type=str, default="",
                        help="Cartella di output (default: C:\\CharlieRP_SS)")
    parser.add_argument("--quick", action="store_true",
                        help="Salta Journal e moduli lenti")
    parser.add_argument("--gui", action="store_true",
                        help="Avvia l'interfaccia grafica CustomTkinter")
    parser.add_argument("--version", "-v", action="store_true",
                        help="Stampa la versione ed esce")
    args = parser.parse_args()

    if args.version:
        print(f"ScreenShareTool v{__version__}")
        sys.exit(0)

    # Auto-launch GUI when no arguments are given (packaged exe / double-click)
    no_args = len(sys.argv) == 1
    if args.gui or no_args:
        _launch_gui(initial_days=args.days)
        return

    # Explicit CLI mode
    _run_cli(days=args.days, output=args.output, quick=args.quick)


if __name__ == "__main__":
    main()
