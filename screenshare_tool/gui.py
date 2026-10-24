"""
ScreenShareTool v4.0.0 — GUI
Black / white-pill UI via pywebview (customtkinter fallback).
"""

from __future__ import annotations

import json
import os
import platform
import sys
import threading
import webbrowser
from pathlib import Path
from typing import Any, Dict, Optional

from . import __version__
from .engine import (
    MODULE_BAM,
    MODULE_CHEAT,
    MODULE_DASHBOARD,
    MODULE_EVENTS,
    MODULE_JOURNAL,
    MODULE_MACRO,
    MODULE_MINECRAFT,
    MODULE_NETWORK,
    MODULE_NICKS,
    MODULE_PREFETCH,
    MODULE_REGISTRY,
    MODULE_SYSTEM,
    run_scan,
)

_MODULES = [
    MODULE_JOURNAL, MODULE_REGISTRY, MODULE_BAM, MODULE_PREFETCH,
    MODULE_MACRO, MODULE_MINECRAFT, MODULE_EVENTS, MODULE_SYSTEM,
    MODULE_NETWORK, MODULE_CHEAT, MODULE_NICKS, MODULE_DASHBOARD,
]

_UI_PATH = Path(__file__).with_name("gui_ui.html")
_BG = "#000000"


def _is_admin() -> bool:
    if sys.platform != "win32":
        return bool(hasattr(os, "geteuid") and os.geteuid() == 0)
    try:
        import ctypes
        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def _js_call(window, fn: str, payload: Dict[str, Any]) -> None:
    if window is None:
        return
    raw = json.dumps(payload, ensure_ascii=False)
    escaped = raw.replace("\\", "\\\\").replace("'", "\\'")
    try:
        window.evaluate_js(f"{fn}('{escaped}')")
    except Exception:
        pass


class _Api:
    def __init__(self) -> None:
        self.window = None
        self._dashboard: Optional[str] = None
        self._output_dir: Optional[str] = None
        self._running = False

    def start_scan(self, days: int) -> str:
        if self._running:
            return "busy"
        try:
            days_i = int(days)
        except Exception:
            days_i = 0
        if days_i <= 0:
            _js_call(self.window, "onDone", {"error": "Giorni non validi"})
            return "invalid"

        self._running = True
        self._dashboard = None
        self._output_dir = None
        threading.Thread(target=self._worker, args=(days_i,), daemon=True).start()
        return "ok"

    def _worker(self, days: int) -> None:
        done = {"n": 0}
        total = max(len(_MODULES), 1)

        def on_progress(module_id: str, status: str, detail: str = "") -> None:
            if status == "done":
                done["n"] += 1
            frac = min(done["n"] / total, 0.98)
            label = (detail or module_id).replace("_", " ")
            _js_call(self.window, "onProgress", {
                "frac": frac,
                "label": f"Modulo: {label}",
                "state": "Analisi in corso…",
            })

        try:
            result = run_scan(
                days=days,
                output_dir="",
                quick=True,
                on_progress=on_progress,
                on_log=lambda _m: None,
            )
            self._output_dir = result.get("root_dir")
            self._dashboard = result.get("dashboard_path")
            mc = result.get("mc_data") or {}
            accounts = len(mc.get("all_accounts") or [])
            cheat = len(result.get("cheat_alerts") or [])
            _js_call(self.window, "onDone", {
                "summary": f"Completata · {accounts} account · {cheat} alert",
            })
        except Exception as exc:
            _js_call(self.window, "onDone", {"error": str(exc)})
        finally:
            self._running = False

    def open_dashboard(self) -> None:
        if not self._dashboard:
            return
        try:
            if hasattr(os, "startfile"):
                os.startfile(self._dashboard)  # type: ignore[attr-defined]
            else:
                webbrowser.open(f"file://{self._dashboard}")
        except Exception:
            pass

    def open_output(self) -> None:
        if not self._output_dir:
            return
        try:
            if hasattr(os, "startfile"):
                os.startfile(self._output_dir)  # type: ignore[attr-defined]
            elif sys.platform == "darwin":
                os.system(f'open "{self._output_dir}"')
            else:
                os.system(f'xdg-open "{self._output_dir}"')
        except Exception:
            pass


def _launch_webview() -> None:
    import webview

    api = _Api()
    admin = _is_admin()
    html = (
        _UI_PATH.read_text(encoding="utf-8")
        .replace("__VERSION_LINE__", f"v{__version__}  ·  {platform.system()}")
        .replace("__ADMIN_CLASS__", "ok" if admin else "")
        .replace(
            "__ADMIN_TEXT__",
            "Amministratore attivo" if admin else "Avvia come admin per la scansione completa",
        )
    )

    window = webview.create_window(
        title="ScreenShareTool",
        html=html,
        js_api=api,
        width=480,
        height=720,
        min_size=(420, 640),
        background_color=_BG,
        text_select=False,
    )
    api.window = window

    try:
        webview.start(gui="edgechromium")
    except Exception:
        webview.start()


def _launch_customtkinter_fallback() -> None:
    try:
        import customtkinter as ctk
    except ImportError as exc:
        raise ImportError(
            "Installa la GUI: pip install pywebview  (oppure customtkinter)"
        ) from exc

    ctk.set_appearance_mode("dark")
    app = ctk.CTk()
    app.title("ScreenShareTool")
    app.geometry("440x560")
    app.configure(fg_color=_BG)

    shell = ctk.CTkFrame(
        app, fg_color="#0a0a0a", corner_radius=28,
        border_width=1, border_color="#1f1f1f",
    )
    shell.pack(fill="both", expand=True, padx=22, pady=22)

    ctk.CTkLabel(
        shell, text="ScreenShareTool",
        font=ctk.CTkFont(size=26, weight="bold"), text_color="#ffffff",
    ).pack(pady=(36, 6), padx=28, anchor="w")
    ctk.CTkLabel(
        shell, text=f"v{__version__}  ·  {platform.system()}",
        font=ctk.CTkFont(size=12), text_color="#8a8a8a",
    ).pack(padx=28, anchor="w")

    days_var = ctk.IntVar(value=7)
    chips = ctk.CTkFrame(shell, fg_color="transparent")
    chips.pack(pady=(28, 8), padx=28, fill="x")
    for d in (1, 7, 30):
        ctk.CTkRadioButton(
            chips, text=f"{d}g", variable=days_var, value=d,
            fg_color="#ffffff", hover_color="#e8e8e8",
            text_color="#8a8a8a", border_color="#2a2a2a",
        ).pack(side="left", padx=(0, 14))

    status = ctk.CTkLabel(shell, text="Pronto", text_color="#8a8a8a")
    status.pack(pady=(16, 0), padx=28, anchor="w")
    bar = ctk.CTkProgressBar(shell, progress_color="#7eb6ff", fg_color="#1a1a1a")
    bar.pack(fill="x", padx=28, pady=14)
    bar.set(0)

    state = {"run": False}

    def handle_start() -> None:
        if state["run"]:
            return
        state["run"] = True
        btn.configure(state="disabled", text="Analisi in corso…")
        status.configure(text="Avvio…", text_color="#7eb6ff")
        bar.set(0.02)

        def work() -> None:
            done = {"n": 0}

            def on_progress(mid: str, st: str, detail: str = "") -> None:
                if st == "done":
                    done["n"] += 1
                frac = min(done["n"] / len(_MODULES), 0.98)
                app.after(0, lambda: bar.set(frac))
                app.after(0, lambda: status.configure(
                    text=f"Modulo: {(detail or mid)}", text_color="#7eb6ff"
                ))

            try:
                result = run_scan(
                    days=int(days_var.get()),
                    output_dir="",
                    quick=True,
                    on_progress=on_progress,
                    on_log=lambda _m: None,
                )
                accounts = len((result.get("mc_data") or {}).get("all_accounts") or [])
                cheat = len(result.get("cheat_alerts") or [])
                app.after(0, lambda: (
                    bar.set(1),
                    status.configure(
                        text=f"Completata · {accounts} account · {cheat} alert",
                        text_color="#4ade9b",
                    ),
                    btn.configure(state="normal", text="Avvia analisi"),
                ))
            except Exception as exc:
                msg = str(exc)
                app.after(0, lambda: (
                    status.configure(text=msg, text_color="#ff5c5c"),
                    btn.configure(state="normal", text="Avvia analisi"),
                ))
            finally:
                state["run"] = False

        threading.Thread(target=work, daemon=True).start()

    btn = ctk.CTkButton(
        shell, text="Avvia analisi", height=52, corner_radius=999,
        font=ctk.CTkFont(size=15, weight="bold"),
        fg_color="#ffffff", hover_color="#e8e8e8", text_color="#000000",
        command=handle_start,
    )
    btn.pack(fill="x", padx=28, pady=(8, 36))
    app.mainloop()


def launch_gui() -> None:
    try:
        _launch_webview()
    except Exception:
        _launch_customtkinter_fallback()


def main() -> None:
    launch_gui()


if __name__ == "__main__":
    main()
