"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/guide", label: "Guide" },
  { href: "/strings", label: "Strings" },
  { href: "/tools", label: "Tools" },
  { href: "/download", label: "Download" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/20">
              S
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ScreenShareTool
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.href ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/guide#p7"
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
            >
              Ban Flags
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="md:hidden flex flex-col gap-1 pb-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "text-white bg-gray-900"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/guide#p7"
              onClick={() => setOpen(false)}
              className="mt-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white text-sm font-semibold text-center"
            >
              Ban Flags
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
