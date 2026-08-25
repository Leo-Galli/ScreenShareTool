"use client";

export default function Download() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Download
        </span>
      </h1>
      <p className="text-gray-400 text-lg mb-12">Scarica l&apos;ultima versione dello ScreenShareTool</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="card border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">screensharetool.exe</h3>
              <p className="text-gray-500 text-sm">Eseguibile standalone (8.4MB)</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">Non richiede Python installato. Doppio-click e parte. Richiede privilegi di amministratore.</p>
          <a
            href="https://github.com/Leo-Galli/ScreenShareTool/releases/download/v3.0.0/screensharetool.exe"
            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Scarica .exe
          </a>
        </div>

        <div className="card hover:border-gray-700 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">CharlieRPScreenShareTool-v3.0.0.zip</h3>
              <p className="text-gray-500 text-sm">Archivio sorgenti (56KB)</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">Per sviluppatori. Contiene tutti i file Python. Richiede Python 3.8+ per eseguire.</p>
          <a
            href="https://github.com/Leo-Galli/ScreenShareTool/releases/download/v3.0.0/CharlieRPScreenShareTool-v3.0.0.zip"
            className="block w-full text-center px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 font-semibold hover:bg-gray-700 transition-all"
          >
            Scarica .zip
          </a>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="font-bold text-lg mb-4">Installazione tramite winget</h3>
        <div className="cmd-box">
          winget install LeoGalli.CharlieRPScreenShareTool
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="font-bold text-lg mb-4">Uso da riga di comando</h3>
        <div className="space-y-3">
          <div>
            <p className="text-gray-400 text-sm mb-1">Analisi ultimi 7 giorni:</p>
            <div className="cmd-box text-xs">python -m screenshare_tool --days 7</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Cartella output personalizzata:</p>
            <div className="cmd-box text-xs">python -m screenshare_tool --days 30 --output C:\MyOutput</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Mostra versione:</p>
            <div className="cmd-box text-xs">python -m screenshare_tool --version</div>
          </div>
        </div>
      </div>

      <div className="card border-green-500/20">
        <h3 className="font-bold text-lg mb-4 text-green-400">Requisiti di Sistema</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Windows</h4>
            <p className="text-gray-400">Windows 10/11, Python 3.8+ (o .exe), Privilegi Amministratore</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h4 className="font-semibold mb-2">macOS</h4>
            <p className="text-gray-400">macOS 10.15+, accesso root, Bash</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h4 className="font-semibold mb-2">Linux</h4>
            <p className="text-gray-400">Qualsiasi distribuzione, accesso root, Bash</p>
          </div>
        </div>
      </div>
    </div>
  );
}
