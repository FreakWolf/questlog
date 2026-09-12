import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/login`, lastModified: now, priority: 0.5 },
    { url: `${base}/signup`, lastModified: now, priority: 0.8 },
  ];
}
