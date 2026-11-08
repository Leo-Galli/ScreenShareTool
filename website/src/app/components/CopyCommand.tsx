"use client"

import { useState } from "react"

type CopyCommandProps = {
  command: string
  label?: string
}

const CopyCommand = ({ command, label }: CopyCommandProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden border border-[var(--rule-strong)] bg-[var(--code)]">
      {label ? (
        <div
          className="flex items-center justify-between gap-3 border-b border-[var(--rule)] px-3 py-2 text-[0.65rem] uppercase tracking-[0.12em]"
          style={{ color: "var(--faint)" }}
        >
          <span>{label}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-[var(--radius)] px-2 py-1 font-medium normal-case tracking-normal transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: copied ? "var(--accent)" : "var(--muted)" }}
            aria-label={copied ? "Copied" : `Copy ${label} command`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : null}
      <div className="flex items-start gap-3">
        <pre className="m-0 flex-1 overflow-x-auto px-3 py-3 font-mono text-[0.8125rem] leading-relaxed text-[#dce3d6]">
          {command}
        </pre>
        {!label ? (
          <button
            type="button"
            onClick={handleCopy}
            className="m-2 shrink-0 self-start rounded-[var(--radius)] border border-[var(--rule-strong)] px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: copied ? "var(--accent)" : "var(--muted)" }}
            aria-label={copied ? "Copied" : "Copy command"}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default CopyCommand
