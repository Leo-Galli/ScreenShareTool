"use client";

export default function Home() {
  const features = [
    { icon: <SearchIcon />, title: "48 Cheat Client", desc: "Rileva Doomsday, Sigma, Meteor, Vape, Wurst, Autoclicker e 42 altri client con precisione forense completa.", badge: "Aggiornato", badgeColor: "cyan" },
    { icon: <ChartIcon />, title: "BAM Parser", desc: "Ultime esecuzioni con firma Authenticode, correzione timezone e risoluzione SID verso utente.", badge: "Nuovo", badgeColor: "green" },
    { icon: <ScanIcon />, title: "Scan Totale PC", desc: "Cerca file e cartelle cheat in Desktop, Downloads, AppData, Temp e ovunque nel sistema.", badge: null, badgeColor: "" },
    { icon: <ShieldIcon />, title: "Anti-False-Positive", desc: "Distingue username distinti da varianti UUID. Account offline/cracked segnalati separatamente.", badge: null, badgeColor: "" },
    { icon: <PlatformIcon />, title: "Cross-Platform", desc: "Windows (Python/EXE), macOS e Linux (Bash). Nessuna dipendenza esterna.", badge: null, badgeColor: "" },
    { icon: <UsbIcon />, title: "USB Forensics", desc: "Storico USBSTOR con timestamp ultima connessione. Rileva dispositivi scollegati prima del SS.", badge: "Nuovo", badgeColor: "green" },
  ];

  const quickLinks = [
    { href: "/guide", title: "Guida Completa", desc: "Procedura step-by-step per condurre uno ScreenShare professionale", icon: <GuideIcon /> },
    { href: "/guide#flags", title: "Flags di Ban", desc: "Criteri rapidi per identificare violazioni e procedere al ban", icon: <FlagIcon /> },
    { href: "/guide#checklist", title: "Checklist Pre-Analisi", desc: "Controllo immediato dello stato della macchina dopo AnyDesk", icon: <CheckIcon /> },
    { href: "/download", title: "Download Tool", desc: "Scarica l'ultima versione dello ScreenShareTool per Windows", icon: <DownloadIcon /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            v3.0 — 48 Cheat Client · BAM Parser · Cross-Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              ScreenShareTool
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Strumento forense avanzato per gli Screen Share su Minecraft.
            Rileva cheat client, multiaccounting, autodistruzione e manomissioni.
          </p>
          <p className="text-sm text-gray-600 mb-10">mc.charlieroleplay.it — Made by LeoGalli</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/guide" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-105">
              Leggi la Guida
            </a>
            <a href="/download" className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 font-semibold hover:bg-gray-700 transition-all">
              Scarica il Tool
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="section-title">Funzionalita</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-3 group-hover:bg-cyan-500/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                {f.title}
                {f.badge && (
                  <span className={`badge badge-${f.badgeColor}`}>{f.badge}</span>
                )}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="section-title">Link Rapidi</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="card hover:border-cyan-500/30 hover:bg-gray-800/50 transition-all group block"
            >
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 mb-2 group-hover:bg-cyan-500/20 transition-colors">
                {l.icon}
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-cyan-400 transition-colors">{l.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{l.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-cyan-400">48</div>
            <div className="text-sm text-gray-500 mt-1">Cheat Client</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400">15+</div>
            <div className="text-sm text-gray-500 mt-1">Launcher MC</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400">15</div>
            <div className="text-sm text-gray-500 mt-1">Moduli Analisi</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400">7</div>
            <div className="text-sm text-gray-500 mt-1">Flags di Ban</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SearchIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }
function ChartIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>; }
function ScanIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>; }
function ShieldIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>; }
function PlatformIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>; }
function UsbIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; }
function GuideIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>; }
function FlagIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>; }
function CheckIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>; }
function DownloadIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>; }
