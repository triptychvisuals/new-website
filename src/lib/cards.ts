import {
  projects,
  projectFromWork,
  projectMedia,
  type Project,
} from "@/lib/projects";
import type { PortalWork } from "@/lib/siteContent";

/** A gallery-ready card: a portal project, or an authored fallback. */
export type CardData = {
  project: Project;
  /** Original position — keeps gradients/media stable across filters. */
  index: number;
  media: string;
  href?: string;
};

/**
 * When the portal feed carries works, they ARE the card list — the
 * portal adds and removes projects, and every card routes to its
 * /work/<slug> page (rendered from the same feed). With an empty or
 * unreachable feed, the authored list stands untouched.
 */
export function mergeCards(works: PortalWork[] = []): CardData[] {
  if (works.length > 0) {
    return works.map((w, i) => {
      const project = projectFromWork(w, i);
      return {
        project,
        index: i,
        media: w.thumb ?? projectMedia(i),
        // Cards default to the project page; ProjectCard falls back to
        // /work/<slug> when href is undefined.
        href: undefined,
      };
    });
  }
  return projects.map((project, i) => ({
    project,
    index: i,
    media: projectMedia(i),
    href: undefined,
  }));
}
