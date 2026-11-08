import type { Metadata } from "next"
import Link from "next/link"
import ProductStage from "./components/ProductStage"

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

const modules = [
  {
    title: "BAM & Prefetch",
    desc: "Last executions and launch history for binaries that matter mid-share.",
  },
  {
    title: "Minecraft accounts",
    desc: "Launchers, usercache, IAS logs, and account switches across clients.",
  },
  {
    title: "Cheat self-delete",
    desc: "Known clients and cleanup scripts that try to erase evidence in-session.",
  },
  {
    title: "Registry & journal",
    desc: "UserAssist, RunMRU, ShellBags, and NTFS USN when you go deep.",
  },
  {
    title: "Macros & peripherals",
    desc: "Gaming software and devices that can run autoclickers or scripted input.",
  },
  {
    title: "HTML dashboard",
    desc: "One offline report with KPIs, tables, and charts — ready to archive.",
  },
]

const kit = [
  {
    title: "Operational guide",
    desc: "Full procedure: roles, deploy, checklist, multi-accounting, ghosts, autoclickers, ban flags, sstool workflow, evidence pack.",
    href: "/guide",
    meta: "14 parts",
  },
  {
    title: "Forensic strings",
    desc: "2500+ searchable registry keys, USN commands, Event IDs, paths, cheat clients, and artifacts.",
    href: "/strings",
    meta: "2500+ entries",
  },
  {
    title: "String builder",
    desc: "Select categories or lines and export a custom .txt for System Informer or your checklist.",
    href: "/builder",
    meta: "Export .txt",
  },
]

const faq = [
  {
    q: "What is ScreenShareTool?",
    a: "A forensic kit for Minecraft screen shares: an operational guide, a 2500+ string dictionary with .txt builder, a tool encyclopedia, and a cross-platform analysis app (command: sstool) that writes a dashboard at the end of each scan.",
  },
  {
    q: "Who is it for?",
    a: "Server staff and inspectors who need a repeatable procedure and machine-readable evidence — not casual players looking for a ban button.",
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
    q: "How do I install it?",
    a: "winget install LeoGalli.CharlieRPScreenShareTool, then run sstool. Or download the ZIP from GitHub Releases. Display name: ScreenShareTool.",
  },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden" aria-label="Hero">
        <div className="page-shell pb-16 pt-16 sm:pb-20 sm:pt-20">
          <div className="grid items-end gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
            <div className="min-w-0">
              <p className="animate-hero-in section-label !mb-5">v4.0.1 · command sstool</p>
              <h1
                className="animate-hero-in-late font-display font-semibold tracking-tight text-white break-words"
                style={{ fontSize: "clamp(2.6rem, 11vw, 6.4rem)", letterSpacing: "-0.055em", lineHeight: 0.92 }}
              >
                ScreenShare
                <br />
                Tool
              </h1>
              <p
                className="animate-hero-in-later mt-7 max-w-md text-base leading-relaxed sm:text-lg"
                style={{ color: "var(--muted)" }}
              >
                Forensic analysis for Minecraft screen shares — evidence without the noise.
              </p>
              <div className="animate-hero-in-later mt-9 flex flex-wrap gap-3">
                <Link
                  href="/download"
                  className="cta-primary px-6 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  Download v4.0.1
                </Link>
                <Link
                  href="/guide"
                  className="cta-ghost px-6 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  Read the guide
                </Link>
              </div>
            </div>

            <ProductStage className="min-h-[22rem]" />
          </div>
        </div>
      </section>

      <div className="page-shell pb-16 sm:pb-28">
        <div className="mb-14 grid gap-8 border-y border-[var(--rule)] py-8 sm:mb-20 sm:grid-cols-3 sm:py-10">
          {[
            { k: "2500+", l: "Forensic strings indexed for live lookup" },
            { k: ".txt", l: "Custom string lists via the builder export" },
            { k: "sstool", l: "One command after winget — GUI or CLI" },
          ].map((s) => (
            <div key={s.l} className="rail">
              <div className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {s.k}
              </div>
              <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {s.l}
              </p>
            </div>
          ))}
        </div>

        <section className="mb-24">
          <div className="mb-10 max-w-2xl">
            <p className="section-label">Scanner</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What gets pulled in a share
            </h2>
            <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: "var(--muted)" }}>
              Parallel modules, one day window, one dashboard. Designed for inspectors who already know
              what a clean box looks like.
            </p>
          </div>
          <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
            {modules.map((c) => (
              <div key={c.title} className="rail py-6">
                <p className="rail-label">{c.title.split(" ")[0]}</p>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-white">
                    {c.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Kit</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Guide, strings, tools
              </h2>
            </div>
            <Link
              href="/download"
              className="text-sm font-medium text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Get the app →
            </Link>
          </div>
          <div className="grid gap-px bg-[var(--rule)] sm:grid-cols-3">
            {kit.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-[var(--bg)] p-7 transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={item.title}
              >
                <span className="text-[0.65rem] uppercase tracking-[0.14em]" style={{ color: "var(--faint)" }}>
                  {item.meta}
                </span>
                <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-white group-hover:text-[var(--accent)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-24 surface-panel p-8 sm:p-10">
          <p className="section-label">Workflow</p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            From connect to verdict
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Connect", d: "AnyDesk or equivalent. Prefer ping under 150ms." },
              { t: "Deploy", d: "Everything, System Informer, Luyten — see the tool list." },
              { t: "Analyze", d: "Run sstool with the right day window." },
              { t: "Verdict", d: "Read the dashboard, then sanction or clear." },
            ].map((item) => (
              <div key={item.t}>
                <h3 className="font-display text-lg font-semibold text-white">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.d}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/guide#p2"
              className="cta-ghost inline-flex px-5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Open the checklist
            </Link>
          </div>
        </section>

        <section className="mb-24 grid gap-12 lg:grid-cols-2">
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
        </section>

        <section className="surface-panel flex flex-col gap-8 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-12">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to run a share?
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Install via winget, run <code className="text-[var(--accent)]">sstool</code>, keep the guide open.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/download"
              className="cta-primary px-6 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Download
            </Link>
            <Link
              href="/builder"
              className="cta-ghost px-6 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Build a .txt
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
