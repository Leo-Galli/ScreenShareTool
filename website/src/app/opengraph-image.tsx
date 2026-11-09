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
          background: "#131313",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 10,
            background: "#ff6a00",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ff6a00",
              marginBottom: 24,
              fontWeight: 700,
            }}
          >
            v4.0.1 · sstool · 8000+ strings
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              color: "#f2f2f0",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            ScreenShareTool
          </div>
          <div
            style={{
              display: "flex",
              width: 72,
              height: 4,
              background: "#ff6a00",
              marginBottom: 22,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#9a9a94",
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
