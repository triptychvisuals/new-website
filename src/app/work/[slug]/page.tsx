import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  projects,
  projectBySlug,
  projectFromWork,
  placeholderGradient,
  projectMedia,
  slugify,
} from "@/lib/projects";
import Header from "@/components/Header";
import ProjectDetail from "@/components/ProjectDetail";
import { getSiteContent, type PortalWork } from "@/lib/siteContent";

// The portal adds and removes projects: re-read its feed every minute,
// and render slugs that weren't known at build time on demand.
export const revalidate = 60;
export const dynamicParams = true;

/** /work/<slug>/camera.png if the file exists in public/, else undefined. */
function cameraImageFor(slug: string): string | undefined {
  const file = path.join(process.cwd(), "public", "work", slug, "camera.png");
  return fs.existsSync(file) ? `/work/${slug}/camera.png` : undefined;
}

function workSlug(w: PortalWork): string {
  return w.slug || slugify(w.title ?? "");
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
  const content = await getSiteContent();
  const work = content.works.find((w) => workSlug(w) === slug);
  const found = projectBySlug(slug);
  const title = work?.title ?? found?.project.title;
  return { title: title ? `${title} — Triptych` : "Project — Triptych" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getSiteContent();

  // The portal feed is the project list when it has one; the authored
  // list answers for the same slug (or when the feed is empty/down).
  const workIndex = content.works.findIndex((w) => workSlug(w) === slug);
  const work = workIndex >= 0 ? content.works[workIndex] : undefined;
  const found = projectBySlug(slug);
  if (!work && !found) notFound();

  const project = work ? projectFromWork(work, workIndex) : found!.project;
  const index = work ? workIndex : found!.index;

  return (
    // Force the dark palette so the site menu header matches the page, and keep
    // a dark backdrop behind the sticky header.
    <div data-theme="dark" style={{ background: "#0b0a0a", minHeight: "100vh" }}>
      <Header logo={content.logo} />
      <ProjectDetail
        project={project}
        work={work}
        gradient={placeholderGradient(index)}
        media={work?.thumb ?? projectMedia(index)}
        cameraImage={work?.camera?.image ?? cameraImageFor(slug)}
      />
    </div>
  );
}
