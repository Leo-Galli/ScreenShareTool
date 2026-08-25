"""
Minecraft launcher detection, account extraction, log analysis, and IGAS detection.

Covers: 15+ launchers, InGame Account Switcher (standalone + mod),
Minecraft servers.dat parsing, crash reports, mods, hidden jars,
chat keyword scanning, and browser history cheat traces.
"""

import gzip
import os
import re
import struct
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional, Set, Tuple

from .config import (
    CHAT_KEYWORDS, IGAS_MOD_PATHS, IGAS_ROOTS,
    MC_LAUNCHERS, LauncherDef, SUSPICIOUS_DOMAINS,
)
from .utils import (
    html_escape, new_report_file, read_log_lines, run_cmd, show_step,
    write_block,
)


# ================================================================
#  ACCOUNT JSON PARSING
# ================================================================

def parse_account_json(json_path: str) -> List[Dict[str, str]]:
    """
    Parse an account JSON file from any launcher.
    Returns list of dicts with: name, uuid, type, online
    Handles all known formats: Mojang old/new, Modrinth, Prism/MultiMC, IGAS.
    """
    results = []
    if not os.path.exists(json_path):
        return results
    try:
        import json
        with open(json_path, "r", encoding="utf-8", errors="replace") as f:
            raw = f.read().strip()
        if not raw:
            return results
        data = json.loads(raw)

        # Mojang old: authenticationDatabase { uuid: {displayName, username} }
        auth_db = data.get("authenticationDatabase") or (
            getattr(data, "authenticationDatabase", None) if hasattr(data, "get") else None
        )
        if auth_db and isinstance(auth_db, dict):
            for uuid, info in auth_db.items():
                n = info.get("displayName") or info.get("username")
                if n:
                    results.append({"name": n, "uuid": uuid, "type": "Mojang-old", "online": "?"})

        # Mojang new / generic: accounts [ {minecraftProfile:{name,id}, type} ]
        accounts = data.get("accounts") if isinstance(data.get("accounts"), list) else None
        if accounts:
            for a in accounts:
                if not isinstance(a, dict):
                    continue
                mp = a.get("minecraftProfile") or {}
                n = (mp.get("name") or a.get("displayName") or
                     a.get("name") or a.get("username"))
                u = mp.get("id") or a.get("uuid") or ""
                tp = a.get("type", "?")
                if n:
                    results.append({"name": n, "uuid": u, "type": tp, "online": "?"})

        # Modrinth credentials.json: accounts { uuid: {username, active} }
        accts_obj = data.get("accounts")
        if isinstance(accts_obj, dict):
            for uid, info in accts_obj.items():
                if isinstance(info, dict):
                    n = info.get("username") or info.get("name")
                    active = info.get("active", "?")
                    if n:
                        results.append({"name": n, "uuid": uid, "type": "Modrinth", "online": str(active)})

        # Prism/MultiMC nested profiles
        accounts2 = data.get("accounts") if isinstance(data.get("accounts"), list) else None
        if accounts2:
            for a in accounts2:
                if isinstance(a, dict) and a.get("profiles") and not a.get("name") and not a.get("minecraftProfile"):
                    profiles = a["profiles"]
                    if isinstance(profiles, dict):
                        for pid, pdata in profiles.items():
                            dn = pdata.get("displayName") if isinstance(pdata, dict) else None
                            if dn:
                                results.append({"name": dn, "uuid": pid, "type": "Prism/MultiMC", "online": "?"})

        # IGAS: flat list or {accounts: [...]}
        ias_arr = None
        if isinstance(accounts, list):
            ias_arr = accounts
        elif isinstance(data, list):
            ias_arr = data
        if ias_arr:
            seen = {(r["name"], r["uuid"]) for r in results}
            for a in ias_arr:
                if not isinstance(a, dict):
                    continue
                n = a.get("name") or a.get("username")
                u = a.get("uuid", "")
                ol = str(a.get("online", "?"))
                tp = a.get("type", "IGAS")
                if n and (n, u) not in seen:
                    results.append({"name": n, "uuid": u, "type": tp, "online": ol})
                    seen.add((n, u))

    except Exception:
        pass
    return results


# ================================================================
#  IAS LOG SCANNER
# ================================================================

RE_IAS_LOGIN = re.compile(r'IAS:.*Received login request', re.IGNORECASE)
RE_IAS_FLOW = re.compile(r'IAS:\s*(Creating user|Flushing user|Flushed user)', re.IGNORECASE)
RE_IAS_ANY = re.compile(r'IAS:', re.IGNORECASE)
RE_AUTH = re.compile(r'Setting user|Logging in with|Authenticated as|Username:|Refreshing token|Got refresh', re.IGNORECASE)
RE_NET = re.compile(
    r'sessionserver\.mojang\.com|api\.minecraftservices\.com|'
    r'minecraft\.net/authenticate|auth\.mojang\.com|access token|'
    r'modrinth\.com/auth|hydra\.modrinth', re.IGNORECASE,
)


def scan_mc_log(log_path: str) -> Dict[str, Any]:
    """
    Scan a Minecraft log file for account change traces.
    Returns dict with: ias_blocks, auth_lines, net_lines
    """
    result = {
        "ias_blocks": [],
        "auth_lines": [],
        "net_lines": [],
    }

    lines = read_log_lines(log_path)
    if not lines:
        return result

    in_block = False
    cur_block = None

    for line in lines:
        line = line.strip() if isinstance(line, str) else str(line).strip()
        if not line:
            continue

        # IAS login block
        if RE_IAS_LOGIN.search(line):
            in_block = True
            name_m = re.search(r"name='([^']+)'", line)
            uuid_m = re.search(r'uuid=([\w\-]+)', line)
            online_m = re.search(r'online=(true|false)', line)
            time_m = re.search(r'^\[(\d{2}:\d{2}:\d{2})\]', line)
            cur_block = {
                "time": time_m.group(1) if time_m else "?",
                "name": name_m.group(1) if name_m else "?",
                "uuid": uuid_m.group(1) if uuid_m else "?",
                "online": online_m.group(1) if online_m else "?",
                "raw_lines": [line],
            }
            continue

        if in_block:
            if RE_IAS_ANY.search(line):
                cur_block["raw_lines"].append(line)
                if RE_IAS_FLOW.search(line) and "Flushed user" in line:
                    result["ias_blocks"].append(cur_block)
                    in_block = False
                    cur_block = None
            else:
                if cur_block:
                    result["ias_blocks"].append(cur_block)
                in_block = False
                cur_block = None
            continue

        # Generic auth
        if RE_AUTH.search(line):
            result["auth_lines"].append(line)

        # Network calls
        if RE_NET.search(line):
            result["net_lines"].append(line)

    if in_block and cur_block:
        result["ias_blocks"].append(cur_block)

    return result


# ================================================================
#  SERVERS.DAT PARSER
# ================================================================

def parse_servers_dat(dat_path: str) -> List[str]:
    """Extract server IPs from a Minecraft servers.dat (NBT binary)."""
    ips = set()
    try:
        with open(dat_path, "rb") as f:
            data = f.read()
        text = data.decode("utf-8", errors="replace")
        for m in re.finditer(r'(?i)[a-z0-9.-]+\.[a-z]{2,}(?::[0-9]+)?', text):
            val = m.group()
            if not re.search(r'(?i)lwjgl|minecraft|mojang|oracle|microsoft|sun|java', val):
                ips.add(val)
    except Exception:
        pass
    return sorted(ips)


# ================================================================
#  MAIN MINECRAFT ANALYSIS
# ================================================================

def analyze_minecraft(date_limit: datetime, days: int,
                      root_dir: str, ts: str, win_name: str, win_build: int
                      ) -> Dict[str, Any]:
    """
    Full Minecraft analysis (14a-14j).
    Returns data needed for dashboard: accounts, ias_entries, found_launchers, etc.
    """
    show_step("MINECRAFT", "Profili, account, Modrinth, IGAS, log cambio account...")

    out_main = os.path.join(root_dir, "14_Minecraft", f"14a_Launcher_Trovati_{ts}.txt")
    out_acc = os.path.join(root_dir, "14_Minecraft", f"14b_Account_Estratti_{ts}.txt")
    out_igas = os.path.join(root_dir, "14_Minecraft", f"14c_IGAS_{ts}.txt")
    out_log = os.path.join(root_dir, "14_Minecraft", f"14d_Log_CambioAccount_{ts}.txt")
    out_cache = os.path.join(root_dir, "14_Minecraft", f"14e_Usercache_{ts}.txt")
    out_crash = os.path.join(root_dir, "14_Minecraft", f"14f_Crash_Mods_{ts}.txt")
    out_servers = os.path.join(root_dir, "14_Minecraft", f"14g_ServerHistory_{ts}.txt")
    out_chat = os.path.join(root_dir, "14_Minecraft", f"14h_ChatKeywords_{ts}.txt")
    out_hidden = os.path.join(root_dir, "14_Minecraft", f"14i_HiddenMods_{ts}.txt")

    for f in [out_main, out_acc, out_igas, out_log, out_cache,
              out_crash, out_servers, out_chat, out_hidden]:
        new_report_file(f, f"MINECRAFT - {os.path.splitext(os.path.basename(f))[0]}",
                        "", win_name, win_build, days, date_limit)

    # --- [14a] Launchers Found ---
    path_lines = []
    found_launchers = []  # dict: {name, root, acc_files, log_dirs}

    for launcher in MC_LAUNCHERS:
        roots = [r for r in launcher.roots if os.path.isdir(r)]
        if not roots:
            path_lines.append(f"  [   ] NON TROVATO  : {launcher.name}")
            continue
        for lr in roots:
            try:
                mtime = datetime.fromtimestamp(os.path.getmtime(lr))
                in_range = mtime >= date_limit
            except OSError:
                in_range = False
            tag = "[!!!]" if in_range else "[ - ]"
            path_lines.append("")
            path_lines.append(f"  {tag} TROVATO  : {launcher.name}")
            path_lines.append(f"       Root            : {lr}")
            try:
                path_lines.append(f"       Ultima modifica : {mtime.strftime('%d/%m/%Y %H:%M:%S')}")
            except Exception:
                path_lines.append(f"       Ultima modifica : N/A")

            for ep in launcher.extra_paths:
                full = os.path.join(lr, ep)
                if os.path.exists(full):
                    try:
                        ep_mtime = datetime.fromtimestamp(os.path.getmtime(full))
                        ep_in = ep_mtime >= date_limit
                        ep_tag = "[!!!]" if ep_in else "[ - ]"
                        path_lines.append(f"       {ep_tag}  {ep}  (modif: {ep_mtime.strftime('%d/%m/%Y %H:%M:%S')})")
                    except OSError:
                        path_lines.append(f"       [ - ]  {ep}")

            found_launchers.append({
                "name": launcher.name,
                "root": lr,
                "acc_files": launcher.account_files,
                "log_dirs": launcher.log_dirs,
            })

    # IGAS standalone
    path_lines.append("")
    path_lines.append("  ---- INGAME ACCOUNT SWITCHER (IGAS) ----")
    for ir in IGAS_ROOTS:
        if os.path.exists(ir):
            try:
                ii_mtime = datetime.fromtimestamp(os.path.getmtime(ir))
                in_r = ii_mtime >= date_limit
                tag = "[!!!]" if in_r else "[ - ]"
                path_lines.append(f"  {tag} TROVATO  : IGAS standalone")
                path_lines.append(f"       Path : {ir}")
                path_lines.append(f"       Data : {ii_mtime.strftime('%d/%m/%Y %H:%M:%S')}")
            except OSError:
                path_lines.append(f"  [ - ] TROVATO  : IGAS standalone ({ir})")
        else:
            path_lines.append(f"  [   ] assente  : {ir}")

    # IGAS mod paths
    path_lines.append("")
    path_lines.append("  ---- IGAS MOD (ias.json in .minecraft/config) ----")
    for imp in IGAS_MOD_PATHS:
        if os.path.exists(imp):
            try:
                imp_mtime = datetime.fromtimestamp(os.path.getmtime(imp))
                tag = "[!!!]" if imp_mtime >= date_limit else "[ - ]"
                path_lines.append(f"  {tag} TROVATO  : {imp}  (data: {imp_mtime.strftime('%d/%m/%Y %H:%M:%S')})")
            except OSError:
                path_lines.append(f"  [ - ] TROVATO  : {imp}")
        else:
            path_lines.append(f"  [   ] assente  : {imp}")

    # IGAS mod .jar wildcard
    mods_dir = os.path.join(os.environ.get("APPDATA", ""), ".minecraft", "mods")
    if os.path.isdir(mods_dir):
        for fn in os.listdir(mods_dir):
            if "nGameAccountSwitcher" in fn or "InGameAccountSwitcher" in fn:
                fp = os.path.join(mods_dir, fn)
                try:
                    j_mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                    tag = "[!!!]" if j_mtime >= date_limit else "[ - ]"
                    path_lines.append(f"  {tag} IGAS MOD .jar : {fn}  (data: {j_mtime.strftime('%d/%m/%Y %H:%M:%S')})")
                except OSError:
                    path_lines.append(f"  [ - ] IGAS MOD .jar : {fn}")

    write_block(out_main, path_lines)

    # --- [14b] Account Extraction ---
    acc_lines = []
    all_accounts = []
    seen_accounts: Set[Tuple[str, str]] = set()

    for launcher in found_launchers:
        launcher_accounts = []
        for af in launcher["acc_files"]:
            full_path = os.path.join(launcher["root"], af)
            if not os.path.exists(full_path):
                continue
            parsed = parse_account_json(full_path)
            for a in parsed:
                key = (a["name"], a["uuid"])
                if key not in seen_accounts:
                    a["launcher"] = launcher["name"]
                    a["file"] = full_path
                    all_accounts.append(a)
                    launcher_accounts.append(a)
                    seen_accounts.add(key)

        if launcher_accounts:
            acc_lines.append("")
            acc_lines.append(f"  {'-' * 64}")
            acc_lines.append(f"  LAUNCHER : {launcher['name']}   ({launcher['root']})")
            acc_lines.append(f"  {'-' * 64}")
            for a in launcher_accounts:
                name_str = a["name"].ljust(24)
                uuid_str = f"UUID: {a['uuid']}" if a["uuid"] else "UUID: N/A"
                acc_lines.append(f"  [ACC] {name_str}  {uuid_str}  Tipo: {a['type']}  Online: {a['online']}")

    # IGAS standalone accounts
    acc_lines.append("")
    acc_lines.append(f"  {'-' * 64}")
    acc_lines.append("  IGAS STANDALONE + MOD")
    acc_lines.append(f"  {'-' * 64}")
    ias_jsons = []
    for ir in IGAS_ROOTS:
        if os.path.isdir(ir):
            for dirpath, _, filenames in os.walk(ir):
                for fn in filenames:
                    if fn in ("accounts.json", "users.json", "ias.json"):
                        ias_jsons.append(os.path.join(dirpath, fn))
    for imp in IGAS_MOD_PATHS:
        if os.path.exists(imp):
            ias_jsons.append(imp)

    ias_found_accs = False
    for ij in dict.fromkeys(ias_jsons):  # unique, ordered
        parsed = parse_account_json(ij)
        for a in parsed:
            key = (a["name"], a["uuid"])
            if key not in seen_accounts:
                a["launcher"] = "IGAS"
                a["file"] = ij
                all_accounts.append(a)
                seen_accounts.add(key)
                ias_found_accs = True
                uuid_str = f"UUID: {a['uuid']}" if a["uuid"] else "UUID: N/A"
                acc_lines.append(f"  [IAS] {a['name'].ljust(24)}  {uuid_str}  Online: {a['online']}  (da: {ij})")

    if not ias_found_accs:
        acc_lines.append("  [--] Nessun account IGAS trovato nei JSON.")

    # Summary — anti-false-positive: only distinct usernames count as
    # multiaccounting; UUID variants of the same nick are noted separately.
    acc_lines.append("")
    acc_lines.append("  " + "=" * 64)
    acc_lines.append(f"  TOTALE ACCOUNT UNIVOCI TROVATI: {len(all_accounts)}")
    distinct_names = sorted({a["name"].lower() for a in all_accounts})
    offline_accounts = [a for a in all_accounts if str(a.get("online", "?")).lower() == "false"]
    acc_lines.append(f"  Username distinti           : {len(distinct_names)}")
    acc_lines.append(f"  Account offline/cracked     : {len(offline_accounts)}")
    acc_lines.append("")
    acc_lines.append("  Riepilogo nomi:")
    for a in all_accounts:
        offline_tag = "  <- OFFLINE/CRACKED" if str(a.get("online", "?")).lower() == "false" else ""
        acc_lines.append(f"    -> {a['name'].ljust(24)}  [{a.get('launcher', '?')}]{offline_tag}")
    acc_lines.append("")
    if len(distinct_names) > 1:
        acc_lines.append("  [!!!] PIU' USERNAME DISTINTI - VERIFICARE MULTIACCOUNTING")
    elif len(all_accounts) > 1:
        acc_lines.append("  [NB]  Stesso username con UUID diversi - possibile alt account o re-login")
    if offline_accounts:
        acc_lines.append("  [!!!] PRESENZA ACCOUNT OFFLINE/CRACKED - VERIFICARE")
    acc_lines.append("  " + "=" * 64)
    write_block(out_acc, acc_lines)

    # --- [14c] IGAS Detail ---
    ias_lines = []
    ias_lines.append("  PATH CERCATI:")
    for ir in IGAS_ROOTS:
        s = "[OK ] PRESENTE" if os.path.exists(ir) else "[   ] assente "
        ias_lines.append(f"  {s}  {ir}")
    for imp in IGAS_MOD_PATHS:
        s = "[OK ] PRESENTE" if os.path.exists(imp) else "[   ] assente "
        ias_lines.append(f"  {s}  {imp}")

    for ir in IGAS_ROOTS:
        if os.path.isdir(ir):
            ias_lines.append("")
            ias_lines.append(f"  ---- CONTENUTO: {ir} ----")
            files = []
            for dirpath, _, filenames in os.walk(ir):
                for fn in filenames:
                    fp = os.path.join(dirpath, fn)
                    try:
                        mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                        files.append((mtime, fn, fp))
                    except OSError:
                        pass
            files.sort(key=lambda x: x[0], reverse=True)
            for mtime, fn, fp in files:
                tag = "[!!!]" if mtime >= date_limit else "[ - ]"
                ias_lines.append(f"  {tag}  {mtime.strftime('%d/%m/%Y %H:%M:%S')}  |  {fn}  |  {fp}")
    write_block(out_igas, ias_lines)

    # --- [14d] Log Analysis ---
    log_lines, ias_log_entries, total_ias, total_multi = _analyze_logs(
        found_launchers, date_limit, days, win_name, win_build
    )
    write_block(out_log, log_lines)

    # --- [14e] Usercache ---
    cache_lines = _analyze_usercache(found_launchers)
    write_block(out_cache, cache_lines)

    # --- [14f] Crash Reports + Mods ---
    crash_lines = _analyze_crash_mods(found_launchers, date_limit)
    write_block(out_crash, crash_lines)

    # --- [14g] Servers.dat ---
    srv_lines = ["  ---- MC SERVERS (servers.dat) ----"]
    for launcher in found_launchers:
        sdat = os.path.join(launcher["root"], "servers.dat")
        if os.path.exists(sdat):
            srv_lines.append(f"  LAUNCHER: {launcher['name']} ({sdat})")
            ips = parse_servers_dat(sdat)
            for ip in ips:
                srv_lines.append(f"    -> IP / Server: {ip}")
    write_block(out_servers, srv_lines)

    # --- [14h] Chat Keywords ---
    chat_lines = _scan_chat_keywords(found_launchers, date_limit)
    write_block(out_chat, chat_lines)

    # --- [14i] Hidden Mod Jars ---
    hidden_lines = _scan_hidden_mods(found_launchers)
    write_block(out_hidden, hidden_lines)

    show_step("MINECRAFT", f"Completato. File: 14a-14i.", "green")

    return {
        "all_accounts": all_accounts,
        "ias_log_entries": ias_log_entries,
        "found_launchers": found_launchers,
        "total_ias": total_ias,
        "total_multi": total_multi,
    }


# ================================================================
#  LOG ANALYSIS HELPER
# ================================================================

def _analyze_logs(found_launchers, date_limit, days, win_name, win_build):
    """Analyze all Minecraft logs for account changes."""
    log_lines = []
    ias_log_entries = []
    total_ias = 0
    total_multi = 0

    # Collect all log files
    all_log_files = []
    seen_paths: Set[str] = set()

    for launcher in found_launchers:
        for ld in launcher["log_dirs"]:
            log_dir = os.path.join(launcher["root"], ld)
            if not os.path.isdir(log_dir):
                continue
            for dirpath, _, filenames in os.walk(log_dir):
                for fn in filenames:
                    if fn.endswith(".log") or fn.endswith(".log.gz"):
                        fp = os.path.join(dirpath, fn)
                        if fp.lower() not in seen_paths:
                            seen_paths.add(fp.lower())
                            try:
                                mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                                in_range = mtime >= date_limit
                            except OSError:
                                in_range = False
                            all_log_files.append({
                                "path": fp,
                                "label": launcher["name"],
                                "in_range": in_range,
                                "date": mtime if in_range else datetime.min,
                            })

    # latest.log always
    latest = os.path.join(os.environ.get("APPDATA", ""), ".minecraft", "logs", "latest.log")
    if os.path.exists(latest) and latest.lower() not in seen_paths:
        try:
            mtime = datetime.fromtimestamp(os.path.getmtime(latest))
        except OSError:
            mtime = datetime.min
        all_log_files.append({
            "path": latest, "label": "Mojang Launcher (latest.log)",
            "in_range": True, "date": mtime,
        })

    # Sort: in-range first, then by date
    all_log_files.sort(key=lambda x: (0 if x["in_range"] else 1), reverse=False)
    all_log_files.sort(key=lambda x: x["date"], reverse=True)

    to_scan = [lf for lf in all_log_files if lf["in_range"] or lf["path"] == latest]

    log_lines.append(f"  Log trovati sul sistema  : {len(all_log_files)}")
    log_lines.append(f"  Log scansionati          : {len(to_scan)}  (nell'intervallo + latest.log)")
    log_lines.append("")

    for entry in to_scan:
        scan = scan_mc_log(entry["path"])
        has_content = (scan["ias_blocks"] or scan["auth_lines"] or scan["net_lines"])
        if not has_content:
            continue

        log_lines.append("")
        log_lines.append("  " + "=" * 64)
        log_lines.append(f"  LAUNCHER : {entry['label']}")
        log_lines.append(f"  FILE     : {entry['path']}")
        log_lines.append(f"  DATA     : {entry['date'].strftime('%d/%m/%Y %H:%M:%S')}")
        log_lines.append("  " + "=" * 64)

        if scan["ias_blocks"]:
            total_ias += len(scan["ias_blocks"])
            if len(scan["ias_blocks"]) > 1:
                total_multi += 1
            log_lines.append("")
            log_lines.append(f"  >> CAMBI ACCOUNT IAS : {len(scan['ias_blocks'])}")
            for i, blk in enumerate(scan["ias_blocks"], 1):
                log_lines.append("")
                log_lines.append("  +----------------------------------------------------------+")
                log_lines.append(f"  | [IAS] CAMBIO ACCOUNT #{i} di {len(scan['ias_blocks'])}")
                log_lines.append(f"  |  Orario : {blk['time']}")
                log_lines.append(f"  |  Nome   : {blk['name']}")
                log_lines.append(f"  |  UUID   : {blk['uuid']}")
                online_note = " <- account OFFLINE/CRACKED" if blk["online"] == "false" else ""
                log_lines.append(f"  |  Online : {blk['online']}{online_note}")
                log_lines.append("  +----------------------------------------------------------+")
                for rl in blk["raw_lines"]:
                    log_lines.append(f"  |  {rl}")
                log_lines.append("  +----------------------------------------------------------+")

                ias_log_entries.append({
                    "time": blk["time"],
                    "name": blk["name"],
                    "uuid": blk["uuid"],
                    "online": blk["online"],
                    "log_file": entry["path"],
                    "launcher": entry["label"],
                })

        if scan["auth_lines"]:
            log_lines.append("")
            log_lines.append(f"  >> AUTH GENERICO ({len(scan['auth_lines'])} righe):")
            for al in scan["auth_lines"]:
                log_lines.append(f"  [LOG] {al}")

        if scan["net_lines"]:
            log_lines.append("")
            log_lines.append(f"  >> CHIAMATE RETE AUTH ({len(scan['net_lines'])} righe):")
            for nl in scan["net_lines"]:
                log_lines.append(f"  [NET] {nl}")

    if total_ias == 0 and to_scan:
        log_lines.append("")
        log_lines.append("  [OK] Nessun cambio account IAS trovato in nessun log.")

    # Copy latest.log
    if os.path.exists(latest):
        try:
            import shutil
            dest = os.path.join(os.environ.get("SystemDrive", "C:"),
                                "CharlieRP_SS", "14_Minecraft", f"latest_log_copy_{ts}.txt")
            shutil.copy2(latest, dest)
            log_lines.append("")
            log_lines.append("  [OK] Copia di latest.log salvata in output.")
        except Exception:
            pass

    log_lines.append("")
    log_lines.append("  " + "=" * 64)
    log_lines.append(f"  RIEPILOGO LOG")
    log_lines.append(f"  Cambi account IAS totali : {total_ias}")
    if total_ias > 1:
        log_lines.append(f"  [!!!] {total_ias} cambi account rilevati nei log - MULTIACCOUNTING")
    log_lines.append("  " + "=" * 64)

    return log_lines, ias_log_entries, total_ias, total_multi


# ================================================================
#  USERCACHE ANALYSIS
# ================================================================

def _analyze_usercache(found_launchers) -> List[str]:
    """Analyze usercache.json from all found launchers."""
    lines = []
    uc_paths = []
    for launcher in found_launchers:
        uc = os.path.join(launcher["root"], "usercache.json")
        if os.path.exists(uc) and uc not in uc_paths:
            uc_paths.append(uc)
    if not uc_paths:
        default_uc = os.path.join(os.environ.get("APPDATA", ""), ".minecraft", "usercache.json")
        if os.path.exists(default_uc):
            uc_paths.append(default_uc)

    for uc_path in uc_paths:
        if not os.path.exists(uc_path):
            continue
        lines.append("")
        lines.append(f"  ---- {uc_path} ----")
        try:
            mtime = datetime.fromtimestamp(os.path.getmtime(uc_path))
            lines.append(f"  Data modifica : {mtime.strftime('%d/%m/%Y %H:%M:%S')}")
        except OSError:
            pass
        try:
            import json
            with open(uc_path, "r", encoding="utf-8", errors="replace") as f:
                uc = json.loads(f.read())
            if isinstance(uc, list):
                lines.append(f"  Voci totali   : {len(uc)}")
                if len(uc) > 1:
                    lines.append("  [NB] Piu' username = account multipli o altri giocatori visti sui server")
                lines.append("")
                for entry in uc:
                    if isinstance(entry, dict):
                        name = entry.get("name", "?")
                        uuid = entry.get("uuid", "?")
                        expires = entry.get("expiresOn", "N/A")
                        lines.append(f"  [USR] {name.ljust(24)}  UUID: {uuid}  Scadenza: {expires}")
        except Exception:
            lines.append("  [ERR] Errore parsing usercache.json")

    if not lines:
        lines.append("  [--] Nessun usercache.json trovato.")
    return lines


# ================================================================
#  CRASH REPORTS + MODS
# ================================================================

def _analyze_crash_mods(found_launchers, date_limit) -> List[str]:
    """Analyze crash reports and installed mods."""
    lines = []
    lines.append("  ---- CRASH REPORTS ----")

    for launcher in found_launchers:
        crash_dir = os.path.join(launcher["root"], "crash-reports")
        if not os.path.isdir(crash_dir):
            continue
        crashes = []
        for fn in os.listdir(crash_dir):
            if fn.endswith(".txt"):
                fp = os.path.join(crash_dir, fn)
                try:
                    mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                    if mtime >= date_limit:
                        crashes.append((mtime, fn, fp))
                except OSError:
                    pass
        crashes.sort(key=lambda x: x[0], reverse=True)
        if crashes:
            lines.append("")
            lines.append(f"  LAUNCHER: {launcher['name']}  ({crash_dir})")
            for mtime, fn, fp in crashes:
                lines.append(f"  [CRS] {mtime.strftime('%d/%m/%Y %H:%M:%S')}  |  {fn}")
                # Try to read Description line
                try:
                    with open(fp, "r", encoding="utf-8", errors="replace") as f:
                        for fl in f:
                            if fl.startswith("Description:"):
                                lines.append(f"        Motivo : {fl.strip()}")
                                break
                except Exception:
                    pass

    # Mods
    lines.append("")
    lines.append("  ---- MODS INSTALLATE (lista, senza giudizio) ----")
    for launcher in found_launchers:
        mods_dir = os.path.join(launcher["root"], "mods")
        if not os.path.isdir(mods_dir):
            continue
        mods = []
        for fn in os.listdir(mods_dir):
            if fn.endswith(".jar"):
                fp = os.path.join(mods_dir, fn)
                try:
                    mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                    mods.append((mtime, fn))
                except OSError:
                    pass
        if mods:
            mods.sort(key=lambda x: x[0])
            lines.append("")
            lines.append(f"  LAUNCHER: {launcher['name']}  ({mods_dir})  -  {len(mods)} mods")
            for mtime, fn in mods:
                tag = "[NEW]" if mtime >= date_limit else "[ - ]"
                lines.append(f"  {tag}  {fn}  ({mtime.strftime('%d/%m/%Y %H:%M:%S')})")

    return lines


# ================================================================
#  CHAT KEYWORD SCANNER
# ================================================================

def _scan_chat_keywords(found_launchers, date_limit) -> List[str]:
    """Scan log files for suspicious chat keywords."""
    lines = ["  ---- MC CHAT / LOGS SUSPICIOUS LINES ----"]
    total_found = 0

    for launcher in found_launchers:
        log_dir = os.path.join(launcher["root"], "logs")
        if not os.path.isdir(log_dir):
            continue
        for fn in os.listdir(log_dir):
            if not fn.endswith(".log"):
                continue
            fp = os.path.join(log_dir, fn)
            try:
                mtime = datetime.fromtimestamp(os.path.getmtime(fp))
                if mtime < date_limit:
                    continue
            except OSError:
                continue
            found_in_file = 0
            try:
                with open(fp, "r", encoding="utf-8", errors="replace") as f:
                    for line in f:
                        for kw in CHAT_KEYWORDS:
                            if kw.lower() in line.lower():
                                lines.append(f"  [{fn}]  {line.rstrip()}")
                                found_in_file += 1
                                total_found += 1
                                break
                        if found_in_file >= 100:
                            lines.append(f"  [{fn}]  ... (limite 100 righe raggiunto)")
                            break
            except Exception:
                pass

    if total_found == 0:
        lines.append("  [OK] Nessuna riga sospetta trovata nei log.")
    return lines


# ================================================================
#  HIDDEN MOD JAR DETECTION
# ================================================================

def _scan_hidden_mods(found_launchers) -> List[str]:
    """Detect hidden .jar files in mods directories."""
    lines = ["  ---- HIDDEN MOD JAR FILES ----"]
    hidden_count = 0

    for launcher in found_launchers:
        mods_dir = os.path.join(launcher["root"], "mods")
        if not os.path.isdir(mods_dir):
            continue
        for fn in os.listdir(mods_dir):
            if not fn.endswith(".jar"):
                continue
            fp = os.path.join(mods_dir, fn)
            try:
                # Check for hidden attribute or dot-prefixed name
                import ctypes
                attrs = ctypes.windll.kernel32.GetFileAttributesW(fp)
                is_hidden = bool(attrs & 0x2)  # FILE_ATTRIBUTE_HIDDEN
                is_dotfile = fn.startswith(".")
                if is_hidden or is_dotfile:
                    lines.append(f"  [!!!] File nascosto: {fn}  |  Hidden: {is_hidden}  |  Dotfile: {is_dotfile}")
                    hidden_count += 1
            except Exception:
                if fn.startswith("."):
                    lines.append(f"  [!!!] File nascosto: {fn}")
                    hidden_count += 1

    if hidden_count == 0:
        lines.append("  [OK] Nessun file .jar nascosto trovato nella cartella mods.")
    return lines
