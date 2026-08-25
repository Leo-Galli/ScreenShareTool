"use client";

import { useState, useMemo } from "react";

const categories = [
  {
    name: "NTFS Journal (USN Journal)",
    os: "Windows",
    color: "blue",
    strings: [
      "$UsnJrnl:$J", "$UsnJrnl:$Max", "$UsnJrnl:$Data",
      "USN_REASON_DATA_OVERWRITE", "USN_REASON_DATA_EXTEND", "USN_REASON_DATA_TRUNCATION",
      "USN_REASON_FILE_CREATE", "USN_REASON_FILE_DELETE", "USN_REASON_EA_CHANGE",
      "USN_REASON_SECURITY_CHANGE", "USN_REASON_RENAME_OLD_NAME", "USN_REASON_RENAME_NEW_NAME",
      "USN_REASON_HARD_LINK_CHANGE", "USN_REASON_COMPRESSION_CHANGE", "USN_REASON_ENCRYPTION_CHANGE",
      "USN_REASON_INTEGRITY_CHANGE", "USN_REASON_REPARSE_POINT_CHANGE", "USN_REASON_STREAM_CHANGE",
      "USN_REASON_TRANSACTED_CHANGE", "USN_REASON_INTEGRITY_CHANGE", "USN_REASON_BASIC_INFO_CHANGE",
      "USN_REASON_LINK_ID_CHANGE", "USN_REASON_CRYPTO_CHANGE", "USN_REASON_EA_CHANGE",
      "$MFT", "$MFTMirr", "$LogFile", "$Volume", "$AttrDef",
      "$Bitmap", "$Boot", "$BadClus", "$Secure", "$Extend",
      "NTFS", "NTFS volume", "MFT entry", "file reference number",
      "source file", "parent file", "file name", "file attributes",
      "timestamp", "reason", "file ID", "parent ID",
    ],
  },
  {
    name: "Prefetch",
    os: "Windows",
    color: "blue",
    strings: [
      "C:\\Windows\\Prefetch", "*.pf", "Aggregated.exe",
      "Created by Windows", "Last Run Time", "Run Count",
      "File References", "Device Path", "Volume0",
      "SCCA\\Ver", "PF headers", "MAMPrefetch",
      "TASKHOST.EXE", "CONHOST.EXE", "RUNDLL32.EXE",
      "POWERSHELL.EXE", "CMD.EXE", "MSIEXEC.EXE",
      "WSCRIPT.EXE", "CSCRIPT.EXE", "REGSVR32.EXE",
      "RASPHONE.EXE", "NETSTAT.EXE", "IPCONFIG.EXE",
      "JAVAW.EXE", "JAVA.EXE", "PYTHON.EXE",
      "SC.EXE", "SCHTASKS.EXE", "REG.EXE",
      "DEL.EXE", "XCOPY.EXE", "ROBOCOPY.EXE",
      "CACLS.EXE", "ICACLS.EXE", "TAKEOWN.EXE",
    ],
  },
  {
    name: "BAM (Background Activity Moderator)",
    os: "Windows",
    color: "cyan",
    strings: [
      "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\UserSettings",
      "HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\State\\UserSettings",
      "bam\\UserSettings\\", "bam\\State\\UserSettings\\",
      "ActiveTimeBias", "DaylightBias", "TimeZoneKeyName",
      "LastExecTime", "SequenceNumber", "Version",
      "\\Device\\HarddiskVolume", "\\Device\\HarddiskVolume1",
      "\\Device\\HarddiskVolume2", "\\Device\\HarddiskVolume3",
      "SID", "SecurityIdentifier", "NTAccount",
      "FileTime", "FromFileTimeUtc", "FromFileTime",
      "Bam\\UserSettings", "Bam\\State\\UserSettings",
      "Windows\\System32", "Program Files", "Program Files (x86)",
      "AppData\\Local", "AppData\\Roaming", "Desktop",
      "Downloads", "Documents", "Temp",
    ],
  },
  {
    name: "UserAssist",
    os: "Windows",
    color: "cyan",
    strings: [
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist",
      "UserAssist\\", "UserAssist\\Count",
      "UserAssist\\Count\\{ SID }",
      "ROT13", "ROT 13", "decryption", "encode",
      "UserAssist Key", "UserAssist ID", "UserAssist Entry",
      "Focus Time", "Run Count", "Focus Count",
      "Run Count Value", "Focus Time Value",
      "encrypted", "encoded", "obfuscated",
      "Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist",
    ],
  },
  {
    name: "USBSTOR",
    os: "Windows",
    color: "blue",
    strings: [
      "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR",
      "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USB",
      "USBSTOR", "USB\\VID_", "USB\\PID_",
      "Disk&Ven_", "Prod_", "Rev_",
      "FirstInstallDate", "LastConnected", "DeviceDesc",
      "HardwareID", "CompatibleIds", "Driver",
      "ClassGUID", "{4D36E967-E325-11CE-BFC1-08002BE10318}",
      "DiskDrive", "USB Device", "USB Mass Storage",
      "FriendlyName", "LocationInformation", "Capabilities",
      "ConfigFlags", "Mfg", "Service", "DeviceParameters",
      "SerialNumber", "VendorId", "ProductId", "Revision",
      "DevicePharento", "ContainerID", "ParentIdPrefix",
    ],
  },
  {
    name: "ShellBags",
    os: "Windows",
    color: "purple",
    strings: [
      "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU",
      "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags",
      "BagMRU", "Bags", "Shell", "Bag",
      "Shellbags", "Shell Bag", "Bag Entry",
      "MRU", "Most Recently Used", "Sort",
      "View", "FolderType", "GroupByKey",
      "GroupView", "GroupByKey:PID", "GroupByDirection",
      "FolderCapFlags", "IconSize", "Flags",
      "NTFS", "POSIX", "Windows",
      "Desktop", "MyComputer", "Network",
      "RecycleBin", "ControlPanel", "Printers",
    ],
  },
  {
    name: "MuiCache",
    os: "Windows",
    color: "purple",
    strings: [
      "HKCU\\Software\\Classes\\Local Settings\\MUiCache",
      "MuiCache", "MUI", "MUI\\Cache",
      "FriendlyName", "ApplicationName", "ApplicationPath",
      "Microsoft\\Windows\\Shell\\MuiCache",
      "LanmanAPI", "Shell32.dll", "ExplorerFrame.dll",
      "mscoree.dll", "mscorwks.dll", "clr.dll",
      "Application Company", "Application Description",
    ],
  },
  {
    name: "Registry Keys — Critici",
    os: "Windows",
    color: "red",
    strings: [
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunServices",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunServicesOnce",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\Run",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\Run",
      "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon",
      "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options",
      "HKLM\\SYSTEM\\CurrentControlSet\\Services",
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders",
      "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders",
      "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\BootExecute",
    ],
  },
  {
    name: "Event Logs",
    os: "Windows",
    color: "yellow",
    strings: [
      "Microsoft-Windows-PowerShell/Operational",
      "Microsoft-Windows-Sysmon/Operational",
      "Microsoft-Windows-TerminalServices-LocalSessionManager/Operational",
      "Microsoft-Windows-TerminalServices-RemoteConnectionManager/Operational",
      "Microsoft-Windows-Windows Defender/Operational",
      "Microsoft-Windows-AppLocker/EXE and DLL",
      "Microsoft-Windows-WMI-Activity/Operational",
      "Microsoft-Windows-CodeIntegrity/Operational",
      "Security", "System", "Application",
      "Microsoft-Windows-Sysmon", "Event ID",
      "Process Create", "File Create", "Registry Value Set",
      "Network Connection", "DNS Query", "Driver Load",
      "Image Load", "Create Remote Thread", "Access Process",
    ],
  },
  {
    name: "Minecraft — Percorsi e File",
    os: "Windows",
    color: "green",
    strings: [
      "%appdata%\\.minecraft", ".minecraft\\versions", ".minecraft\\mods",
      ".minecraft\\config", ".minecraft\\logs", ".minecraft\\resourcepacks",
      ".minecraft\\saves", ".minecraft\\libraries", ".minecraft\\assets",
      "launcher_profiles.json", "launcher_accounts.json",
      "usercache.json", "user.properties", "profiles.json",
      "TlauncherProfiles.json", "latest.log", "debug.log",
      "fml-client-latest.log", "blclient.log",
      ".lunarclient", ".lunarclient\\offline\\logs",
      ".battlaxy", ".battlaxy\\logs",
      "ias.json", "ias-accounts.json", "accounts.json",
      "net.minecraft.client.main.Main", "net.minecraft.launchwrapper.Launch",
      "net.fabricmc.loader", "net.minecraftforge",
      "C:\\Users\\", "AppData\\Roaming", "AppData\\Local",
    ],
  },
  {
    name: "Minecraft — Stringhe Log",
    os: "Windows",
    color: "green",
    strings: [
      "Logging in as", "Setting user:", "Session ID is",
      "Connecting to", "LwjglWindow: Title: Minecraft",
      "Disconnected", "Server IP:", "Multiplayer login",
      "Client thread/INFO", "Client thread/WARN",
      "Client thread/ERROR", "Forge Mod Loader",
      "FML", "Mixin", "FabricLoader",
      "OptiFine", "OptiFineLoader", "LegacyOptiFine",
      "Class.forName", "ClassLoader", "defineClass",
      "LaunchWrapper", "KnotClient", "FabricLoader",
      "MixinBootstrap", "SpongePowered",
    ],
  },
  {
    name: "Ghost Client — File e Percorsi",
    os: "Windows",
    color: "red",
    strings: [
      "LiquidBounce", "net.ccbluex.liquidbounce", "ccbluex",
      "Wurst", "wurstclient", "net.wurstclient",
      "Sigma", "sigma.modules", "net.sigmaclient",
      "FDPClient", "fdpclient", "fdp.client.Main",
      "Vape", "net.vape.client", "vape.v4", "vape.render",
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
    name: "Ghost Client — Stringhe RAM",
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
    name: "Autoclicker — Stringhe",
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
      "Proxy", "InvocationHandler", "Method",
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
      "Hypixel", "HypixelWatchdog", "WatchdogCheck",
      "Packet", "Transaction", "KeepAlive", "Payload",
      "Chat", "Abilities", "Position", "Look",
      "Player", "PlayerDigging", "PlayerBlockPlacement",
      "HeldItemChange", "Animation", "EntityAction",
      "ClickWindow", "CreativeInventoryAction", "EnchantItem",
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
      "Mullvad", "SoftEther", "SoftEtherVPN",
      "vpn0", "tun0", "tap0", "wg0",
      "C:\\Program Files\\ZeroTier", "C:\\Program Files\\Tailscale",
      "C:\\Program Files\\Hamachi", "C:\\Program Files\\Radmin VPN",
      "hamachi-2-client.exe", "zerotier-one.exe",
      "tailscale-ipn.exe", "radmin_vpn.exe",
      "openvpn.exe", "warp-cli.exe",
      "10.0.0.", "10.8.0.", "10.10.0.",
      "172.16.0.", "192.168.", "25.0.0.",
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
      "DLL_THREAD_ATTACH", "DLL_THREAD_DETACH", "DLL_PROCESS_DETACH",
      "CreateToolhelp32Snapshot", "Process32First", "Process32Next",
      "Module32First", "Module32Next", "Thread32First", "Thread32Next",
      "OpenThread", "SuspendThread", "ResumeThread",
      "GetModuleHandle", "GetModuleFileName", "GetModuleInformation",
    ],
  },
  {
    name: "File System — NTFS",
    os: "Windows",
    color: "gray",
    strings: [
      "NTFS", "Alternate Data Stream", "ADS", "$DATA",
      "::$INDEX_ALLOCATION", "$FILE_NAME", "$STANDARD_INFORMATION",
      "$SECURITY_DESCRIPTOR", "$DATA", "$EFS",
      "Zone.Identifier", "ZoneTransfer", "Mark of the Web",
      "C:\\$Recycle.Bin", "$I", "$R",
      "C:\\System Volume Information", "System Volume Information",
      "C:\\$MFT", "C:\\$LogFile", "C:\\$UsnJrnl",
      "C:\\$Bitmap", "C:\\$Boot", "C:\\$BadClus",
      "C:\\$Secure", "C:\\$Extend", "C:\\$Extend\\$ObjId",
      "C:\\$Extend\\$Quota", "C:\\$Extend\\$Reparse",
      "C:\\$Extend\\$RmMetadata",
    ],
  },
  {
    name: "Browser Forensics",
    os: "Cross-platform",
    color: "blue",
    strings: [
      "Cookies", "History", "Bookmarks", "Login Data",
      "Web Data", "Local State", "Preferences",
      "chrome.exe", "firefox.exe", "msedge.exe", "brave.exe",
      "History", "Visit Count", "Last Visit Time",
      "chromium", "User Data", "Default", "Profile 1",
      "%localappdata%\\Google\\Chrome\\User Data",
      "%appdata%\\Mozilla\\Firefox\\Profiles",
      "%localappdata%\\Microsoft\\Edge\\User Data",
      "minecraft.net", "mojang.com", "namemc.com",
      "mc-name", "alt", "account", "login",
      "localStorage", "sessionStorage", "IndexedDB",
    ],
  },
  {
    name: "Discord / Telegram Forensics",
    os: "Cross-platform",
    color: "blue",
    strings: [
      "%appdata%\\Discord", "%appdata%\\Discord\\Cache",
      "%appdata%\\Discord\\Cache\\Cache_Data",
      "%appdata%\\Discord\\Code Cache",
      "%appdata%\\Discord\\Local Storage",
      "%appdata%\\Discord\\Session Storage",
      "%appdata%\\Discord\\IndexedDB",
      "%appdata%\\Discord\\leveldb",
      "%appdata%\\Telegram Desktop\\tdata",
      "%appdata%\\Telegram Desktop\\tdata\\D877F783D5D3EF8C0",
      "token", "refresh_token", "access_token",
      "alts", "account", "mojang", "mail:pass",
      "minecraft", "alt account", "cracked",
      "DiscordCache", "Cache_Data", "index",
    ],
  },
  {
    name: "Linux — Artefatti",
    os: "Linux",
    color: "yellow",
    strings: [
      "/var/log/syslog", "/var/log/auth.log", "/var/log/kern.log",
      "/var/log/dmesg", "/var/log/audit/audit.log",
      "~/.bash_history", "~/.zsh_history", "~/.local/share/recently-used.xbel",
      "~/.local/share/Trash", "~/.local/share/gvfs-metadata",
      "/tmp/", "/var/tmp/", "/dev/shm/",
      "~/.minecraft/", "~/.local/share/minecraft/",
      "bash_history", "zsh_history", "recently-used.xbel",
      "Trash", "recently-used", "metadata",
      "/proc/[pid]/maps", "/proc/[pid]/fd", "/proc/[pid]/exe",
      "/proc/[pid]/cmdline", "/proc/[pid]/environ",
      "lsof", "strace", "fuser", "netstat", "ss",
    ],
  },
  {
    name: "macOS — Artefatti",
    os: "macOS",
    color: "purple",
    strings: [
      "~/Library/Caches", "~/Library/Application Support",
      "~/Library/Preferences", "~/Library/Saved Application State",
      "~/Library/HTTPStorages", "~/Library/WebKit",
      "/private/var/log/asl", "/private/var/log/system.log",
      "~/Library/Cookies", "com.apple.loginitems",
      "LSLoginItems", "LaunchAgents", "LaunchDaemons",
      "/Library/LaunchAgents", "/Library/LaunchDaemons",
      "~/Library/LaunchAgents", "LoginItem",
      "~/Library/Saved Application State",
      "com.apple.recentitems", "com.apple.recent Documents",
      "Open Recent", "NSRecentDocuments",
      "~/Library/Mail", "~/Library/Messages",
      "history.db", "chat.db", "contacts.db",
      "lsregister", "mdls", "mdfind", "xattr",
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
      "Timestamp", "Epoch", "Miliiseconds",
    ],
  },
  {
    name: "Obfuscation / Offuscamento",
    os: "Cross-platform",
    color: "gray",
    strings: [
      "obfuscate", "deobfuscate", "remap", "unmap",
      "mapping", "srg", "notch", "mojang", "yarn", "intermediary",
      "Proguard", "R8", "StringEncryption", "ControlFlow",
      "SourceFile", "LineNumberTable", "LocalVariableTable",
      "StackMapTable", "Exceptions", "Signature",
      "RuntimeVisibleAnnotations", "Deprecated", "Synthetic",
      "BootstrapMethods", "InvokeDynamic", "MethodParameters",
      "TypeAnnotation", "InnerClasses", "EnclosingMethod",
      "SourceDebugExtension", "LocalVariableTypeTable",
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
      "@Accessor", "@Invoker", "@At",
      "net.fabricmc", "FabricLoader", "net.fabricmc.loader",
      "MixinEnvironment", "MixinTransformer",
      "LaunchWrapper", "Tweaker", "ITweaker",
      "KnotClient", "FabricLauncher",
      "DeobfuscatingTransformer", "RuntimeDeobfuscation",
    ],
  },
  {
    name: "Network Connections",
    os: "Cross-platform",
    color: "blue",
    strings: [
      "ServerSocket", "Socket", "connect", "bind",
      "InetSocketAddress", "Channel", "Selector",
      "DatagramSocket", "loopback", "127.0.0.1", "localhost",
      "ws://", "wss://", "http://", "https://",
      "netstat", "ESTABLISHED", "LISTENING",
      "TIME_WAIT", "CLOSE_WAIT", "FIN_WAIT",
      "netstat -ano", "netstat -b", "netstat -r",
      "ipconfig /displaydns", "ipconfig /flushdns",
      "arp -a", "route print", "tracert",
      "nslookup", "ping", "dig",
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
      "SetWindowDisplayAffinity", "GetWindowLong",
      "SetWindowLong", "FindWindow", "EnumWindows",
      "ShowWindow", "SetWindowPos", "SetLayeredWindowAttributes",
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
            Dizionario Stringhe Forensi
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          {totalStrings} stringhe reali in {categories.length} categorie. Registry, Journal, Prefetch, BAM, USB, RAM, Network, OS artifacts.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Cerca stringa, chiave registry, percorso, nome file..."
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
              {os === "all" ? "Tutti" : os}
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
            {highlight ? "Evidenza ON" : "Evidenza OFF"}
          </button>
          <button
            onClick={() => setOpenCats(openCats.length === filtered.length ? [] : filtered.map((_, i) => i))}
            className="text-xs px-3 py-1.5 rounded-lg border bg-gray-900/50 border-gray-700 text-gray-500 hover:text-white transition-colors"
          >
            {openCats.length === filtered.length ? "Comprimi" : "Espandi Tutto"}
          </button>
          {search && (
            <span className="text-xs text-gray-500 ml-2">
              {filtered.reduce((a, c) => a + c.strings.length, 0)} risultati
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
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {cat.strings.map((s, si) => (
                      <span
                        key={si}
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono border ${
                          highlight && search && s.toLowerCase().includes(search.toLowerCase())
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : catColors[cat.color]
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Nessun risultato</p>
          <p className="text-sm">Prova con un&apos;altra stringa o cambia filtro OS.</p>
        </div>
      )}

      <div className="border-t border-gray-800 pt-8 mt-12 text-center">
        <p className="text-gray-500 text-sm">
          CharlieRP Forensic Strings Reference — {totalStrings} stringhe documentate
        </p>
      </div>
    </div>
  );
}
