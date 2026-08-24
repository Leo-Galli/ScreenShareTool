"""
System information module — Cross-platform.

Detects: Virtual Machine, VPN/Tunnel adapters, hardware info (CPU, RAM, GPU),
disk usage, and OS version details. Works on Windows, macOS, and Linux.
"""

import os
import platform
import subprocess
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional

from .config import IS_WINDOWS, IS_MACOS, IS_LINUX
from .utils import new_report_file, run_ps, show_step, write_block


def get_system_info() -> Dict[str, Any]:
    """
    Gather comprehensive system information.
    Returns a dict with all hardware/VM/VPN data.
    """
    info = {
        "is_vm": False,
        "vm_info": "Physical hardware",
        "vpn_active": [],
        "cpu": "",
        "ram_gb": 0.0,
        "gpu": "",
        "model": "",
        "manufacturer": "",
        "os_name": "",
        "os_build": 0,
        "disks": [],
        "drives": [],
    }

    # OS version
    info["os_name"] = platform.platform()
    info["os_build"] = platform.release()

    if IS_WINDOWS:
        _gather_windows(info)
    elif IS_MACOS:
        _gather_macos(info)
    else:
        _gather_linux(info)

    # Detect drives/mount points
    info["drives"] = _detect_drives()

    return info


def _gather_windows(info: Dict[str, Any]):
    """Gather hardware info on Windows via PowerShell."""
    try:
        ps_cmd = (
            "$cs = Get-CimInstance Win32_ComputerSystem; "
            "$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1; "
            "$gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1; "
            "@{"
            "  Model=$cs.Model; "
            "  Manufacturer=$cs.Manufacturer; "
            "  RAM=[math]::Round($cs.TotalPhysicalMemory/1GB,1); "
            "  CPU=$cpu.Name; "
            "  GPU=$gpu.Name "
            "} | ConvertTo-Json -Compress"
        )
        result = run_ps(ps_cmd)
        if result.strip():
            import json
            data = json.loads(result.strip())
            info["model"] = data.get("Model", "")
            info["manufacturer"] = data.get("Manufacturer", "")
            info["ram_gb"] = float(data.get("RAM", 0))
            info["cpu"] = data.get("CPU", "")
            info["gpu"] = data.get("GPU", "")

            # VM detection
            import re
            model = data.get("Model", "")
            mfr = data.get("Manufacturer", "")
            if re.search(r'Virtual|VMware|VBox|HVM', model, re.I) or re.search(r'VMware|Microsoft Corporation|innotek|QEMU', mfr, re.I):
                info["is_vm"] = True
                info["vm_info"] = f"{mfr} - {model}"
    except Exception:
        pass

    # VPN detection
    try:
        ps_vpn = (
            "Get-NetAdapter | Where-Object { "
            "  $_.InterfaceDescription -match 'VPN|TAP|TUN|WireGuard|OpenVPN|ProtonVPN|NordVPN|ExpressVPN|Mullvad|Surfshark|Cisco|Fortinet|Pulse Secure' "
            "  -and $_.Status -eq 'Up' "
            "} | ForEach-Object { @{Name=$_.Name;Desc=$_.InterfaceDescription} } | ConvertTo-Json -Compress"
        )
        result = run_ps(ps_vpn)
        if result.strip():
            import json
            data = json.loads(result.strip())
            if isinstance(data, dict):
                data = [data]
            info["vpn_active"] = data
    except Exception:
        pass

    # Disk usage
    try:
        ps_disk = (
            "Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Root -match '^[A-Z]:\\\\$' } | "
            "ForEach-Object { "
            "  $used = [math]::Round($_.Used/1GB,1); "
            "  $total = [math]::Round(($_.Used+$_.Free)/1GB,1); "
            "  \"$($_.Name): ${used}GB used / ${total}GB\" "
            "} | ConvertTo-Json -Compress"
        )
        result = run_ps(ps_disk)
        if result.strip():
            import json
            data = json.loads(result.strip())
            info["disks"] = data if isinstance(data, list) else [data]
    except Exception:
        pass


def _gather_macos(info: Dict[str, Any]):
    """Gather hardware info on macOS."""
    try:
        info["cpu"] = subprocess.getoutput("sysctl -n machdep.cpu.brand_string").strip()
        ram_bytes = int(subprocess.getoutput("sysctl -n hw.memsize").strip() or "0")
        info["ram_gb"] = round(ram_bytes / (1024**3), 1)
        info["model"] = subprocess.getoutput("sysctl -n hw.model").strip()
        info["manufacturer"] = "Apple"
        # GPU
        gpu_out = subprocess.getoutput("system_profiler SPDisplaysDataType 2>/dev/null | grep 'Chipset Model:' | head -1")
        info["gpu"] = gpu_out.split(":")[-1].strip() if ":" in gpu_out else ""

        # VM detection (Parallels, VMware Fusion, etc.)
        import re
        if re.search(r'VMware|VirtualBox|Parallels|QEMU|HVM', info["model"], re.I):
            info["is_vm"] = True
            info["vm_info"] = info["model"]

        # VPN detection (utun, ppp, tap interfaces)
        ifconfig = subprocess.getoutput("ifconfig 2>/dev/null")
        import re
        if re.search(r'^utun|^ppp|^tap|^tun', ifconfig, re.MULTILINE):
            info["vpn_active"] = [{"Name": "VPN/Tunnel", "Desc": "Detected via ifconfig"}]
    except Exception:
        pass


def _gather_linux(info: Dict[str, Any]):
    """Gather hardware info on Linux."""
    try:
        # CPU
        cpu_out = subprocess.getoutput("lscpu 2>/dev/null | grep 'Model name' | awk -F': ' '{print $2}'")
        if not cpu_out.strip():
            cpu_out = subprocess.getoutput("grep 'model name' /proc/cpuinfo 2>/dev/null | head -1 | awk -F': ' '{print $2}'")
        info["cpu"] = cpu_out.strip()

        # RAM
        try:
            with open("/proc/meminfo") as f:
                for line in f:
                    if "MemTotal" in line:
                        info["ram_gb"] = int(line.split()[1]) // (1024 * 1024)
                        break
        except Exception:
            pass

        # GPU
        info["gpu"] = subprocess.getoutput("lspci 2>/dev/null | grep -iE 'VGA|3D|Display' | head -1").strip()

        # Model
        info["model"] = subprocess.getoutput("cat /sys/devices/virtual/dmi/id/product_name 2>/dev/null").strip()
        info["manufacturer"] = subprocess.getoutput("cat /sys/devices/virtual/dmi/id/sys_vendor 2>/dev/null").strip()

        # VM detection
        import re
        vm_detected = False
        # systemd-detect-virt
        virt = subprocess.getoutput("systemd-detect-virt 2>/dev/null").strip()
        if virt and virt != "none":
            vm_detected = True
            info["vm_info"] = virt
        # /proc/cpuinfo hypervisor flag
        if not vm_detected:
            try:
                with open("/proc/cpuinfo") as f:
                    cpuinfo = f.read()
                if re.search(r'hypervisor|VMware|VirtualBox|QEMU|Xen|KVM', cpuinfo, re.I):
                    vm_detected = True
                    m = re.search(r'hypervisor|VMware|VirtualBox|QEMU|Xen|KVM', cpuinfo, re.I)
                    info["vm_info"] = m.group(0) if m else "Unknown VM"
            except Exception:
                pass
        info["is_vm"] = vm_detected

        # VPN detection
        ip_link = subprocess.getoutput("ip link show 2>/dev/null")
        if re.search(r'tun[0-9]|tap[0-9]|wg[0-9]|ppp[0-9]|vpn|proton|nord', ip_link, re.I):
            info["vpn_active"] = [{"Name": "VPN/Tunnel", "Desc": "Detected via ip link"}]
    except Exception:
        pass


def _detect_drives() -> List[str]:
    """Detect available drives/mount points."""
    drives = []
    if IS_WINDOWS:
        for letter in "CDEFGHIJKLMNOPQRSTUVWXYZ":
            root_path = f"{letter}:\\"
            if os.path.isdir(root_path):
                drives.append(root_path)
    else:
        try:
            output = subprocess.getoutput("df 2>/dev/null | awk 'NR>1 && $1 ~ /^\\/dev\\// {print $NF}'")
            for line in output.strip().split("\n"):
                line = line.strip()
                if line:
                    drives.append(line)
        except Exception:
            pass
        if not drives:
            drives = ["/"]
    return drives


def analyze_system(date_limit: datetime, days: int,
                   root_dir: str, ts: str, win_name: str, win_build: int,
                   sys_info: Dict[str, Any]):
    """Write system info report (module 16)."""
    show_step("SYSTEM INFO", "VM detection, VPN, hardware...")

    out = os.path.join(root_dir, "16_SystemInfo", f"System_{ts}.txt")
    new_report_file(out, "SYSTEM INFO [16] - VM / VPN / HARDWARE", "",
                    win_name, win_build, days, date_limit)

    lines = []

    # VM
    lines.append("  ---- VIRTUAL MACHINE ----")
    if sys_info["is_vm"]:
        lines.append("  [!!!] VIRTUAL ENVIRONMENT DETECTED")
        lines.append(f"        Info       : {sys_info['vm_info']}")
        lines.append(f"        GPU        : {sys_info['gpu']}")
    else:
        lines.append("  [OK]  Physical hardware.")
        lines.append(f"        Model    : {sys_info['model']}")
        lines.append(f"        Vendor   : {sys_info['manufacturer']}")

    # VPN
    lines.append("")
    lines.append("  ---- ACTIVE VPN ----")
    if sys_info["vpn_active"]:
        lines.append("  [!!!] VPN/TUNNEL INTERFACES:")
        for v in sys_info["vpn_active"]:
            lines.append(f"        - {v.get('Name', '?')} : {v.get('Desc', '?')}")
    else:
        lines.append("  [OK]  No VPN detected.")

    # Hardware
    lines.append("")
    lines.append("  ---- HARDWARE ----")
    lines.append(f"  CPU : {sys_info['cpu']}")
    lines.append(f"  RAM : {sys_info['ram_gb']} GB")
    lines.append(f"  GPU : {sys_info['gpu']}")
    lines.append(f"  OS  : {win_name} (Build {win_build})")

    write_block(out, lines)
    show_step("SYSTEM INFO", "Completed.", "green")
