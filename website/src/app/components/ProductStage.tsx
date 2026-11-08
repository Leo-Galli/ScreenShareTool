"use client"

import { useRef, useState } from "react"

const lines = [
  { t: "12:04:18", m: "BAM", d: "javaw.exe last run 41m ago", flag: false },
  { t: "12:04:19", m: "USN", d: "FILE_DELETE · liquidbounce.jar", flag: true },
  { t: "12:04:19", m: "PRE", d: "WUJ.EXE-3A91.pf · 2 launches", flag: true },
  { t: "12:04:21", m: "REG", d: "UserAssist · explorer shellbag hit", flag: false },
  { t: "12:04:22", m: "MC", d: "IAS switch · nick delta +2", flag: true },
  { t: "12:04:24", m: "EVT", d: "Security 4688 · powershell.exe", flag: false },
  { t: "12:04:26", m: "CHEAT", d: "self-delete pattern matched", flag: true },
  { t: "12:04:28", m: "OUT", d: "dashboard.html written", flag: false },
]

type ProductStageProps = {
  className?: string
}

const ProductStage = ({ className = "" }: ProductStageProps) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ x: 55, y: 42, on: false })
  const [hot, setHot] = useState(-1)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSpot({ x, y, on: true })
    const idx = Math.min(
      lines.length - 1,
      Math.max(0, Math.floor(((e.clientY - rect.top - 72) / Math.max(rect.height - 96, 1)) * lines.length))
    )
    setHot(idx)
  }

  const handleLeave = () => {
    setSpot((s) => ({ ...s, on: false }))
    setHot(-1)
  }

  return (
    <div
      ref={stageRef}
      className={`product-stage animate-stage ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      role="img"
      aria-label="ScreenShareTool scan preview with live evidence highlights"
    >
      <div className="product-stage__grid" aria-hidden="true" />
      <div
        className="product-stage__spot"
        style={{
          left: `${spot.x}%`,
          top: `${spot.y}%`,
          opacity: spot.on ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="live-dot inline-block h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <span className="font-display text-sm font-semibold tracking-tight text-white">
              ScreenShareTool
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.14em]" style={{ color: "var(--faint)" }}>
              live scan
            </span>
          </div>
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--muted)" }}>
            window · 7d
          </span>
        </div>
      </div>

      <div className="relative z-10 grid gap-0 sm:grid-cols-[1fr_11rem]">
        <ul className="space-y-0 px-2 py-3 sm:px-3">
          {lines.map((line, i) => (
            <li
              key={`${line.t}-${line.m}`}
              className={`scan-line flex items-baseline gap-3 py-2 font-mono text-[0.72rem] sm:text-[0.78rem] ${
                hot === i || (hot < 0 && line.flag) ? "is-hot" : ""
              }`}
              style={{ color: hot === i || (hot < 0 && line.flag) ? undefined : "var(--muted)" }}
            >
              <span className="w-14 shrink-0 tabular-nums opacity-70">{line.t}</span>
              <span
                className="w-12 shrink-0 font-semibold"
                style={{ color: line.flag ? "var(--accent)" : "var(--ink)" }}
              >
                {line.m}
              </span>
              <span className="min-w-0 truncate">{line.d}</span>
            </li>
          ))}
        </ul>

        <aside className="border-t border-white/10 px-4 py-4 sm:border-l sm:border-t-0">
          <p className="section-label !mb-3">Hits</p>
          <p className="font-display text-4xl font-semibold tracking-tight text-white">04</p>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            Flagged artifacts in this window. Hover the tape to inspect each line.
          </p>
          <div className="mt-5 space-y-2">
            {["USN delete", "Prefetch", "IAS", "Self-delete"].map((tag) => (
              <div
                key={tag}
                className="border border-[var(--rule)] px-2.5 py-1.5 text-[0.7rem]"
                style={{ color: "var(--muted)" }}
              >
                {tag}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProductStage
