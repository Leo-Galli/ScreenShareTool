"use client";

const tools = [
  {
    category: "RAM and Process Analysis",
    items: [
      {
        name: "System Informer",
        desc: "Analisi processi, handle, DLL caricate, memoria. Il tool principale per dump RAM, ispezione moduli caricati da javaw.exe e rilevamento DLL iniettate.",
        use: "Aprire javaw.exe > Properties > Memory > Strings. Filtrare per .minecraft/mods, JNativeHook, nomi cheat.",
        install: "winget install SystemInformer.SystemInformer --silent",
        url: "https://systeminformer.sourceforge.io",
      },
      {
        name: "Process Hacker 2",
        desc: "Predecessore di System Informer. Stesse funzionalita: analisi processi, handle, DLL, memoria.",
        use: "Stesso utilizzo di System Informer. Utile come alternativa.",
        install: "winget install ProcessHacker.ProcessHacker --silent",
        url: "https://processhacker.sourceforge.io",
      },
      {
        name: "Strings (Sysinternals)",
        desc: "Estrae stringhe testuali da qualsiasi file binario. Utile per analizzare .jar, .exe, .dll.",
        use: "strings javaw.exe | findstr /i \"killaura velocity fly\" per cercare stringhe in binari.",
        install: "Parte di Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/strings",
      },
    ],
  },
  {
    category: "Filesystem and Search",
    items: [
      {
        name: "Everything (VoidTools)",
        desc: "Indicizzatore MFT. Ricerche istantanee su tutto il filesystem. Trova qualsiasi file in millisecondi.",
        use: "Cercare: latest.log, ias.json, .jar sospetti, file in %temp%, cartelle nascoste.",
        install: "winget install voidtools.Everything --silent",
        url: "https://www.voidtools.com",
      },
      {
        name: "7-Zip",
        desc: "Estrazione archivi compressi. Indispensabile per aprire .log.gz, .zip, .rar.",
        use: "Estrarre log compressi di Minecraft e launcher.",
        install: "winget install 7zip.7zip --silent",
        url: "https://www.7-zip.org",
      },
      {
        name: "Notepad++",
        desc: "Editor testo con ricerca regex, confronto file, sintassi highlighting.",
        use: "Aprire e analizzare log, .json, file di configurazione con ricerca avanzata.",
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
        desc: "Decompilatore Java. Apre .jar e mostra il bytecode decompilato in Java leggibile.",
        use: "Aprire ogni .jar nella cartella mods, cercare package/clinze sospetti (liquidbounce, wurst, etc.).",
        install: "Download da github.com/deathmarine/Luyten",
        url: "https://github.com/deathmarine/Luyten",
      },
      {
        name: "JD-GUI",
        desc: "Decompilatore Java alternativo. Interface grafica per navigare il codice sorgente decompilato.",
        use: "Alternativa a Luyten per analisi .jar.",
        install: "Download da java-decompiler.github.io",
        url: "https://java-decompiler.github.io",
      },
      {
        name: "CFR",
        desc: "Decompilatore Java da riga di comando. Utile per automazione e batch analysis.",
        use: "java -jar cfr.jar mod.jar --outputdir ./decompiled/",
        install: "Download da github.com/leibnitz27/cfr",
        url: "https://github.com/leibnitz27/cfr",
      },
    ],
  },
  {
    category: "Registry Forensics",
    items: [
      {
        name: "RegScanner (NirSoft)",
        desc: "Scansione avanzata del registro di Windows con filtri avanzati.",
        use: "Cercare BAM, UserAssist, USBSTOR, ShellBags, MuiCache.",
        install: "Download da nirsoft.net/utils/regscanner.html",
        url: "https://www.nirsoft.net/utils/regscanner.html",
      },
      {
        name: "RegistryLoaderView (NirSoft)",
        desc: "Mostra le chiavi di registro caricate al boot del sistema.",
        use: "Verificare quali chiavi vengono caricate all'avvio.",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/registry_loader_view.html",
      },
      {
        name: "RegShot",
        desc: "Confronta snapshot del registro prima e dopo un evento. Rileva modifiche.",
        use: "Fare snapshot prima e dopo l'esecuzione di un programma sospetto.",
        install: "Download da sourceforge.net/projects/regshot",
        url: "https://sourceforge.net/projects/regshot",
      },
    ],
  },
  {
    category: "Prefetch and Timeline Forensics",
    items: [
      {
        name: "WinPrefetchView (NirSoft)",
        desc: "Visualizza e analizza i file Prefetch di Windows. Mostra eseguibili avviati, data, conteggio.",
        use: "Cercare: conhost.exe, powershell.exe, wscript.exe, javaw.exe. Verificare file caricati.",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/winprefetchview.html",
      },
      {
        name: "LastActivityView (NirSoft)",
        desc: "Mostra le attivita recenti del sistema: file aperti, programmi eseguiti, connessioni.",
        use: "Timeline completa delle attivita del giocatore.",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/last_activity_view.html",
      },
      {
        name: "ExecutedProgramsList (NirSoft)",
        desc: "Storico completo degli eseguibili avviati con date e percorsi.",
        use: "Trovare eseguibili che non dovrebbero essere presenti.",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/executed_programs_list.html",
      },
      {
        name: "RecentFilesView (NirSoft)",
        desc: "File aperti o modificati di recente.",
        use: "Trovare file modificati di recente che potrebbero indicare cheat.",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/recent_files_view.html",
      },
    ],
  },
  {
    category: "USB and Peripheral Forensics",
    items: [
      {
        name: "USBDeview (NirSoft)",
        desc: "Storico completo di tutti i dispositivi USB collegati. Data prima/ultima connessione, serial number.",
        use: "Trovare dispositivi USB scollegati prima dello SS (FLAG D).",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/usb_devices_view.html",
      },
      {
        name: "USBLogView (NirSoft)",
        desc: "Log delle connessioni e disconnessioni USB in tempo reale.",
        use: "Monitorare connessioni USB durante lo SS.",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/usb_log_view.html",
      },
    ],
  },
  {
    category: "Network Forensics",
    items: [
      {
        name: "Wireshark",
        desc: "Analisi pacchetti di rete. Capire esattamente cosa comunica il PC.",
        use: "Analisi avanzata del traffico di rete, protocolli, connessioni.",
        install: "winget install WiresharkFoundation.Wireshark --silent",
        url: "https://www.wireshark.org",
      },
      {
        name: "TCPView (Sysinternals)",
        desc: "Mostra tutte le connessioni TCP/UDP attive con processi associati.",
        use: "Vedere quali processi hanno connessioni attive. Trovare connessioni verso VPN/cheat server.",
        install: "Parte di Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/tcpview",
      },
      {
        name: "CurrPorts (NirSoft)",
        desc: "Alternativa a TCPView con piu opzioni di filtro.",
        use: "Stesso utilizzo di TCPView.",
        install: "Download da nirsoft.net",
        url: "https://www.nirsoft.net/utils/cports.html",
      },
    ],
  },
  {
    category: "Disk Forensics",
    items: [
      {
        name: "FTK Imager",
        desc: "Creazione di immagini forensi di dischi. Utile per preservare prove.",
        use: "Creare immagine del disco prima di modificare qualsiasi cosa.",
        install: "Download da accessdata.com",
        url: "https://www.exterro.com/ftk-imager",
      },
      {
        name: "Autopsy",
        desc: "Piattaforma forensica open source. Analisi completa del disco.",
        use: "Analisi forensica approfondita del disco rigido.",
        install: "Download da sleuthkit.org",
        url: "https://www.autopsy.com",
      },
      {
        name: "WinDirStat",
        desc: "Visualizzazione dello spazio disco utilizzato. Trova cartelle grandi nascoste.",
        use: "Trovare cartelle grandi nascoste che potrebbero contenere cheat o log.",
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
        desc: "Tutti i programmi che partono al boot, login, avvio servizi.",
        use: "Trovare programmi nascosti che partono all'avvio.",
        install: "Parte di Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/autoruns",
      },
      {
        name: "AccessChk (Sysinternals)",
        desc: "Visualizza i permessi di file, cartelle, chiavi di registro.",
        use: "Verificare permessi sospetti su file/cartelle.",
        install: "Parte di Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/accesschk",
      },
      {
        name: "AccessEnum (Sysinternals)",
        desc: "Visualizza permessi su file, cartelle e chiavi di registro in un'unica vista.",
        use: "Trova file/cartelle con permessi modificati.",
        install: "Parte di Sysinternals Suite",
        url: "https://docs.microsoft.com/en-us/sysinternals/downloads/accessenum",
      },
    ],
  },
  {
    category: "Scripts and Automation",
    items: [
      {
        name: "AstroSS",
        desc: "Script PowerShell per screen share. Estrae BAM con timezone correction, firme Authenticode, ricostruzione path.",
        use: "Esegui come admin per estrarre BAM entries con ultima esecuzione e firma.",
        install: "github.com/Jammy108/AstroSS",
        url: "https://github.com/Jammy108/AstroSS",
      },
      {
        name: "CharlieRP ScreenShareTool",
        desc: "Tool forense completo Python. 48 client cheat, BAM parser, scan totale PC, anti-false-positive.",
        use: "python -m screenshare_tool --days 7 per analisi completa.",
        install: "winget install LeoGalli.CharlieRPScreenShareTool",
        url: "https://github.com/Leo-Galli/ScreenShareTool",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tool Encyclopedia
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Every tool used in Minecraft screen shares. {tools.reduce((a, c) => a + c.items.length, 0)} tools documented.
        </p>
      </div>

      <div className="space-y-12">
        {tools.map((group, gi) => (
          <div key={gi}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
              {group.category}
            </h2>
            <div className="space-y-3">
              {group.items.map((tool, ti) => (
                <div key={ti} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-white font-semibold">{tool.name}</h3>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:text-cyan-300 shrink-0">
                      Link
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{tool.desc}</p>
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 mb-2">
                    <p className="text-gray-500 text-xs mb-1">Usage:</p>
                    <p className="text-gray-300 text-sm">{tool.use}</p>
                  </div>
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Installation:</p>
                    <p className="text-green-400 text-sm font-mono">{tool.install}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 pt-8 mt-12 text-center">
        <p className="text-gray-500 text-sm">
          CharlieRP ScreenShare Tools Reference — LeoGalli
        </p>
      </div>
    </div>
  );
}
