"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/guide", label: "Guide" },
  { href: "/strings", label: "Strings" },
  { href: "/tools", label: "Tools" },
  { href: "/changelog", label: "Changelog" },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleToggle = () => setOpen((v) => !v)
  const handleClose = () => setOpen(false)

  return (
    <nav className="sticky top-0 z-50" aria-label="Main navigation">
      <div className="border-b border-[var(--rule)] bg-[rgba(12,14,12,0.82)] backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center justify-between">
          <Link
            href="/"
            onClick={handleClose}
            aria-label="ScreenShareTool home"
            className="font-display text-[1.05rem] font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            ScreenShareTool
          </Link>

          <div className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => {
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className="px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}
                >
                  {l.label}
                </Link>
              )
            })}
            <Link
              href="/download"
              className="cta-primary ml-3 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Download
            </Link>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center border border-[var(--rule-strong)] text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 9h16M4 15h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="page-shell mb-3 mt-2 flex flex-col gap-1 border border-[var(--rule-strong)] bg-[var(--bg-elevated)] p-2 md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={handleClose}
              className="px-3 py-2.5 text-sm font-medium"
              style={{ color: pathname === l.href ? "var(--accent)" : "var(--muted)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/download"
            onClick={handleClose}
            className="cta-primary mt-1 px-3 py-2.5 text-center text-sm"
          >
            Download
          </Link>
        </div>
      ) : null}
    </nav>
  )
}
