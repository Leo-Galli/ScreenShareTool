import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CharlieRP ScreenShareTool — Guida Completa",
  description: "Manuale operativo per gli screen share su Minecraft. Strumenti forensi, checklist, criteri di ban e guida completa.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/20">
                  S
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ScreenShareTool
                </span>
              </a>
              <div className="hidden md:flex items-center gap-8">
                <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Home</a>
                <a href="/guide" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Guida</a>
                <a href="/download" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Download</a>
                <a href="/guide#flags" className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all">
                  Flags di Ban
                </a>
              </div>
              <div className="md:hidden">
                <button id="mobile-menu-btn" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-800 bg-gray-950 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 text-sm">
            <p>CharlieRP ScreenShareTool v3.0 — Made by LeoGalli</p>
            <p className="mt-2">mc.charlieroleplay.it — RISERVATO PERSONALE AUTORIZZATO</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
