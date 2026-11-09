import type { Metadata } from "next"
import Link from "next/link"
import ProductStage from "./components/ProductStage"

export const metadata: Metadata = {
  title: "ScreenShareTool — Minecraft Forensic Anti-Cheat",
  description:
    "Operational guide, 8000+ forensic strings, .txt builder, and sstool for Minecraft screen shares.",
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
    desc: "Fourteen parts: roles, deploy, checklist, alts, ghosts, flags, sstool, USN, evidence pack, builder.",
    href: "/guide",
    meta: "14 parts",
  },
  {
    title: "Forensic strings",
    desc: "8000+ registry keys, USN commands, Event IDs, paths, cheat clients, and live-share artifacts.",
    href: "/strings",
    meta: "8000+ entries",
  },
  {
    title: "String builder",
    desc: "Pick categories or lines and export a custom .txt for System Informer or your checklist.",
    href: "/builder",
    meta: "Export .txt",
  },
]

const faq = [
  {
    q: "What is ScreenShareTool?",
    a: "A forensic kit for Minecraft screen shares: guide, 8000+ string dictionary with .txt builder, tool encyclopedia, and sstool (GUI/CLI) that writes a dashboard after each scan.",
  },
  {
    q: "Who is it for?",
    a: "Server staff and inspectors who need a repeatable procedure and machine-readable evidence.",
  },
  {
    q: "Does it replace manual inspection?",
    a: "No. It accelerates collection and highlights leads. Final verdicts still come from a trained inspector.",
  },
  {
    q: "Which platforms are supported?",
    a: "Windows gets the full module set. macOS and Linux run GUI/CLI with the modules available on those systems.",
  },
  {
    q: "How do I install it?",
    a: "winget install LeoGalli.CharlieRPScreenShareTool, then run sstool. Or download the ZIP from GitHub Releases.",
  },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden" aria-label="Hero">
        <div className="page-shell pb-8 pt-12 sm:pb-10 sm:pt-16 lg:pt-20">
          <p className="animate-hero-in section-label !mb-5">v4.0.1 · sstool</p>
          <h1
            className="animate-hero-in-late font-display text-[var(--ink)] break-words"
            style={{ fontSize: "clamp(3.4rem, 13vw, 7.5rem)", letterSpacing: "-0.05em", lineHeight: 0.88 }}
          >
            ScreenShare
            <br />
            <span className="mark">Tool</span>
          </h1>
          <span className="mark-bar animate-hero-in-late mt-5" aria-hidden="true" />
          <p
            className="animate-hero-in-later mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--muted)" }}
          >
            Evidence for Minecraft screen shares. Scanner, dictionary, builder.
          </p>
          <div className="animate-hero-in-later mt-8 flex flex-wrap gap-3">
            <Link
              href="/download"
              className="cta-primary px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
            >
              Download
            </Link>
            <Link
              href="/builder"
              className="cta-ghost px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
            >
              Build .txt
            </Link>
          </div>
        </div>

        <div className="page-shell pb-14 sm:pb-20">
          <ProductStage className="min-h-[18rem] sm:min-h-[20rem]" />
        </div>
      </section>

      <div className="page-shell pb-16 sm:pb-24">
        <section className="mb-20">
          <p className="section-label">Scanner</p>
          <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
            What gets pulled
          </h2>
          <div className="mt-8 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
            {modules.map((c) => (
              <div key={c.title} className="rail py-5">
                <p className="rail-label">{c.title.split(" ")[0]}</p>
                <div>
                  <h3 className="font-display text-xl text-[var(--ink)]">{c.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Kit</p>
              <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
                Guide · Strings · Builder
              </h2>
            </div>
            <Link
              href="/download"
              className="text-sm font-semibold text-[var(--ink)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 hover:decoration-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
            >
              Get the app
            </Link>
          </div>
          <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
            {kit.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="list-row group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
                aria-label={item.title}
              >
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--faint)" }}>
                  {item.meta}
                </span>
                <h3 className="font-display mt-2 text-2xl text-[var(--ink)] sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <p className="section-label">Workflow</p>
          <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
            Connect → Deploy → Analyze → Verdict
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Connect", d: "AnyDesk or equivalent. Prefer ping under 150ms." },
              { t: "Deploy", d: "Everything, System Informer, Luyten — see tools." },
              { t: "Analyze", d: "Run sstool with the right day window." },
              { t: "Verdict", d: "Read the dashboard, then sanction or clear." },
            ].map((item) => (
              <div key={item.t}>
                <h3 className="font-display text-lg text-[var(--ink)]">
                  <span className="mark">{item.t}</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.d}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/guide#p2"
              className="cta-ghost inline-flex px-5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
            >
              Open checklist
            </Link>
          </div>
        </section>

        <section className="mb-20 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="section-label">FAQ</p>
            <h2 className="font-display text-3xl text-[var(--ink)]">Common questions</h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Short answers. Deep procedure lives in the manual.
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

        <section className="flex flex-col gap-6 border border-[var(--rule)] bg-[var(--surface)] p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
              Ready to run a share?
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Install via winget, run <code className="font-mono-ui text-[var(--ink)]">sstool</code>, keep the guide open.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/download"
              className="cta-primary px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
            >
              Download
            </Link>
            <Link
              href="/strings"
              className="cta-ghost px-6 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
            >
              Strings
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
