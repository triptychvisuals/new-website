import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  projects,
  projectBySlug,
  placeholderGradient,
  projectMedia,
} from "@/lib/projects";
import Header from "@/components/Header";
import ProjectDetail from "@/components/ProjectDetail";
import { getSiteContent } from "@/lib/siteContent";

/**
 * Finished frames for a project: every still in /public/work/<slug>/
 * (jpg / png / webp). `camera.png` was the old equipment shot — skipped.
 * EDIT: drop stills in that folder and they appear on the page, pinnable.
 */
function framesFor(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "work", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && f.toLowerCase() !== "camera.png")
    .sort()
    .map((f) => `/work/${slug}/${f}`);
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = projectBySlug(slug);
  return {
    title: found ? `${found.project.title} — Triptych` : "Project — Triptych",
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = projectBySlug(slug);
  if (!found) notFound();

  const content = await getSiteContent();

  return (
    // Force the dark palette so the site menu header matches the page, and keep
    // a dark backdrop behind the sticky header.
    <div data-theme="dark" style={{ background: "#0b0a0a", minHeight: "100vh" }}>
      <Header logo={content.logo} />
      <ProjectDetail
        project={found.project}
        gradient={placeholderGradient(found.index)}
        media={projectMedia(found.index)}
        frames={framesFor(slug)}
      />
    </div>
  );
}
