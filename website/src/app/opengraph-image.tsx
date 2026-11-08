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
          background: "#0c0e0c",
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
              "radial-gradient(ellipse 55% 45% at 8% 0%, rgba(198,242,74,0.18), transparent 55%), radial-gradient(ellipse 45% 40% at 100% 100%, rgba(60,90,70,0.35), transparent 50%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#c6f24a",
              marginBottom: 28,
              fontWeight: 600,
            }}
          >
            v4.0.1 · sstool
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              color: "#f1f4ef",
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
              color: "#8d9688",
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
