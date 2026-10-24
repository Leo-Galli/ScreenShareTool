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
          background: "#000000",
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
              "radial-gradient(ellipse 55% 45% at 10% 100%, rgba(50,110,255,0.35), transparent 55%), radial-gradient(ellipse 40% 35% at 90% 0%, rgba(80,90,200,0.18), transparent 50%)",
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
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8a8a8a",
              marginBottom: 28,
              fontWeight: 600,
            }}
          >
            v4.0.0
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontWeight: 650,
              color: "#ffffff",
              letterSpacing: "-0.045em",
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            ScreenShareTool
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#8a8a8a",
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
