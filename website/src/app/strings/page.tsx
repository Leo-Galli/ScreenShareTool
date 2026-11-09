"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { forensicCategories, totalForensicStringCount } from "../../lib/forensic-strings"

export default function StringsPage() {
  const [search, setSearch] = useState("")
  const [osFilter, setOsFilter] = useState("all")
  const [openCats, setOpenCats] = useState<number[]>([])
  const [highlight, setHighlight] = useState(true)

  const handleToggleCat = (i: number) =>
    setOpenCats((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))

  const filtered = useMemo(() => {
    let result = forensicCategories
    if (osFilter !== "all") {
      result = result.filter((c) => c.os === osFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result
        .map((cat) => ({
          ...cat,
          strings: cat.strings.filter((s) => s.toLowerCase().includes(q)),
        }))
        .filter((cat) => cat.strings.length > 0)
    }
    return result
  }, [search, osFilter])

  const osList = useMemo(() => {
    const oses = [...new Set(forensicCategories.map((c) => c.os))]
    return ["all", ...oses]
  }, [])

  const resultCount = filtered.reduce((a, c) => a + c.strings.length, 0)

  const isCmd = (s: string) =>
    /^(fsutil|reg |netstat|dir |type |cat |ls |find |wevtutil|eventvwr|wmic|tasklist|arp |tracert|nslookup|log show|defaults |vssadmin|cipher|powershell|Get-|winget)/i.test(
      s
    )
  const isReg = (s: string) => s.startsWith("HKLM") || s.startsWith("HKCU")
  const isPath = (s: string) => s.startsWith("C:\\") || s.startsWith("%") || s.startsWith(".")

  return (
    <div className="page-shell py-16 sm:py-20">
      <div className="mb-10 max-w-3xl border-b border-[var(--rule)] pb-10">
        <p className="section-label">Dictionary</p>
        <h1
          className="font-display font-semibold tracking-tight text-[var(--ink)]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", letterSpacing: "-0.045em", lineHeight: 1.05 }}
        >
          Forensic Strings
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          {totalForensicStringCount.toLocaleString()} strings across {forensicCategories.length} categories —
          commands, registry keys, paths, cheat clients, Defender/ASR, remotes, and live-share artifacts.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/builder"
            className="cta-primary px-5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Build a .txt list
          </Link>
          <Link
            href="/guide#p6"
            className="cta-ghost px-5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            How to use in a share
          </Link>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search command, registry key, path, cheat name..."
            aria-label="Search forensic strings"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--rule)",
              color: "var(--ink)",
              caretColor: "var(--accent)",
              borderRadius: "var(--radius)",
            }}
          />
          <svg
            className="absolute left-3 top-3.5 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            style={{ color: "var(--muted)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {osList.map((os) => {
            const active = osFilter === os
            return (
              <button
                key={os}
                type="button"
                onClick={() => setOsFilter(os)}
                aria-pressed={active}
                className="px-3.5 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  color: active ? "var(--ink)" : "var(--muted)",
                  border: `1px solid ${active ? "var(--ink)" : "var(--rule)"}`,
                  backgroundColor: active ? "var(--accent-dim)" : "var(--surface)",
                }}
              >
                {os === "all" ? "All OS" : os}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setHighlight(!highlight)}
            aria-pressed={highlight}
            className="ml-1 px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              color: highlight ? "var(--accent)" : "var(--muted)",
              border: `1px solid ${highlight ? "var(--accent)" : "var(--rule)"}`,
              backgroundColor: highlight ? "var(--soft)" : "transparent",
            }}
          >
            Highlight {highlight ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={() =>
              setOpenCats(
                openCats.length === filtered.length
                  ? []
                  : filtered.map((cat) => forensicCategories.findIndex((c) => c.name === cat.name))
              )
            }
            className="px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: "var(--muted)", border: "1px solid var(--rule)" }}
          >
            {openCats.length ? "Collapse all" : "Expand all"}
          </button>
          <span className="ml-1 font-mono text-xs" style={{ color: "var(--faint)" }}>
            {resultCount.toLocaleString()} shown
          </span>
        </div>
      </div>

      <div className="space-y-px">
        {filtered.map((cat) => {
          const origIdx = forensicCategories.findIndex((c) => c.name === cat.name)
          const isOpen = openCats.includes(origIdx)
          return (
            <div
              key={cat.name}
              style={{
                backgroundColor: "var(--panel)",
                border: "1px solid var(--rule)",
                marginBottom: "-1px",
              }}
            >
              <button
                type="button"
                onClick={() => handleToggleCat(origIdx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 shrink-0 text-right font-mono text-xs" style={{ color: "var(--muted)" }}>
                    {cat.strings.length}
                  </span>
                  <h3 className="font-display text-sm font-semibold text-[var(--ink)]">{cat.name}</h3>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider" style={{ color: "var(--faint)" }}>
                    {cat.os}
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  style={{ color: "var(--muted)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen ? (
                <div className="space-y-0.5 px-4 pb-4" style={{ borderTop: "1px solid var(--rule)" }}>
                  {cat.strings.map((s) => {
                    const isMatch = highlight && search && s.toLowerCase().includes(search.toLowerCase())
                    return (
                      <div
                        key={s}
                        className="px-2 py-1 font-mono text-xs"
                        style={{
                          color: isMatch
                            ? "var(--accent)"
                            : isCmd(s)
                              ? "var(--chalk)"
                              : isReg(s)
                                ? "#e7c27d"
                                : isPath(s)
                                  ? "var(--muted)"
                                  : "var(--muted)",
                          backgroundColor: isMatch ? "var(--soft)" : undefined,
                        }}
                      >
                        {s}
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-lg text-[var(--ink)]">No results</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Try a different query or OS filter.
          </p>
        </div>
      ) : null}
    </div>
  )
}
