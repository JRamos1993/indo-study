import { createElement } from "react";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    createElement(
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
          fontSize: 300,
          fontWeight: 700,
        },
      },
      "id",
    ),
    { width: 512, height: 512 },
  );
}
