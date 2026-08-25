import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CharlieRP ScreenShareTool — Guida Completa Screen Share Minecraft",
  description:
    "Strumento forense completo per l'analisi di client Minecraft. Rileva cheat, autodistruzione, multiaccount e manipolazioni di sistema. 48 client monitorati, 200+ stringhe forensi.",
  openGraph: {
    title: "CharlieRP ScreenShareTool",
    description:
      "Strumento forense per l'analisi di client Minecraft. 48 client monitorati, 200+ stringhe forensi.",
    url: "https://screensharetool.vercel.app",
  },
};

const features = [
  {
    title: "48 Cheat Client Monitorati",
    desc: "Doomsday, Wurst, LiquidBounce, Sigma, Meteor, Vape, Astolfo, Kami, Phobos, e 40+ altri con pattern di autodistruzione.",
    color: "cyan",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  {
    title: "BAM Parser — Ultima Esecuzione",
    desc: "Estrae l'ultima esecuzione di ogni exe dal registro BAM con correzione timezone, risoluzione SID-utente e verifica firma Authenticode.",
    color: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Scan Totale PC",
    desc: "Desktop, Downloads, AppData, Temp, cartelle nascoste. Rileva file, cartelle e config di cheat ovunque sul sistema.",
    color: "purple",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Anti False Positive",
    desc: "Distingue username distinti da varianti UUID. Account offline/cracked segnalati separatamente. Nessun ban ingiustificato.",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Cross-Platform",
    desc: "Python per Windows con BASH per macOS/Linux. Funziona ovunque, senza dipendenze esterne.",
    color: "yellow",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "USB e Periferiche",
    desc: "USBSTOR con timestamp ultima connessione. Rileva dispositivi scollegati di nascosto prima dello screenshare.",
    color: "orange",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "48", label: "Cheat Client" },
  { value: "15+", label: "Launcher Minecraft" },
  { value: "200+", label: "Stringhe Forensi" },
  { value: "12", label: "Moduli di Analisi" },
];

const colorClasses: Record<string, string> = {
  cyan: "border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/5",
  blue: "border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/5",
  purple: "border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/5",
  green: "border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/5",
  yellow: "border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-yellow-500/5",
  orange: "border-orange-500/20 hover:border-orange-500/40 hover:shadow-orange-500/5",
};

const iconBg: Record<string, string> = {
  cyan: "bg-cyan-500/10 text-cyan-400",
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
  green: "bg-green-500/10 text-green-400",
  yellow: "bg-yellow-500/10 text-yellow-400",
  orange: "bg-orange-500/10 text-orange-400",
};

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            v3.0 — Cross-Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              SCREENSHARE
            </span>
            <br />
            <span className="text-white text-4xl md:text-5xl">TOOL</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-2">
            Strumento forense completo per l&apos;analisi di client Minecraft
          </p>
          <p className="text-gray-600 text-sm max-w-xl mx-auto mb-8">
            Rileva cheat, autodistruzione, multiaccount e manipolazioni di sistema
            con 48 client monitorati e 200+ stringhe forensi documentate.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="/guide"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Guida Completa
            </a>
            <a
              href="/strings"
              className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 hover:border-gray-600 transition-all"
            >
              Stringhe Forensi
            </a>
            <a
              href="/download"
              className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 hover:border-gray-600 transition-all"
            >
              Download
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {features.map((f, i) => (
          <div
            key={i}
            className={`bg-gray-900/50 border ${colorClasses[f.color]} rounded-2xl p-5 transition-all hover:shadow-lg`}
          >
            <div className={`w-9 h-9 ${iconBg[f.color]} rounded-xl flex items-center justify-center mb-3`}>
              {f.icon}
            </div>
            <h3 className="text-white font-semibold text-sm mb-2">{f.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {stats.map((s, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
              {s.value}
            </div>
            <div className="text-gray-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Come Funziona</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Avvia lo Strumento",
              desc: "Scarica l'eseguibile o esegui con Python. Richiede privilegi di Amministratore per accedere al registro e alla RAM.",
            },
            {
              step: "02",
              title: "Analisi Automatica",
              desc: "Il tool esegue 12 moduli di analisi: Journal, Registro, Prefetch, BAM, Macro, Minecraft, Network, Cheat, USB, e altri.",
            },
            {
              step: "03",
              title: "Report Completo",
              desc: "Genera un report organizzato con tutte le evidenze: account, cheat rilevati, ultime esecuzioni, firme Authenticode.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="text-4xl font-black text-gray-800 mb-3">{item.step}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-lg font-bold mb-5">Risorse</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <a
            href="/guide"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 py-3 px-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 transition-all"
          >
            <span className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            Manuale Operativo — 10 parti complete
          </a>
          <a
            href="/strings"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 py-3 px-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 transition-all"
          >
            <span className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            Dizionario Stringhe — 200+ stringhe in 24 categorie
          </a>
          <a
            href="/download"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 py-3 px-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 transition-all"
          >
            <span className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </span>
            Download — .exe, .zip, winget
          </a>
          <a
            href="https://github.com/Leo-Galli/ScreenShareTool"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 py-3 px-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 transition-all"
          >
            <span className="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </span>
            GitHub Repository — Codice sorgente
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-8 mt-16 text-center">
        <p className="text-gray-600 text-sm">
          CharlieRP ScreenShareTool v3.0 — LeoGalli
        </p>
      </div>
    </div>
  );
}
