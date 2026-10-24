"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/guide", label: "Guide" },
  { href: "/strings", label: "Strings" },
  { href: "/tools", label: "Tools" },
  { href: "/changelog", label: "Changelog" },
  { href: "/download", label: "Download" },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleToggle = () => setOpen((v) => !v)
  const handleClose = () => setOpen(false)

  return (
    <nav className="sticky top-0 z-50" aria-label="Main navigation">
      <div className="border-b border-white/5 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-6 sm:px-8">
          <Link
            href="/"
            onClick={handleClose}
            aria-label="ScreenShareTool home"
            className="font-display text-[1.05rem] font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            ScreenShareTool
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className="rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ color: isActive ? "#fff" : "var(--muted)" }}
                >
                  {l.label}
                </Link>
              )
            })}
            <Link
              href="/guide#p7"
              className="ml-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Ban Flags
            </Link>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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

      {open && (
        <div
          id="mobile-menu"
          className="mx-6 mb-4 mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/95 p-3 backdrop-blur-xl md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={handleClose}
              className="rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ color: pathname === l.href ? "#fff" : "var(--muted)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/guide#p7"
            onClick={handleClose}
            className="mt-1 rounded-full bg-white px-3 py-2.5 text-center text-sm font-semibold text-black"
          >
            Ban Flags
          </Link>
        </div>
      )}
    </nav>
  )
}
