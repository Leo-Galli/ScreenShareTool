import type { Metadata } from "next"
import Link from "next/link"
import { Manrope, Syne } from "next/font/google"
import "./globals.css"
import SiteNav from "./components/SiteNav"

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
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
    "sstool",
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

const footerCols = [
  {
    title: "Product",
    links: [
      { href: "/download", label: "Download" },
      { href: "/changelog", label: "Changelog" },
      { href: "https://github.com/Leo-Galli/ScreenShareTool/releases", label: "Releases", external: true },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/guide", label: "Operational guide" },
      { href: "/strings", label: "Forensic strings" },
      { href: "/tools", label: "Tool encyclopedia" },
      { href: "/guide#p7", label: "Ban flags" },
    ],
  },
  {
    title: "Install",
    links: [
      { href: "/download#winget", label: "Winget · sstool" },
      { href: "/download#python", label: "Python source" },
      { href: "/download#cli", label: "CLI flags" },
    ],
  },
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
      "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v4.0.1/ScreenShareTool-v4.0.1-GUI-x64.zip",
    softwareVersion: "4.0.1",
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
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
        <footer className="relative z-10 mt-4 border-t border-[var(--rule)]">
          <div className="page-shell py-16">
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight text-white">
                  ScreenShareTool
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  Forensic kit for Minecraft screen shares — guide, string dictionary, tool encyclopedia,
                  and the <code className="text-[var(--accent)]">sstool</code> analysis app.
                </p>
                <p className="mt-6 text-xs" style={{ color: "var(--faint)" }}>
                  v4.0.1 · MIT · LeoGalli
                </p>
              </div>
              {footerCols.map((col) => (
                <div key={col.title}>
                  <p className="section-label">{col.title}</p>
                  <ul className="space-y-2.5 text-sm">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        {"external" in l && l.external ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            style={{ color: "var(--muted)" }}
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            className="transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            style={{ color: "var(--muted)" }}
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div
              className="mt-14 flex flex-col gap-3 border-t border-[var(--rule)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
              style={{ color: "var(--faint)" }}
            >
              <p>
                For authorized staff use during consented screen shares. Not affiliated with Mojang or Microsoft.
              </p>
              <a
                href="https://github.com/Leo-Galli/ScreenShareTool"
                className="hover:text-[var(--accent)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
