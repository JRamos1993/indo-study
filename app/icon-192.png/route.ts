import { createElement } from "react";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

function badge(fontSize: number) {
  return createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#4f46e5",
        color: "#fff",
        fontSize,
        fontWeight: 700,
      },
    },
    "id",
  );
}

export function GET() {
  return new ImageResponse(badge(110), { width: 192, height: 192 });
}
