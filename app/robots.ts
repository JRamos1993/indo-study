import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lilt.jplramos1993.workers.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The owner dashboard is gated server-side, but keep it out of crawl too.
      disallow: "/admin",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
