import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Page not found — ScreenShareTool",
  robots: { index: false, follow: true },
}

const links = [
  { href: "/", label: "Home" },
  { href: "/guide", label: "Guide" },
  { href: "/strings", label: "Strings" },
  { href: "/builder", label: "Builder" },
  { href: "/download", label: "Download" },
] as const

export default function NotFound() {
  return (
    <div className="page-shell relative flex min-h-[78svh] flex-col justify-center py-16 sm:py-20">
      <p className="section-label animate-hero-in">Error</p>

      <p
        className="animate-hero-in-late font-display font-semibold tracking-tight text-white"
        aria-hidden="true"
        style={{
          fontSize: "clamp(6rem, 28vw, 14rem)",
          letterSpacing: "-0.08em",
          lineHeight: 0.85,
          background: "linear-gradient(180deg, #fff 0%, rgba(251,113,133,0.55) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        404
      </p>

      <h1 className="animate-hero-in-later sr-only">Page not found</h1>

      <p
        className="animate-hero-in-later mt-6 max-w-md text-base leading-relaxed sm:text-lg"
        style={{ color: "var(--muted)" }}
      >
        This route does not exist. Jump back in — guide, strings, builder, or download.
      </p>

      <nav
        className="animate-hero-in-later mt-10 flex flex-wrap gap-2 sm:gap-3"
        aria-label="Quick links"
      >
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            prefetch
            className={
              i === 0
                ? "cta-primary px-5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                : "cta-ghost px-5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
