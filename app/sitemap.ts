import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lilt.jplramos1993.workers.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/signin", "/guide/grammar", "/guide/pronunciation", "/privacy", "/terms"];
  return routes.map((r) => ({
    url: `${base}${r}/`.replace(/\/+$/, "/"),
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r.startsWith("/guide") ? 0.8 : 0.5,
  }));
}
