import { ImageResponse } from "next/og";

// Materialize as a static PNG at build time (required under output: "export").
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4f46e5",
          color: "#fff",
          fontSize: 96,
          fontWeight: 700,
        }}
      >
        id
      </div>
    ),
    size,
  );
}
