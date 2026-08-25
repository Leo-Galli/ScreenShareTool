import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CharlieRP ScreenShareTool — Guida Completa Screen Share Minecraft",
  description:
    "La guida piu completa mai scritta sugli screen share Minecraft. Ogni technica, ogni tool, ogni stringa forense, ogni cheat conosciuto. DaZero a livello professionale.",
  openGraph: {
    title: "CharlieRP ScreenShareTool — Guida Completa Screen Share Minecraft",
    description:
      "La guida piu completa mai scritta sugli screen share Minecraft.",
    url: "https://screenshare-guide.vercel.app",
  },
};

const sections = [
  {
    title: "Manuale Operativo",
    desc: "Procedura completa passo-passo per condurre uno screen share professionale. Dalla checklist iniziale alla chiusura.",
    href: "/guide",
    color: "cyan",
    stats: "10 parti, 50+ controlli",
  },
  {
    title: "Dizionario Stringhe",
    desc: "Ogni singola stringa forense conosciuta dall'umanita. 300+ stringhe in 30+ categorie. Ricerca istantanea.",
    href: "/strings",
    color: "red",
    stats: "300+ stringhe, 30+ categorie",
  },
  {
    title: "Enciclopedia Tool",
    desc: "Ogni tool usato negli screen share: System Informer, Everything, Luyten, NirSoft, Process Hacker, e decine di altri.",
    href: "/tools",
    color: "purple",
    stats: "20+ tool documentati",
  },
  {
    title: "Download Tool",
    desc: "Scarica lo strumento forense CharlieRP. Exe standalone, sorgenti Python, winget.",
    href: "/download",
    color: "green",
    stats: "v3.0 — Cross-platform",
  },
];

const colorMap: Record<string, string> = {
  cyan: "border-cyan-500/20 hover:border-cyan-500/40",
  red: "border-red-500/20 hover:border-red-500/40",
  purple: "border-purple-500/20 hover:border-purple-500/40",
  green: "border-green-500/20 hover:border-green-500/40",
};

const dotColor: Record<string, string> = {
  cyan: "bg-cyan-400",
  red: "bg-red-400",
  purple: "bg-purple-400",
  green: "bg-green-400",
};

const knowledge = [
  "Ghost Client (LiquidBounce, Wurst, Sigma, FDP, Vape, Meteor, Rise, Future, Impact, Aristois, Inertia, Do0mClient, MoonClient, Tenacity, Astolfo, Kami, Phobos, SalHack, Seppuku, Flux, Snow, Rusher)",
  "Autoclicker (Koid, Dream, Drip, Whiteout, Itami, 7Clicker, Mango, Murmur, Phantom, JNativeHook)",
  "Self-Destruct / Anti-Forensics (Doomsday, ClassLoader, defineClass, unload, clean tracks, wipe logs)",
  "External cheat (VPN tunnel, Hamachi, ZeroTier, Radmin, ngrok, USB Rubber Ducky, BadUSB)",
  "Movement hacks (Speed, Fly, NoFall, Scaffold, Tower, Jesus, BoatFly, ElytraFly, Spider, Bhop)",
  "Combat hacks (KillAura, Reach, Velocity, AntiKnockback, Aimbot, Triggerbot, Criticals)",
  "Render hacks (XRay, ESP, PlayerESP, ChestESP, Nametags, Tracers, FullBright, Chams, Tomograph)",
  "Registry forensics (BAM, UserAssist, MuiCache, USBSTOR, Prefetch, USN Journal, ShellBags)",
  "RAM forensics (System Informer, DLL injection, memory strings, loaded modules)",
  "Minecraft internals (launcher_profiles.json, usercache.json, IAS mod, Lunar/Badlion/Fabric/Forge)",
  "Network forensics (TCP connections, DNS cache, hosts file, VPN detection, proxy detection)",
  "Anti-cheat bypass (Grim, Vulcan, Matrix, Intave, Rewind, Polar, AAC, NCP, Watchdog)",
  "Obfuscation (Proguard, R8, Mixin, SRG, Notch, Mojang, Yarn mappings)",
  "Java runtime exploitation (ClassLoader, Runtime.exec, ProcessBuilder, reflection)",
  "File system forensics (NTFS ADS, Alternate Data Streams, $Recycle.Bin, USN Journal)",
  "Hardware forensics (USB device history, disk serial numbers, hardware fingerprints)",
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            v3.0 — La guida piu completa mai scritta
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              MINECRAFT
            </span>
            <br />
            <span className="text-white text-4xl md:text-5xl">SCREENSHARE</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-2">
            Ogni tecnica, ogni tool, ogni stringa forense, ogni cheat conosciuto.
            <br />
            Da zero a livello professionale.
          </p>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-8">
            Guide, enciclopedie, dizionari di stringhe, tool forensi, metodi di rilevamento,
            bypass, anti-forensics, e tutto cio che riguarda gli screen share su Minecraft.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="/guide" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              Guida Completa
            </a>
            <a href="/strings" className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all">
              300+ Stringhe Forensi
            </a>
            <a href="/tools" className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all">
              Enciclopedia Tool
            </a>
            <a href="/download" className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all">
              Download
            </a>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid md:grid-cols-2 gap-4 mb-20">
        {sections.map((s, i) => (
          <a key={i} href={s.href} className={`bg-gray-900/50 border ${colorMap[s.color]} rounded-2xl p-6 transition-all hover:shadow-lg block`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 ${dotColor[s.color]} rounded-full`} />
              <h3 className="text-white font-bold">{s.title}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-3 leading-relaxed">{s.desc}</p>
            <span className="text-gray-600 text-xs">{s.stats}</span>
          </a>
        ))}
      </div>

      {/* What You'll Learn */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-3">Cosa Imparerai</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Tutto cio che esiste sugli screen share Minecraft</p>
        <div className="grid md:grid-cols-2 gap-2">
          {knowledge.map((k, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-400 py-2 px-3 rounded-lg bg-gray-900/30">
              <span className="text-cyan-500 mt-0.5 shrink-0">/</span>
              <span>{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-16">
        <h2 className="text-xl font-bold mb-6">Quick Start — Come Fare uno Screen Share</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Accesso AnyDesk", desc: "Connessione AnyDesk al PC del giocatore. Verifica ping stabile." },
            { step: "2", title: "Deploy Tool", desc: "Scarica ed esegui Everything, System Informer, Luyten, Suite NirSoft." },
            { step: "3", title: "Analisi", desc: "Esegui Checklist Pre-Analisi, poi tutti i controlli: Registry, RAM, Prefetch, BAM, Cheat, USB." },
            { step: "4", title: "Veredetto", desc: "Raccogli prove, documenta con screenshot, emetti sanzione o assolvi." },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-8 text-center">
        <p className="text-gray-600 text-sm">CharlieRP ScreenShareTool v3.0 — LeoGalli</p>
      </div>
    </div>
  );
}
