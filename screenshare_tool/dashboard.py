"""
Final HTML dashboard generation module.

Builds a single, self-contained HTML report (inline CSS + inline JS only,
zero external/CDN calls) summarising every module's findings at the end of
a scan. Opened automatically from __main__.py at the end of main().

Designed to read as professional forensic tooling: a KPI summary up top,
then one section per module with real tables and a few small inline-SVG
charts where a chart genuinely helps (counts per cheat category, accounts
per launcher) — never a chart where a table would be clearer.
"""

import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from . import __version__
from .utils import html_escape

# ================================================================
#  COLOR SYSTEM
# ================================================================
# Light/dark values mirror the dataviz reference palette: one sequential
# blue hue is used for every magnitude bar chart (counts per category),
# and the reserved status colors (good/warning/critical/muted) are used
# wherever a value represents a state rather than a plain magnitude.
# See the inline CSS custom properties in _PAGE_TEMPLATE for the exact
# light/dark hex steps.


def _esc(value: Any) -> str:
    return html_escape(value)


def _fmt_int(n: Any) -> str:
    try:
        return f"{int(n):,}".replace(",", ".")
    except (TypeError, ValueError):
        return _esc(n)


def _safe(d: Optional[dict], key: str, default=None):
    if not isinstance(d, dict):
        return default
    v = d.get(key, default)
    return default if v is None else v


# ================================================================
#  SMALL HTML-BUILDING HELPERS
# ================================================================

def _stat_tile(label: str, value: str, status: str = "") -> str:
    """One KPI stat tile. status in {"", "good", "warning", "critical"}."""
    cls = f"tile tile-{status}" if status else "tile"
    return (
        f'<div class="{cls}">'
        f'<div class="tile-value">{_esc(value)}</div>'
        f'<div class="tile-label">{_esc(label)}</div>'
        f'</div>'
    )


def _table(headers: List[str], rows: List[List[str]], empty_msg: str,
           cap: Optional[int] = None, total: Optional[int] = None) -> str:
    """Generic data table, already-escaped cell strings expected in rows."""
    if not rows:
        return f'<p class="empty-state">{_esc(empty_msg)}</p>'
    shown = rows if cap is None else rows[:cap]
    note = ""
    real_total = total if total is not None else len(rows)
    if cap is not None and real_total > cap:
        note = (f'<p class="table-note">Vengono mostrate le prime {cap} '
                f'righe su {_fmt_int(real_total)} totali. Il dettaglio '
                f'completo e nel report testuale del modulo.</p>')
    thead = "".join(f"<th>{_esc(h)}</th>" for h in headers)
    tbody = "".join(
        "<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>"
        for row in shown
    )
    return (
        '<div class="table-wrap">'
        f'<table><thead><tr>{thead}</tr></thead><tbody>{tbody}</tbody></table>'
        '</div>' + note
    )


def _bar_chart(title: str, items: List[tuple], max_items: int = 10,
               unit: str = "") -> str:
    """
    Horizontal single-hue (sequential) bar chart as inline SVG.
    items: list of (label, count), any order — sorted desc here.
    """
    items = sorted(items, key=lambda x: x[1], reverse=True)[:max_items]
    if not items:
        return ""
    max_count = max((c for _, c in items), default=0) or 1
    row_h = 28
    gap = 10
    label_w = 190
    chart_w = 420
    svg_w = label_w + chart_w + 60
    svg_h = len(items) * (row_h + gap) + gap

    bars = []
    for i, (label, count) in enumerate(items):
        y = gap + i * (row_h + gap)
        bar_w = max(4, round((count / max_count) * chart_w))
        bars.append(
            f'<text x="{label_w - 10}" y="{y + row_h / 2 + 4}" '
            f'text-anchor="end" class="bar-label">{_esc(label)}</text>'
            f'<rect x="{label_w}" y="{y}" width="{bar_w}" height="{row_h}" '
            f'rx="4" class="bar-fill"/>'
            f'<text x="{label_w + bar_w + 8}" y="{y + row_h / 2 + 4}" '
            f'class="bar-value">{_fmt_int(count)}{_esc(unit)}</text>'
        )
    svg = (
        f'<svg viewBox="0 0 {svg_w} {svg_h}" width="100%" '
        f'height="{svg_h}" role="img" aria-label="{_esc(title)}" '
        f'class="bar-chart">' + "".join(bars) + "</svg>"
    )
    return f'<div class="chart-block"><h4>{_esc(title)}</h4>{svg}</div>'


def _status_stacked_bar(title: str, segments: List[tuple]) -> str:
    """
    One full-width stacked bar made of (label, count, status_role) segments.
    status_role in {"good", "critical", "muted"}. Always ships a legend
    (icon swatch + label + count) so identity never rides on hue alone.
    """
    segments = [s for s in segments if s[1] > 0]
    total = sum(c for _, c, _ in segments)
    if total == 0:
        return ""
    svg_w = 760
    h = 28
    x = 0
    rects = []
    legend = []
    for label, count, role in segments:
        w = round((count / total) * svg_w)
        rects.append(f'<rect x="{x}" y="0" width="{max(w,1)}" height="{h}" class="seg seg-{role}"/>')
        x += w
        pct = round((count / total) * 100)
        legend.append(
            f'<span class="legend-item"><span class="swatch swatch-{role}"></span>'
            f'{_esc(label)}: <b>{_fmt_int(count)}</b> ({pct}%)</span>'
        )
    svg = (
        f'<svg viewBox="0 0 {svg_w} {h}" width="100%" height="{h}" '
        f'role="img" aria-label="{_esc(title)}" class="stacked-bar">'
        + "".join(rects) + "</svg>"
    )
    return (
        f'<div class="chart-block"><h4>{_esc(title)}</h4>{svg}'
        f'<div class="legend-row">{"".join(legend)}</div></div>'
    )


def _section(anchor: str, title: str, subtitle: str, body: str) -> str:
    return (
        f'<section class="card" id="{anchor}">'
        f'<div class="card-header"><h2>{_esc(title)}</h2>'
        f'<p class="card-subtitle">{_esc(subtitle)}</p></div>'
        f'<div class="card-body">{body}</div>'
        f'</section>'
    )


# ================================================================
#  MAIN ENTRY POINT
# ================================================================

def generate_dashboard(
    mc_data: Dict[str, Any],
    bam_total: int,
    pf_in_range: int,
    event_data: Dict[str, Any],
    sys_info: Dict[str, Any],
    net_data: Dict[str, Any],
    cheat_alerts: List[Dict[str, str]],
    global_nicks: List[Dict[str, str]],
    macro_data: List[Dict[str, Any]],
    win_name: str,
    win_build: int,
    days: int,
    date_limit: datetime,
    root_dir: str,
    ts: str,
) -> str:
    """
    Build the final self-contained HTML dashboard and write it to root_dir.
    Returns the full path of the written file.
    """
    all_accounts = _safe(mc_data, "all_accounts", []) or []
    ias_log_entries = _safe(mc_data, "ias_log_entries", []) or []
    found_launchers = _safe(mc_data, "found_launchers", []) or []
    total_ias = _safe(mc_data, "total_ias", 0) or 0

    n_accounts = len(all_accounts)
    n_ias = total_ias
    n_nicks = len(global_nicks or [])
    n_cheat = len(cheat_alerts or [])
    distinct_names = sorted({str(a.get("name", "")).lower() for a in all_accounts if a.get("name")})
    n_distinct = len(distinct_names)

    now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    date_limit_str = date_limit.strftime("%d/%m/%Y %H:%M:%S")

    # ---------------- KPI row ----------------
    kpi_tiles = [
        _stat_tile("Account launcher trovati", _fmt_int(n_accounts),
                   "warning" if n_distinct > 1 else ""),
        _stat_tile("Cambi account IAS", _fmt_int(n_ias),
                   "warning" if n_ias > 1 else ""),
        _stat_tile("Nickname univoci", _fmt_int(n_nicks)),
        _stat_tile("Alert autodistruzione cheat", _fmt_int(n_cheat),
                   "critical" if n_cheat > 0 else "good"),
        _stat_tile("Esecuzioni BAM nell'intervallo", _fmt_int(bam_total)),
        _stat_tile("File Prefetch nell'intervallo", _fmt_int(pf_in_range)),
        _stat_tile("Macchina virtuale", "SI" if _safe(sys_info, "is_vm", False) else "NO",
                   "warning" if _safe(sys_info, "is_vm", False) else "good"),
        _stat_tile("VPN attiva", _fmt_int(len(_safe(sys_info, "vpn_active", []) or [])),
                   "warning" if _safe(sys_info, "vpn_active", []) else ""),
    ]

    # ---------------- Minecraft / account section ----------------
    launcher_rows = []
    for l in found_launchers:
        launcher_rows.append([
            _esc(l.get("name", "?")),
            _esc(l.get("root", "?")),
        ])
    launcher_table = _table(["Launcher", "Percorso"], launcher_rows,
                             "Nessun launcher Minecraft rilevato sul sistema.")

    acc_rows = []
    for a in all_accounts:
        online = str(a.get("online", "?"))
        offline_flag = ' <span class="pill pill-critical">OFFLINE/CRACKED</span>' if online.lower() == "false" else ""
        acc_rows.append([
            f'{_esc(a.get("name", "?"))}{offline_flag}',
            _esc(a.get("uuid", "N/D") or "N/D"),
            _esc(a.get("type", "?")),
            _esc(a.get("launcher", "?")),
            _esc(online),
        ])
    acc_table = _table(["Nickname", "UUID", "Tipo", "Launcher", "Online"], acc_rows,
                        "Nessun account estratto dai launcher trovati.", cap=200)

    ias_rows = []
    for e in sorted(ias_log_entries, key=lambda x: x.get("time", "")):
        ias_rows.append([
            _esc(e.get("time", "?")),
            _esc(e.get("name", "?")),
            _esc(e.get("uuid", "?")),
            _esc(e.get("online", "?")),
            _esc(e.get("launcher", "?")),
        ])
    ias_table = _table(["Orario", "Nickname", "UUID", "Online", "Launcher"], ias_rows,
                        "Nessun cambio account IAS rilevato nei log Minecraft.", cap=200)

    launcher_counts = {}
    for a in all_accounts:
        launcher_counts[a.get("launcher", "?")] = launcher_counts.get(a.get("launcher", "?"), 0) + 1
    launcher_chart = _bar_chart("Account trovati per launcher", list(launcher_counts.items()))

    n_offline = sum(1 for a in all_accounts if str(a.get("online", "?")).lower() == "false")
    n_online = sum(1 for a in all_accounts if str(a.get("online", "?")).lower() == "true")
    n_unknown = n_accounts - n_offline - n_online
    status_chart = _status_stacked_bar(
        "Stato account (online / offline-cracked / sconosciuto)",
        [("Online (legittimo)", n_online, "good"),
         ("Offline / cracked", n_offline, "critical"),
         ("Stato sconosciuto", n_unknown, "muted")],
    )

    multi_acc_banner = (
        '<p class="alert-banner">Rilevati più username distinti: '
        'verificare possibile multiaccounting.</p>'
    ) if n_distinct > 1 else ""
    ias_banner = (
        '<p class="alert-banner">Rilevati cambi account IAS nei log: verificare.</p>'
    ) if n_ias > 1 else ""

    mc_body = (
        f'<div class="kpi-mini">'
        f'<span>Launcher rilevati: <b>{_fmt_int(len(found_launchers))}</b></span>'
        f'<span>Username distinti: <b>{_fmt_int(n_distinct)}</b></span>'
        f'<span>Account offline/cracked: <b>{_fmt_int(n_offline)}</b></span>'
        f'</div>'
        f'{multi_acc_banner}'
        f'{ias_banner}'
        f'<h3>Launcher Minecraft rilevati</h3>{launcher_table}'
        f'<div class="chart-grid">{launcher_chart}{status_chart}</div>'
        f'<h3>Account estratti</h3>{acc_table}'
        f'<h3>Cambi account IAS (log)</h3>{ias_table}'
    )

    # ---------------- Cheat self-destruction section ----------------
    cheat_rows = []
    cheat_counts: Dict[str, int] = {}
    tipo_counts: Dict[str, int] = {}
    for a in (cheat_alerts or []):
        cheat_name = a.get("cheat", "Sconosciuto") or "Sconosciuto"
        cheat_counts[cheat_name] = cheat_counts.get(cheat_name, 0) + 1
        tipo_counts[a.get("tipo", "?")] = tipo_counts.get(a.get("tipo", "?"), 0) + 1
        cheat_rows.append([
            _esc(a.get("tipo", "?")),
            f'<span class="pill pill-critical">{_esc(cheat_name)}</span>',
            _esc(a.get("dettaglio", "")),
            _esc(a.get("drive", "-")),
        ])
    cheat_table = _table(["Tipo rilevamento", "Cheat", "Dettaglio", "Drive"], cheat_rows,
                          "Nessuna traccia di cheat client o autodistruzione rilevata.", cap=300)
    cheat_chart = _bar_chart("Alert per categoria cheat", list(cheat_counts.items()))
    tipo_chart = _bar_chart("Alert per tipo di rilevamento", list(tipo_counts.items()))

    cheat_body = (
        f'<div class="chart-grid">{cheat_chart}{tipo_chart}</div>'
        f'<h3>Dettaglio alert</h3>{cheat_table}'
    )

    # ---------------- BAM / Prefetch section ----------------
    bam_pf_body = (
        '<div class="kpi-mini">'
        f'<span>Esecuzioni BAM nell\'intervallo: <b>{_fmt_int(bam_total)}</b></span>'
        f'<span>File .pf Prefetch nell\'intervallo: <b>{_fmt_int(pf_in_range)}</b></span>'
        '</div>'
        '<p class="table-note">Il dettaglio completo di ogni esecuzione '
        '(percorso ricostruito, utente, firma Authenticode) e nei report '
        'testuali <code>11_Regedit\\BAM_AstroSS_*.txt</code> e '
        '<code>12_Prefetch\\Lista_*.txt</code>.</p>'
    )

    # ---------------- Nickname section ----------------
    nick_rows = []
    for n in global_nicks or []:
        nick_rows.append([
            _esc(n.get("nick", "?")),
            _esc(n.get("source", "?")),
            _esc(n.get("date", "") or "-"),
            _esc(n.get("note", "") or "-"),
        ])
    nick_table = _table(["Nickname", "Fonte", "Data", "Note"], nick_rows,
                         "Nessun nickname trovato sul sistema.", cap=300,
                         total=len(global_nicks or []))
    nick_body = (
        f'<div class="kpi-mini"><span>Nickname univoci trovati: '
        f'<b>{_fmt_int(n_nicks)}</b></span></div>{nick_table}'
    )

    # ---------------- Macro software section ----------------
    macro_rows = []
    for m in macro_data or []:
        tag = "pill-warning" if m.get("in_range") else "pill-muted"
        tag_text = "Modificato nell'intervallo" if m.get("in_range") else "Trovato (fuori intervallo)"
        macro_rows.append([
            _esc(m.get("name", "?")),
            _esc(m.get("path", "?")),
            f'<span class="pill {tag}">{tag_text}</span>',
            _esc(m.get("date", "N/D")),
        ])
    macro_table = _table(["Software", "Percorso", "Stato", "Ultima modifica"], macro_rows,
                          "Nessun software macro/gaming rilevato sul sistema.")
    macro_body = macro_table

    # ---------------- System info section ----------------
    vpn_list = _safe(sys_info, "vpn_active", []) or []
    vpn_rows = [[_esc(v.get("Name", "?")), _esc(v.get("Desc", "?"))] for v in vpn_list]
    vpn_table = _table(["Interfaccia", "Descrizione"], vpn_rows, "Nessuna VPN/tunnel attivo rilevato.")
    sys_kv = [
        ("Sistema operativo", f"{win_name} (Build {win_build})"),
        ("Macchina virtuale", ("SI - " + str(_safe(sys_info, "vm_info", ""))) if _safe(sys_info, "is_vm", False) else "NO"),
        ("CPU", _safe(sys_info, "cpu", "N/D")),
        ("RAM", f"{_safe(sys_info, 'ram_gb', 0)} GB"),
        ("GPU", _safe(sys_info, "gpu", "N/D")),
        ("Modello", _safe(sys_info, "model", "N/D")),
        ("Produttore", _safe(sys_info, "manufacturer", "N/D")),
    ]
    sys_table = _table(["Parametro", "Valore"],
                        [[_esc(k), _esc(v)] for k, v in sys_kv], "N/D")
    sys_body = f'{sys_table}<h3>VPN / Tunnel attivi</h3>{vpn_table}'

    # ---------------- Network section ----------------
    tcp_rows = []
    for c in (_safe(net_data, "tcp_conns", []) or [])[:150]:
        if isinstance(c, dict):
            tcp_rows.append([
                _esc(c.get("Local") or c.get("local", "")),
                _esc(c.get("Remote") or c.get("remote", "")),
                _esc(c.get("PID") or c.get("pid", "")),
                _esc(c.get("Process") or c.get("process") or c.get("proc", "")),
            ])
    tcp_table = _table(["Locale", "Remoto", "PID", "Processo"], tcp_rows,
                        "Nessuna connessione TCP attiva rilevata.",
                        cap=150, total=len(_safe(net_data, "tcp_conns", []) or []))

    dns_rows = []
    for d in (_safe(net_data, "dns_cache", []) or [])[:50]:
        if isinstance(d, dict):
            dns_rows.append([_esc(d.get("entry", "")), _esc(d.get("data", ""))])
    dns_table = _table(["Voce DNS", "Risoluzione"], dns_rows, "Cache DNS vuota o non disponibile.")

    hosts_rows = [[_esc(h)] for h in (_safe(net_data, "hosts_entries", []) or [])]
    hosts_table = _table(["Voce"], hosts_rows, "Nessuna voce personalizzata nel file hosts.")

    net_body = (
        f'<h3>Connessioni TCP attive</h3>{tcp_table}'
        f'<h3>Cache DNS</h3>{dns_table}'
        f'<h3>File hosts</h3>{hosts_table}'
    )

    # ---------------- Events / misc section ----------------
    users_rows = []
    for u in _safe(event_data, "users", []) or []:
        users_rows.append([
            _esc(u.get("Name", "?")),
            _esc(u.get("SID", "?")),
            _esc(str(u.get("Disabled", "?"))),
            _esc(str(u.get("Local", "?"))),
        ])
    users_table = _table(["Utente", "SID", "Disabilitato", "Locale"], users_rows,
                          "Nessun utente di sistema recuperato.")

    susp_rows = [[_esc(s)] for s in (_safe(event_data, "ps_suspicious", []) or [])]
    susp_table = _table(["Comando PowerShell sospetto"], susp_rows,
                         "Nessun comando PowerShell sospetto nella cronologia.", cap=100)

    ev_counts = {
        "Cambio orario di sistema (ID 4616)": len(_safe(event_data, "ev_4616", []) or []),
        "Eliminazione Event Log (ID 1102)": len(_safe(event_data, "ev_1102", []) or []),
        "Eliminazione USN Journal (ID 3079)": len(_safe(event_data, "ev_3079", []) or []),
        "Volume Snapshot (ID 116/117)": len(_safe(event_data, "volume_snapshots", []) or []),
        "Crash dump recenti": len(_safe(event_data, "crash_dumps", []) or []),
    }
    ev_chart = _bar_chart("Eventi di sistema sospetti per categoria", list(ev_counts.items()))

    events_body = (
        f'{ev_chart}'
        f'<h3>Comandi PowerShell sospetti</h3>{susp_table}'
        f'<h3>Utenti di sistema</h3>{users_table}'
    )

    # ================================================================
    #  ASSEMBLE PAGE
    # ================================================================
    sections = [
        _section("minecraft", "Minecraft e account", "Launcher, account estratti e cambi account IAS", mc_body),
        _section("cheat", "Autodistruzione cheat client", "Tracce di cheat client e meccanismi di self-delete", cheat_body),
        _section("bam-prefetch", "BAM e Prefetch", "Ultime esecuzioni e cronologia avvio applicazioni", bam_pf_body),
        _section("nicknames", "Ricerca nickname", "Nickname Minecraft individuati su tutto il sistema", nick_body),
        _section("macro", "Software macro/gaming", "Periferiche e software che possono eseguire macro", macro_body),
        _section("system", "Informazioni di sistema", "Hardware, macchina virtuale, VPN", sys_body),
        _section("network", "Rete", "Connessioni TCP, cache DNS, file hosts", net_body),
        _section("events", "Varie / Event Log", "Manomissioni di sistema, utenti, PowerShell", events_body),
    ]

    nav_links = "".join(
        f'<a href="#{s_id}">{s_label}</a>' for s_id, s_label in [
            ("minecraft", "Minecraft"), ("cheat", "Cheat"), ("bam-prefetch", "BAM/Prefetch"),
            ("nicknames", "Nickname"), ("macro", "Macro"), ("system", "Sistema"),
            ("network", "Rete"), ("events", "Varie"),
        ]
    )

    html_doc = _PAGE_TEMPLATE.format(
        version=_esc(__version__),
        win_name=_esc(win_name),
        win_build=_esc(win_build),
        days=_esc(days),
        date_limit=_esc(date_limit_str),
        now=_esc(now_str),
        root_dir=_esc(root_dir),
        nav_links=nav_links,
        kpi_tiles="".join(kpi_tiles),
        sections="".join(sections),
    )

    out_path = os.path.join(root_dir, f"DASHBOARD_{ts}.html")
    os.makedirs(root_dir, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html_doc)
    return out_path


# ================================================================
#  PAGE TEMPLATE (CSS + structure)
# ================================================================

_PAGE_TEMPLATE = """<!doctype html>
<html lang="it" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ScreenShareTool — Dashboard</title>
<style>
  :root {{
    color-scheme: dark;
    --bg: #000000;
    --surface-1: #0a0a0a;
    --surface-2: #111111;
    --text-primary: #ffffff;
    --text-secondary: #c8c8c8;
    --text-muted: #8a8a8a;
    --gridline: rgba(255,255,255,0.06);
    --border: rgba(255,255,255,0.08);
    --accent: #7eb6ff;
    --glow: rgba(70,130,255,0.35);
    --chart-seq: #7eb6ff;
    --status-good: #4ade9b;
    --status-warning: #fbbf24;
    --status-critical: #ff5c5c;
    --status-muted: #6a6a6a;
  }}
  :root[data-theme="light"] {{
    color-scheme: light;
    --bg: #f4f4f5;
    --surface-1: #ffffff;
    --surface-2: #f0f0f2;
    --text-primary: #0a0a0a;
    --text-secondary: #3f3f46;
    --text-muted: #71717a;
    --gridline: rgba(0,0,0,0.06);
    --border: rgba(0,0,0,0.1);
    --accent: #2563eb;
    --glow: rgba(37,99,235,0.18);
    --chart-seq: #2563eb;
    --status-good: #16a34a;
    --status-warning: #ca8a04;
    --status-critical: #dc2626;
    --status-muted: #a1a1aa;
  }}
  * {{ box-sizing: border-box; }}
  html, body {{
    margin: 0; padding: 0;
    background: var(--bg);
    color: var(--text-primary);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 15px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }}
  body::before {{
    content: "";
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 40% at 8% 100%, rgba(50,110,255,0.22), transparent 55%),
      radial-gradient(ellipse 40% 30% at 92% 0%, rgba(80,90,200,0.1), transparent 50%);
    pointer-events: none;
    z-index: 0;
  }}
  :root[data-theme="light"] body::before {{ opacity: 0.35; }}
  a {{ color: var(--accent); }}
  code {{
    background: var(--surface-2);
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 0.88em;
    border: 1px solid var(--border);
  }}

  .viz-root {{ position: relative; z-index: 1; }}

  .topbar {{
    position: sticky; top: 0; z-index: 10;
    background: rgba(0,0,0,0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
  }}
  :root[data-theme="light"] .topbar {{ background: rgba(244,244,245,0.85); }}
  .topbar-inner {{
    max-width: 1120px; margin: 0 auto;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;
  }}
  .brand {{ display: flex; flex-direction: column; gap: 2px; }}
  .brand .name {{
    font-weight: 650; font-size: 1.05rem;
    letter-spacing: -0.03em;
  }}
  .brand .sub {{ color: var(--text-muted); font-size: 0.78rem; }}
  .nav-links {{ display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.82rem; }}
  .nav-links a {{
    text-decoration: none; color: var(--text-muted);
    padding: 6px 12px; border-radius: 999px;
    transition: color 0.15s, background 0.15s;
  }}
  .nav-links a:hover {{
    color: var(--text-primary);
    background: rgba(255,255,255,0.05);
  }}
  .theme-toggle {{
    background: #fff; color: #000;
    border: none; border-radius: 999px;
    padding: 8px 16px; font-size: 0.78rem; font-weight: 650;
    cursor: pointer;
  }}
  :root[data-theme="light"] .theme-toggle {{
    background: #0a0a0a; color: #fff;
  }}

  .wrap {{ max-width: 1120px; margin: 0 auto; padding: 28px 24px 48px; }}

  .hero {{
    margin-bottom: 28px;
  }}
  .hero h1 {{
    margin: 0 0 8px;
    font-size: clamp(1.75rem, 4vw, 2.4rem);
    font-weight: 650;
    letter-spacing: -0.04em;
    line-height: 1.15;
  }}
  .hero p {{
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
    max-width: 36rem;
  }}

  .meta-bar {{
    display: flex; flex-wrap: wrap; gap: 18px 28px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 18px 22px;
    margin-bottom: 22px;
    font-size: 0.84rem;
    color: var(--text-muted);
  }}
  .meta-bar b {{ color: var(--text-primary); font-weight: 600; }}

  .kpi-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 28px;
  }}
  .tile {{
    position: relative;
    overflow: hidden;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 18px 18px 16px;
  }}
  .tile::after {{
    content: "";
    position: absolute;
    inset: auto -40% -70% -40%;
    height: 90%;
    background: radial-gradient(ellipse at center, var(--glow), transparent 70%);
    pointer-events: none;
    opacity: 0.55;
  }}
  .tile-value {{
    position: relative; z-index: 1;
    font-size: 1.75rem; font-weight: 700;
    letter-spacing: -0.03em;
  }}
  .tile-label {{
    position: relative; z-index: 1;
    color: var(--text-muted); font-size: 0.78rem; margin-top: 4px;
  }}
  .tile-good .tile-value {{ color: var(--status-good); }}
  .tile-warning .tile-value {{ color: var(--status-warning); }}
  .tile-critical .tile-value {{ color: var(--status-critical); }}

  .card {{
    position: relative;
    overflow: hidden;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    margin-bottom: 18px;
  }}
  .card::after {{
    content: "";
    position: absolute;
    inset: auto -25% -55% -25%;
    height: 55%;
    background: radial-gradient(ellipse at center, var(--glow), transparent 70%);
    pointer-events: none;
    opacity: 0.35;
  }}
  .card-header {{
    position: relative; z-index: 1;
    padding: 22px 24px 12px;
  }}
  .card-header h2 {{
    margin: 0 0 4px;
    font-size: 1.25rem;
    font-weight: 650;
    letter-spacing: -0.03em;
  }}
  .card-subtitle {{
    color: var(--text-muted); font-size: 0.84rem; margin: 0;
  }}
  .card-body {{
    position: relative; z-index: 1;
    padding: 8px 24px 24px;
  }}
  .card-body h3 {{
    font-size: 0.9rem; margin: 22px 0 10px;
    color: var(--text-secondary); font-weight: 600;
  }}
  .card-body h3:first-child {{ margin-top: 4px; }}

  .kpi-mini {{
    display: flex; flex-wrap: wrap; gap: 18px;
    font-size: 0.84rem; color: var(--text-muted); margin-bottom: 14px;
  }}
  .kpi-mini b {{ color: var(--text-primary); }}

  .alert-banner {{
    background: rgba(255,92,92,0.1);
    border: 1px solid rgba(255,92,92,0.35);
    color: var(--text-primary);
    padding: 10px 14px; border-radius: 0.85rem;
    font-size: 0.84rem; margin: 0 0 14px;
  }}

  .table-wrap {{
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 0.85rem;
    background: rgba(0,0,0,0.25);
  }}
  :root[data-theme="light"] .table-wrap {{ background: rgba(0,0,0,0.02); }}
  table {{ border-collapse: collapse; width: 100%; font-size: 0.84rem; min-width: 480px; }}
  thead th {{
    text-align: left; background: var(--surface-2); color: var(--text-muted);
    font-weight: 600; padding: 10px 14px; border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }}
  tbody td {{
    padding: 9px 14px; border-bottom: 1px solid var(--gridline); vertical-align: top;
  }}
  tbody tr:last-child td {{ border-bottom: none; }}
  tbody tr:hover {{ background: rgba(126,182,255,0.04); }}
  .table-note {{ color: var(--text-muted); font-size: 0.76rem; margin: 10px 2px 0; }}
  .empty-state {{ color: var(--text-muted); font-size: 0.88rem; }}

  .pill {{
    display: inline-block; padding: 3px 10px; border-radius: 999px;
    font-size: 0.72rem; font-weight: 650; white-space: nowrap;
  }}
  .pill-critical {{ background: rgba(255,92,92,0.15); color: var(--status-critical); }}
  .pill-warning {{ background: rgba(251,191,36,0.15); color: var(--status-warning); }}
  .pill-muted {{ background: var(--surface-2); color: var(--text-muted); }}

  .chart-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 18px; margin-bottom: 10px;
  }}
  .chart-block h4 {{
    font-size: 0.84rem; color: var(--text-muted);
    margin: 0 0 12px; font-weight: 600;
  }}
  .bar-chart {{ overflow: visible; }}
  .bar-fill {{ fill: var(--chart-seq); }}
  .bar-label {{ fill: var(--text-muted); font-size: 12px; }}
  .bar-value {{ fill: var(--text-primary); font-size: 12px; font-variant-numeric: tabular-nums; }}

  .stacked-bar {{ display: block; border-radius: 6px; overflow: hidden; }}
  .seg {{ stroke: var(--surface-1); stroke-width: 2; }}
  .seg-good {{ fill: var(--status-good); }}
  .seg-critical {{ fill: var(--status-critical); }}
  .seg-muted {{ fill: var(--status-muted); }}
  .legend-row {{
    display: flex; flex-wrap: wrap; gap: 16px;
    margin-top: 12px; font-size: 0.8rem; color: var(--text-muted);
  }}
  .legend-item {{ display: inline-flex; align-items: center; gap: 6px; }}
  .legend-item b {{ color: var(--text-primary); }}
  .swatch {{ width: 10px; height: 10px; border-radius: 99px; display: inline-block; }}
  .swatch-good {{ background: var(--status-good); }}
  .swatch-critical {{ background: var(--status-critical); }}
  .swatch-muted {{ background: var(--status-muted); }}

  footer {{
    text-align: center; color: var(--text-muted);
    font-size: 0.76rem; padding: 32px 8px 8px;
    border-top: 1px solid var(--border);
    margin-top: 12px;
  }}

  @media (max-width: 640px) {{
    .wrap {{ padding: 16px 14px 36px; }}
    .card-body, .card-header {{ padding-left: 16px; padding-right: 16px; }}
  }}
</style>
</head>
<body>
<div class="viz-root">

<div class="topbar">
  <div class="topbar-inner">
    <div class="brand">
      <span class="name">ScreenShareTool</span>
      <span class="sub">Dashboard forense · v{version}</span>
    </div>
    <nav class="nav-links">{nav_links}</nav>
    <button type="button" class="theme-toggle" onclick="window.__toggleTheme()" aria-label="Cambia tema">Tema</button>
  </div>
</div>

<div class="wrap">

  <div class="hero">
    <h1>Report forense</h1>
    <p>Sintesi dell&rsquo;analisi su Minecraft, BAM/Prefetch, cheat e sistema.</p>
  </div>

  <div class="meta-bar">
    <span>Sistema: <b>{win_name}</b> (Build {win_build})</span>
    <span>Intervallo: <b>{date_limit}</b> &rarr; oggi ({days}g)</span>
    <span>Generato: <b>{now}</b></span>
    <span>Output: <b>{root_dir}</b></span>
  </div>

  <div class="kpi-grid">{kpi_tiles}</div>

  {sections}

  <footer>
    ScreenShareTool v{version} — report generato a fine scansione.
    Uso interno staff, con consenso del giocatore.
  </footer>

</div>
</div>

<script>
(function() {{
  function applyStoredTheme() {{
    try {{
      var saved = window.localStorage.getItem("ss-dashboard-theme");
      if (saved === "light" || saved === "dark") {{
        document.documentElement.setAttribute("data-theme", saved);
      }}
    }} catch (e) {{}}
  }}
  window.__toggleTheme = function() {{
    var root = document.documentElement;
    var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    var next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {{ window.localStorage.setItem("ss-dashboard-theme", next); }} catch (e) {{}}
  }};
  applyStoredTheme();
}})();
</script>
</body>
</html>
"""
