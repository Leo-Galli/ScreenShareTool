import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-center px-6 py-20 sm:px-8">
      <p className="section-label">404</p>
      <h1
        className="font-display font-semibold tracking-tight text-white"
        style={{ fontSize: "clamp(2.4rem, 6vw, 3.75rem)", letterSpacing: "-0.04em" }}
      >
        Page not found
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: "var(--muted)" }}>
        That route does not exist. Head home or open the guide.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="cta-primary rounded-full px-7 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Home
        </Link>
        <Link
          href="/guide"
          className="cta-ghost rounded-full px-7 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Guide
        </Link>
      </div>
    </div>
  )
}
