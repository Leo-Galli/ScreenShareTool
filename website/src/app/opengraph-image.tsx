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
          background: "#f3f5f7",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(10,14,20,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,14,20,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8a94a1",
              marginBottom: 28,
              fontWeight: 700,
            }}
          >
            v4.0.1 · sstool · 8000+ strings
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 900,
              color: "#0a0e14",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              marginBottom: 18,
            }}
          >
            ScreenShareTool
          </div>
          <div
            style={{
              display: "flex",
              width: 88,
              height: 8,
              background: "#c8f000",
              marginBottom: 24,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#5a6573",
              maxWidth: 720,
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
