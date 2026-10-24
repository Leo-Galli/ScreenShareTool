import type { Metadata } from "next"
import Link from "next/link"
import { Bricolage_Grotesque, Outfit } from "next/font/google"
import "./globals.css"
import SiteNav from "./components/SiteNav"

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "ScreenShareTool — Minecraft Forensic Anti-Cheat",
    template: "%s | ScreenShareTool",
  },
  description:
    "Cross-platform forensic analysis for Minecraft screen shares. Detect cheat self-destruction, multi-accounting, and system tampering — plus an 800+ string reference and full operational guide.",
  keywords: [
    "minecraft screenshare",
    "anti cheat",
    "forensic tool",
    "cheat detection",
    "screen share guide",
    "ScreenShareTool",
  ],
  authors: [{ name: "LeoGalli" }],
  creator: "LeoGalli",
  publisher: "LeoGalli",
  metadataBase: new URL("https://screenshare-guide.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://screenshare-guide.vercel.app",
    siteName: "ScreenShareTool",
    title: "ScreenShareTool — Minecraft Forensic Anti-Cheat",
    description:
      "Forensic analysis for Minecraft screen shares. Cheat self-destruction, multi-accounting, and system tampering.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScreenShareTool",
    description:
      "Forensic analysis for Minecraft screen shares. 48 cheat clients tracked, 800+ forensic strings.",
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
}

const footerLinks = [
  { href: "/guide", label: "Guide" },
  { href: "/strings", label: "Strings" },
  { href: "/tools", label: "Tools" },
  { href: "/changelog", label: "Changelog" },
  { href: "/download", label: "Download" },
  { href: "/guide#p7", label: "Ban flags" },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ScreenShareTool",
    operatingSystem: "Windows, macOS, Linux",
    applicationCategory: "SecurityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Forensic analysis tool for Minecraft screen shares. Detects cheat self-destruction, multi-accounting, and system tampering.",
    author: { "@type": "Person", name: "LeoGalli" },
    url: "https://screenshare-guide.vercel.app",
    downloadUrl:
      "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v4.0.0/screensharetool.exe",
    softwareVersion: "4.0.0",
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ScreenShareTool",
    url: "https://screenshare-guide.vercel.app",
    description:
      "Operational guide for Minecraft screen share inspections — forensic tools, checklists, and ban criteria.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://screenshare-guide.vercel.app/strings?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en" className={`${bricolage.variable} ${outfit.variable}`}>
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
      <body className="relative">
        <SiteNav />
        <main className="relative z-10">{children}</main>
        <footer className="relative z-10 mt-8 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <p className="font-display text-lg font-semibold tracking-tight text-white">
                  ScreenShareTool
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  Forensic kit for Minecraft screen shares — guide, strings, tools, and analysis app.
                </p>
              </div>
              <div>
                <p className="section-label">Navigate</p>
                <ul className="space-y-2 text-sm">
                  {footerLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                        style={{ color: "var(--muted)" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="section-label">Project</p>
                <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                  <li>v4.0.0 · MIT License</li>
                  <li>LeoGalli</li>
                  <li>
                    <a
                      href="https://github.com/Leo-Galli/ScreenShareTool"
                      className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub repository
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Leo-Galli/ScreenShareTool/releases"
                      className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Releases
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-12 text-xs" style={{ color: "var(--muted)" }}>
              For authorized staff use during consented screen shares. Not affiliated with Mojang or Microsoft.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
