import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  projects,
  projectBySlug,
  placeholderGradient,
  projectMedia,
} from "@/lib/projects";
import ProjectDetail from "@/components/ProjectDetail";

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
    <ProjectDetail
      project={found.project}
      gradient={placeholderGradient(found.index)}
      media={projectMedia(found.index)}
    />
  );
}
