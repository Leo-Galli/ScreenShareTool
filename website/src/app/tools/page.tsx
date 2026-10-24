import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tool Encyclopedia",
  description:
    "29 forensic tools used during Minecraft screen shares — System Informer, Everything, Luyten, the NirSoft suite, Wireshark, and more, with install commands and usage notes.",
}

const tools = [
  {
    category: "RAM and Process Analysis",
    items: [
      {
        name: "System Informer",
        desc: "Process, handle, loaded-DLL, and memory analysis. The primary tool for RAM dumps, inspecting modules loaded by javaw.exe, and detecting injected DLLs.",
        use: "Open javaw.exe > Properties > Memory > Strings. Filter for .minecraft/mods, JNativeHook, or known cheat names.",
        install: "winget install SystemInformer.SystemInformer --silent",
        url: "https://systeminformer.sourceforge.io",
      },
      {
        name: "Process Hacker 2",
        desc: "The predecessor to System Informer, with the same core capabilities: process, handle, DLL, and memory analysis.",
        use: "Same workflow as System Informer. Useful as a fallback if it isn't available.",
        install: "winget install ProcessHacker.ProcessHacker --silent",
        url: "https://processhacker.sourceforge.io",
      },
      {
        name: "Strings (Sysinternals)",
        desc: "Extracts printable text strings from any binary file. Useful for analyzing .jar, .exe, and .dll files.",
        use: 'strings javaw.exe | findstr /i "killaura velocity fly" to search for strings inside a binary.',
        install: "Part of the Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/strings",
      },
    ],
  },
  {
    category: "Filesystem and Search",
    items: [
      {
        name: "Everything (VoidTools)",
        desc: "An MFT indexer with instant search across the entire filesystem. Finds any file in milliseconds.",
        use: "Search for latest.log, ias.json, suspicious .jar files, files in %temp%, or hidden folders.",
        install: "winget install voidtools.Everything --silent",
        url: "https://www.voidtools.com",
      },
      {
        name: "7-Zip",
        desc: "Archive extraction. Required for opening .log.gz, .zip, and .rar files.",
        use: "Extract compressed Minecraft and launcher logs.",
        install: "winget install 7zip.7zip --silent",
        url: "https://www.7-zip.org",
      },
      {
        name: "Notepad++",
        desc: "A text editor with regex search, file comparison, and syntax highlighting.",
        use: "Open and search logs, JSON files, and configuration files with advanced find/replace.",
        install: "winget install Notepad++.Notepad++ --silent",
        url: "https://notepad-plus-plus.org",
      },
    ],
  },
  {
    category: "Java Forensics",
    items: [
      {
        name: "Luyten",
        desc: "A Java decompiler. Opens a .jar and shows its decompiled bytecode as readable Java source.",
        use: "Open every .jar in the mods folder and look for suspicious packages or classes (liquidbounce, wurst, etc.).",
        install: "Download from github.com/deathmarine/Luyten",
        url: "https://github.com/deathmarine/Luyten",
      },
      {
        name: "JD-GUI",
        desc: "An alternative Java decompiler with a graphical interface for browsing decompiled source.",
        use: "A drop-in alternative to Luyten for .jar analysis.",
        install: "Download from java-decompiler.github.io",
        url: "https://java-decompiler.github.io",
      },
      {
        name: "CFR",
        desc: "A command-line Java decompiler. Useful for automation and batch analysis.",
        use: "java -jar cfr.jar mod.jar --outputdir ./decompiled/",
        install: "Download from github.com/leibnitz27/cfr",
        url: "https://github.com/leibnitz27/cfr",
      },
    ],
  },
  {
    category: "Registry Forensics",
    items: [
      {
        name: "RegScanner (NirSoft)",
        desc: "Advanced Windows Registry scanning with flexible filters.",
        use: "Search for BAM, UserAssist, USBSTOR, ShellBags, and MuiCache entries.",
        install: "Download from nirsoft.net/utils/regscanner.html",
        url: "https://www.nirsoft.net/utils/regscanner.html",
      },
      {
        name: "RegistryLoaderView (NirSoft)",
        desc: "Shows registry keys loaded at system boot.",
        use: "Check which keys are loaded at startup.",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/registry_loader_view.html",
      },
      {
        name: "RegShot",
        desc: "Compares registry snapshots taken before and after an event to detect changes.",
        use: "Take a snapshot before and after running a suspicious program.",
        install: "Download from sourceforge.net/projects/regshot",
        url: "https://sourceforge.net/projects/regshot",
      },
    ],
  },
  {
    category: "Prefetch and Timeline Forensics",
    items: [
      {
        name: "WinPrefetchView (NirSoft)",
        desc: "Displays and analyzes Windows Prefetch files, including executables run, dates, and run counts.",
        use: "Search for conhost.exe, powershell.exe, wscript.exe, and javaw.exe. Check which files they loaded.",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/winprefetchview.html",
      },
      {
        name: "LastActivityView (NirSoft)",
        desc: "Shows recent system activity: files opened, programs run, and connections made.",
        use: "Build a complete timeline of the player's recent activity.",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/last_activity_view.html",
      },
      {
        name: "ExecutedProgramsList (NirSoft)",
        desc: "A complete history of executed programs with dates and paths.",
        use: "Find executables that shouldn't be present on the machine.",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/executed_programs_list.html",
      },
      {
        name: "RecentFilesView (NirSoft)",
        desc: "Files opened or modified recently.",
        use: "Find recently modified files that could indicate a cheat.",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/recent_files_view.html",
      },
    ],
  },
  {
    category: "USB and Peripheral Forensics",
    items: [
      {
        name: "USBDeview (NirSoft)",
        desc: "A complete history of every USB device connected, with first/last-connected timestamps and serial numbers.",
        use: "Find USB devices disconnected just before the screen share (Flag D).",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/usb_devices_view.html",
      },
      {
        name: "USBLogView (NirSoft)",
        desc: "Real-time logging of USB connect/disconnect events.",
        use: "Monitor USB connections live during the screen share.",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/usb_log_view.html",
      },
    ],
  },
  {
    category: "Network Forensics",
    items: [
      {
        name: "Wireshark",
        desc: "Network packet analysis. See exactly what the machine is communicating with.",
        use: "Deep inspection of traffic, protocols, and connections.",
        install: "winget install WiresharkFoundation.Wireshark --silent",
        url: "https://www.wireshark.org",
      },
      {
        name: "TCPView (Sysinternals)",
        desc: "Shows every active TCP/UDP connection alongside the owning process.",
        use: "See which processes have active connections. Spot connections to VPN or cheat servers.",
        install: "Part of the Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/tcpview",
      },
      {
        name: "CurrPorts (NirSoft)",
        desc: "An alternative to TCPView with additional filtering options.",
        use: "Same workflow as TCPView.",
        install: "Download from nirsoft.net",
        url: "https://www.nirsoft.net/utils/cports.html",
      },
    ],
  },
  {
    category: "Disk Forensics",
    items: [
      {
        name: "FTK Imager",
        desc: "Creates forensic disk images. Useful for preserving evidence.",
        use: "Image the disk before modifying anything on it.",
        install: "Download from accessdata.com",
        url: "https://www.exterro.com/ftk-imager",
      },
      {
        name: "Autopsy",
        desc: "An open-source forensics platform for full disk analysis.",
        use: "In-depth forensic analysis of the hard drive.",
        install: "Download from sleuthkit.org",
        url: "https://www.autopsy.com",
      },
      {
        name: "WinDirStat",
        desc: "Visualizes disk space usage to help locate large hidden folders.",
        use: "Find large hidden folders that could contain cheats or logs.",
        install: "winget install WinDirStat.WinDirStat --silent",
        url: "https://windirstat.net",
      },
    ],
  },
  {
    category: "System Tools",
    items: [
      {
        name: "Autoruns (Sysinternals)",
        desc: "Every program configured to run at boot, logon, or service startup.",
        use: "Find hidden programs configured to launch at startup.",
        install: "Part of the Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/autoruns",
      },
      {
        name: "AccessChk (Sysinternals)",
        desc: "Displays permissions on files, folders, and registry keys.",
        use: "Check for suspicious permissions on files or folders.",
        install: "Part of the Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/accesschk",
      },
      {
        name: "AccessEnum (Sysinternals)",
        desc: "Shows permissions on files, folders, and registry keys in a single view.",
        use: "Find files or folders with modified permissions.",
        install: "Part of the Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/accessenum",
      },
    ],
  },
  {
    category: "Scripts and Automation",
    items: [
      {
        name: "AstroSS",
        desc: "A PowerShell script for screen shares. Extracts BAM entries with timezone correction, Authenticode signature checks, and path reconstruction.",
        use: "Run as Administrator to extract BAM entries with last-execution time and signature status.",
        install: "github.com/Jammy108/AstroSS",
        url: "https://github.com/Jammy108/AstroSS",
      },
      {
        name: "ScreenShareTool",
        desc: "The forensic GUI/CLI behind this site: 48 tracked cheat clients, BAM parser, whole-PC scan, and false-positive filtering.",
        use: "python -m screenshare_tool --gui for the app, or --days 7 for CLI.",
        install: "winget install LeoGalli.CharlieRPScreenShareTool",
        url: "https://github.com/Leo-Galli/ScreenShareTool",
      },
    ],
  },
]

export default function ToolsPage() {
  const toolCount = tools.reduce((a, c) => a + c.items.length, 0)

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
      <div className="mb-14 max-w-3xl">
        <h1
          className="font-display font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.5rem)", letterSpacing: "-0.04em" }}
        >
          Tool Encyclopedia
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          {toolCount} tools for Minecraft screen shares — install commands and usage notes.
        </p>
      </div>

      <div className="space-y-16">
        {tools.map((group, gi) => (
          <div key={gi}>
            <h2 className="font-display mb-2 text-2xl font-semibold tracking-tight text-white">
              {group.category}
            </h2>
            <div className="mt-2">
              {group.items.map((tool, ti) => (
                <div key={ti} className="list-row">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                      {tool.name}
                    </h3>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Official site for ${tool.name} (opens in new tab)`}
                      className="link-amber shrink-0 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                    >
                      site ↗
                    </a>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {tool.desc}
                  </p>
                  <div className="guide-inset mt-4">
                    <p className="mb-1 text-xs font-medium" style={{ color: "var(--muted)" }}>
                      Usage
                    </p>
                    <p className="text-sm text-white">{tool.use}</p>
                  </div>
                  <div className="cmd-box mt-3">{tool.install}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
