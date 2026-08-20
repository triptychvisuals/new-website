import { placeholderGradient } from "@/lib/projects";
import { mergeCards } from "@/lib/cards";
import type { PortalWork } from "@/lib/siteContent";
import ProjectCard from "./ProjectCard";

// EDIT: how many reels stack on the homepage (the full set lives on /projects).
const COUNT = 5;

// EDIT: where the first card parks below the header (px)…
const TOP = 84;
// EDIT: …and the strip of each card left peeking when the next stacks onto it.
const PEEK = 26;

/**
 * Apple-Wallet-style stack: each card scrolls up and parks a little below the
 * previous one, so the stack builds at the top with the top edge of every
 * card still showing. Pure CSS sticky — Lenis drives native scroll, so no
 * ScrollTrigger needed.
 */
export default function WalletStack({ works = [] }: { works?: PortalWork[] }) {
  const cards = mergeCards(works).slice(0, COUNT);

  return (
    <section id="work" className="px-5 pb-20 sm:px-8">
      {cards.map(({ project, index, media, href }, i) => (
        <div
          key={project.slug}
          className="sticky mx-auto w-full max-w-[980px] pb-5 last:pb-0"
          style={{ top: TOP + i * PEEK, zIndex: i + 1 }}
        >
          {/* Lifted shadow so each card reads as its own layer in the stack */}
          <div className="overflow-hidden rounded-2xl shadow-[0_-14px_36px_rgba(0,0,0,0.22)]">
            <ProjectCard
              project={project}
              index={index}
              gradient={placeholderGradient(index)}
              media={media}
              href={href}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
