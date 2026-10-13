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
import { site } from "@/lib/site";
import { youtubePoster } from "@/lib/youtube";

// The portal adds and removes projects: re-read its feed every minute,
// and render slugs that weren't known at build time on demand.
export const revalidate = 60;
export const dynamicParams = true;

/**
 * Finished frames for a project: every still in /public/work/<slug>/
 * (jpg / png / webp). `camera.png` was the old equipment shot — skipped.
 * EDIT: drop stills in that folder and they appear on the page, pinnable.
 * Frames published from the portal's Delivery tab come through the feed
 * (work.frames, public addresses) and are shown first.
 */
function framesFor(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "work", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && f.toLowerCase() !== "camera.png")
    // Numeric-aware order so frame-2 comes before frame-10.
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    // Encode the filename — "frame #3.jpg" would otherwise truncate at '#'.
    .map((f) => `/work/${slug}/${encodeURIComponent(f)}`);
}

function workSlug(w: PortalWork): string {
  return w.slug || slugify(w.title ?? "");
}

/** An absolute address for a frame, whether it lives here or on the portal's bucket. */
function absolute(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${site.url}${src}`;
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
  const description =
    work?.synopsis ?? `${title ?? "A project"} by ${site.name} ${site.suffix}.`;
  // The first frame is the picture Pinterest, iMessage and the rest show
  // for the page: a portal-published frame first, else one on disk, else
  // the clip's poster.
  const frames = [...(work?.frames ?? []), ...framesFor(slug)];
  const image = frames[0] ?? work?.clipPoster;
  const pageUrl = `${site.url}/work/${slug}`;
  return {
    title: title ? `${title} — Triptych` : "Project — Triptych",
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      title: title ?? "Project",
      description,
      url: pageUrl,
      siteName: `${site.name} ${site.suffix}`,
      ...(image ? { images: [{ url: absolute(image) }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: title ?? "Project",
      description,
      ...(image ? { images: [absolute(image)] } : {}),
    },
  };
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
    <div className="min-h-screen bg-background text-foreground">
      <Header logo={content.logo} />
      <ProjectDetail
        project={project}
        work={work}
        gradient={placeholderGradient(index)}
        media={work?.thumb ?? work?.clipPoster ?? (project.youtube ? youtubePoster(project.youtube) : projectMedia(index))}
        frames={[...(work?.frames ?? []), ...framesFor(slug)]}
      />
    </div>
  );
}
