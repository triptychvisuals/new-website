import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

// EDIT: every public page, with how much search engines should weigh it.
const PAGES: [string, number][] = [
  ["", 1],
  ["/projects", 0.9],
  ["/who-we-are", 0.8],
  ["/services", 0.8],
  ["/about", 0.7],
  ["/philosophy", 0.6],
  ["/testimonials", 0.6],
  ["/press", 0.6],
  ["/press/kit", 0.5],
  ["/store", 0.5],
  ["/contact", 0.5],
  ["/privacy", 0.2],
  ["/terms", 0.2],
  ["/disclaimer", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...PAGES.map(([p, priority]) => ({ url: `${site.url}${p}`, lastModified: now, priority })),
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
