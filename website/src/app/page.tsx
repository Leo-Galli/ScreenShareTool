import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "ScreenShareTool — Minecraft Forensic Anti-Cheat",
  description:
    "Operational guide, 800+ forensic strings, tool encyclopedia, and a cross-platform analysis app for Minecraft screen shares.",
  openGraph: {
    title: "ScreenShareTool — Minecraft Forensic Anti-Cheat",
    description:
      "Operational guide, forensic strings, and tools for Minecraft screen share inspections.",
    url: "https://screenshare-guide.vercel.app",
  },
}

const featured = [
  {
    title: "Operational Manual",
    desc: "Ten-part procedure: roles, tool deploy, checklist, multi-accounting, ghosts, autoclickers, ban flags, false positives, closure.",
    href: "/guide",
    meta: "10 parts",
  },
  {
    title: "Forensic Strings",
    desc: "Searchable registry keys, USN journal commands, Event IDs, paths, and real artifacts — not guesses.",
    href: "/strings",
    meta: "800+ strings",
  },
]

const rows = [
  {
    title: "Tool Encyclopedia",
    desc: "System Informer, Everything, Luyten, NirSoft, Wireshark, and more — install commands and usage notes.",
    href: "/tools",
    meta: "29 tools · Reference",
  },
  {
    title: "Changelog",
    desc: "Full version history from v1.0.0 PowerShell to v4.0.0 GUI — every fix and feature.",
    href: "/changelog",
    meta: "v1 → v4 · Updates",
  },
  {
    title: "Download",
    desc: "Native GUI for Windows, macOS, and Linux. Winget, standalone exe, Python, or Bash.",
    href: "/download",
    meta: "v4.0.0 · Release",
  },
]

const capabilities = [
  {
    title: "BAM & Prefetch",
    desc: "Last executions and launch history for executables that matter during a share.",
  },
  {
    title: "Minecraft accounts",
    desc: "Launchers, usercache, IAS logs, and account switches across common clients.",
  },
  {
    title: "Cheat self-delete",
    desc: "Traces of known clients and cleanup scripts that try to erase evidence mid-share.",
  },
  {
    title: "Registry & journal",
    desc: "UserAssist, RunMRU, ShellBags, and NTFS USN journal signals when you go deep.",
  },
  {
    title: "Macros & peripherals",
    desc: "Gaming software and devices that can run autoclickers or scripted input.",
  },
  {
    title: "HTML dashboard",
    desc: "One self-contained report with KPIs, tables, and charts — ready to archive.",
  },
]

const faq = [
  {
    q: "What is ScreenShareTool?",
    a: "A forensic kit for Minecraft screen shares: an operational guide, an 800+ string dictionary, a tool encyclopedia, and a cross-platform analysis app that writes a dashboard at the end of each scan.",
  },
  {
    q: "Who is it for?",
    a: "Server staff and inspectors who need a repeatable procedure and machine-readable evidence — not casual players looking for a “ban button.”",
  },
  {
    q: "Does it replace manual inspection?",
    a: "No. It accelerates collection and highlights leads. Final verdicts still come from a trained inspector reading the report and the live session.",
  },
  {
    q: "Which platforms are supported?",
    a: "Windows gets the full module set (BAM, Prefetch, Event Log, Registry). macOS and Linux run the GUI/CLI with the modules available on those systems.",
  },
  {
    q: "Is it free?",
    a: "Yes. MIT licensed. Download the exe, install via winget, or run from source with Python.",
  },
]

export default function Home() {
  return (
    <>
      <section className="relative min-h-[92svh] overflow-hidden" aria-label="Hero">
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-6 pb-24 pt-24 sm:px-8 sm:pt-32">
          <p className="animate-hero-in section-label !mb-6">ScreenShareTool · v4.0.0</p>
          <div className="animate-hero-in-late max-w-4xl">
            <h1
              className="font-display font-semibold leading-[1.05] tracking-[-0.045em] text-white"
              style={{ fontSize: "clamp(2.8rem, 8.5vw, 5.75rem)" }}
            >
              Forensic analysis,
              <br />
              built for inspectors.
            </h1>
          </div>

          <div className="animate-hero-in-later mt-8 max-w-xl">
            <p className="text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
              Guide, strings, tools, and a modern analysis app for Minecraft screen shares —
              evidence without the noise.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/download"
                className="cta-primary rounded-full px-7 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Download
              </Link>
              <Link
                href="/guide"
                className="cta-ghost rounded-full px-7 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Read the guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-28 sm:px-8">
        <div className="mb-24 grid gap-6 border-y border-white/10 py-10 sm:grid-cols-4">
          {[
            { k: "800+", l: "Forensic strings" },
            { k: "48", l: "Cheat clients tracked" },
            { k: "29", l: "Documented tools" },
            { k: "3", l: "OS platforms" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {s.k}
              </div>
              <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <p className="section-label">Capabilities</p>
        <h2 className="font-display mb-10 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          What the scanner covers
        </h2>
        <div className="mb-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div key={c.title} className="glow-card !min-h-0 p-7">
              <div className="relative z-10">
                <h3 className="font-display text-xl font-semibold tracking-tight text-white">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="section-label">Resources</p>
        <h2 className="font-display mb-8 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Everything in one kit
        </h2>

        <div className="mb-4 grid gap-5 md:grid-cols-2">
          {featured.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="glow-card group flex flex-col justify-end p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={s.title}
            >
              <div className="relative z-10">
                <span className="mb-3 block text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {s.meta}
                </span>
                <h3 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-24 mt-6">
          {rows.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="list-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={s.title}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                  {s.title}
                </h3>
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {s.meta}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {s.desc}
              </p>
            </Link>
          ))}
        </div>

        <div className="glow-card !min-h-0 mb-24 p-8 sm:p-10">
          <div className="relative z-10">
            <p className="section-label">Workflow</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Screen share in four moves
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-4">
              {[
                { n: "01", t: "Connect", d: "AnyDesk or equivalent. Aim for ping under 150ms." },
                { n: "02", t: "Deploy", d: "Everything, System Informer, Luyten — see the tool list." },
                { n: "03", t: "Analyze", d: "Run ScreenShareTool with the right day window." },
                { n: "04", t: "Verdict", d: "Read the dashboard, then sanction or clear." },
              ].map((item) => (
                <div key={item.n}>
                  <div className="mb-3 text-xs font-medium" style={{ color: "var(--accent)" }}>
                    {item.n}
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">{item.t}</h3>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/guide#p2"
                className="cta-ghost inline-flex rounded-full px-6 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Open the checklist
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-24 grid gap-12 lg:grid-cols-2">
          <div>
            <p className="section-label">FAQ</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white">
              Common questions
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Short answers. Deep procedure lives in the operational manual.
            </p>
          </div>
          <div>
            {faq.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="glow-card !min-h-0 p-8 sm:flex sm:items-end sm:justify-between sm:gap-10 sm:p-12">
          <div className="relative z-10 max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to run a share?
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Install the GUI, open the guide, keep the string dictionary nearby.
            </p>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-3 sm:mt-0 sm:shrink-0">
            <Link
              href="/download"
              className="cta-primary rounded-full px-7 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Download v4.0.0
            </Link>
            <Link
              href="/strings"
              className="cta-ghost rounded-full px-7 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Browse strings
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
