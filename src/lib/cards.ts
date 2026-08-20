import { projects, projectMedia, type Project } from "@/lib/projects";
import type { PortalWork } from "@/lib/siteContent";

/** A gallery-ready card: authored project merged with any portal override. */
export type CardData = {
  project: Project;
  /** Original position — keeps gradients/media stable across filters. */
  index: number;
  media: string;
  href?: string;
};

/**
 * Portal tiles override cards position-by-position — tile 1 edits the first
 * card; any card the portal doesn't cover keeps what's authored locally.
 */
export function mergeCards(works: PortalWork[] = []): CardData[] {
  return projects.map((project, i) => {
    const w = works[i];
    if (!w) return { project, index: i, media: projectMedia(i), href: undefined };
    return {
      project: {
        ...project,
        title: w.title ?? project.title,
        artist: w.client ?? project.artist,
        // A portal thumbnail replaces the local reel for that card.
        video: w.thumb ? undefined : project.video,
      },
      index: i,
      media: w.thumb ?? projectMedia(i),
      href: w.link,
    };
  });
}
