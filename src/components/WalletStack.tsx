"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
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

// EDIT: how dark the page gets behind the stack (0–1) while scrolling it.
const DIM_OPACITY = 0.9;
// Above the header (z-40) so the whole page dims; the cards sit above this.
const DIM_Z = 41;

/**
 * Apple-Wallet-style stack: each card scrolls up and parks a little below the
 * previous one, top edges peeking as the pile builds (pure CSS sticky — Lenis
 * drives native scroll). While the stack is in view, a fixed black overlay
 * scrubbed by ScrollTrigger dims everything around it, so only the reel
 * thumbnails stay lit; it lifts again once the last card has stacked.
 */
export default function WalletStack({ works = [] }: { works?: PortalWork[] }) {
  const root = useRef<HTMLElement>(null);
  const dim = useRef<HTMLDivElement>(null);

  const cards = mergeCards(works).slice(0, COUNT);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 45%", // EDIT: when the dim starts fading in
            end: "bottom 25%", // EDIT: when it has fully lifted again
            scrub: true,
          },
        })
        .fromTo(dim.current, { opacity: 0 }, { opacity: DIM_OPACITY, ease: "none", duration: 0.5 })
        .to(dim.current, { opacity: DIM_OPACITY, duration: 0.35 }) // hold through the stack
        .to(dim.current, { opacity: 0, ease: "none", duration: 0.15 }); // lift after the last card
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="relative pb-20 pt-12 sm:pt-16">
      {/* The dimmer — fixed so it swallows the whole viewport (header included) */}
      <div
        ref={dim}
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-black opacity-0"
        style={{ zIndex: DIM_Z }}
      />

      {cards.map(({ project, index, media, href }, i) => (
        <div
          key={project.slug}
          className="sticky w-full pb-5 last:pb-0"
          style={{ top: TOP + i * PEEK, zIndex: DIM_Z + 1 + i }}
        >
          {/* Lifted shadow so each card reads as its own layer in the stack */}
          <div className="overflow-hidden shadow-[0_-14px_36px_rgba(0,0,0,0.22)]">
            <ProjectCard
              project={project}
              index={index}
              gradient={placeholderGradient(index)}
              media={media}
              href={href}
              rounded={false}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
