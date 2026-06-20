import { ImageResponse } from "next/og";

// Materialize a static PNG at build time (required under output: "export").
export const dynamic = "force-static";
export const alt = "Lilt — learn Indonesian & Japanese";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 84,
          background: "#1A1430",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <svg width="92" height="92" viewBox="0 0 130 130">
            <path
              d="M26 24 h66 a18 18 0 0 1 18 18 v36 a18 18 0 0 1 -18 18 h-30 l-16 18 v-18 h-20 a18 18 0 0 1 -18 -18 v-36 a18 18 0 0 1 18 -18 z"
              fill="#FFD23F"
              stroke="#1A1430"
              strokeWidth="7"
            />
          </svg>
          <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -2 }}>Lilt</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.04 }}>Learn Indonesian & Japanese</div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.12 }}>
            <span>that actually&nbsp;</span>
            <span style={{ color: "#C9F24D" }}>sticks.</span>
          </div>
        </div>

        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 32, color: "#b8b0da" }}>
          Spaced repetition · 10 ways to practise · No leagues, no guilt
        </div>
      </div>
    ),
    { ...size },
  );
}
