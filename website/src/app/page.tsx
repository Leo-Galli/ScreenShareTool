"use client";

const features = [
  {
    title: "48 Cheat Client Monitorati",
    desc: "Doomsday, Wurst, LiquidBounce, Sigma, Meteor, Vape, Astolfo, Kami, Phobos, e 40+ altri con pattern di autodistruzione.",
    color: "cyan",
  },
  {
    title: "BAM Parser (Ultima Esecuzione)",
    desc: "Estrae l'ultima esecuzione di ogni exe dal registro BAM con correzione timezone, risoluzione SID-utente e verifica firma Authenticode.",
    color: "blue",
  },
  {
    title: "Scan Totale PC",
    desc: "Desktop, Downloads, AppData, Temp, cartelle nascoste. Rileva file, cartelle e config di cheat ovunque sul sistema.",
    color: "purple",
  },
  {
    title: "Anti False Positive",
    desc: "Distingue username distinti da varianti UUID. Account offline/cracked segnalati separatamente. Nessun ban ingiustificato.",
    color: "green",
  },
  {
    title: "Cross-Platform",
    desc: "Python per Windows con BASH per macOS/Linux. Funziona ovunque, senza dipendenze esterne.",
    color: "yellow",
  },
  {
    title: "USB e Periferiche",
    desc: "USBSTOR con timestamp ultima connessione. Rileva dispositivi scollegati di nascosto prima dello screenshare.",
    color: "orange",
  },
];

const stats = [
  { value: "48", label: "Cheat Client" },
  { value: "15+", label: "Launcher Minecraft" },
  { value: "200+", label: "Stringhe Forensi" },
  { value: "12", label: "Moduli di Analisi" },
];

const colorClasses: Record<string, string> = {
  cyan: "border-cyan-500/20 hover:border-cyan-500/40",
  blue: "border-blue-500/20 hover:border-blue-500/40",
  purple: "border-purple-500/20 hover:border-purple-500/40",
  green: "border-green-500/20 hover:border-green-500/40",
  yellow: "border-yellow-500/20 hover:border-yellow-500/40",
  orange: "border-orange-500/20 hover:border-orange-500/40",
};

const iconColor: Record<string, string> = {
  cyan: "text-cyan-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  green: "text-green-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
};

function SearchIcon({ cls }: { cls: string }) {
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ChartIcon({ cls }: { cls: string }) {
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ScanIcon({ cls }: { cls: string }) {
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7v6m3-3H7" />
    </svg>
  );
}

function ShieldIcon({ cls }: { cls: string }) {
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function PlatformIcon({ cls }: { cls: string }) {
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function UsbIcon({ cls }: { cls: string }) {
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

const icons = [SearchIcon, ChartIcon, ScanIcon, ShieldIcon, PlatformIcon, UsbIcon];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <div className="text-6xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              SCREENSHARE
            </span>
          </div>
          <div className="text-lg text-gray-400 font-medium tracking-widest uppercase mt-1">
            CharlieRP Anti-Cheat Forensic Tool
          </div>
        </div>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8">
          Strumento forense completo per l&apos;analisi di client Minecraft. Rileva cheat, autodistruzione, multiaccount, e manipolazioni di sistema con 48 client monitorati e 200+ stringhe forensi.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="/guide"
            className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/20 transition-colors"
          >
            Guida Completa
          </a>
          <a
            href="/strings"
            className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Stringhe Forensi
          </a>
          <a
            href="/download"
            className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {features.map((f, i) => {
          const Icon = icons[i];
          return (
            <div
              key={i}
              className={`bg-gray-900/50 border ${colorClasses[f.color]} rounded-2xl p-5 transition-colors`}
            >
              <div className="mb-3">
                <Icon cls={iconColor[f.color]} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((s, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
              {s.value}
            </div>
            <div className="text-gray-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Risorse Rapide</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <a href="/guide" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 py-2 transition-colors">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Manuale Operativo ScreenShare
          </a>
          <a href="/strings" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 py-2 transition-colors">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Dizionario Stringhe Forensi
          </a>
          <a href="/download" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 py-2 transition-colors">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Download Tool
          </a>
          <a href="https://github.com/Leo-Galli/ScreenShareTool" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 py-2 transition-colors" target="_blank" rel="noopener noreferrer">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            GitHub Repository
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-8 mt-12 text-center">
        <p className="text-gray-500 text-sm">
          CharlieRP ScreenShareTool v3.0 — LeoGalli
        </p>
      </div>
    </div>
  );
}
