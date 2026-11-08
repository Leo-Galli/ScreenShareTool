"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  forensicCategories,
  totalForensicStringCount,
  type ForensicCategory,
} from "../../lib/forensic-strings"

const buildTxt = (
  cats: ForensicCategory[],
  selected: Set<string>,
  opts: { headers: boolean; dedupe: boolean }
) => {
  const lines: string[] = []
  lines.push("# ScreenShareTool string list")
  lines.push(`# Generated ${new Date().toISOString()}`)
  lines.push(`# Source: screenshare-guide.vercel.app/builder`)
  lines.push("")

  const seen = new Set<string>()
  for (const cat of cats) {
    const picked = cat.strings.filter((s) => selected.has(`${cat.name}::${s}`))
    if (picked.length === 0) continue
    if (opts.headers) {
      lines.push(`## ${cat.name} (${cat.os})`)
    }
    for (const s of picked) {
      if (opts.dedupe) {
        const key = s.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
      }
      lines.push(s)
    }
    if (opts.headers) lines.push("")
  }
  return lines.join("\n").trimEnd() + "\n"
}

export default function BuilderPage() {
  const [search, setSearch] = useState("")
  const [osFilter, setOsFilter] = useState("all")
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [headers, setHeaders] = useState(true)
  const [dedupe, setDedupe] = useState(true)
  const [filename, setFilename] = useState("sstool-strings.txt")
  const [openCats, setOpenCats] = useState<string[]>([])

  const osList = useMemo(() => {
    const oses = [...new Set(forensicCategories.map((c) => c.os))]
    return ["all", ...oses]
  }, [])

  const filtered = useMemo(() => {
    let result = forensicCategories
    if (osFilter !== "all") result = result.filter((c) => c.os === osFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result
        .map((cat) => ({
          ...cat,
          strings: cat.strings.filter(
            (s) => s.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q)
          ),
        }))
        .filter((cat) => cat.strings.length > 0)
    }
    return result
  }, [search, osFilter])

  const selectedCount = selected.size

  const handleToggleString = (catName: string, value: string) => {
    const key = `${catName}::${value}`
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleToggleCategory = (cat: ForensicCategory, on: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const s of cat.strings) {
        const key = `${cat.name}::${s}`
        if (on) next.add(key)
        else next.delete(key)
      }
      return next
    })
  }

  const handleSelectVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const cat of filtered) {
        for (const s of cat.strings) next.add(`${cat.name}::${s}`)
      }
      return next
    })
  }

  const handleClear = () => setSelected(new Set())

  const handleDownload = () => {
    const text = buildTxt(forensicCategories, selected, { headers, dedupe })
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.trim() || "sstool-strings.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    const text = buildTxt(forensicCategories, selected, { headers, dedupe })
    await navigator.clipboard.writeText(text)
  }

  const preview = useMemo(
    () => buildTxt(forensicCategories, selected, { headers, dedupe }),
    [selected, headers, dedupe]
  )

  return (
    <div className="page-shell py-16 sm:py-20">
      <div className="mb-10 max-w-3xl border-b border-[var(--rule)] pb-10">
        <p className="section-label">Export</p>
        <h1
          className="font-display font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", letterSpacing: "-0.045em", lineHeight: 1.05 }}
        >
          String Builder
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Pick categories or individual strings from the {totalForensicStringCount.toLocaleString()}-entry
          dictionary, then download a custom <code className="text-white">.txt</code> for System Informer,
          Everything, or your checklist.
        </p>
        <p className="mt-3 text-sm" style={{ color: "var(--faint)" }}>
          Tip: browse the full{" "}
          <Link href="/strings" className="text-[var(--accent-2)] hover:underline">
            dictionary
          </Link>{" "}
          first, then come back here to export.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter categories / strings..."
              aria-label="Filter strings for builder"
              className="min-w-[14rem] flex-1 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--rule)",
                color: "var(--ink)",
                borderRadius: "var(--radius)",
              }}
            />
            {osList.map((os) => (
              <button
                key={os}
                type="button"
                className="builder-chip"
                data-on={osFilter === os}
                onClick={() => setOsFilter(os)}
              >
                {os === "all" ? "All OS" : os}
              </button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button type="button" className="builder-chip" onClick={handleSelectVisible}>
              Select visible
            </button>
            <button type="button" className="builder-chip" onClick={handleClear}>
              Clear selection
            </button>
            <span className="px-2 py-1 font-mono text-xs" style={{ color: "var(--faint)" }}>
              {selectedCount} selected
            </span>
          </div>

          <div className="max-h-[70vh] space-y-px overflow-y-auto border border-[var(--rule)]">
            {filtered.map((cat) => {
              const keys = cat.strings.map((s) => `${cat.name}::${s}`)
              const selectedInCat = keys.filter((k) => selected.has(k)).length
              const allOn = selectedInCat === cat.strings.length && cat.strings.length > 0
              const isOpen = openCats.includes(cat.name)
              return (
                <div key={cat.name} style={{ background: "var(--panel)" }}>
                  <div className="flex items-center gap-2 border-b border-[var(--rule)] px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={allOn}
                      aria-label={`Select all in ${cat.name}`}
                      onChange={(e) => handleToggleCategory(cat, e.target.checked)}
                      className="h-4 w-4"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center justify-between text-left"
                      onClick={() =>
                        setOpenCats((p) =>
                          p.includes(cat.name) ? p.filter((x) => x !== cat.name) : [...p, cat.name]
                        )
                      }
                      aria-expanded={isOpen}
                    >
                      <span className="truncate font-display text-sm font-semibold text-white">
                        {cat.name}
                      </span>
                      <span className="ml-2 shrink-0 font-mono text-[0.65rem]" style={{ color: "var(--faint)" }}>
                        {selectedInCat}/{cat.strings.length} · {cat.os}
                      </span>
                    </button>
                  </div>
                  {isOpen ? (
                    <ul className="max-h-64 overflow-y-auto px-2 py-2">
                      {cat.strings.map((s) => {
                        const key = `${cat.name}::${s}`
                        const on = selected.has(key)
                        return (
                          <li key={key}>
                            <label className="flex cursor-pointer items-start gap-2 px-2 py-1.5 hover:bg-white/5">
                              <input
                                type="checkbox"
                                checked={on}
                                onChange={() => handleToggleString(cat.name, s)}
                                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                style={{ accentColor: "var(--accent)" }}
                              />
                              <span className="font-mono text-[0.7rem] leading-snug" style={{ color: "var(--muted)" }}>
                                {s}
                              </span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <aside className="surface-panel h-fit p-5 lg:sticky lg:top-24">
          <p className="section-label">Output</p>
          <h2 className="font-display text-xl font-semibold text-white">Your .txt</h2>

          <label className="mt-5 block text-xs" style={{ color: "var(--faint)" }}>
            Filename
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="mt-1.5 w-full px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                background: "var(--code)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius)",
              }}
            />
          </label>

          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <input
                type="checkbox"
                checked={headers}
                onChange={(e) => setHeaders(e.target.checked)}
                style={{ accentColor: "var(--accent)" }}
              />
              Category headers
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <input
                type="checkbox"
                checked={dedupe}
                onChange={(e) => setDedupe(e.target.checked)}
                style={{ accentColor: "var(--accent)" }}
              />
              Deduplicate lines
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={selectedCount === 0}
              className="cta-primary px-4 py-2.5 text-sm disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Download .txt
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={selectedCount === 0}
              className="cta-ghost px-4 py-2.5 text-sm disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Copy
            </button>
          </div>

          <pre
            className="mt-5 max-h-80 overflow-auto p-3 font-mono text-[0.65rem] leading-relaxed"
            style={{
              background: "var(--code)",
              border: "1px solid var(--rule)",
              color: "var(--muted)",
              borderRadius: "var(--radius)",
            }}
            aria-label="Preview of generated text file"
          >
            {selectedCount === 0 ? "# Select strings to preview export" : preview.slice(0, 4000)}
          </pre>
        </aside>
      </div>
    </div>
  )
}
