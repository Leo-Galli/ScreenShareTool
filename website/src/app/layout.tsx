import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CharlieRP ScreenShareTool — Guida Completa Screen Share Minecraft",
    template: "%s | CharlieRP ScreenShareTool",
  },
  description:
    "Strumento forense completo per l'analisi di client Minecraft. Rileva cheat, autodistruzione, multiaccount e manipolazioni di sistema. 48 client monitorati, 200+ stringhe forensi, guida operativa completa.",
  keywords: [
    "minecraft screenshare",
    "anti cheat",
    "forensic tool",
    "cheat detection",
    "minecraft cheat",
    "screen share guide",
    "Doomsday",
    "Wurst",
    "LiquidBounce",
    "BAM parser",
    "CharlieRP",
  ],
  authors: [{ name: "LeoGalli" }],
  creator: "LeoGalli",
  publisher: "LeoGalli",
  metadataBase: new URL("https://website-gamma-teal-94.vercel.app"),
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://website-gamma-teal-94.vercel.app",
    siteName: "CharlieRP ScreenShareTool",
    title: "CharlieRP ScreenShareTool — Guida Completa Screen Share Minecraft",
    description:
      "Strumento forense completo per l'analisi di client Minecraft. Rileva cheat, autodistruzione, multiaccount e manipolazioni di sistema.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CharlieRP ScreenShareTool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CharlieRP ScreenShareTool",
    description:
      "Strumento forense completo per l'analisi di client Minecraft. 48 client monitorati, 200+ stringhe forensi.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://website-gamma-teal-94.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CharlieRP ScreenShareTool",
    operatingSystem: "Windows",
    applicationCategory: "SecurityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Strumento forense per l'analisi di client Minecraft. Rileva cheat, autodistruzione, multiaccount.",
    author: { "@type": "Person", name: "LeoGalli" },
    url: "https://website-gamma-teal-94.vercel.app",
    downloadUrl:
      "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v3.0.0/screensharetool.exe",
    softwareVersion: "3.0.0",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CharlieRP ScreenShareTool",
    url: "https://website-gamma-teal-94.vercel.app",
    description:
      "Guida completa per lo screen share su Minecraft. Strumenti forensi, checklist, criteri di ban.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://website-gamma-teal-94.vercel.app/strings?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="it" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://website-gamma-teal-94.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
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
              <div className="hidden md:flex items-center gap-6">
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="/guide"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Guida
                </a>
                <a
                  href="/strings"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Stringhe
                </a>
                <a
                  href="/download"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Download
                </a>
                <a
                  href="/guide#flags"
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
                >
                  Flags di Ban
                </a>
              </div>
              <div className="md:hidden">
                <button
                  id="mobile-menu-btn"
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-800 bg-gray-950 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 text-sm">
            <p>
              CharlieRP ScreenShareTool v3.0 — Made by LeoGalli
            </p>
            <p className="mt-2">
              mc.charlieroleplay.it
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
