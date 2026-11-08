import type { Metadata } from "next"
import Link from "next/link"
import CopyCommand from "../components/CopyCommand"
import PageHeader from "../components/PageHeader"

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download ScreenShareTool v4.0.1 — sstool.exe, winget, Python, or Bash. Display name ScreenShareTool.",
  openGraph: {
    title: "Download — ScreenShareTool",
    description: "Cross-platform forensic analysis app for Minecraft screen shares.",
  },
}

const zipUrl =
  "https://github.com/Leo-Galli/ScreenShareTool/releases/download/v4.0.1/ScreenShareTool-v4.0.1-GUI-x64.zip"

export default function Download() {
  return (
    <div className="page-shell py-16 sm:py-20">
      <PageHeader
        eyebrow="Release · v4.0.1"
        title="Download"
        description="GUI for Windows, macOS, and Linux — or CLI if you prefer. After winget, the command is sstool. Display name: ScreenShareTool. Run as administrator on Windows for the full module set."
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={zipUrl}
            className="cta-primary px-5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Download ScreenShareTool ZIP"
          >
            Download ZIP
          </a>
          <Link
            href="/changelog"
            className="cta-ghost px-5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Changelog
          </Link>
        </div>
      </PageHeader>

      <section className="mb-16 grid gap-px bg-[var(--rule)] md:grid-cols-2" aria-label="Primary installs">
        <div className="bg-[var(--bg)] p-5 sm:p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.14em]" style={{ color: "var(--faint)" }}>
            Recommended · Windows
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white">
            sstool.exe
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Standalone GUI. No Python. Inside the release ZIP. Double-click or invoke{" "}
            <code className="text-[var(--accent)]">sstool</code> after winget.
          </p>
          <a
            href={zipUrl}
            className="cta-primary mt-8 inline-flex px-5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Download sstool.exe ZIP from GitHub"
          >
            Get the ZIP
          </a>
        </div>
        <div id="winget" className="scroll-mt-28 bg-[var(--bg)] p-5 sm:p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.14em]" style={{ color: "var(--faint)" }}>
            Package manager
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white">
            Winget
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Package id stays <code className="text-white">LeoGalli.CharlieRPScreenShareTool</code> for
            continuity. Display name ScreenShareTool. Command alias{" "}
            <code className="text-[var(--accent)]">sstool</code>.
          </p>
          <div className="mt-6">
            <CopyCommand
              label="PowerShell"
              command="winget install LeoGalli.CharlieRPScreenShareTool"
            />
          </div>
          <div className="mt-3">
            <CopyCommand label="Then run" command="sstool" />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <p className="section-label">Platforms</p>
        <h2 className="font-display mb-8 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Coverage by OS
        </h2>
        <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {[
            {
              t: "Windows",
              d: "Full modules: BAM, Prefetch, Registry, Event Log, USN journal. Prefer Admin.",
            },
            {
              t: "macOS",
              d: "GUI/CLI via Python. Minecraft, system, and network modules.",
            },
            {
              t: "Linux",
              d: "GUI/CLI or Bash helper. Same cross-platform core as macOS.",
            },
          ].map((os) => (
            <div key={os.t} className="rail py-6">
              <p className="rail-label">{os.t}</p>
              <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {os.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="python" className="mb-16 scroll-mt-28">
        <p className="section-label">From source</p>
        <h2 className="font-display mb-4 text-2xl font-semibold tracking-tight text-white">
          Python — Windows · macOS · Linux
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Python 3.8+. Prefer pywebview for the glass UI. Command after pip install entry points:{" "}
          <code className="text-[var(--accent)]">sstool</code>.
        </p>
        <CopyCommand
          label="Clone & launch GUI"
          command={`git clone https://github.com/Leo-Galli/ScreenShareTool.git
cd ScreenShareTool
pip install pywebview
python -m screenshare_tool --gui`}
        />
      </section>

      <section className="mb-16">
        <p className="section-label">Unix helper</p>
        <h2 className="font-display mb-4 text-2xl font-semibold tracking-tight text-white">
          Bash — macOS · Linux
        </h2>
        <CopyCommand
          label="curl"
          command={`curl -O https://raw.githubusercontent.com/Leo-Galli/ScreenShareTool/main/ss_tool_unix.sh
sudo bash ss_tool_unix.sh`}
        />
      </section>

      <section id="cli" className="mb-16 scroll-mt-28">
        <p className="section-label">Reference</p>
        <h2 className="font-display mb-6 text-2xl font-semibold tracking-tight text-white">
          CLI flags
        </h2>
        <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {[
            { flag: "sstool", desc: "Launch (auto GUI when no args)." },
            { flag: "--gui", desc: "Force the graphical interface." },
            { flag: "--days N", desc: "Analyze the last N days." },
            { flag: "--output PATH", desc: "Custom output directory for reports." },
            { flag: "--quick", desc: "Skip slow modules (journal / deep walks)." },
            { flag: "--version", desc: "Print version and exit." },
          ].map((opt) => (
            <div key={opt.flag} className="flex flex-wrap items-baseline gap-4 py-4">
              <code
                className="shrink-0 px-2 py-0.5 font-mono text-xs"
                style={{ backgroundColor: "var(--soft)", color: "var(--accent)" }}
              >
                {opt.flag}
              </code>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                {opt.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel p-8">
        <h2 className="font-display text-xl font-semibold tracking-tight text-white">
          After install
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm" style={{ color: "var(--muted)" }}>
          <li>Run elevated on Windows for BAM, Prefetch, and Event Log coverage.</li>
          <li>Pick 1 / 7 / 30 days to match the suspected window.</li>
          <li>
            Open the generated dashboard, then cross-check with the{" "}
            <Link href="/guide" className="text-[var(--accent)] underline-offset-2 hover:underline">
              operational guide
            </Link>
            .
          </li>
        </ol>
      </section>
    </div>
  )
}
