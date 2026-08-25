"""
Network analysis module — Cross-platform.

Checks: TCP connections, hosts file, DNS cache.
Works on Windows (PowerShell), macOS (ifconfig/dscacheutil), Linux (ss/ip/resolvectl).
"""

import os
import subprocess
import json
from datetime import datetime
from typing import Any, Dict, List

from .config import IS_WINDOWS, IS_MACOS, IS_LINUX
from .utils import new_report_file, run_ps, show_step, write_block


def analyze_network(date_limit: datetime, days: int,
                    root_dir: str, ts: str, win_name: str, win_build: int) -> Dict[str, Any]:
    """
    Analyze network connections, hosts file, and DNS cache.
    Returns data for dashboard.
    """
    show_step("NETWORK", "TCP connections, hosts file, DNS cache...")

    out = os.path.join(root_dir, "17_Network", f"Network_{ts}.txt")
    new_report_file(out, "NETWORK [17] - CONNECTIONS AND DNS", "",
                    win_name, win_build, days, date_limit)

    lines = []

    # --- TCP Connections ---
    tcp_conns = _get_tcp_connections()
    lines.append("  ---- ACTIVE TCP CONNECTIONS ----")
    for conn in tcp_conns:
        if isinstance(conn, dict):
            local = conn.get("Local") or conn.get("local", "")
            remote = conn.get("Remote") or conn.get("remote", "")
            pid = conn.get("PID") or conn.get("pid", "")
            proc = conn.get("Process") or conn.get("process") or conn.get("proc", "")
            lines.append(f"  [TCP] {local}  ->  {remote}  |  PID: {pid}  |  {proc}")
        else:
            lines.append(f"  [TCP] {conn}")

    # --- Hosts file ---
    lines.append("")
    lines.append("  ---- HOSTS FILE ----")
    hosts_entries = _read_hosts_file()
    for h in hosts_entries:
        lines.append(f"  [HST] {h}")

    # --- DNS Cache ---
    lines.append("")
    lines.append("  ---- DNS CACHE ----")
    dns_cache = _get_dns_cache()
    for entry in dns_cache[:50]:
        if isinstance(entry, dict):
            lines.append(f"  [DNS] {entry.get('entry', ''):<50} -> {entry.get('data', '')}")
        else:
            lines.append(f"  [DNS] {entry}")

    # --- Network Interfaces ---
    lines.append("")
    lines.append("  ---- NETWORK INTERFACES ----")
    interfaces = _get_interfaces()
    for iface in interfaces:
        lines.append(f"  {iface}")

    write_block(out, lines)
    show_step("NETWORK", "Completed.", "green")

    return {
        "tcp_conns": tcp_conns,
        "hosts_entries": hosts_entries,
        "dns_cache": dns_cache[:50],
    }


def _get_tcp_connections() -> List[Dict[str, str]]:
    """Get established TCP connections with process names."""
    conns = []

    if IS_WINDOWS:
        try:
            ps_cmd = (
                "Get-NetTCPConnection -State Established | "
                "ForEach-Object { "
                "  $p = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue; "
                "  @{Local=\"$($_.LocalAddress):$($_.LocalPort)\"; "
                "    Remote=\"$($_.RemoteAddress):$($_.RemotePort)\"; "
                "    PID=$_.OwningProcess; "
                "    Process=if($p){$p.Name}else{'?'} } "
                "} | ConvertTo-Json -Compress"
            )
            result = run_ps(ps_cmd, timeout=15)
            if result.strip():
                data = json.loads(result.strip())
                if isinstance(data, dict):
                    data = [data]
                conns = data
        except Exception:
            pass
    else:
        # macOS/Linux: use ss, netstat, or lsof
        try:
            output = subprocess.getoutput("ss -tnp 2>/dev/null | tail -n +2")
            if not output.strip():
                output = subprocess.getoutput("netstat -tnp 2>/dev/null | grep ESTABLISHED")
            if not output.strip():
                output = subprocess.getoutput("lsof -i TCP -n -P 2>/dev/null | grep ESTABLISHED")
            for line in output.strip().split("\n"):
                line = line.strip()
                if line:
                    conns.append({"Local": line, "Remote": "", "PID": "", "Process": ""})
        except Exception:
            pass

    return conns


def _read_hosts_file() -> List[str]:
    """Read non-comment lines from the hosts file."""
    entries = []
    if IS_WINDOWS:
        hosts_path = os.path.join(os.environ.get("SystemRoot", r"C:\Windows"),
                                  "System32", "drivers", "etc", "hosts")
    else:
        hosts_path = "/etc/hosts"
    try:
        with open(hosts_path, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    entries.append(line)
    except Exception:
        entries.append("[--] Hosts file not found.")
    return entries


def _get_dns_cache() -> List[Dict[str, str]]:
    """Get DNS client cache entries."""
    entries = []

    if IS_WINDOWS:
        try:
            result = run_ps("Get-DnsClientCache | ConvertTo-Json -Compress", timeout=15)
            if result.strip():
                data = json.loads(result.strip())
                if isinstance(data, dict):
                    data = [data]
                for item in data:
                    entries.append({
                        "entry": str(item.get("Entry", "")),
                        "data": str(item.get("Data", "")),
                        "type": str(item.get("Type", "")),
                    })
        except Exception:
            pass
    elif IS_MACOS:
        try:
            output = subprocess.getoutput("dscacheutil -cachedump -entries all 2>/dev/null")
            for line in output.strip().split("\n")[:50]:
                if line.strip():
                    entries.append({"entry": line.strip(), "data": "", "type": ""})
        except Exception:
            pass
    else:
        try:
            output = subprocess.getoutput("resolvectl statistics 2>/dev/null")
            if not output.strip():
                output = subprocess.getoutput("systemd-resolve --statistics 2>/dev/null")
            for line in output.strip().split("\n")[:50]:
                if line.strip():
                    entries.append({"entry": line.strip(), "data": "", "type": ""})
        except Exception:
            pass

    return entries


def _get_interfaces() -> List[str]:
    """Get network interface information."""
    interfaces = []
    try:
        if IS_WINDOWS:
            output = subprocess.getoutput("ipconfig 2>/dev/null")
        elif IS_MACOS:
            output = subprocess.getoutput("ifconfig 2>/dev/null | grep -E '^[a-z]|inet '")
        else:
            output = subprocess.getoutput("ip addr show 2>/dev/null")
        for line in output.strip().split("\n"):
            if line.strip():
                interfaces.append(line.strip())
    except Exception:
        pass
    return interfaces
