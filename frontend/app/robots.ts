import type { MetadataRoute } from "next";

const SITE = "https://blackcloud.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/settings", "/playground", "/projects", "/ai-architect", "/migration", "/simulator", "/time-machine", "/cost", "/health-score", "/onboarding"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
