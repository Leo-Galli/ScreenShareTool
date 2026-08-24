"""
Windows Event Log analysis module.

Checks for: time changes (4616), log deletion (1102),
journal deletion (3079), volume snapshots (116/117).
"""

import json
import os
from datetime import datetime
from typing import Any, Dict, List

from .utils import new_report_file, run_ps, show_step, write_block


def analyze_events(date_limit: datetime, days: int,
                   root_dir: str, ts: str, win_name: str, win_build: int) -> Dict[str, Any]:
    """
    Analyze Windows Event Logs for suspicious activities.
    Returns event data for dashboard.
    """
    show_step("MISC", "CrashDumps, PS history, utenti, event log...")

    results = {
        "crash_dumps": [],
        "ps_history": [],
        "ps_suspicious": [],
        "users": [],
        "ev_4616": [],
        "ev_1102": [],
        "volume_snapshots": [],
    }

    # --- [15a] Crash Dumps ---
    out = os.path.join(root_dir, "15_Misc", f"CrashDumps_{ts}.txt")
    new_report_file(out, "MISC [15a] - CRASH DUMPS",
                    r"%LOCALAPPDATA%\CrashDumps",
                    win_name, win_build, days, date_limit)
    dump_lines = _analyze_crash_dumps(date_limit)
    write_block(out, dump_lines)

    # --- [15b] PowerShell History ---
    out = os.path.join(root_dir, "15_Misc", f"PS_History_{ts}.txt")
    new_report_file(out, "MISC [15b] - POWERSHELL HISTORY",
                    "ConsoleHost_history.txt",
                    win_name, win_build, days, date_limit)
    ps_lines, ps_susp = _analyze_ps_history()
    write_block(out, ps_lines)
    results["ps_suspicious"] = ps_susp

    # --- [15c] System Users ---
    out = os.path.join(root_dir, "15_Misc", f"Utenti_{ts}.txt")
    new_report_file(out, "MISC [15c] - UTENTI DI SISTEMA",
                    "Win32_UserAccount",
                    win_name, win_build, days, date_limit)
    user_lines, users = _analyze_users()
    write_block(out, user_lines)
    results["users"] = users

    # --- [15d-15f] Event Logs ---
    ev_table = [
        {"file": "EventLog_CambioOrario_{}.txt".format(ts), "title": "MISC [15d] - CAMBIO ORARIO",
         "log": "Security", "id": 4616, "max": 50, "key": "ev_4616"},
        {"file": "EventLog_EliminazioneLog_{}.txt".format(ts), "title": "MISC [15e] - ELIMINAZIONE LOG",
         "log": "Security", "id": 1102, "max": 20, "key": "ev_1102"},
        {"file": "EventLog_Journal_{}.txt".format(ts), "title": "MISC [15f] - ELIMINAZIONE JOURNAL",
         "log": "Application", "id": 3079, "max": 20, "key": "ev_3079"},
    ]
    for ev in ev_table:
        out = os.path.join(root_dir, "15_Misc", ev["file"])
        new_report_file(out, ev["title"],
                        "EventLog {} - ID {}".format(ev["log"], ev["id"]),
                        win_name, win_build, days, date_limit)
        events, ev_lines = _get_events(ev["log"], ev["id"], date_limit, ev["max"])
        write_block(out, ev_lines)
        if ev["key"] in results:
            results[ev["key"]] = events

    # --- [15g] Volume Snapshot ---
    out = os.path.join(root_dir, "15_Misc", f"EventLog_VolumeSnapshot_{ts}.txt")
    new_report_file(out, "MISC [15g] - VOLUME SNAPSHOT (ID 116/117)",
                    "VolumeSnapshot-Driver",
                    win_name, win_build, days, date_limit)
    vs_lines = _analyze_volume_snapshots(date_limit)
    write_block(out, vs_lines)

    # --- [15j] AnyDesk Logs ---
    out = os.path.join(root_dir, "15_Misc", f"AnyDeskLogs_{ts}.txt")
    new_report_file(out, "MISC [15j] - ANYDESK SESSION LOGS",
                    "File transfer / connection traces",
                    win_name, win_build, days, date_limit)
    ad_lines = _analyze_anydesk()
    write_block(out, ad_lines)

    show_step("MISC", "Completato.", "green")
    return results


# ================================================================
#  CRASH DUMPS
# ================================================================

def _analyze_crash_dumps(date_limit: datetime) -> List[str]:
    dump_dir = os.path.join(os.environ.get("LOCALAPPDATA", ""), "CrashDumps")
    if not os.path.isdir(dump_dir):
        return ["  [--] Cartella CrashDumps non trovata."]
    entries = []
    try:
        for fn in os.listdir(dump_dir):
            fp = os.path.join(dump_dir, fn)
            try:
                mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                if mtime >= date_limit:
                    entries.append((mtime, fn))
            except OSError:
                pass
    except PermissionError:
        return ["  [--] Accesso negato alla cartella CrashDumps."]
    entries.sort(key=lambda x: x[0], reverse=True)
    if entries:
        return ["  [DMP] {}  |  {}".format(dt.strftime('%d/%m/%Y %H:%M:%S'), fn) for dt, fn in entries]
    return ["  [--] Nessun crash dump nell'intervallo."]


# ================================================================
#  POWERSHELL HISTORY
# ================================================================

def _analyze_ps_history():
    import re
    ps_hist = os.path.join(
        os.environ.get("APPDATA", ""),
        "Microsoft", "Windows", "PowerShell", "PSReadLine", "ConsoleHost_history.txt"
    )
    if not os.path.exists(ps_hist):
        return ["  [--] Nessuna history PS trovata."], []

    try:
        with open(ps_hist, "r", encoding="utf-8", errors="replace") as f:
            lines = [l.rstrip() for l in f.readlines()]
    except Exception:
        return ["  [--] Errore lettura history PS."], []

    output = ["  {}".format(l) for l in lines]

    suspicious_re = re.compile(r'creationtime|lastwritetime|Set-Item|icacls|cacls|attrib|fsutil|usn', re.IGNORECASE)
    susp = [l for l in lines if suspicious_re.search(l)]
    if susp:
        output.extend(["", "=== RIGHE SOSPETTE ==="])
        output.extend("  [!!!] {}".format(l) for l in susp)

    return output, susp


# ================================================================
#  SYSTEM USERS
# ================================================================

def _analyze_users():
    lines = []
    users = []
    try:
        result = run_ps(
            "Get-CimInstance Win32_UserAccount | "
            "ForEach-Object { "
            "@{Name=$_.Name;SID=$_.SID;Disabled=$_.Disabled;Local=$_.LocalAccount} "
            "} | ConvertTo-Json -Compress"
        )
        if result.strip():
            data = json.loads(result.strip())
            if isinstance(data, dict):
                data = [data]
            for u in data:
                name = u.get("Name", "?")
                sid = u.get("SID", "?")
                disabled = u.get("Disabled", False)
                local = u.get("Local", False)
                lines.append("  [USR] {:<20} | SID: {} | Disab: {} | Locale: {}".format(name, sid, disabled, local))
                users.append(u)
    except Exception:
        pass
    if not lines:
        lines.append("  [--] Nessun utente trovato.")
    return lines, users


# ================================================================
#  EVENTS
# ================================================================

def _get_events(log_name: str, event_id: int, date_limit: datetime,
                max_count: int = 50):
    """Get Windows events by log name and ID."""
    events = []
    lines = []
    start_str = date_limit.strftime('%Y-%m-%d %H:%M:%S')
    # Build PS command carefully to avoid f-string issues
    ps_cmd = (
        "Get-WinEvent -FilterHashtable @{"
        "LogName='" + log_name + "';"
        "Id=" + str(event_id) + ";"
        "StartTime='" + start_str + "'"
        "} -ErrorAction SilentlyContinue | "
        "Select-Object -First " + str(max_count) + " | "
        "ForEach-Object { "
        "@{"
        "Time=$_.TimeCreated.ToString('dd/MM/yyyy HH:mm:ss');"
        "Msg=($_.Message -replace '\\s+',' ')"
        "} "
        "} | ConvertTo-Json -Compress"
    )
    try:
        result = run_ps(ps_cmd, timeout=30)
        if result.strip():
            data = json.loads(result.strip())
            if isinstance(data, dict):
                data = [data]
            for ev in data:
                time_str = ev.get("Time", "?")
                msg = ev.get("Msg", "?")
                lines.append("  [EVT] {}  |  {}".format(time_str, msg))
                events.append(ev)
    except Exception:
        pass
    if not lines:
        lines.append("  [--] Nessun evento nell'intervallo.")
    return events, lines


# ================================================================
#  VOLUME SNAPSHOTS
# ================================================================

def _analyze_volume_snapshots(date_limit: datetime) -> List[str]:
    lines = []
    start_str = date_limit.strftime('%Y-%m-%d %H:%M:%S')
    for ev_id in [116, 117]:
        ps_cmd = (
            "Get-WinEvent -FilterHashtable @{"
            "ProviderName='Microsoft-Windows-VolumeSnapshot-Driver';"
            "Id=" + str(ev_id) + ";"
            "StartTime='" + start_str + "'"
            "} -ErrorAction SilentlyContinue | "
            "Select-Object -First 10 | "
            "ForEach-Object { "
            "@{"
            "Time=$_.TimeCreated.ToString('dd/MM/yyyy HH:mm:ss');"
            "Msg=($_.Message -replace '\\s+',' ')"
            "} "
            "} | ConvertTo-Json -Compress"
        )
        try:
            result = run_ps(ps_cmd, timeout=15)
            if result.strip():
                data = json.loads(result.strip())
                if isinstance(data, dict):
                    data = [data]
                for ev in data:
                    lines.append("  [ID{}] {}  |  {}".format(ev_id, ev.get('Time', '?'), ev.get('Msg', '?')))
            else:
                lines.append("  [--] ID {} : nessun evento.".format(ev_id))
        except Exception:
            lines.append("  [--] ID {} : errore lettura.".format(ev_id))
    return lines


# ================================================================
#  ANYDESK LOGS
# ================================================================

def _analyze_anydesk() -> List[str]:
    import re
    lines = ["  ---- ANYDESK SESSION / FILE TRANSFER TRACES ----"]
    ad_paths = [
        os.path.join(os.environ.get("APPDATA", ""), "AnyDesk", "ad.trace"),
        os.path.join(os.environ.get("ProgramData", ""), "AnyDesk", "ad.trace"),
    ]
    hits = 0
    ad_re = re.compile(r'file_transfer|file transfer|app\.prepare_transfer|incoming|connected from|files received', re.IGNORECASE)
    for ap in ad_paths:
        if os.path.exists(ap):
            lines.append("  LOG FILE: {}".format(ap))
            try:
                with open(ap, "r", encoding="utf-8", errors="replace") as f:
                    for line in f:
                        if ad_re.search(line):
                            lines.append("  [!!!] {}".format(line.rstrip()))
                            hits += 1
            except Exception:
                pass
    if hits == 0:
        lines.append("  [OK] Nessuna traccia di trasferimento file o connessione sospetta nei log AnyDesk.")
    return lines
