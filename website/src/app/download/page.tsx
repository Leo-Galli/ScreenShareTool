import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download ScreenShareTool v4.0.0 for Windows, macOS, or Linux — GUI exe, winget, Python, or Bash.",
  openGraph: {
    title: "Download — ScreenShareTool",
    description: "Cross-platform forensic analysis app for Minecraft screen shares.",
  },
}

export default function Download() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
      <div className="mb-14 max-w-2xl">
        <p className="section-label">Release · v4.0.0</p>
        <h1
          className="font-display font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(2.4rem, 6vw, 3.75rem)", letterSpacing: "-0.04em" }}
        >
          Download
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          GUI for Windows, macOS, and Linux — or CLI if you prefer. Run as administrator on Windows for the full module set.
          See the{" "}
          <Link href="/changelog" className="text-white underline-offset-2 hover:underline">
            changelog
          </Link>{" "}
          for what changed in this release.
        </p>
      </div>

      <div className="mb-5 grid gap-5 md:grid-cols-2">
        <div className="glow-card !min-h-0 flex flex-col justify-end p-8">
          <div className="relative z-10">
            <span className="mb-3 block text-xs font-medium" style={{ color: "var(--muted)" }}>
              Recommended · Windows · Admin
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              screensharetool.exe
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Standalone build. No Python. Double-click, pick a day window, run the analysis.
            </p>
            <a
              href="https://github.com/Leo-Galli/ScreenShareTool/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download screensharetool.exe from GitHub Releases"
              className="cta-primary mt-8 inline-flex rounded-full px-6 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Download .exe
            </a>
          </div>
        </div>

        <div className="glow-card !min-h-0 flex flex-col justify-end p-8">
          <div className="relative z-10">
            <span className="mb-3 block text-xs font-medium" style={{ color: "var(--muted)" }}>
              Portable · Windows
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Portable ZIP
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Zip with the GUI executable for USB transfer or offline shares.
            </p>
            <a
              href="https://github.com/Leo-Galli/ScreenShareTool/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download portable ZIP from GitHub Releases"
              className="cta-ghost mt-8 inline-flex rounded-full px-6 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Download .zip
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14 mb-6 grid gap-5 sm:grid-cols-3">
        {[
          { t: "Windows", d: "Full modules: BAM, Prefetch, Registry, Event Log, USN journal." },
          { t: "macOS", d: "GUI/CLI via Python. Minecraft, system, and network modules." },
          { t: "Linux", d: "GUI/CLI or Bash helper. Same cross-platform core as macOS." },
        ].map((os) => (
          <div key={os.t} className="glow-card !min-h-0 p-6">
            <div className="relative z-10">
              <h3 className="font-display text-lg font-semibold text-white">{os.t}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {os.d}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        {[
          {
            title: "Winget",
            body: (
              <>
                <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
                  Install from the terminal (package id unchanged until the next winget PR):
                </p>
                <div className="cmd-box">winget install LeoGalli.CharlieRPScreenShareTool</div>
              </>
            ),
          },
          {
            title: "Python — Windows · macOS · Linux",
            body: (
              <>
                <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
                  GUI or CLI from source. Python 3.8+. Prefer pywebview for the glass UI.
                </p>
                <pre className="cmd-box">{`git clone https://github.com/Leo-Galli/ScreenShareTool.git
cd ScreenShareTool
pip install pywebview
python -m screenshare_tool --gui`}</pre>
              </>
            ),
          },
          {
            title: "Bash — macOS · Linux",
            body: (
              <pre className="cmd-box">{`curl -O https://raw.githubusercontent.com/Leo-Galli/ScreenShareTool/main/ss_tool_unix.sh
sudo bash ss_tool_unix.sh`}</pre>
            ),
          },
        ].map((block) => (
          <div key={block.title} className="list-row">
            <h3 className="font-display text-xl font-semibold tracking-tight text-white">
              {block.title}
            </h3>
            <div className="mt-4">{block.body}</div>
          </div>
        ))}

        <div className="list-row">
          <h3 className="font-display text-xl font-semibold tracking-tight text-white">
            CLI flags
          </h3>
          <div className="mt-5 space-y-3 text-sm">
            {[
              { flag: "--gui", desc: "Open the graphical interface." },
              { flag: "--days N", desc: "Analyze the last N days (default depends on mode)." },
              { flag: "--output PATH", desc: "Custom output directory for reports." },
              { flag: "--quick", desc: "Skip slow modules (journal / deep walks)." },
            ].map((opt) => (
              <div key={opt.flag} className="flex items-start gap-4">
                <code
                  className="shrink-0 rounded-md px-2 py-0.5 font-mono text-xs"
                  style={{ backgroundColor: "var(--soft)", color: "var(--accent)" }}
                >
                  {opt.flag}
                </code>
                <span style={{ color: "var(--muted)" }}>{opt.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="list-row">
          <h3 className="font-display text-xl font-semibold tracking-tight text-white">
            After install
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm" style={{ color: "var(--muted)" }}>
            <li>Run elevated on Windows for BAM, Prefetch, and Event Log coverage.</li>
            <li>Pick 1 / 7 / 30 days to match the suspected window.</li>
            <li>
              Open the generated dashboard, then cross-check with the{" "}
              <Link href="/guide" className="text-white underline-offset-2 hover:underline">
                operational guide
              </Link>
              .
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
