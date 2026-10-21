import type { MetadataRoute } from "next";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/contact", "/routes", "/gallery", "/pay", "/terms"].map((p) => ({ url: `${site.url}${p}`, lastModified: now, priority: p ? 0.7 : 1 }));
  return [...pages, ...routes.map((r) => ({ url: `${site.url}/routes/${r.slug}`, lastModified: now, priority: 0.8 }))];
}
