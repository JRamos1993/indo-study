import type { MetadataRoute } from "next";

// Materialize as a static file at build time (required under output: "export").
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lilt — learn Indonesian & Japanese",
    short_name: "Lilt",
    description: "A practice studio for Indonesian and Japanese — spaced review, a real exercise engine, and your whole word bank, offline.",
    start_url: "/today/",
    display: "standalone",
    background_color: "#1A1430",
    theme_color: "#6C4CF0",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
