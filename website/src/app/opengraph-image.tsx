import { ImageResponse } from "next/og"

export const alt = "ScreenShareTool — Minecraft forensic anti-cheat"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 96px",
          background: "#08080a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(251,113,133,0.18), transparent 55%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontSize: 15,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#fb7185",
              marginBottom: 28,
              fontWeight: 600,
            }}
          >
            v4.0.1 · sstool · 2500+ strings
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              color: "#f4f4f5",
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
              marginBottom: 24,
            }}
          >
            ScreenShareTool
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#a1a1aa",
              maxWidth: 740,
              lineHeight: 1.4,
            }}
          >
            Forensic analysis for Minecraft screen shares
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
