import type { MetadataRoute } from "next";
import { getAllPosts } from "@/content/posts";
import { getAllDocs } from "@/content/docs";

const SITE = "https://blackcloud.ai";

const STATIC_ROUTES = [
  "",
  "/pricing",
  "/mascots",
  "/manifesto",
  "/changelog",
  "/blog",
  "/docs",
  "/login",
  "/signup",
  "/forgot",
  "/product/ai-architect",
  "/product/cloud-playground",
  "/product/migration-ground",
  "/product/failure-simulator",
  "/product/time-machine",
  "/product/cost-simulator",
  "/product/live-twin",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // ponytail: fixed lastModified (Date.now would defeat static caching + break Workflow determinism)
  const lastModified = new Date("2026-07-18");
  const staticEntries = STATIC_ROUTES.map(path => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
  const blogEntries = getAllPosts().map(p => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const docEntries = getAllDocs().map(d => ({
    url: `${SITE}/docs/${d.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...staticEntries, ...blogEntries, ...docEntries];
}
