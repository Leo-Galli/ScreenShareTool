import Link from "next/link"

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70svh] flex-col justify-center py-20">
      <p className="section-label">404</p>
      <h1
        className="font-display font-semibold tracking-tight text-white"
        style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", letterSpacing: "-0.045em", lineHeight: 1.05 }}
      >
        Page not found
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: "var(--muted)" }}>
        That route does not exist. Head home, open the guide, or grab the latest build.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="cta-primary px-6 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Home
        </Link>
        <Link
          href="/guide"
          className="cta-ghost px-6 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Guide
        </Link>
        <Link
          href="/download"
          className="cta-ghost px-6 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Download
        </Link>
      </div>
    </div>
  )
}
