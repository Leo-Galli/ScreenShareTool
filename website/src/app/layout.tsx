import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "./components/SiteNav";

export const metadata: Metadata = {
  title: {
    default: "CharlieRP ScreenShareTool — Minecraft Forensic Anti-Cheat Analysis",
    template: "%s | CharlieRP ScreenShareTool",
  },
  description:
    "A cross-platform forensic analysis tool for Minecraft server staff. Detects cheat self-destruction, multi-accounting, and system tampering across 48 known cheat clients, backed by an 800+ entry forensic string reference and a complete screen share operational guide.",
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
  metadataBase: new URL("https://screenshare-guide.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://screenshare-guide.vercel.app",
    siteName: "CharlieRP ScreenShareTool",
    title: "CharlieRP ScreenShareTool — Minecraft Forensic Anti-Cheat Analysis",
    description:
      "A cross-platform forensic analysis tool for Minecraft server staff. Detects cheat self-destruction, multi-accounting, and system tampering.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CharlieRP ScreenShareTool",
    description:
      "Forensic analysis tool for Minecraft server staff. 48 known cheat clients tracked, 800+ forensic strings documented.",
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
    canonical: "https://screenshare-guide.vercel.app",
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
    operatingSystem: "Windows, macOS, Linux",
    applicationCategory: "SecurityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Forensic analysis tool for Minecraft server staff. Detects cheat self-destruction, multi-accounting, and system tampering.",
    author: { "@type": "Person", name: "LeoGalli" },
    url: "https://screenshare-guide.vercel.app",
    downloadUrl:
      "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v3.1.0/screensharetool.exe",
    softwareVersion: "3.1.0",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CharlieRP ScreenShareTool",
    url: "https://screenshare-guide.vercel.app",
    description:
      "Operational guide for Minecraft screen share inspections — forensic tools, checklists, and ban criteria.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://screenshare-guide.vercel.app/strings?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://screenshare-guide.vercel.app" />
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
        <SiteNav />
        <main>{children}</main>
        <footer className="border-t border-gray-800 bg-gray-950 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 text-sm">
            <p>CharlieRP ScreenShareTool v3.1.0 — Made by LeoGalli</p>
            <p className="mt-2">mc.charlieroleplay.it</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
