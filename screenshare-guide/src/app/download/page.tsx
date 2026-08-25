import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Scarica CharlieRP ScreenShareTool v3.0. .exe standalone, sorgenti Python, winget. Strumento forense per analisi client Minecraft.",
  openGraph: {
    title: "Download — CharlieRP ScreenShareTool",
    description:
      "Scarica lo strumento forense per l'analisi di client Minecraft.",
  },
};

export default function Download() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Download
          </span>
        </h1>
        <p className="text-gray-400 text-lg">Scarica lo strumento forense per il tuo sistema operativo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* .exe */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 className="text-white font-semibold">screensharetool.exe</h3>
              <p className="text-gray-500 text-xs">Standalone — 8.4 MB — Windows</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Eseguibile standalone compilato con PyInstaller. Non richiede Python installato. Estrai e clicca per avviare. Richiede privilegi di Amministratore.
          </p>
          <a
            href="https://github.com/Leo-Galli/ScreenShareTool/releases/download/v3.0.0/screensharetool.exe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/20 transition-colors"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Scarica .exe
          </a>
        </div>

        {/* .zip */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <h3 className="text-white font-semibold">CharlieRPScreenShareTool-v3.0.0.zip</h3>
              <p className="text-gray-500 text-xs">Sorgenti Python — 56 KB — Cross-platform</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Pacchetto sorgente completo con tutti i moduli Python. Richiede Python 3.8+. Funziona su Windows, macOS e Linux.
          </p>
          <a
            href="https://github.com/Leo-Galli/ScreenShareTool/releases/download/v3.0.0/CharlieRPScreenShareTool-v3.0.0.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Scarica .zip
          </a>
        </div>
      </div>

      {/* Winget */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold mb-3">Winget (Windows Package Manager)</h3>
        <p className="text-gray-400 text-sm mb-3">
          Installa direttamente da terminale senza aprire il browser:
        </p>
        <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 font-mono text-sm text-green-400">
          winget install LeoGalli.CharlieRPScreenShareTool
        </div>
      </div>

      {/* CLI Options */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold mb-3">Opzioni CLI</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-3">
            <code className="text-cyan-400 font-mono text-xs bg-gray-800/50 px-2 py-0.5 rounded shrink-0">--days N</code>
            <span className="text-gray-400">Analizza gli ultimi N giorni (default: 7)</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-cyan-400 font-mono text-xs bg-gray-800/50 px-2 py-0.5 rounded shrink-0">--output PATH</code>
            <span className="text-gray-400">Directory di output personalizzata</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-cyan-400 font-mono text-xs bg-gray-800/50 px-2 py-0.5 rounded shrink-0">--no-nick</code>
            <span className="text-gray-400">Salta la ricerca nick su tutto il PC (piu veloce)</span>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-3">Requisiti</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 font-medium mb-1">Windows (.exe)</p>
            <ul className="text-gray-500 space-y-1">
              <li>Windows 10/11</li>
              <li>Privilegi di Amministratore</li>
              <li>Nessuna dipendenza esterna</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-1">Windows (Python)</p>
            <ul className="text-gray-500 space-y-1">
              <li>Python 3.8+</li>
              <li>Zero dipendenze esterne</li>
              <li>Privilegi di Amministratore</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 mt-12 text-center">
        <p className="text-gray-500 text-sm">
          CharlieRP ScreenShareTool v3.0 — LeoGalli
        </p>
      </div>
    </div>
  );
}
