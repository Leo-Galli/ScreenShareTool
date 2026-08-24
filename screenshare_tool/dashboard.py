"""
HTML Dashboard generator.

Produces a modern, interactive, single-file HTML report with:
- Overview with alert summary
- Nick search results
- Account table
- IAS log visualization
- Cheat self-destruction detection
- System info (VM, VPN, hardware)
- Network analysis
- Macro software detection
- Forensics page
- File output listing
"""

import os
from datetime import datetime
from typing import Any, Dict, List

from .config import KNOWN_CHEATS
from .utils import html_escape


def generate_dashboard(date_limit: datetime, days: int,
                       win_name: str, win_build: int,
                       root_dir: str, ts: str,
                       sys_info: Dict[str, Any],
                       net_data: Dict[str, Any],
                       mc_data: Dict[str, Any],
                       event_data: Dict[str, Any],
                       cheat_alerts: List[Dict],
                       global_nicks: List[Dict],
                       macro_data: List[Dict],
                       pf_in_range: int) -> str:
    """
    Generate the HTML dashboard.
    Returns the path to the generated file.
    """
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    date_start = date_limit.strftime("%d/%m/%Y")
    date_end = datetime.now().strftime("%d/%m/%Y")

    all_accounts = mc_data.get("all_accounts", [])
    ias_entries = mc_data.get("ias_log_entries", [])
    found_launchers = mc_data.get("found_launchers", [])

    # Count alert types
    alert_count = 0
    if sys_info["is_vm"]:
        alert_count += 1
    if sys_info["vpn_active"]:
        alert_count += 1
    # Prefetch disabled - check if we have that info
    if event_data.get("ev_1102"):
        alert_count += 1
    if event_data.get("ev_4616"):
        alert_count += 1
    if cheat_alerts:
        alert_count += 1
    multi_acc = len(set(a["name"] for a in all_accounts)) > 1
    if multi_acc:
        alert_count += 1
    if len(ias_entries) > 1:
        alert_count += 1

    # Count output files
    total_files = 0
    for d in os.listdir(root_dir) if os.path.isdir(root_dir) else []:
        dp = os.path.join(root_dir, d)
        if os.path.isdir(dp):
            total_files += len([f for f in os.listdir(dp) if os.path.isfile(os.path.join(dp, f))])

    html_parts = []

    # ============ CSS + HEAD ============
    html_parts.append(_get_html_head())

    # ============ HEADER + NAV ============
    html_parts.append(_get_header_nav())

    # ============ OVERVIEW PAGE ============
    html_parts.append(_get_overview_page(
        win_name, win_build, days, date_start, date_end, now_str,
        alert_count, all_accounts, ias_entries, sys_info, cheat_alerts,
        global_nicks, found_launchers, total_files, pf_in_range,
        event_data, macro_data,
    ))

    # ============ NICKS PAGE ============
    html_parts.append(_get_nicks_page(global_nicks, ias_entries))

    # ============ ACCOUNTS PAGE ============
    html_parts.append(_get_accounts_page(all_accounts, found_launchers))

    # ============ IAS LOG PAGE ============
    html_parts.append(_get_ias_page(ias_entries))

    # ============ CHEATS PAGE ============
    html_parts.append(_get_cheats_page(cheat_alerts))

    # ============ SYSTEM PAGE ============
    html_parts.append(_get_system_page(sys_info, event_data))

    # ============ NETWORK PAGE ============
    html_parts.append(_get_network_page(net_data))

    # ============ MACRO PAGE ============
    html_parts.append(_get_macro_page(macro_data))

    # ============ FORENSICS PAGE ============
    html_parts.append(_get_forensics_page(event_data))

    # ============ FILES PAGE ============
    html_parts.append(_get_files_page(root_dir, total_files))

    # ============ JAVASCRIPT + CLOSE ============
    html_parts.append(_get_js())

    # Write file
    dash_path = os.path.join(root_dir, f"DASHBOARD_{ts}.html")
    with open(dash_path, "w", encoding="utf-8") as f:
        f.write("".join(html_parts))

    return dash_path


# ================================================================
#  HTML HEAD (CSS)
# ================================================================

def _get_html_head() -> str:
    return '''<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CharlieRP Screen Share Dashboard</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --bg:#080b14;--bg2:#0e1220;--bg3:#141828;--bg4:#1a1f2e;
    --border:#1e2540;--border2:#252d45;
    --accent:#5865f2;--accent2:#7983f5;--accent3:#a5acf9;
    --green:#10b981;--green2:#34d399;
    --red:#ef4444;--red2:#f87171;
    --orange:#f97316;--orange2:#fb923c;
    --yellow:#f59e0b;--cyan:#06b6d4;--pink:#ec4899;
    --text:#e8eaf6;--text2:#8891b4;--text3:#4a5378;
    --radius:12px;--radius-sm:8px;
    --shadow:0 4px 32px rgba(0,0,0,.6);--shadow-sm:0 2px 12px rgba(0,0,0,.4);
    --glow-r:0 0 20px rgba(239,68,68,.25);--glow-g:0 0 20px rgba(16,185,129,.2);--glow-a:0 0 20px rgba(88,101,242,.25);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--text);font-family:'Inter','Segoe UI',system-ui,sans-serif;font-size:14px;line-height:1.65;min-height:100vh}
  .site-header{background:linear-gradient(135deg,#0d1021,#0e1525 40%,#0f1020);border-bottom:1px solid var(--border);padding:18px 28px 16px;position:relative;overflow:hidden}
  .site-header::before{content:'';position:absolute;top:-60px;left:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(88,101,242,.15),transparent 70%);pointer-events:none}
  .header-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;position:relative;z-index:1}
  .header-brand{display:flex;align-items:center;gap:14px}
  .header-logo{width:42px;height:42px;background:linear-gradient(135deg,var(--accent),var(--cyan));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 16px rgba(88,101,242,.4);flex-shrink:0}
  .header-title{font-size:20px;font-weight:800;letter-spacing:-.02em;background:linear-gradient(90deg,#fff,var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .header-sub{font-size:12px;color:var(--text2);margin-top:1px}
  .header-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  nav{position:sticky;top:0;z-index:100;background:rgba(8,11,20,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:2px;padding:0 20px;height:48px;overflow-x:auto}
  nav a{color:var(--text2);text-decoration:none;padding:5px 13px;border-radius:6px;white-space:nowrap;font-size:12.5px;font-weight:500;transition:all .15s;border:1px solid transparent;display:flex;align-items:center;gap:5px}
  nav a:hover{background:var(--bg4);color:var(--text);border-color:var(--border2)}
  nav a.active{background:linear-gradient(135deg,rgba(88,101,242,.25),rgba(88,101,242,.1));color:var(--accent3);border-color:rgba(88,101,242,.4);text-shadow:0 0 8px rgba(88,101,242,.5)}
  .nav-sep{width:1px;height:20px;background:var(--border2);flex-shrink:0;margin:0 6px}
  .nav-badge{display:inline-flex;align-items:center;justify-content:center;background:var(--red);color:#fff;border-radius:10px;font-size:10px;font-weight:700;padding:1px 5px;min-width:17px}
  .page{display:none;padding:24px 28px;max-width:1440px;margin:0 auto;animation:fadein .25s cubic-bezier(.4,0,.2,1)}.page.active{display:block}
  @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  section{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px 22px;margin-bottom:16px;box-shadow:var(--shadow-sm);transition:border-color .2s}
  section:hover{border-color:var(--border2)}
  section h2{font-size:13.5px;font-weight:700;color:var(--accent3);margin-bottom:14px;display:flex;align-items:center;gap:8px;letter-spacing:-.01em}
  section h2 .icon{width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(88,101,242,.25),rgba(88,101,242,.1));border:1px solid rgba(88,101,242,.25);border-radius:7px;font-size:13px;flex-shrink:0}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}
  @media(max-width:1000px){.grid-3,.grid-4{grid-template-columns:1fr 1fr}}
  @media(max-width:700px){.grid-2,.grid-3,.grid-4{grid-template-columns:1fr}}
  .stat{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius);padding:18px 20px;display:flex;flex-direction:column;gap:5px;position:relative;overflow:hidden;transition:transform .15s,border-color .2s}
  .stat:hover{transform:translateY(-1px)}
  .stat .label{font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);font-weight:600}
  .stat .value{font-size:28px;font-weight:800;letter-spacing:-.03em;line-height:1.1}
  .stat .sub{font-size:11.5px;color:var(--text2)}
  .stat.alert{border-color:rgba(239,68,68,.5);background:rgba(239,68,68,.07);box-shadow:var(--glow-r)}.stat.alert .value{color:var(--red2)}
  .stat.warn{border-color:rgba(249,115,22,.45);background:rgba(249,115,22,.07)}.stat.warn .value{color:var(--orange2)}
  .stat.ok{border-color:rgba(16,185,129,.4);background:rgba(16,185,129,.06);box-shadow:var(--glow-g)}.stat.ok .value{color:var(--green2)}
  .stat.info{border-color:rgba(88,101,242,.4);background:rgba(88,101,242,.06);box-shadow:var(--glow-a)}.stat.info .value{color:var(--accent2)}
  .badge{display:inline-flex;align-items:center;gap:5px;padding:3px 11px;border-radius:20px;font-size:11.5px;font-weight:700}
  .badge.red{background:rgba(239,68,68,.18);color:var(--red2);border:1px solid rgba(239,68,68,.4)}
  .badge.green{background:rgba(16,185,129,.15);color:var(--green2);border:1px solid rgba(16,185,129,.35)}
  .badge.orange{background:rgba(249,115,22,.15);color:var(--orange2);border:1px solid rgba(249,115,22,.35)}
  .badge.gray{background:rgba(148,163,184,.1);color:var(--text2);border:1px solid rgba(148,163,184,.2)}
  .badge.purple{background:rgba(88,101,242,.18);color:var(--accent3);border:1px solid rgba(88,101,242,.3)}
  .badge.big{font-size:14px;padding:5px 16px;border-radius:22px}
  .table-wrap{overflow-x:auto;border-radius:var(--radius-sm);border:1px solid var(--border)}
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  thead tr{background:var(--bg4)}
  th{padding:9px 14px;text-align:left;font-weight:600;color:var(--text2);font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--border2);white-space:nowrap}
  td{padding:9px 14px;border-bottom:1px solid rgba(30,37,64,.8);color:var(--text);vertical-align:top}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:rgba(88,101,242,.04)}
  .nick-grid{display:flex;flex-wrap:wrap;gap:10px}
  .nick-card{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius-sm);padding:11px 16px;min-width:150px;transition:all .18s}
  .nick-card:hover{border-color:var(--accent);background:var(--bg4);transform:translateY(-1px);box-shadow:var(--glow-a)}
  .nick-card .nick-name{font-size:15px;font-weight:700;color:var(--text);margin-bottom:5px}
  .nick-card .nick-src{font-size:11px;color:var(--text3)}
  .ias-block{background:linear-gradient(135deg,rgba(249,115,22,.07),rgba(249,115,22,.03));border:1px solid rgba(249,115,22,.25);border-left-width:3px;border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:14px 18px;margin-bottom:10px}
  .ias-block .ias-title{font-weight:700;color:var(--orange2);margin-bottom:10px;font-size:13px}
  .ias-block .ias-row{display:flex;gap:10px;margin-bottom:4px;font-size:13px}
  .ias-block .ias-key{color:var(--text3);min-width:65px;font-size:11.5px;text-transform:uppercase;letter-spacing:.05em}
  .ias-block .ias-val{color:var(--text);font-weight:600}
  .alert-box{border-radius:var(--radius-sm);padding:13px 16px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start}
  .alert-box.critical{background:linear-gradient(135deg,rgba(239,68,68,.12),rgba(239,68,68,.06));border:1px solid rgba(239,68,68,.4);box-shadow:0 2px 12px rgba(239,68,68,.15)}
  .alert-box.warning{background:linear-gradient(135deg,rgba(249,115,22,.1),rgba(249,115,22,.05));border:1px solid rgba(249,115,22,.38)}
  .alert-box.info2{background:linear-gradient(135deg,rgba(88,101,242,.1),rgba(88,101,242,.05));border:1px solid rgba(88,101,242,.3)}
  .alert-box.success{background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(16,185,129,.05));border:1px solid rgba(16,185,129,.3)}
  .alert-box .a-icon{font-size:20px;flex-shrink:0}
  .alert-box .a-title{font-weight:700;font-size:13.5px;margin-bottom:2px}
  .alert-box .a-body{font-size:12px;color:var(--text2);line-height:1.5}
  .alert-box.critical .a-title{color:var(--red2)}
  .alert-box.warning .a-title{color:var(--orange2)}
  .alert-box.success .a-title{color:var(--green2)}
  .overview-hero{background:linear-gradient(135deg,var(--bg2),var(--bg3) 50%,var(--bg2));border:1px solid var(--border2);border-radius:var(--radius);padding:24px 28px;margin-bottom:20px;position:relative;overflow:hidden}
  .overview-title{font-size:24px;font-weight:800;letter-spacing:-.03em;background:linear-gradient(90deg,#fff,var(--accent3) 60%,var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px}
  .overview-meta{font-size:12.5px;color:var(--text2);display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .overview-meta span{display:flex;align-items:center;gap:5px}
  .meta-dot{width:5px;height:5px;border-radius:50%;background:var(--border2)}
  .kv-list{display:grid;grid-template-columns:auto 1fr;gap:5px 18px;font-size:13px}
  .kv-list .kk{color:var(--text3);white-space:nowrap;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
  .kv-list .vv{color:var(--text);font-weight:500}
  .mono-block{background:var(--bg);border-radius:var(--radius-sm);padding:11px 16px;font-family:'JetBrains Mono','Consolas',monospace;font-size:11.5px;color:var(--text2);white-space:pre-wrap;word-break:break-all;max-height:320px;overflow-y:auto;border:1px solid var(--border)}
  .empty{color:var(--text3);font-style:italic;font-size:13px;padding:10px 0}
  .chip{display:inline-block;padding:2px 9px;border-radius:12px;font-size:11px;background:rgba(88,101,242,.15);color:var(--accent3);margin:2px;border:1px solid rgba(88,101,242,.2)}
  hr.section-hr{border:none;border-top:1px solid var(--border);margin:16px 0}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}
</style>
</head>
<body>
'''


# ================================================================
#  HEADER + NAV
# ================================================================

def _get_header_nav() -> str:
    return '''
<div class="site-header">
  <div class="header-inner">
    <div class="header-brand">
      <div class="header-logo">&#9732;</div>
      <div>
        <div class="header-title">CharlieRP Screen Share</div>
        <div class="header-sub">Analisi forense anti-cheat &mdash; mc.charlieroleplay.it</div>
      </div>
    </div>
    <div class="header-meta" id="header-badges"></div>
  </div>
</div>
<nav id="main-nav">
  <a href="#" class="active" onclick="showPage('overview',this)">&#127968; Overview</a>
  <span class="nav-sep"></span>
  <a href="#" onclick="showPage('nicks',this)">&#127918; Nick</a>
  <a href="#" onclick="showPage('accounts',this)">&#128100; Account</a>
  <a href="#" onclick="showPage('ias',this)">&#128260; IAS Log</a>
  <a href="#" onclick="showPage('cheats',this)" id="nav-cheats">&#128683; Cheat</a>
  <span class="nav-sep"></span>
  <a href="#" onclick="showPage('system',this)">&#128187; Sistema</a>
  <a href="#" onclick="showPage('network',this)">&#127760; Network</a>
  <a href="#" onclick="showPage('macro',this)">&#129303; Macro</a>
  <a href="#" onclick="showPage('forensics',this)">&#128269; Forensics</a>
  <a href="#" onclick="showPage('files',this)">&#128193; File</a>
</nav>
'''


# ================================================================
#  OVERVIEW PAGE
# ================================================================

def _get_overview_page(win_name, win_build, days, date_start, date_end, now_str,
                       alert_count, all_accounts, ias_entries, sys_info, cheat_alerts,
                       global_nicks, found_launchers, total_files, pf_in_range,
                       event_data, macro_data):
    n_acc = len(all_accounts)
    n_ias = len(ias_entries)
    multi_acc = n_acc > 1

    # Badges
    vm_badge = '<span class="badge red">&#9888; VM Rilevata</span>' if sys_info["is_vm"] else '<span class="badge green">&#10003; Fisico</span>'
    vpn_badge = '<span class="badge red">&#9888; VPN Attiva</span>' if sys_info["vpn_active"] else '<span class="badge green">&#10003; No VPN</span>'
    pf_badge = '<span class="badge green">Attivo</span>'
    multi_badge = '<span class="badge orange">&#9888; Multi-account</span>' if multi_acc else '<span class="badge green">&#10003; 1 account</span>'
    alert_badge = f'<span class="badge red big">&#9888; {alert_count} Alert</span>' if alert_count > 0 else '<span class="badge green big">&#10003; Tutto ok</span>'
    cheat_badge = f'<span class="badge red">&#128683; {len(cheat_alerts)} Cheat</span>' if cheat_alerts else '<span class="badge green">&#10003; No Cheat</span>'

    # Alert boxes
    alert_boxes = []
    if sys_info["is_vm"]:
        alert_boxes.append(f'<div class="alert-box critical"><div class="a-icon">&#128187;</div><div><div class="a-title">Macchina Virtuale Rilevata</div><div class="a-body">{html_escape(sys_info["vm_info"])}</div></div></div>')
    for v in sys_info["vpn_active"]:
        alert_boxes.append(f'<div class="alert-box critical"><div class="a-icon">&#128274;</div><div><div class="a-title">VPN Attiva: {html_escape(v.get("Name",""))}</div><div class="a-body">{html_escape(v.get("Desc",""))}</div></div></div>')
    if cheat_alerts:
        alert_boxes.append(f'<div class="alert-box critical"><div class="a-icon">&#128683;</div><div><div class="a-title">Cheat Client Rilevati &mdash; {len(cheat_alerts)} tracce</div><div class="a-body">Vai alla tab Cheat per i dettagli.</div></div></div>')
    if event_data.get("ev_1102"):
        alert_boxes.append(f'<div class="alert-box critical"><div class="a-icon">&#128204;</div><div><div class="a-title">Log di Sicurezza Cancellato ({len(event_data["ev_1102"])} volte)</div><div class="a-body">Evento ID 1102 nell\'intervallo</div></div></div>')
    if event_data.get("ev_4616"):
        alert_boxes.append(f'<div class="alert-box warning"><div class="a-icon">&#128336;</div><div><div class="a-title">Cambio Orario di Sistema ({len(event_data["ev_4616"])} eventi)</div><div class="a-body">Evento ID 4616 nell\'intervallo</div></div></div>')
    if multi_acc:
        alert_boxes.append(f'<div class="alert-box warning"><div class="a-icon">&#128100;</div><div><div class="a-title">Account Multipli Trovati ({n_acc})</div><div class="a-body">Verificare possibile multiaccounting</div></div></div>')
    if n_ias > 1:
        alert_boxes.append(f'<div class="alert-box warning"><div class="a-icon">&#128260;</div><div><div class="a-title">Cambi Account IAS: {n_ias}</div><div class="a-body">Più cambi account rilevati nei log</div></div></div>')

    alert_html = ""
    if alert_boxes:
        alert_html = '<section><h2><span class="icon">&#9888;</span>Alert Critici</h2>' + "\n".join(alert_boxes) + '</section>'

    # Stat classes
    c1s = "warn" if multi_acc else "ok"
    c2s = "warn" if n_ias > 0 else "ok"
    c3s = "alert" if (sys_info["is_vm"] or sys_info["vpn_active"]) else "ok"
    c5s = "alert" if cheat_alerts else "ok"

    # Launcher chips
    launcher_names = list({l["name"] for l in found_launchers})
    launcher_chips = "".join(f'<span class="chip">{html_escape(n)}</span>' for n in launcher_names) if launcher_names else '<p class="empty">Nessun launcher trovato.</p>'

    # Top nicks
    nick_cards = ""
    top_nicks = sorted(global_nicks, key=lambda n: 0 if n["source"] in ("Account JSON", "IAS Log") else 1)[:12]
    for n in top_nicks:
        nick_cards += f'<div class="nick-card"><div class="nick-name">{html_escape(n["nick"])}</div><div class="nick-src">{html_escape(n["source"])}</div></div>'
    if not global_nicks:
        nick_cards = '<p class="empty">&#9711; Nessun nick trovato.</p>'

    # Hardware
    disks_html = "".join(f'<span class="kk">Disco</span><span class="vv">{html_escape(d)}</span>' for d in sys_info.get("disks", []))

    # Nick search unique names
    unique_nicks = list({n["nick"] for n in global_nicks})

    return f'''<div class='page active' id='page-overview'>
<div class='overview-hero'>
  <div class='overview-title'>&#9732; Screen Share Analysis</div>
  <div class='overview-meta'>
    <span>&#128187; {html_escape(win_name)} Build {win_build}</span>
    <span class='meta-dot'></span>
    <span>&#128197; Analisi: ultimi {days} giorni</span>
    <span class='meta-dot'></span>
    <span>&#128337; {date_start} &rarr; {date_end}</span>
    <span class='meta-dot'></span>
    <span>{alert_badge}</span>
  </div>
</div>
{alert_html}
<div class='grid-4'>
  <div class='stat {c1s}'><div class='label'>Account trovati</div><div class='value'>{n_acc}</div><div class='sub'>{multi_badge}</div></div>
  <div class='stat {c2s}'><div class='label'>Cambi account IAS</div><div class='value'>{n_ias}</div><div class='sub'>nei log scansionati</div></div>
  <div class='stat {c3s}'><div class='label'>VM / VPN</div><div class='value'>{"ALERT" if sys_info["is_vm"] or sys_info["vpn_active"] else "OK"}</div><div class='sub'>{vm_badge} {vpn_badge}</div></div>
  <div class='stat ok'><div class='label'>Prefetch</div><div class='value'>ON</div><div class='sub'>{pf_badge}</div></div>
</div>
<div class='grid-2'>
  <div class='stat {c5s}'><div class='label'>Cheat Autodistruzione</div><div class='value'>{len(cheat_alerts)}</div><div class='sub'>{cheat_badge} &bull; {len(KNOWN_CHEATS)} cheat monitorati</div></div>
  <div class='stat info'><div class='label'>Nick univoci trovati</div><div class='value'>{len(unique_nicks)}</div><div class='sub'><span class="badge purple">{total_files} file output</span></div></div>
</div>
<div class='grid-2'>
  <section><h2><span class="icon">&#128187;</span>Hardware</h2><div class='kv-list'>
    <span class='kk'>CPU</span><span class='vv'>{html_escape(sys_info["cpu"])}</span>
    <span class='kk'>RAM</span><span class='vv'>{sys_info["ram_gb"]} GB</span>
    <span class='kk'>GPU</span><span class='vv'>{html_escape(sys_info["gpu"])}</span>
    <span class='kk'>Modello</span><span class='vv'>{html_escape(sys_info["model"])}</span>
    <span class='kk'>OS</span><span class='vv'>{html_escape(win_name)} (Build {win_build})</span>
    {disks_html}
  </div></section>
  <section><h2><span class="icon">&#127918;</span>Nick Principali</h2><div class='nick-grid'>{nick_cards}</div></section>
</div>
<section><h2><span class="icon">&#127918;</span>Launcher Trovati</h2><div style='display:flex;flex-wrap:wrap;gap:8px;'>{launcher_chips}</div></section>
</div>'''


# ================================================================
#  NICKS PAGE
# ================================================================

def _get_nicks_page(global_nicks, ias_entries):
    unique_by_name = {}
    for n in global_nicks:
        if n["nick"] not in unique_by_name:
            unique_by_name[n["nick"]] = n

    nick_cards = ""
    for nick, n in sorted(unique_by_name.items()):
        ias_match = next((e for e in ias_entries if e["name"] == nick), None)
        if ias_match:
            online = ias_match.get("online", "?")
            if online == "true":
                color = "#22c55e"
            elif online == "false":
                color = "#f97316"
            else:
                color = "#94a3b8"
            online_txt = f'<div class="nick-src" style="color:{color}">Online: {online}</div>'
        else:
            online_txt = ""
        nick_cards += f'<div class="nick-card"><div class="nick-name">{html_escape(nick)}</div><div class="nick-src">{html_escape(n["source"])}</div>{online_txt}</div>'

    # Table rows
    rows_html = ""
    for n in sorted(global_nicks, key=lambda x: x["nick"]):
        rows_html += f'<tr><td>{html_escape(n["nick"])}</td><td>{html_escape(n["source"])}</td><td>{html_escape(n["date"])}</td><td>{html_escape(n["note"])}</td></tr>'

    if not global_nicks:
        nick_cards = '<p class="empty">Nessun nick trovato.</p>'
        rows_html = '<tr><td colspan="4" class="empty">Nessun nick trovato.</td></tr>'

    return f'''<div class='page' id='page-nicks'>
<section><h2><span class="icon">&#127918;</span>Tutti i Nick Trovati &nbsp;<span class="badge purple">{len(unique_by_name)} univoci</span></h2>
<div class='nick-grid' style='margin-bottom:18px;'>{nick_cards}</div>
<hr class='section-hr'>
<h3 style='font-size:13px;color:var(--text2);margin-bottom:10px;'>Tabella completa</h3>
<div class='table-wrap'>
<table><thead><tr><th>Nick</th><th>Fonte</th><th>Data</th><th>Note</th></tr></thead><tbody>
{rows_html}
</tbody></table>
</div></section>
</div>'''


# ================================================================
#  ACCOUNTS PAGE
# ================================================================

def _get_accounts_page(all_accounts, found_launchers):
    groups = {}
    for a in all_accounts:
        launcher = a.get("launcher", "Unknown")
        if launcher not in groups:
            groups[launcher] = []
        groups[launcher].append(a)

    groups_html = ""
    for launcher, accounts in groups.items():
        rows = ""
        for a in accounts:
            rows += f'<tr><td>{html_escape(a["name"])}</td><td>{html_escape(a["uuid"])}</td><td>{html_escape(a["type"])}</td><td>{html_escape(a["online"])}</td></tr>'
        groups_html += f'''<h3 style="font-size:13px;font-weight:600;color:var(--accent2);margin:12px 0 8px;">{html_escape(launcher)}</h3>
        <div class="table-wrap" style="margin-bottom:12px;">
        <table><thead><tr><th>Nick</th><th>UUID</th><th>Tipo</th><th>Online</th></tr></thead><tbody>{rows}</tbody></table>
        </div>'''

    if not all_accounts:
        groups_html = '<p class="empty">Nessun account estratto.</p>'

    acc_badge = f'<span class="badge orange">&#9888; {len(all_accounts)} account</span>' if len(all_accounts) > 1 else f'<span class="badge green">&#10003; {len(all_accounts)} account</span>'

    return f'''<div class='page' id='page-accounts'>
<section><h2><span class="icon">&#128100;</span>Account Estratti dai JSON &nbsp;{acc_badge}</h2>{groups_html}</section>
</div>'''


# ================================================================
#  IAS PAGE
# ================================================================

def _get_ias_page(ias_entries):
    if not ias_entries:
        return '''<div class='page' id='page-ias'>
<section><h2><span class="icon">&#128260;</span>InGame Account Switcher - Log</h2>
<p class="empty">Nessun cambio account IAS trovato.</p></section></div>'''

    blocks_html = ""
    for i, blk in enumerate(ias_entries, 1):
        online = blk.get("online", "?")
        color = "#22c55e" if online == "true" else ("#f97316" if online == "false" else "#94a3b8")
        label = "OFFLINE / CRACKED" if online == "false" else ("Online (premium)" if online == "true" else "Sconosciuto")
        blocks_html += f'''<div class="ias-block">
<div class="ias-title">Cambio #{i} &mdash; {html_escape(blk["name"])}</div>
<div class="ias-row"><span class="ias-key">Orario</span><span class="ias-val">{html_escape(blk.get("time","?"))}</span></div>
<div class="ias-row"><span class="ias-key">Nick</span><span class="ias-val" style="font-size:15px;">{html_escape(blk["name"])}</span></div>
<div class="ias-row"><span class="ias-key">UUID</span><span class="ias-val" style="font-family:monospace;">{html_escape(blk.get("uuid","?"))}</span></div>
<div class="ias-row"><span class="ias-key">Online</span><span class="ias-val" style="color:{color};">{label}</span></div>
<div class="ias-row"><span class="ias-key">Launcher</span><span class="ias-val">{html_escape(blk.get("launcher","?"))}</span></div>
</div>'''

    warn = ""
    if len(ias_entries) > 1:
        warn = f'<div class="alert-box warning" style="margin-bottom:14px;"><div class="a-icon">&#9888;</div><div><div class="a-title">{len(ias_entries)} cambi account rilevati</div><div class="a-body">Possibile multiaccounting in sessione</div></div></div>'

    # Table
    rows = ""
    for blk in ias_entries:
        rows += f'<tr><td>{html_escape(blk.get("time","?"))}</td><td>{html_escape(blk["name"])}</td><td style="font-family:monospace;">{html_escape(blk.get("uuid","?"))}</td><td>{html_escape(blk.get("online","?"))}</td><td>{html_escape(blk.get("launcher","?"))}</td></tr>'

    return f'''<div class='page' id='page-ias'>
<section><h2><span class="icon">&#128260;</span>InGame Account Switcher - Log</h2>
{warn}{blocks_html}
<hr class="section-hr">
<h3 style="font-size:13px;font-weight:600;color:var(--accent2);margin-bottom:8px;">Tabella riepilogo</h3>
<div class="table-wrap">
<table><thead><tr><th>Orario</th><th>Nick</th><th>UUID</th><th>Online</th><th>Launcher</th></tr></thead><tbody>{rows}</tbody></table>
</div></section></div>'''


# ================================================================
#  CHEATS PAGE
# ================================================================

def _get_cheats_page(cheat_alerts):
    banner = ""
    if cheat_alerts:
        banner = f'<div class="alert-box critical" style="margin-bottom:18px;"><div class="a-icon">&#9888;</div><div><div class="a-title">{len(cheat_alerts)} TRACCE DI CHEAT RILEVATE</div><div class="a-body">Trovate tracce di cheat client noti nel sistema.</div></div></div>'
    else:
        banner = '<div class="alert-box info2" style="margin-bottom:18px;"><div class="a-icon">&#10003;</div><div><div class="a-title">Nessuna traccia di cheat rilevata</div></div></div>'

    # Alert table
    alert_rows = ""
    for a in cheat_alerts:
        alert_rows += f'<tr><td>{html_escape(a.get("tipo",""))}</td><td>{html_escape(a.get("cheat",""))}</td><td>{html_escape(a.get("dettaglio",""))}</td><td>{html_escape(a.get("drive",""))}</td></tr>'

    # Cheat database
    cheat_cards = ""
    for cn in [c.name for c in KNOWN_CHEATS]:
        has_hit = any(a.get("cheat") == cn for a in cheat_alerts)
        border = "var(--red)" if has_hit else "var(--border)"
        dot = "var(--red)" if has_hit else "var(--text3)"
        status = "TRACCIA RILEVATA" if has_hit else "Non trovato"
        prefix = '<span style="color:var(--red);">&#9888; </span>' if has_hit else ""
        cheat_cards += f'''<div class="nick-card" style="border-color:{border};">
<div class="nick-name" style="font-size:13px;">{prefix}{html_escape(cn)}</div>
<div class="nick-src"><span class="nick-dot" style="background:{dot};width:6px;height:6px;border-radius:50%;display:inline-block;"></span> {status}</div>
</div>'''

    return f'''<div class='page' id='page-cheats'>
{banner}
<section><h2><span class="icon">&#128683;</span>Riepilogo Alert Cheat Self-Destruct</h2>
<div class="table-wrap">
{"<table><thead><tr><th>Tipo</th><th>Cheat</th><th>Dettaglio</th><th>Drive</th></tr></thead><tbody>" + alert_rows + "</tbody></table>" if alert_rows else '<p class="empty">Nessun alert.</p>'}
</div></section>
<section><h2><span class="icon">&#128203;</span>Cheat Client Monitorati</h2>
<div class="nick-grid">{cheat_cards}</div></section>
</div>'''


# ================================================================
#  SYSTEM PAGE
# ================================================================

def _get_system_page(sys_info, event_data):
    disks_html = "".join(f'<span class="kk">Disco</span><span class="vv">{html_escape(d)}</span>' for d in sys_info.get("disks", []))

    vm_box = ""
    if sys_info["is_vm"]:
        vm_box = f'<div class="alert-box critical" style="margin-bottom:10px;"><div class="a-icon">&#9888;</div><div><div class="a-title">Macchina Virtuale</div><div class="a-body">{html_escape(sys_info["vm_info"])}</div></div></div>'
    else:
        vm_box = f'<div class="alert-box info2" style="margin-bottom:10px;"><div class="a-icon">&#10003;</div><div><div class="a-title">Hardware fisico</div><div class="a-body">{html_escape(sys_info["model"])}</div></div></div>'

    vpn_boxes = ""
    for v in sys_info["vpn_active"]:
        vpn_boxes += f'<div class="alert-box critical" style="margin-bottom:6px;"><div class="a-icon">&#128274;</div><div><div class="a-title">VPN: {html_escape(v.get("Name",""))}</div><div class="a-body">{html_escape(v.get("Desc",""))}</div></div></div>'
    if not vpn_boxes:
        vpn_boxes = '<div class="alert-box info2"><div class="a-icon">&#10003;</div><div><div class="a-title">Nessuna VPN attiva</div></div></div>'

    return f'''<div class='page' id='page-system'>
<div class='grid-2'>
<section><h2><span class="icon">&#128187;</span>Hardware</h2><div class='kv-list'>
  <span class='kk'>CPU</span><span class='vv'>{html_escape(sys_info["cpu"])}</span>
  <span class='kk'>RAM</span><span class='vv'>{sys_info["ram_gb"]} GB</span>
  <span class='kk'>GPU</span><span class='vv'>{html_escape(sys_info["gpu"])}</span>
  <span class='kk'>Modello</span><span class='vv'>{html_escape(sys_info["model"])}</span>
  <span class='kk'>Produttore</span><span class='vv'>{html_escape(sys_info["manufacturer"])}</span>
  {disks_html}
</div></section>
<section><h2><span class="icon">&#128274;</span>VM &amp; VPN</h2>{vm_box}{vpn_boxes}</section>
</div></div>'''


# ================================================================
#  NETWORK PAGE
# ================================================================

def _get_network_page(net_data):
    tcp_rows = ""
    for c in net_data.get("tcp_conns", []):
        tcp_rows += f'<tr><td style="font-family:monospace;">{html_escape(c.get("Local",""))}</td><td style="font-family:monospace;">{html_escape(c.get("Remote",""))}</td><td>{html_escape(str(c.get("PID","")))}</td><td>{html_escape(c.get("Process",""))}</td></tr>'

    hosts_html = ""
    for h in net_data.get("hosts_entries", []):
        hosts_html += f'{html_escape(h)}\n'

    dns_rows = ""
    for d in net_data.get("dns_cache", []):
        dns_rows += f'<tr><td>{html_escape(d.get("entry",""))}</td><td>{html_escape(d.get("data",""))}</td><td>{html_escape(d.get("type",""))}</td></tr>'

    return f'''<div class='page' id='page-network'>
<section><h2><span class="icon">&#127760;</span>Connessioni TCP Attive</h2><div class="table-wrap">
<table><thead><tr><th>Locale</th><th>Remoto</th><th>PID</th><th>Processo</th></tr></thead><tbody>
{"<tr><td colspan='4' class='empty'>Nessuna connessione attiva.</td></tr>" if not tcp_rows else tcp_rows}
</tbody></table></div></section>
<div class='grid-2'>
<section><h2><span class="icon">&#128196;</span>File Hosts</h2>
{"<div class='mono-block'>" + hosts_html + "</div>" if hosts_html else '<p class="empty">Nessuna voce personalizzata.</p>'}
</section>
<section><h2><span class="icon">&#127881;</span>DNS Cache (prime 50)</h2><div class="table-wrap">
<table><thead><tr><th>Entry</th><th>Data</th><th>Type</th></tr></thead><tbody>
{"<tr><td colspan='3' class='empty'>Cache DNS vuota.</td></tr>" if not dns_rows else dns_rows}
</tbody></table></div></section>
</div></div>'''


# ================================================================
#  MACRO PAGE
# ================================================================

def _get_macro_page(macro_data):
    rows = ""
    for m in macro_data:
        in_range = "SI" if m.get("in_range") else "no"
        rows += f'<tr><td>{html_escape(m.get("name",""))}</td><td>{in_range}</td><td>{html_escape(m.get("date",""))}</td><td>{html_escape(m.get("path",""))}</td></tr>'

    return f'''<div class='page' id='page-macro'>
<section><h2><span class="icon">&#127918;</span>Software Macro / Gaming Trovati</h2>
{"<div class='table-wrap'><table><thead><tr><th>Software</th><th>Nel Intervallo</th><th>Ultima Modifica</th><th>Path</th></tr></thead><tbody>" + rows + "</tbody></table></div>" if rows else '<p class="empty">Nessun software macro trovato.</p>'}
</section></div>'''


# ================================================================
#  FORENSICS PAGE
# ================================================================

def _get_forensics_page(event_data):
    # PS History
    ps_susp = event_data.get("ps_suspicious", [])
    ps_box = ""
    if ps_susp:
        susp_lines = "\n".join(html_escape(s) for s in ps_susp[:20])
        ps_box = f'<div class="alert-box warning" style="margin-bottom:10px;"><div class="a-icon">&#9888;</div><div><div class="a-title">{len(ps_susp)} righe sospette nella history PS</div></div></div><div class="mono-block">{susp_lines}</div>'

    users = event_data.get("users", [])
    users_html = ""
    for u in users:
        users_html += f'<tr><td>{html_escape(u.get("Name",""))}</td><td style="font-family:monospace;">{html_escape(u.get("SID",""))}</td><td>{u.get("Disabled",False)}</td></tr>'

    return f'''<div class='page' id='page-forensics'>
<section><h2><span class="icon">&#9998;</span>PowerShell History</h2>{ps_box if ps_box else '<p class="empty">Nessuna history PS.</p>'}</section>
<section><h2><span class="icon">&#128101;</span>Utenti di Sistema</h2><div class="table-wrap">
<table><thead><tr><th>Nome</th><th>SID</th><th>Disabilitato</th></tr></thead><tbody>
{"<tr><td colspan='3' class='empty'>Nessun utente.</td></tr>" if not users_html else users_html}
</tbody></table></div></section>
</div>'''


# ================================================================
#  FILES PAGE
# ================================================================

def _get_files_page(root_dir, total_files):
    rows = ""
    if os.path.isdir(root_dir):
        for d in sorted(os.listdir(root_dir)):
            dp = os.path.join(root_dir, d)
            if os.path.isdir(dp):
                cnt = len([f for f in os.listdir(dp) if os.path.isfile(os.path.join(dp, f))])
                rows += f'<tr><td>{html_escape(d)}</td><td>{cnt}</td><td style="font-family:monospace;font-size:11px;">{html_escape(dp)}</td></tr>'

    return f'''<div class='page' id='page-files'>
<section><h2><span class="icon">&#128193;</span>File di Output &mdash; {total_files} file totali</h2>
<p style="color:var(--text2);font-size:12px;margin-bottom:14px;">Cartella: <code style="background:var(--bg3);padding:2px 6px;border-radius:4px;">{html_escape(root_dir)}</code></p>
<div class="table-wrap">
<table><thead><tr><th>Modulo</th><th>File</th><th>Path</th></tr></thead><tbody>{rows}</tbody></table>
</div></section></div>'''


# ================================================================
#  JAVASCRIPT
# ================================================================

def _get_js() -> str:
    return '''
<script>
function showPage(id, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    el.classList.add('active');
    window.scrollTo(0,0);
}
</script>
</body></html>
'''
