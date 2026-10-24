import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "ScreenShareTool version history — release notes for v4.0.0, v3.1.0, v3.0.0, v2.0.0, and v1.0.0.",
  openGraph: {
    title: "Changelog — ScreenShareTool",
    description: "Every release, from the first PowerShell build to the GUI era.",
  },
}

type ChangeBlock = {
  version: string
  date: string
  title: string
  tag: "Latest" | "Major" | "Minor" | "Patch" | "Initial"
  summary: string
  sections: { heading: string; items: string[] }[]
  links?: { label: string; href: string }[]
}

const releases: ChangeBlock[] = [
  {
    version: "4.0.0",
    date: "24 Oct 2026",
    title: "GUI era · ScreenShareTool rebrand",
    tag: "Latest",
    summary:
      "First GUI release, product rename from CharlieRP ScreenShareTool to ScreenShareTool, parallel scan engine, restyled website and HTML dashboard.",
    sections: [
      {
        heading: "App & engine",
        items: [
          "Modern glass GUI via pywebview (customtkinter fallback) — one primary action, day window chips, live progress",
          "Reusable parallel scan engine (ThreadPoolExecutor) shared by GUI and CLI",
          "Quick scan mode skips slow journal / deep walks for faster shares",
          "Output folder renamed to ScreenShareTool_SS",
          "Winget manifests bumped to 4.0.0",
        ],
      },
      {
        heading: "Dashboard",
        items: [
          "HTML dashboard restyled to match the site (black canvas, glow tiles, blur topbar)",
          "KPI tiles, per-module tables, inline SVG charts, dark/light theme retained",
        ],
      },
      {
        heading: "Website",
        items: [
          "Full redesign: brand-first hero, capability grid, FAQ, richer download page",
          "Guide, strings, and tools pages aligned to the same design system",
          "Dedicated changelog page (this page)",
          "404 page, improved footer navigation, Open Graph image refresh",
        ],
      },
      {
        heading: "Branding",
        items: [
          "Public product name: ScreenShareTool (CharlieRP package id kept for winget continuity)",
          "Site, GUI, and dashboard copy updated end-to-end",
        ],
      },
    ],
    links: [
      { label: "Download", href: "/download" },
      {
        label: "GitHub (upcoming tag)",
        href: "https://github.com/Leo-Galli/ScreenShareTool/releases",
      },
    ],
  },
  {
    version: "3.1.0",
    date: "14 Oct 2026",
    title: "Bug fixes · rebuilt dashboard · string overhaul",
    tag: "Minor",
    summary:
      "Hardening pass across Python and Bash tools, rebuilt offline HTML dashboard, website corrections, and cleaner CI.",
    sections: [
      {
        heading: "Fixes (Python)",
        items: [
          "BAM parser f-string syntax error that crashed the module on import",
          "Doubled-backslash regex bugs that never matched real Windows paths (BAM / ADS)",
          "Minecraft log copy silently failing on wrong path/timestamp",
          "Event Log: missing ev_3079 key and unpopulated volume snapshots",
          "macro_data threaded through instead of being discarded",
          "Crash-proof UTF-8 console reconfiguration on restrictive codepages",
        ],
      },
      {
        heading: "Fixes (Bash)",
        items: [
          "EXCLUDE_PRUNE quoting bug that silently disabled path exclusions",
          "Counters/flags lost across `| while read` subshells",
          "IAS log switches dropped for every launcher but the default one",
          "Leading-zero DAYS input crash; unexported DASH_PATH",
          "Fragile hand-rolled JSON replaced with a robust delimited format",
        ],
      },
      {
        heading: "Dashboard & content",
        items: [
          "HTML dashboard rebuilt: KPIs, per-module tables, inline SVG charts, dark/light, fully offline",
          "All console/report strings rewritten for clarity",
          "Website: sitemap/robots domain, dead nav, mobile menu, OG image, download copy",
          "Removed stale duplicate screenshare-guide/ folder",
        ],
      },
      {
        heading: "CI & packaging",
        items: [
          "Removed four redundant verify-strings workflows",
          "Version bump across README, setup.py, run.bat, winget 3.1.0 manifests",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: "https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v3.1.0",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "25 Aug 2026",
    title: "Python + Bash cross-platform rewrite",
    tag: "Major",
    summary:
      "Complete rewrite of the original PowerShell tool into modular Python (Windows/macOS/Linux) and a Bash companion for UNIX.",
    sections: [
      {
        heading: "What's new",
        items: [
          "Modular Python package — zero external dependencies (stdlib only)",
          "Bash script with universal UNIX support (macOS / Linux / FreeBSD)",
          "48 cheat clients monitored for self-destruction traces",
          "AstroSS-grade BAM parser: last executions, Authenticode, timezone, user resolution",
          "Whole-PC scan for cheat files, USBSTOR history, ADS streams",
          "Standalone screensharetool.exe + winget package",
          "Interactive HTML dashboard at end of scan",
        ],
      },
      {
        heading: "Follow-up fixes on the 3.0 line",
        items: [
          "Dashboard crash when DNS cache Type was an integer (html_escape / network.py)",
          "Winget: zip installer validation + missing x86 installer entry",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: "https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v3.0.0",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "28 Jun 2026",
    title: "Standalone binaries",
    tag: "Major",
    summary:
      "Distribution upgrade: portable Windows executable and shell entrypoint for easier staff deployment.",
    sections: [
      {
        heading: "Packaging",
        items: [
          "screensharetool.exe — run without installing a scripting runtime on the target PC",
          "screensharetool.sh — companion shell asset for UNIX-side workflows",
          "Winget packaging path established for later 3.x manifests",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: "https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v2.0.0",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "4 Jun 2026",
    title: "First official release",
    tag: "Initial",
    summary:
      "First stable PowerShell ScreenShare tool for the CharlieRP network — multi-threaded, 18-module coverage, HTML dashboard.",
    sections: [
      {
        heading: "Included",
        items: [
          "Multi-thread scan via RunspacePool for logs and game files",
          "In-memory StringBuilder report generation for fast I/O",
          "18 analysis modules: BAM, Amcache, Prefetch, 15+ Minecraft launchers, macros, cheat self-delete",
          "Interactive HTML dashboard for staff review",
          "Distributed as .zip / .ps1 — run PowerShell as Administrator",
        ],
      },
    ],
    links: [
      {
        label: "GitHub release",
        href: "https://github.com/Leo-Galli/ScreenShareTool/releases/tag/v1.0.0",
      },
    ],
  },
]

const tagStyle: Record<ChangeBlock["tag"], { color: string; border: string; bg: string }> = {
  Latest: { color: "#000", border: "#fff", bg: "#fff" },
  Major: { color: "var(--accent)", border: "rgba(126,182,255,0.45)", bg: "var(--soft)" },
  Minor: { color: "var(--muted)", border: "var(--rule)", bg: "transparent" },
  Patch: { color: "var(--muted)", border: "var(--rule)", bg: "transparent" },
  Initial: { color: "var(--muted)", border: "var(--rule)", bg: "transparent" },
}

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
      <div className="mb-14 max-w-3xl">
        <p className="section-label">Updates</p>
        <h1
          className="font-display font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(2.4rem, 6vw, 3.75rem)", letterSpacing: "-0.04em" }}
        >
          Changelog
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Every ScreenShareTool release — from the first PowerShell build to the GUI era.
          Current version: <span className="text-white">v4.0.0</span>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/download"
            className="cta-primary rounded-full px-6 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Download latest
          </Link>
          <a
            href="https://github.com/Leo-Galli/ScreenShareTool/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-ghost rounded-full px-6 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            GitHub releases
          </a>
        </div>
      </div>

      <nav className="guide-panel mb-14" aria-label="Version jump list">
        <p className="section-label !mb-3">Versions</p>
        <div className="flex flex-wrap gap-2">
          {releases.map((r) => (
            <a
              key={r.version}
              href={`#v${r.version.replace(/\./g, "-")}`}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ color: "var(--muted)", border: "1px solid var(--rule)" }}
            >
              v{r.version}
            </a>
          ))}
        </div>
      </nav>

      <div className="space-y-16">
        {releases.map((r) => {
          const style = tagStyle[r.tag]
          return (
            <article
              key={r.version}
              id={`v${r.version.replace(/\./g, "-")}`}
              className="scroll-mt-28"
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  v{r.version}
                </h2>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    color: style.color,
                    border: `1px solid ${style.border}`,
                    backgroundColor: style.bg,
                  }}
                >
                  {r.tag}
                </span>
                <time className="text-sm" style={{ color: "var(--muted)" }} dateTime={r.date}>
                  {r.date}
                </time>
              </div>

              <h3 className="font-display text-xl font-semibold tracking-tight text-white">
                {r.title}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {r.summary}
              </p>

              <div className="mt-8 space-y-8">
                {r.sections.map((sec) => (
                  <div key={sec.heading}>
                    <h4 className="mb-3 text-sm font-semibold" style={{ color: "var(--accent)" }}>
                      {sec.heading}
                    </h4>
                    <ul className="space-y-2.5">
                      {sec.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-relaxed"
                          style={{ color: "var(--muted)" }}
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {r.links && r.links.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {r.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      {...(l.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="cta-ghost rounded-full px-5 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-12 border-b border-white/8" />
            </article>
          )
        })}
      </div>

      <div className="glow-card !min-h-0 mt-8 p-8 sm:flex sm:items-end sm:justify-between sm:gap-8 sm:p-10">
        <div className="relative z-10 max-w-lg">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
            Stay on the latest build
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Grab v4.0.0 from the download page or watch GitHub releases for the next tag.
          </p>
        </div>
        <div className="relative z-10 mt-6 flex flex-wrap gap-3 sm:mt-0">
          <Link
            href="/download"
            className="cta-primary rounded-full px-6 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Download
          </Link>
        </div>
      </div>
    </div>
  )
}
