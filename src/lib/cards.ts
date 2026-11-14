import { youtubePoster } from "@/lib/youtube";
import {
  projects,
  postCredits,
  projectFromWork,
  projectMedia,
  type Project,
} from "@/lib/projects";
import type { PortalWork } from "@/lib/siteContent";
import { previewFor, type Preview } from "@/lib/previews";

/** A gallery-ready card: a portal project, or an authored fallback. */
export type CardData = {
  project: Project;
  /** Original position — keeps gradients/media stable across filters. */
  index: number;
  media?: string;
  href?: string;
  /** A short silent loop that plays while the card is on screen (lib/previews). */
  preview?: Preview;
};

/**
 * When the portal feed carries works, they ARE the card list — the
 * portal adds and removes projects, and every card routes to its
 * /work/<slug> page (rendered from the same feed). With an empty or
 * unreachable feed, the authored list stands untouched.
 */
export function mergeCards(works: PortalWork[] = []): CardData[] {
  if (works.length > 0) {
    const fromFeed: CardData[] = works.map((w, i) => {
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
    const have = new Set(fromFeed.map((c) => c.project.slug));
    // Authored projects marked `standalone` (not in the portal yet) slot in
    // by year among the feed's works.
    const merged = [...fromFeed];
    projects
      .filter((p) => p.standalone && !have.has(p.slug))
      .forEach((project) => {
        const at = merged.findIndex((c) => Number(c.project.year) < Number(project.year));
        merged.splice(at < 0 ? merged.length : at, 0, {
          project,
          index: fromFeed.length + postCredits.length + merged.length,
          media: project.youtube ? youtubePoster(project.youtube) : undefined,
          href: undefined,
        });
        have.add(project.slug);
      });
    // Post-production credits are authored here, so they join the feed's list.
    const extra = postCredits
      .filter((p) => !have.has(p.slug))
      .map((project, k) => ({
        project,
        index: merged.length + k,
        media: project.youtube ? youtubePoster(project.youtube) : undefined,
        href: undefined,
      }));
    return withPreviews([...merged, ...extra]);
  }
  // Projects without a video yet get no media: the card shows its colour
  // poster with a gear drawing (the animated SVG reels are kept for the
  // single-image spots — thirty of them in one grid cost frames).
  return withPreviews(
    projects.map((project, i) => ({
      project,
      index: i,
      media: project.youtube ? youtubePoster(project.youtube) : undefined,
      href: undefined,
    }))
  );
}

/** Every card gets its animated preview, when there is one. */
function withPreviews(cards: CardData[]): CardData[] {
  return cards.map((c) => ({ ...c, preview: previewFor(c.project.slug) }));
}
