"""
Configuration constants, cheat patterns, launcher definitions, and registry paths.
Central configuration for the entire tool — single source of truth.
Cross-platform: Windows, macOS, Linux.
"""

import os
import platform
import re
import sys
from dataclasses import dataclass, field
from typing import List, Optional

IS_WINDOWS = sys.platform == "win32"
IS_MACOS = sys.platform == "darwin"
IS_LINUX = sys.platform.startswith("linux")
IS_UNIX = IS_MACOS or IS_LINUX

# ================================================================
#  SYSTEM
# ================================================================
APP_NAME = "CharlieRP ScreenShareTool"
APP_VERSION = "3.0.0"
NETWORK = "mc.charlieroleplay.it"

# ================================================================
#  OUTPUT PATHS (Cross-platform)
# ================================================================
if IS_WINDOWS:
    OUTPUT_ROOT = os.path.join(os.environ.get("SystemDrive", "C:"), "CharlieRP_SS")
elif IS_MACOS:
    OUTPUT_ROOT = os.path.join("/tmp", "CharlieRP_SS")
else:
    OUTPUT_ROOT = os.path.join("/tmp", "CharlieRP_SS")

OUTPUT_DIRS = [
    "01_AccountFiles", "02_DeletedRenamed", "03_JNativeHook",
    "04_PrefetchDel", "05_WMIC_Stream", "06_SolaLettura",
    "07_Cacls", "08_ExtSpoofed", "09_CestinoExe", "10_Replace",
    "11_Regedit", "12_Prefetch", "13_Macro", "14_Minecraft",
    "15_Misc", "16_SystemInfo", "17_Network",
]

# ================================================================
#  USN JOURNAL FLAG PATTERNS
# ================================================================
USN_FLAG_DELETE = "0x80000200"
USN_FLAG_RENAME_OLD = "0x00001000"
USN_FLAG_RENAME_NEW = "0x00002000"
USN_FLAG_ADS = "0x80200120|0x00200000"
USN_FLAG_ATTR_READONLY = "0x00008000|0x80008000"
USN_FLAG_DACL = "0x00000800|0x80000800"

# File extension patterns
PAT_EXE_JAR = re.compile(r'\.(pf|exe|bat|cmd|jar|pif)\b', re.IGNORECASE)
PAT_BINARY = re.compile(r'\.(exe|jar|dll|zip|rar|pif|cmd|bat)\b', re.IGNORECASE)

# Minecraft account-related files
PAT_MC_ACCOUNT_FILES = re.compile(
    r'latest\.log|\.log\.gz|launcher_profiles\.json|usernamecache\.json|'
    r'usercache\.json|launcher_accounts\.json|InGameAccountSwitcher',
    re.IGNORECASE
)

# ================================================================
#  KNOWN EXTENSIONS (for FileExts spoofing detection)
# ================================================================
KNOWN_EXTENSIONS = frozenset([
    ".exe", ".jar", ".dll", ".bat", ".cmd", ".pif", ".zip", ".rar", ".txt", ".pdf",
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".mp4", ".mp3", ".wav", ".lnk", ".ini",
    ".cfg", ".log", ".json", ".xml", ".html", ".htm", ".css", ".js", ".py", ".cs",
    ".java", ".class", ".db", ".sqlite", ".7z", ".gz", ".tar", ".iso", ".msi", ".reg",
    ".vbs", ".ps1", ".sys", ".drv", ".ocx", ".cpl", ".scr", ".mui", ".dat", ".tmp",
    ".bak", ".old", ".part", ".url", ".ico", ".ttf", ".otf", ".mkv", ".avi", ".mov",
    ".docx", ".xlsx", ".pptx", ".doc", ".xls", ".ppt", ".odt", ".ods", ".md", ".yaml",
    ".sh", ".war", ".apk", ".cab", ".dmp", ".pdb", ".lib", ".h", ".c", ".cpp",
])


# ================================================================
#  MINECRAFT LAUNCHER DEFINITIONS
# ================================================================
@dataclass
class LauncherDef:
    """Definition of a Minecraft launcher to scan for."""
    name: str
    roots: List[str]              # Possible root directories
    account_files: List[str]      # Relative paths to account JSON files
    log_dirs: List[str]           # Relative paths to log directories
    extra_paths: List[str] = field(default_factory=list)  # Extra paths to check


def _expand(path: str) -> str:
    """Expand environment variables in paths."""
    return os.path.expandvars(path)


def _mc_launchers() -> List[LauncherDef]:
    """Build Minecraft launcher definitions based on the current OS."""
    home = os.path.expanduser("~")
    launchers = []

    if IS_WINDOWS:
        launchers.extend([
            LauncherDef(name="Mojang Launcher",
                roots=[_expand(r"%APPDATA%\.minecraft")],
                account_files=["launcher_profiles.json", "launcher_accounts.json"],
                log_dirs=["logs"],
                extra_paths=["usercache.json", "crash-reports", "options.txt", "mods", "resourcepacks", "shaderpacks", "screenshots"]),
            LauncherDef(name="Modrinth",
                roots=[_expand(r"%APPDATA%\com.modrinth.theseus"), _expand(r"%LOCALAPPDATA%\com.modrinth.theseus"),
                       _expand(r"%APPDATA%\ModrinthApp"), _expand(r"%LOCALAPPDATA%\ModrinthApp"),
                       _expand(r"%APPDATA%\modrinth-app"), _expand(r"%LOCALAPPDATA%\modrinth-app")],
                account_files=[os.path.join("metadata", "credentials.json"), "accounts.json", "users.json"],
                log_dirs=["logs", os.path.join("metadata", "logs"), "profiles"],
                extra_paths=["metadata", "settings.json", "profiles.json"]),
            LauncherDef(name="Prism Launcher",
                roots=[_expand(r"%APPDATA%\PrismLauncher"), _expand(r"%LOCALAPPDATA%\PrismLauncher"),
                       _expand(r"%LOCALAPPDATA%\Programs\PrismLauncher"), _expand(r"%ProgramFiles%\PrismLauncher")],
                account_files=["accounts.json"], log_dirs=["logs", "instances"], extra_paths=["prismlauncher.cfg"]),
            LauncherDef(name="MultiMC",
                roots=[_expand(r"%APPDATA%\MultiMC"), _expand(r"%LOCALAPPDATA%\MultiMC")],
                account_files=["accounts.json"], log_dirs=["logs", "instances"]),
            LauncherDef(name="TLauncher",
                roots=[_expand(r"%APPDATA%\.tlauncher"), _expand(r"%LOCALAPPDATA%\.tlauncher"),
                       _expand(r"%APPDATA%\TLauncher"), _expand(r"%LOCALAPPDATA%\TLauncher")],
                account_files=["accounts.json", "TLauncher.cfg"], log_dirs=["logs"]),
            LauncherDef(name="Lunar Client",
                roots=[_expand(r"%USERPROFILE%\.lunarclient"), _expand(r"%APPDATA%\.lunarclient"), _expand(r"%LOCALAPPDATA%\.lunarclient")],
                account_files=[os.path.join("settings", "accounts.json"), os.path.join("offline", "accounts.json"), "accounts.json"],
                log_dirs=["logs", os.path.join("offline", "multiver", "logs")], extra_paths=["settings", "offline"]),
        ])
    elif IS_MACOS:
        launchers.extend([
            LauncherDef(name="Mojang Launcher",
                roots=[os.path.join(home, "Library", "Application Support", "minecraft"), os.path.join(home, ".minecraft")],
                account_files=["launcher_profiles.json", "launcher_accounts.json"],
                log_dirs=["logs"],
                extra_paths=["usercache.json", "crash-reports", "mods"]),
            LauncherDef(name="Modrinth",
                roots=[os.path.join(home, "Library", "Application Support", "com.modrinth.theseus"),
                       os.path.join(home, "Library", "Application Support", "ModrinthApp")],
                account_files=[os.path.join("metadata", "credentials.json"), "accounts.json", "users.json"],
                log_dirs=["logs", os.path.join("metadata", "logs")], extra_paths=["metadata"]),
            LauncherDef(name="Prism Launcher",
                roots=[os.path.join(home, "Library", "Application Support", "PrismLauncher")],
                account_files=["accounts.json"], log_dirs=["logs", "instances"]),
            LauncherDef(name="MultiMC",
                roots=[os.path.join(home, "Library", "Application Support", "MultiMC")],
                account_files=["accounts.json"], log_dirs=["logs", "instances"]),
            LauncherDef(name="TLauncher",
                roots=[os.path.join(home, "Library", "Application Support", ".tlauncher")],
                account_files=["accounts.json", "TLauncher.cfg"], log_dirs=["logs"]),
        ])
    else:  # Linux
        launchers.extend([
            LauncherDef(name="Mojang Launcher",
                roots=[os.path.join(home, ".minecraft")],
                account_files=["launcher_profiles.json", "launcher_accounts.json"],
                log_dirs=["logs"],
                extra_paths=["usercache.json", "crash-reports", "mods"]),
            LauncherDef(name="Modrinth",
                roots=[os.path.join(home, ".var", "app", "com.modrinth.ModrinthApp", "data", "com.modrinth.theseus"),
                       os.path.join(home, ".local", "share", "com.modrinth.ModrinthApp"),
                       os.path.join(home, ".config", "com.modrinth.ModrinthApp")],
                account_files=[os.path.join("metadata", "credentials.json"), "accounts.json", "users.json"],
                log_dirs=["logs", os.path.join("metadata", "logs")], extra_paths=["metadata"]),
            LauncherDef(name="Prism Launcher",
                roots=[os.path.join(home, ".local", "share", "PrismLauncher"),
                       os.path.join(home, ".var", "app", "org.prismlauncher.PrismLauncher", "data", "PrismLauncher")],
                account_files=["accounts.json"], log_dirs=["logs", "instances"]),
            LauncherDef(name="MultiMC",
                roots=[os.path.join(home, ".local", "share", "multimc"), os.path.join(home, "MultiMC")],
                account_files=["accounts.json"], log_dirs=["logs", "instances"]),
            LauncherDef(name="TLauncher",
                roots=[os.path.join(home, ".tlauncher")],
                account_files=["accounts.json", "TLauncher.cfg"], log_dirs=["logs"]),
            LauncherDef(name="ATLauncher",
                roots=[os.path.join(home, ".local", "share", "ATLauncher")],
                account_files=[os.path.join("configs", "accounts.json"), "accounts.json"], log_dirs=["logs"]),
        ])

    # Cross-platform launchers
    launchers.extend([
        LauncherDef(name="Lunar Client",
            roots=[os.path.join(home, ".lunarclient")],
            account_files=[os.path.join("settings", "accounts.json"), os.path.join("offline", "accounts.json"), "accounts.json"],
            log_dirs=["logs", os.path.join("offline", "multiver", "logs")], extra_paths=["settings", "offline"]),
    ])

    return launchers


MC_LAUNCHERS: List[LauncherDef] = _mc_launchers()

# ================================================================
#  INGAME ACCOUNT SWITCHER (IGAS) PATHS — Cross-platform
# ================================================================
def _igas_roots() -> List[str]:
    home = os.path.expanduser("~")
    if IS_WINDOWS:
        return [
            _expand(r"%LOCALAPPDATA%\InGameAccountSwitcher"),
            _expand(r"%APPDATA%\InGameAccountSwitcher"),
            _expand(r"%LOCALAPPDATA%\Programs\InGameAccountSwitcher"),
            _expand(r"%ProgramFiles%\InGameAccountSwitcher"),
        ]
    elif IS_MACOS:
        return [
            os.path.join(home, "Library", "Application Support", "InGameAccountSwitcher"),
            os.path.join(home, ".config", "InGameAccountSwitcher"),
        ]
    else:
        return [
            os.path.join(home, ".local", "share", "InGameAccountSwitcher"),
            os.path.join(home, ".config", "InGameAccountSwitcher"),
        ]

IGAS_ROOTS = _igas_roots()

def _igas_mod_paths() -> List[str]:
    home = os.path.expanduser("~")
    if IS_WINDOWS:
        mc_dir = _expand(r"%APPDATA%\.minecraft")
    else:
        mc_dir = os.path.join(home, ".minecraft")
    return [
        os.path.join(mc_dir, "config", "ias.json"),
        os.path.join(mc_dir, "config", "IAS", "accounts.json"),
        os.path.join(mc_dir, "config", "IAS", "ias.json"),
    ]

IGAS_MOD_PATHS = _igas_mod_paths()

# ================================================================
#  MACRO SOFTWARE PATHS (Cross-platform)
# ================================================================
def _macro_paths() -> dict:
    """Build macro paths based on the current OS."""
    paths = {}
    home = os.path.expanduser("~")
    if IS_WINDOWS:
        paths = {
            _expand(r"%LOCALAPPDATA%\Razer\Synapse3\Log\Razer Synapse 3.log"): "Razer Synapse 3 - Log",
            _expand(r"%ProgramData%\Razer\Synapse\Accounts"): "Razer Synapse - Profili",
            _expand(r"%LOCALAPPDATA%\LGHUB"): "Logitech G HUB",
            _expand(r"%LOCALAPPDATA%\Logitech\Logitech Gaming Software"): "Logitech Gaming Software",
            _expand(r"%USERPROFILE%\Documents\M711 Gaming Mouse"): "M711 Gaming Mouse - MacroDB",
            _expand(r"%APPDATA%\ROCCAT\SWARM\macro"): "ROCCAT SWARM - macro",
            _expand(r"%LOCALAPPDATA%\BY-COMBO2"): "BY-COMBO2 - autoclicker",
            _expand(r"%LOCALAPPDATA%\JM01"): "JM01 - macro tool",
            _expand(r"%USERPROFILE%\Documents\Corsair"): "Corsair iCUE - profili",
            _expand(r"%LOCALAPPDATA%\Corsair\CUE"): "Corsair CUE",
            _expand(r"%ProgramFiles%\Bloody"): "Bloody (A4Tech) - mouse macro",
            _expand(r"%APPDATA%\SteelSeries\GG"): "SteelSeries GG - profili",
        }
    elif IS_MACOS:
        paths = {
            "/Library/Application Support/Razer": "Razer Synapse",
            os.path.join(home, "Library", "Application Support", "Razer"): "Razer Synapse (user)",
            os.path.join(home, "Library", "Application Support", "Logitech G HUB"): "Logitech G HUB",
            os.path.join(home, "Library", "Application Support", "Corsair"): "Corsair iCUE",
            os.path.join(home, "Library", "Application Support", "SteelSeries GG"): "SteelSeries GG",
            "/Applications/Karabiner-Elements.app": "Karabiner-Elements (remapper)",
            "/Applications/BetterTouchTool.app": "BetterTouchTool (macro)",
            "/Applications/Keyboard Maestro.app": "Keyboard Maestro",
        }
    else:  # Linux
        paths = {
            os.path.join(home, ".config", "razergenie"): "Razer (openrazer/razergenie)",
            "/etc/openrazer": "OpenRazer",
            os.path.join(home, ".config", "piper"): "Piper (Logitech)",
            os.path.join(home, ".config", "autokey"): "AutoKey (macro)",
            "/usr/bin/xdotool": "xdotool",
            "/usr/bin/xte": "xte (xautomation)",
            os.path.join(home, ".config", "ckb-next"): "ckb-next (Corsair)",
        }
    return paths

MACRO_PATHS = _macro_paths()

# ================================================================
#  KNOWN CHEAT CLIENTS (with self-destruction detection)
# ================================================================
@dataclass
class CheatDef:
    """Known cheat client with detection patterns."""
    name: str
    patterns: List[str]  # Case-insensitive substrings to match


KNOWN_CHEATS: List[CheatDef] = [
    CheatDef("Doomsday", ["doomsday", "dday", "dd_", "d00msday"]),
    CheatDef("Sigma", ["sigma", "sigma5", "sigma6", "sigma_", "sigmaclient"]),
    CheatDef("Wurst", ["wurst", "wurst-", "wurst_", "wurstclient"]),
    CheatDef("Meteor", ["meteor-client", "meteor_client", "meteorclient", "meteor-"]),
    CheatDef("Aristois", ["aristois", "aristoi", "hacked-1", "hacked-fabric"]),
    CheatDef("Impact", ["impact-", "impactclient", "impact_"]),
    CheatDef("XRay", ["xray", "xray-mod", "xray_mod", "xraymod"]),
    CheatDef("Inertia", ["inertia", "inertia-"]),
    CheatDef("Future", ["future-", "futureclient", "future_client"]),
    CheatDef("LiquidBounce", ["liquidbounce", "liquid-bounce", "liquid_bounce"]),
    CheatDef("Vape", ["vape", "vape-", "vape_", "vape_lite", "vapelite"]),
    CheatDef("Ghost", ["ghost-", "ghostclient", "ghost_client"]),
    CheatDef("Entropy", ["entropy-", "entropyclient", "entropy_"]),
    CheatDef("Horion", ["horion", "horion-"]),
    CheatDef("Ares", ["ares-client", "aresclient", "ares_"]),
    CheatDef("Novoline", ["novoline", "novoline-", "novo-"]),
    CheatDef("Remix", ["remix-", "remixclient", "remix_"]),
    CheatDef("Rise", ["rise-", "riseclient", "rise_client"]),
    CheatDef("Zeroday", ["zeroday", "zero-day", "0day-"]),
    CheatDef("Drip", ["dripx", "drip-", "drip_x", "dripplus"]),
    CheatDef("Rusherhack", ["rusherhack", "rusher-"]),
    CheatDef("Tenacity", ["tenacity-", "tenacityclient"]),
    CheatDef("BleachHack", ["bleachhack", "bleach-hack", "bleach_"]),
    CheatDef("Raven", ["raven-", "ravenclient", "raven_b", "ravenb"]),
    CheatDef("Omega", ["omega-hack", "omegahack", "omega_hack"]),
    CheatDef("Phase", ["phase-", "phaseclient", "phase_b"]),
]

# Pre-compiled master regex for cheat detection
_CHEAT_PATTERNS = []
for _cheat in KNOWN_CHEATS:
    for _pat in _cheat.patterns:
        _CHEAT_PATTERNS.append(re.escape(_pat))

CHEAT_RE = re.compile("(" + "|".join(_CHEAT_PATTERNS) + ")", re.IGNORECASE)


def identify_cheat(text: str) -> Optional[str]:
    """Return the cheat name if text matches any known cheat pattern, else None."""
    for cheat in KNOWN_CHEATS:
        for pat in cheat.patterns:
            if pat.lower() in text.lower():
                return cheat.name
    return None


# ================================================================
#  CLEANUP / SELF-DESTRUCT SCRIPT PATTERNS
# ================================================================
CLEANUP_SCRIPT_RE = re.compile(
    r'del\s+/[fqs]|rmdir\s+/[sq]|Remove-Item.*-Recurse|rd\s+/[sq]|'
    r'wipe|cleanup|selfdelete|self.?destruct|autodistruzione',
    re.IGNORECASE,
)

# ================================================================
#  SUSPICIOUS DNS DOMAINS (cheat servers)
# ================================================================
SUSPICIOUS_DOMAINS = [
    "doomsdayclient.me", "vape.gg", "drip.gg", "entropy.club", "entropy.rip",
    "astolfo.lgbt", "intent.store", "riseclient.com", "novoline.lol",
    "cheat.gq", "speas.cc",
]

# ================================================================
#  NICKNAME VALIDATION
# ================================================================
NICK_VALID_RE = re.compile(r'^[A-Za-z0-9_]{2,16}$')
NICK_IN_FILE_RE = re.compile(
    r'"(?:name|username|displayName|player)"\s*:\s*"([A-Za-z0-9_]{3,16})"',
    re.IGNORECASE,
)
PF_STRIP_RE = re.compile(r'-[A-F0-9]{8}\.pf$|\.EXE$', re.IGNORECASE)

# ================================================================
#  BROWSER HISTORY PATHS (for cheat detection)
# ================================================================
BROWSER_DIRS = [
    _expand(r"%LOCALAPPDATA%\Google\Chrome\User Data\Default"),
    _expand(r"%LOCALAPPDATA%\Microsoft\Edge\User Data\Default"),
    _expand(r"%APPDATA%\Opera Software\Opera Stable"),
    _expand(r"%LOCALAPPDATA%\BraveSoftware\Brave-Browser\User Data\Default"),
]

# ================================================================
#  IAS LOG PATTERN KEYWORDS
# ================================================================
CHAT_KEYWORDS = [
    "cheat", "hack", "autoclicker", "doomsday", "vape", "reach",
    "velocity", "killaura", "alt", "multiacc", "ban", "screenshare", "bypass",
]

# ================================================================
#  PREFETCH PATHS
# ================================================================
PREFETCH_DIR = r"C:\Windows\Prefetch"

# ================================================================
#  PS HISTORY
# ================================================================
PS_HISTORY_PATH = _expand(
    r"%APPDATA%\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt"
)

PS_SUSPICIOUS_RE = re.compile(
    r'creationtime|lastwritetime|Set-Item|icacls|cacls|attrib|fsutil|usn',
    re.IGNORECASE,
)

# ================================================================
#  ANYDESK TRACE PATHS
# ================================================================
ANYDESK_TRACE_PATHS = [
    _expand(r"%APPDATA%\AnyDesk\ad.trace"),
    _expand(r"%ProgramData%\AnyDesk\ad.trace"),
]

ANYDESK_RE = re.compile(
    r'file_transfer|file transfer|app\.prepare_transfer|incoming|'
    r'connected from|files received',
    re.IGNORECASE,
)

# ================================================================
#  VM DETECTION PATTERNS
# ================================================================
VM_MODEL_RE = re.compile(r'Virtual|VMware|VBox|HVM', re.IGNORECASE)
VM_MFR_RE = re.compile(r'VMware|Microsoft Corporation|innotek|QEMU', re.IGNORECASE)
VM_VIDEO_RE = re.compile(r'VMware|VirtualBox|Hyper-V|QEMU|VBox|Virtual', re.IGNORECASE)

# ================================================================
#  VPN DETECTION PATTERNS
# ================================================================
VPN_RE = re.compile(
    r'VPN|TAP|TUN|WireGuard|OpenVPN|ProtonVPN|NordVPN|ExpressVPN|'
    r'Mullvad|Surfshark|Cisco|Fortinet|Pulse Secure',
    re.IGNORECASE,
)

# ================================================================
#  SERVERS.DAT FILTER
# ================================================================
SERVER_IP_RE = re.compile(r'(?i)[a-z0-9.-]+\.[a-z]{2,}(?::[0-9]+)?')
SERVER_IP_BLACKLIST_RE = re.compile(
    r'(?i)lwjgl|minecraft|mojang|oracle|microsoft|sun|java'
)
