"use client";

import { useState, useMemo } from "react";

const categories = [
  {
    name: "NTFS Journal (fsutil)",
    os: "Windows",
    color: "blue",
    strings: [
      "fsutil usn readjournal C: csv",
      "fsutil usn readjournal C: csv | findstr /i /C:\"0x80000200\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"0x00001000\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"0x00002000\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"latest.log\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\".log.gz\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"launcher_profiles.json\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"usernamecache.json\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"usercache.json\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"launcher_accounts.json\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\".pf\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\".exe\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\".bat\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\".cmd\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\".jar\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\".pif\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"jnativehook\"",
      "fsutil usn readjournal C: csv | findstr /i /C:\"0x80000200\" | findstr /i /C:\"latest.log\" /C:\".log.gz\" /C:\"launcher_profiles.json\" /C:\"usercache.json\" /C:\"launcher_accounts.json\"",
      "$UsnJrnl:$J", "$UsnJrnl:$Max", "$UsnJrnl:$Data",
      "$MFT", "$MFTMirr", "$LogFile", "$Volume", "$AttrDef",
      "$Bitmap", "$Boot", "$BadClus", "$Secure", "$Extend",
      "USN_REASON_DATA_OVERWRITE", "USN_REASON_FILE_CREATE", "USN_REASON_FILE_DELETE",
      "USN_REASON_RENAME_OLD_NAME", "USN_REASON_RENAME_NEW_NAME",
      "USN_REASON_STREAM_CHANGE", "USN_REASON_HARD_LINK_CHANGE",
    ],
  },
  {
    name: "Recycle Bin",
    os: "Windows",
    color: "blue",
    strings: [
      "C:\\$Recycle.Bin",
      "C:\\$Recycle.Bin\\S-1-5-21-",
      "dir C:\\$Recycle.Bin /s /b",
      "dir /a C:\\$Recycle.Bin",
      "$I (deleted file info)",
      "$R (actual deleted file)",
      "C:$Recycle.bin",
      "Shell.Nohidden",
      "NukeOnDelete",
      "RecycleBin",
    ],
  },
  {
    name: "Event Viewer",
    os: "Windows",
    color: "yellow",
    strings: [
      "eventvwr.msc",
      "wevtutil qe Application /c:100 /f:text",
      "wevtutil qe Security /c:100 /f:text",
      "wevtutil qe System /c:100 /f:text",
      "wevtutil qe \"Microsoft-Windows-PowerShell/Operational\" /c:100",
      "wevtutil qe \"Microsoft-Windows-Sysmon/Operational\" /c:100",
      "wevtutil qe \"Microsoft-Windows-Windows Defender/Operational\" /c:100",
      "Application Event ID 3079 (Recycle Bin)",
      "Security Event ID 4616 (System Time Changed)",
      "Security Event ID 4624 (Logon)",
      "Security Event ID 4625 (Failed Logon)",
      "Security Event ID 4648 (Explicit Credentials)",
      "Security Event ID 4672 (Special Privileges)",
      "Security Event ID 4688 (Process Created)",
      "Security Event ID 4697 (Service Installed)",
      "Security Event ID 4698 (Scheduled Task Created)",
      "Security Event ID 4720 (User Created)",
      "Security Event ID 4732 (Member Added to Local Group)",
      "Security Event ID 5140 (Network Share Accessed)",
      "System Event ID 7045 (Service Installed)",
      "System Event ID 1074 (System Shutdown)",
      "Microsoft-Windows-PowerShell/Operational Event ID 4103 (Module Logging)",
      "Microsoft-Windows-PowerShell/Operational Event ID 4104 (Script Block Logging)",
      "Microsoft-Windows-Sysmon/Event ID 1 (Process Create)",
      "Microsoft-Windows-Sysmon/Event ID 3 (Network Connection)",
      "Microsoft-Windows-Sysmon/Event ID 7 (Image Loaded)",
      "Microsoft-Windows-Sysmon/Event ID 8 (CreateRemoteThread)",
      "Microsoft-Windows-Sysmon/Event ID 10 (ProcessAccess)",
      "Microsoft-Windows-Sysmon/Event ID 11 (FileCreate)",
      "Microsoft-Windows-Sysmon/Event ID 12-14 (Registry)",
      "Microsoft-Windows-Sysmon/Event ID 15 (FileCreateStreamHash)",
      "Microsoft-Windows-Sysmon/Event ID 22 (DNS Query)",
    ],
  },
  {
    name: "Prefetch",
    os: "Windows",
    color: "blue",
    strings: [
      "C:\\Windows\\Prefetch",
      "dir C:\\Windows\\Prefetch /s /b",
      "dir /ar C:\\Windows\\Prefetch",
      "CONHOST.EXE.pf",
      "POWERSHELL.EXE.pf",
      "CMD.EXE.pf",
      "MSIEXEC.EXE.pf",
      "WSCRIPT.EXE.pf",
      "CSCRIPT.EXE.pf",
      "REGSVR32.EXE.pf",
      "RUNDLL32.EXE.pf",
      "JAVAW.EXE.pf",
      "JAVA.EXE.pf",
      "PYTHON.EXE.pf",
      "SC.EXE.pf",
      "SCHTASKS.EXE.pf",
      "REG.EXE.pf",
      "NETSTAT.EXE.pf",
      "IPCONFIG.EXE.pf",
      "DEL.EXE.pf",
      "XCOPY.EXE.pf",
      "ROBOCOPY.EXE.pf",
      "CACLS.EXE.pf",
      "ICACLS.EXE.pf",
      "TAKEOWN.EXE.pf",
      "TASKHOST.EXE.pf",
      "RASPHONE.EXE.pf",
    ],
  },
  {
    name: "BAM (Background Activity Moderator)",
    os: "Windows",
    color: "cyan",
    strings: [
      "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\UserSettings\\",
      "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\State\\UserSettings\\",
      "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\UserSettings\" /s",
      "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\State\\UserSettings\" /s",
      "ActiveTimeBias", "DaylightBias", "TimeZoneKeyName",
      "StandardBias", "Bias",
      "\\Device\\HarddiskVolume1", "\\Device\\HarddiskVolume2", "\\Device\\HarddiskVolume3",
      "FILETIME", "FromFileTimeUtc", "FromFileTime",
      "SID", "SecurityIdentifier", "NTAccount",
      "Bam\\UserSettings", "Bam\\State\\UserSettings",
      "SequenceNumber", "Version",
    ],
  },
  {
    name: "UserAssist",
    os: "Windows",
    color: "cyan",
    strings: [
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist",
      "reg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist\" /s",
      "UserAssist\\Count\\{",
      "ROT13 encoding",
      "Focus Time", "Run Count", "Focus Count",
      "UserAssist Key", "UserAssist Entry",
      "CEBFF5CD-ACE7-4A20-8E5C-1C5BE5DE4206",
    ],
  },
  {
    name: "USBSTOR / USB Devices",
    os: "Windows",
    color: "blue",
    strings: [
      "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR",
      "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USB",
      "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR\" /s",
      "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USB\" /s",
      "USBSTOR\\Disk&Ven_",
      "USB\\VID_", "USB\\PID_",
      "Disk&Ven_", "Prod_", "Rev_",
      "FirstInstallDate", "LastConnected",
      "{4D36E967-E325-11CE-BFC1-08002BE10318}",
      "DiskDrive", "USB Mass Storage",
      "FriendlyName", "LocationInformation",
      "ParentIdPrefix", "ContainerID",
    ],
  },
  {
    name: "ShellBags",
    os: "Windows",
    color: "purple",
    strings: [
      "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU",
      "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags",
      "reg query \"HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU\" /s",
      "reg query \"HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags\" /s",
      "BagMRU", "Bags", "Shell", "Bag",
      "MRU", "Most Recently Used",
      "Sort", "View", "FolderType",
      "Desktop", "MyComputer", "Network",
      "RecycleBin", "ControlPanel",
    ],
  },
  {
    name: "MuiCache",
    os: "Windows",
    color: "purple",
    strings: [
      "HKCU\\Software\\Classes\\Local Settings\\MUiCache",
      "reg query \"HKCU\\Software\\Classes\\Local Settings\\MUiCache\" /s",
      "MuiCache", "MUI",
      "FriendlyName", "ApplicationName", "ApplicationPath",
      "Microsoft\\Windows\\Shell\\MuiCache",
    ],
  },
  {
    name: "Registry — Run Keys",
    os: "Windows",
    color: "red",
    strings: [
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\" /s",
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce\" /s",
      "reg query \"HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\" /s",
      "reg query \"HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce\" /s",
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunServices\" /s",
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunServicesOnce\" /s",
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\Run\" /s",
      "reg query \"HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\Run\" /s",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
    ],
  },
  {
    name: "Registry — Winlogon & IFEO",
    os: "Windows",
    color: "red",
    strings: [
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\" /s",
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\" /s",
      "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon",
      "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options",
      "HKLM\\SYSTEM\\CurrentControlSet\\Services",
      "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Services\" /s",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders",
      "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\BootExecute",
    ],
  },
  {
    name: "Registry — Startup & Services",
    os: "Windows",
    color: "red",
    strings: [
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\" /s",
      "reg query \"HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\" /s",
      "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\" /s",
      "reg query \"HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\" /s",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved",
      "msconfig", "taskmgr", "services.msc",
    ],
  },
  {
    name: "Prefetch — Analysis Commands",
    os: "Windows",
    color: "blue",
    strings: [
      "dir C:\\Windows\\Prefetch /s /b /o-d",
      "dir /ar C:\\Windows\\Prefetch",
      "WinPrefetchView",
      "PECmd.exe (Eric Zimmerman)",
      "PFro.exe",
      "SCC\\Ver",
      "PF File Header",
      "Created by Windows",
      "Last Run Time",
      "Run Count",
      "File References",
      "Device Path",
      "Volume0",
    ],
  },
  {
    name: "Minecraft — Paths & Files",
    os: "Windows",
    color: "green",
    strings: [
      "%appdata%\\.minecraft",
      "%appdata%\\.minecraft\\versions",
      "%appdata%\\.minecraft\\mods",
      "%appdata%\\.minecraft\\config",
      "%appdata%\\.minecraft\\logs",
      "%appdata%\\.minecraft\\resourcepacks",
      "%appdata%\\.minecraft\\saves",
      "%appdata%\\.minecraft\\libraries",
      "%appdata%\\.minecraft\\assets",
      "dir %appdata%\\.minecraft\\mods /s /b",
      "dir %appdata%\\.minecraft\\versions /s /b",
      "dir %appdata%\\.minecraft\\logs /s /b",
      "type %appdata%\\.minecraft\\launcher_profiles.json",
      "type %appdata%\\.minecraft\\launcher_accounts.json",
      "type %appdata%\\.minecraft\\usercache.json",
      "type %appdata%\\.minecraft\\TlauncherProfiles.json",
      "type %appdata%\\.minecraft\\logs\\latest.log",
      ".lunarclient\\offline\\logs",
      ".battlaxy\\logs",
      "ias.json", "ias-accounts.json", "accounts.json",
      "net.minecraft.client.main.Main",
      "net.minecraft.launchwrapper.Launch",
      "net.fabricmc.loader",
      "net.minecraftforge",
    ],
  },
  {
    name: "Minecraft — Log Analysis",
    os: "Windows",
    color: "green",
    strings: [
      "Logging in as",
      "Setting user:",
      "Session ID is",
      "Connecting to",
      "LwjglWindow: Title: Minecraft",
      "Disconnected",
      "Server IP:",
      "Multiplayer login",
      "Client thread/INFO",
      "Client thread/WARN",
      "Client thread/ERROR",
      "Forge Mod Loader",
      "FML", "Mixin", "FabricLoader",
      "OptiFine", "OptiFineLoader",
      "Class.forName",
      "ClassLoader", "defineClass",
      "LaunchWrapper", "KnotClient",
      "MixinBootstrap", "SpongePowered",
    ],
  },
  {
    name: "Ghost Client — File Paths",
    os: "Windows",
    color: "red",
    strings: [
      "LiquidBounce", "net.ccbluex.liquidbounce", "ccbluex",
      "Wurst", "wurstclient", "net.wurstclient",
      "Sigma", "sigma.modules", "net.sigmaclient",
      "FDPClient", "fdpclient", "fdp.client.Main",
      "Vape", "net.vape.client", "vape.v4",
      "Rise", "me.elijah.rise", "rise.client",
      "Future", "future.client",
      "Impact", "impact.client",
      "Aristois", "aristois",
      "Inertia", "inertia",
      "Do0mClient", "doom.client",
      "MoonClient", "moonclient",
      "Tenacity", "tenacity",
      "Astolfo", "astolfo",
      "Kami", "kami",
      "Phobos", "phobos",
      "SalHack", "salhack",
      "Seppuku", "seppuku",
      "Flux", "flux",
      "Snow", "snow",
      "Rusher", "rusher",
    ],
  },
  {
    name: "Ghost Client — RAM Strings",
    os: "Windows",
    color: "red",
    strings: [
      "combat/Reach", "combat/Killaura", "combat/Aimbot",
      "combat/Triggerbot", "combat/Velocity", "combat/AntiKnockback",
      "Hitbox/Expand", "Reach/Distance", "TargetHUD",
      "KeepSprint", "Criticals", "AutoWeapon",
      "EntityPlayerSP/motionX", "EntityPlayerSP/motionZ",
      "Speed/Boost", "Fly/NoFall", "Sprint/HumanSprint",
      "Step", "Jesus", "BoatFly", "ElytraFly",
      "Spider", "NoSlow", "FastPlace", "FastBreak",
      "Scaffold", "Tower", "Speed/Bhop", "Timer",
      "NoClip", "Velocity", "PacketFly", "PacketElytra",
      "ESP/PlayerESP", "ESP/ChestESP", "ESP/BlockESP",
      "ESP/ItemESP", "XRay", "Nametags", "Tracers",
      "StorageESP", "MobESP", "AntiOverlay", "FullBright",
      "Chams", "ItemPhysics", "Tomograph", "NewChunks",
      "OldChunks", "Freecam", "Zoom",
      "ClickGUI", "ArrayList", "Watermark", "TabGUI",
      "InvViewer", "ArmorHUD", "CrosshairMod",
      "AutoEat", "ChestStealer", "InventoryManager",
      "AutoArmor", "AutoTool", "AutoPot",
      "AutoSnowball", "Spammer", "AntiAFK", "FakePlayer",
      "FastUse", "RightClickRefresh", "MiddleClick",
      "FastBridge", "Nuker", "AutoBuild", "Blink", "MultiClick",
    ],
  },
  {
    name: "Autoclicker",
    os: "Windows",
    color: "orange",
    strings: [
      "AutoClicker", "ClickAssist", "LeftClicker", "RightClicker",
      "JitterClick", "BurstClick", "CPSCounter", "MinCPS", "MaxCPS",
      "RandomizationDelay", "BlockBreakDelay", "InventoryFillClick",
      "RightClickBlatant", "LegitimateClicker",
      "koid", "koid.gg", "koidclicker", "Clicker.java",
      "dreamclient", "dream.clicker", "dream.gg", "dream.club",
      "drip.client", "drip.gg", "drip_autoclicker",
      "whiteout.gg", "whiteout_client", "wo_clicker",
      "itami.exe", "itami_clicker", "itami.club",
      "7clicker", "mangoclicker", "left_click_jitter", "right_click_jitter",
      "murmurclicker", "phantom.gg", "phantom_clicker",
      "JNativeHook", "JNativeHook-[string].dll",
    ],
  },
  {
    name: "Self-Destruct / Anti-Forensics",
    os: "Windows",
    color: "red",
    strings: [
      "SelfDestruct", "DestructModule", "CleanTracks",
      "WipeLogs", "DeleteEvidence", "AntiForensic",
      "UnloadModule", "DisableLoader", "StealthMode",
      "HiddenProcess", "DeleteOnClose", "ExitClean",
      "SecureDelete", "WipeOnExit", "ClearHistory",
      "doomsday", "doomsday.client", "doomsday.Main",
      "doomsday.unload", "doomsday.clean", "doomsday.selfdestruct",
      "doomsday.delete", "doomsday.wipe", "doomsday.stealth",
      "doomsday.hidden", "doomsday.remove", "doomsday.forge",
      "Class.forName", "ClassLoader", "defineClass",
      "loadClass", "getDeclaredMethod",
    ],
  },
  {
    name: "Java Runtime — Exploitation",
    os: "Windows",
    color: "red",
    strings: [
      "ClassLoader", "defineClass", "loadClass", "forName",
      "getRuntime", "ProcessBuilder", "Runtime.exec",
      "Process", "Reflection", "setAccessible",
      "getDeclaredField", "getDeclaredMethod", "Method.invoke",
      "Field.set", "Field.get", "Constructor.newInstance",
      "sun.misc.Unsafe", "UNSAFE.putObject", "UNSAFE.defineClass",
      "java.lang.reflect", "java.lang.Runtime",
      "java.lang.ProcessBuilder", "java.io.File.delete",
      "java.nio.file", "java.nio.file.Files.delete",
    ],
  },
  {
    name: "Anti-Cheat Server",
    os: "Server",
    color: "yellow",
    strings: [
      "Grim", "Vulcan", "Matrix", "Intave", "Rewind",
      "Polar", "AAC", "NCP", "Spigot", "Paper",
      "NoCheatPlus", "Spartan", "SpartanAI", "Karhu",
      "LiteLoaderBukkit", "Negativity", "Watchdog",
      "Hypixel", "HypixelWatchdog",
      "Packet", "Transaction", "KeepAlive", "Payload",
      "Chat", "Abilities", "Position", "Look",
      "Player", "PlayerDigging", "PlayerBlockPlacement",
      "HeldItemChange", "Animation", "EntityAction",
      "ClickWindow", "CreativeInventoryAction",
    ],
  },
  {
    name: "VPN / Tunnel",
    os: "Windows",
    color: "purple",
    strings: [
      "Hamachi", "ZeroTier", "Tailscale", "Radmin",
      "ngrok", "Cloudflare WARP", "WireGuard",
      "OpenVPN", "NordVPN", "ExpressVPN", "ProtonVPN",
      "Mullvad", "SoftEther",
      "C:\\Program Files\\ZeroTier", "C:\\Program Files\\Tailscale",
      "C:\\Program Files\\Hamachi", "C:\\Program Files\\Radmin VPN",
      "hamachi-2-client.exe", "zerotier-one.exe",
      "tailscale-ipn.exe", "radmin_vpn.exe",
      "openvpn.exe", "warp-cli.exe",
      "10.0.0.", "10.8.0.", "10.10.0.",
      "172.16.0.", "25.0.0.",
    ],
  },
  {
    name: "Process Injection / DLL",
    os: "Windows",
    color: "red",
    strings: [
      "VirtualAlloc", "VirtualProtect", "WriteProcessMemory",
      "ReadProcessMemory", "OpenProcess", "CreateRemoteThread",
      "NtMapViewOfSection", "NtWriteVirtualMemory",
      "NtCreateThreadEx", "QueueUserAPC", "SetWindowsHookEx",
      "Inject", "DLL", "LoadLibrary", "GetProcAddress",
      "FreeLibrary", "DllMain", "DLL_PROCESS_ATTACH",
      "DLL_THREAD_ATTACH", "DLL_THREAD_DETACH",
      "CreateToolhelp32Snapshot", "Process32First", "Process32Next",
      "Module32First", "Module32Next",
      "OpenThread", "SuspendThread", "ResumeThread",
      "GetModuleHandle", "GetModuleFileName",
    ],
  },
  {
    name: "File System — NTFS",
    os: "Windows",
    color: "gray",
    strings: [
      "NTFS", "Alternate Data Stream", "ADS", "$DATA",
      "::$INDEX_ALLOCATION", "$FILE_NAME", "$STANDARD_INFORMATION",
      "Zone.Identifier", "ZoneTransfer", "Mark of the Web",
      "C:\\$Recycle.Bin", "$I", "$R",
      "C:\\System Volume Information",
      "C:\\$MFT", "C:\\$LogFile", "C:\\$UsnJrnl",
      "C:\\$Bitmap", "C:\\$Boot", "C:\\$BadClus",
      "C:\\$Secure", "C:\\$Extend",
      "dir C:\\ /s /b", "tree C:\\ /f",
    ],
  },
  {
    name: "Network Connections",
    os: "Windows",
    color: "blue",
    strings: [
      "netstat -ano",
      "netstat -ano | findstr ESTABLISHED",
      "netstat -ano | findstr LISTENING",
      "netstat -ano | findstr TIME_WAIT",
      "netstat -b (admin required)",
      "netstat -r",
      "ipconfig /displaydns",
      "ipconfig /flushdns",
      "arp -a",
      "route print",
      "tracert",
      "nslookup",
      "ping",
      "127.0.0.1", "localhost",
      "ESTABLISHED", "LISTENING", "TIME_WAIT", "CLOSE_WAIT",
    ],
  },
  {
    name: "System Commands",
    os: "Windows",
    color: "gray",
    strings: [
      "tasklist /v",
      "tasklist /m",
      "wmic process list brief",
      "wmic process get name,executablepath",
      "wmic startup list full",
      "wmic product list brief",
      "systeminfo",
      "hostname",
      "whoami /all",
      "net user",
      "net localgroup administrators",
      "net share",
      "schtasks /query /fo LIST /v",
      "sc query type= service state= all",
      "reg query HKLM /s /f",
      "reg query HKCU /s /f",
    ],
  },
  {
    name: "Browser Forensics",
    os: "Cross-platform",
    color: "blue",
    strings: [
      "%localappdata%\\Google\\Chrome\\User Data\\Default\\History",
      "%localappdata%\\Google\\Chrome\\User Data\\Default\\Cookies",
      "%localappdata%\\Google\\Chrome\\User Data\\Default\\Login Data",
      "%appdata%\\Mozilla\\Firefox\\Profiles",
      "%localappdata%\\Microsoft\\Edge\\User Data\\Default\\History",
      "chrome.exe", "firefox.exe", "msedge.exe", "brave.exe",
      "History", "Visit Count", "Last Visit Time",
      "minecraft.net", "mojang.com", "namemc.com",
      "localStorage", "sessionStorage", "IndexedDB",
    ],
  },
  {
    name: "Discord / Telegram Forensics",
    os: "Cross-platform",
    color: "blue",
    strings: [
      "%appdata%\\Discord",
      "%appdata%\\Discord\\Cache\\Cache_Data",
      "%appdata%\\Discord\\Local Storage",
      "%appdata%\\Discord\\Session Storage",
      "%appdata%\\Discord\\IndexedDB",
      "%appdata%\\Discord\\leveldb",
      "%appdata%\\Telegram Desktop\\tdata",
      "token", "refresh_token", "access_token",
      "alts", "account", "mojang", "mail:pass",
      "minecraft", "alt account", "cracked",
    ],
  },
  {
    name: "Linux — Commands & Artifacts",
    os: "Linux",
    color: "yellow",
    strings: [
      "cat /var/log/syslog",
      "cat /var/log/auth.log",
      "cat /var/log/kern.log",
      "cat /var/log/dmesg",
      "cat /var/log/audit/audit.log",
      "cat ~/.bash_history",
      "cat ~/.zsh_history",
      "ls -la ~/.local/share/Trash/",
      "ls -la ~/.minecraft/",
      "find / -name \"*.log\" -mtime -7 2>/dev/null",
      "find / -name \"*.jar\" 2>/dev/null",
      "lsof -p $(pidof java)",
      "strace -p $(pidof java)",
      "fuser -v /dev/tcp/*",
      "netstat -tlnp",
      "ss -tlnp",
      "/proc/[pid]/maps",
      "/proc/[pid]/fd",
      "/proc/[pid]/exe",
      "/proc/[pid]/cmdline",
      "/proc/[pid]/environ",
      "ps aux | grep java",
      "ls -la /tmp/",
      "ls -la /var/tmp/",
    ],
  },
  {
    name: "macOS — Commands & Artifacts",
    os: "macOS",
    color: "purple",
    strings: [
      "ls -la ~/Library/Caches/",
      "ls -la ~/Library/Application\\ Support/",
      "ls -la ~/Library/Preferences/",
      "ls -la ~/Library/Saved\\ Application\\ State/",
      "ls -la ~/Library/HTTPStorages/",
      "ls -la ~/Library/LaunchAgents/",
      "ls -la /Library/LaunchAgents/",
      "ls -la /Library/LaunchDaemons/",
      "cat /private/var/log/system.log",
      "log show --predicate 'process == \"java\"' --last 7d",
      "ls -la ~/Library/Cookies/",
      "mdls [file]",
      "mdfind [query]",
      "xattr [file]",
      "ls -la ~/Library/Mail/",
      "ls -la ~/Library/Messages/",
      "defaults read com.apple.recentitems",
      "sqlite3 ~/Library/Cookies/Cookies.binarycookies",
    ],
  },
  {
    name: "Timing Analysis",
    os: "Cross-platform",
    color: "gray",
    strings: [
      "FILETIME", "SYSTEMTIME", "UnixTimestamp",
      "ActiveTimeBias", "DaylightBias", "TimeZoneKeyName",
      "TimeZoneInformation", "StandardBias", "Bias",
      "GetCurrentTime", "GetLocalTime", "GetSystemTime",
      "time_t", "struct stat", "st_mtime", "st_atime", "st_ctime",
      "Created", "Modified", "Accessed", "Changed",
      "Birth Time", "Change Time",
      "UTC", "GMT", "Local Time",
    ],
  },
  {
    name: "Obfuscation",
    os: "Cross-platform",
    color: "gray",
    strings: [
      "obfuscate", "deobfuscate", "remap", "unmap",
      "mapping", "srg", "notch", "mojang", "yarn", "intermediary",
      "Proguard", "R8", "StringEncryption", "ControlFlow",
      "SourceFile", "LineNumberTable", "LocalVariableTable",
      "StackMapTable", "Exceptions", "Signature",
      "RuntimeVisibleAnnotations", "Deprecated", "Synthetic",
      "BootstrapMethods", "InvokeDynamic",
    ],
  },
  {
    name: "Mod Loader / Forge / Fabric",
    os: "Cross-platform",
    color: "orange",
    strings: [
      "FMLCommonHandler", "FMLPreInitializationEvent",
      "FMLPostInitializationEvent", "FMLInitializationEvent",
      "ForgeModLoader", "net.minecraftforge",
      "MixinBootstrap", "org.spongepowered.asm.mixin",
      "@Mixin", "@Inject", "@Overwrite", "@Shadow",
      "@Redirect", "@ModifyVariable", "@ModifyArg",
      "net.fabricmc", "FabricLoader",
      "LaunchWrapper", "Tweaker", "ITweaker",
      "KnotClient", "FabricLauncher",
    ],
  },
  {
    name: "Hidden / Stealth Software",
    os: "Windows",
    color: "red",
    strings: [
      "HiddenMouse", "HID", "USB Rubber Ducky",
      "Teensy", "Arduino", "BadUSB",
      "Keylogger", "KeySpy", "ActivityMonitor",
      "Spyrix", "Refog", "Agent",
      "HiddenWindow", "WindowHider",
      "SetWindowDisplayAffinity", "FindWindow", "EnumWindows",
      "ShowWindow", "SetWindowPos",
      "WS_EX_TOOLWINDOW", "WS_EX_NOACTIVATE",
      "GetAsyncKeyState", "SetWindowsHookEx",
      "LowLevelKeyboardProc", "LowLevelMouseProc",
      "WH_KEYBOARD_LL", "WH_MOUSE_LL",
    ],
  },
];

const osColors: Record<string, string> = {
  "Windows": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Linux": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "macOS": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Cross-platform": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  "Server": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const catColors: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function StringsPage() {
  const [search, setSearch] = useState("");
  const [osFilter, setOsFilter] = useState<string>("all");
  const [openCats, setOpenCats] = useState<number[]>([]);
  const [highlight, setHighlight] = useState(false);

  const toggleCat = (i: number) =>
    setOpenCats((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const totalStrings = useMemo(
    () => categories.reduce((a, c) => a + c.strings.length, 0), []
  );

  const filtered = useMemo(() => {
    let result = categories;
    if (osFilter !== "all") {
      result = result.filter((c) => c.os === osFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result
        .map((cat) => ({
          ...cat,
          strings: cat.strings.filter((s) => s.toLowerCase().includes(q)),
        }))
        .filter((cat) => cat.strings.length > 0);
    }
    return result;
  }, [search, osFilter]);

  const osList = useMemo(() => {
    const oses = [...new Set(categories.map((c) => c.os))];
    return ["all", ...oses];
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Forensic Strings Dictionary
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          {totalStrings} real strings in {categories.length} categories. Real commands, real paths, real artifacts.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search command, registry key, path, file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {osList.map((os) => (
            <button
              key={os}
              onClick={() => setOsFilter(os)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                osFilter === os
                  ? os === "all"
                    ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                    : osColors[os]
                  : "bg-gray-900/50 border-gray-700 text-gray-500 hover:text-white"
              }`}
            >
              {os === "all" ? "All" : os}
            </button>
          ))}
          <button
            onClick={() => setHighlight(!highlight)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ml-2 ${
              highlight
                ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                : "bg-gray-900/50 border-gray-700 text-gray-500 hover:text-white"
            }`}
          >
            {highlight ? "Highlight ON" : "Highlight OFF"}
          </button>
          <button
            onClick={() => setOpenCats(openCats.length === filtered.length ? [] : filtered.map((_, i) => i))}
            className="text-xs px-3 py-1.5 rounded-lg border bg-gray-900/50 border-gray-700 text-gray-500 hover:text-white transition-colors"
          >
            {openCats.length === filtered.length ? "Collapse" : "Expand All"}
          </button>
          {search && (
            <span className="text-xs text-gray-500 ml-2">
              {filtered.reduce((a, c) => a + c.strings.length, 0)} results
            </span>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {filtered.map((cat, ci) => {
          const origIdx = categories.findIndex((c) => c.name === cat.name);
          const isOpen = openCats.includes(origIdx);
          return (
            <div key={ci} className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleCat(origIdx)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${catColors[cat.color]}`}>
                    {cat.strings.length}
                  </span>
                  <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${osColors[cat.os]}`}>
                    {cat.os}
                  </span>
                </div>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-1">
                  {cat.strings.map((s, si) => (
                    <div
                      key={si}
                      className={`text-xs font-mono py-1 px-2 rounded ${
                        highlight && search && s.toLowerCase().includes(search.toLowerCase())
                          ? "bg-yellow-500/20 text-yellow-300"
                          : s.startsWith("fsutil") || s.startsWith("reg ") || s.startsWith("netstat") || s.startsWith("dir ") || s.startsWith("type ") || s.startsWith("cat ") || s.startsWith("ls ") || s.startsWith("find ") || s.startsWith("wevtutil") || s.startsWith("eventvwr") || s.startsWith("wmic") || s.startsWith("tasklist") || s.startsWith("arp ") || s.startsWith("tracert") || s.startsWith("nslookup") || s.startsWith("log show") || s.startsWith("defaults ")
                          ? "bg-green-500/10 text-green-400"
                          : s.startsWith("HKLM") || s.startsWith("HKCU")
                          ? "bg-purple-500/10 text-purple-400"
                          : s.startsWith("C:\\") || s.startsWith("%") || s.startsWith(".")
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-gray-800/50 text-gray-300"
                      }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No results</p>
          <p className="text-sm">Try a different string or change OS filter.</p>
        </div>
      )}

      <div className="border-t border-gray-800 pt-8 mt-12 text-center">
        <p className="text-gray-500 text-sm">
          CharlieRP Forensic Strings Reference — {totalStrings} strings documented
        </p>
      </div>
    </div>
  );
}
