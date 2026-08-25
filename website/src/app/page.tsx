"use client";

export default function Home() {
  const features = [
    { icon: "🔍", title: "48 Cheat Client", desc: "Rileva Doomsday, Sigma, Meteor, Vape, Wurst, Autoclicker e 42 altri client con precisione forense.", badge: "Aggiornato", badgeColor: "cyan" },
    { icon: "📊", title: "BAM Parser", desc: "Ultime esecuzioni con firma Authenticode, correzione timezone e risoluzione SID → utente.", badge: "Nuovo", badgeColor: "green" },
    { icon: "💻", title: "Scan Totale PC", desc: "Cerca file e cartelle cheat in Desktop, Downloads, AppData, Temp e ovunque nel sistema.", badge: null, badgeColor: "" },
    { icon: "🔑", title: "Anti-False-Positive", desc: "Distingue username distinti da varianti UUID. Account offline/cracked segnalati separatamente.", badge: null, badgeColor: "" },
    { icon: "🖥️", title: "Cross-Platform", desc: "Windows (Python/EXE), macOS e Linux (Bash). Nessuna dipendenza esterna.", badge: null, badgeColor: "" },
    { icon: "🔌", title: "USB Forensics", desc: "Storico USBSTOR con timestamp ultima connessione. Rileva dispositivi scollegati prima del SS.", badge: "Nuovo", badgeColor: "green" },
  ];

  const quickLinks = [
    { href: "/guide", title: "Guida Completa", desc: "Procedura step-by-step per condurre uno ScreenShare professionale", icon: "📋" },
    { href: "/guide#flags", title: "Flags di Ban", desc: "Criteri rapidi per identificare violazioni e procedere al ban", icon: "🚨" },
    { href: "/guide#checklist", title: "Checklist Pre-Analisi", desc: "Controllo immediato dello stato della macchina dopo AnyDesk", icon: "✅" },
    { href: "/download", title: "Download Tool", desc: "Scarica l'ultima versione dello ScreenShareTool per Windows", icon: "⬇️" },
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
            v3.0 — 48 Cheat Client • BAM Parser • Cross-Platform
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
              📖 Leggi la Guida
            </a>
            <a href="/download" className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 font-semibold hover:bg-gray-700 transition-all">
              ⬇️ Scarica il Tool
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="section-title">Funzionalità</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card hover:border-cyan-500/30 transition-all group">
              <div className="text-3xl mb-3">{f.icon}</div>
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
              <div className="text-2xl mb-2">{l.icon}</div>
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
