import { ImageResponse } from "next/og";

export const alt = "CharlieRP ScreenShareTool — Minecraft forensic anti-cheat analysis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          alignItems: "center",
          background: "#0a0f1a",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(6,182,212,0.18), rgba(10,15,26,0) 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 96,
              height: 96,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(135deg, #06b6d4, #2563eb)",
            }}
          >
            S
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              color: "white",
              letterSpacing: -1,
            }}
          >
            ScreenShareTool
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#94a3b8",
            marginBottom: 48,
          }}
        >
          Forensic anti-cheat analysis for Minecraft servers
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["48 cheat clients", "800+ forensic strings", "Windows · macOS · Linux"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: "1px solid rgba(6,182,212,0.3)",
                  color: "#22d3ee",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
