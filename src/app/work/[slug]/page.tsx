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

/** /work/<slug>/camera.png if the file exists in public/, else undefined. */
function cameraImageFor(slug: string): string | undefined {
  const file = path.join(process.cwd(), "public", "work", slug, "camera.png");
  return fs.existsSync(file) ? `/work/${slug}/camera.png` : undefined;
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

  return (
    // Force the dark palette so the site menu header matches the page, and keep
    // a dark backdrop behind the sticky header.
    <div data-theme="dark" style={{ background: "#0b0a0a", minHeight: "100vh" }}>
      <Header />
      <ProjectDetail
        project={found.project}
        gradient={placeholderGradient(found.index)}
        media={projectMedia(found.index)}
        cameraImage={cameraImageFor(slug)}
      />
    </div>
  );
}
