"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects, placeholderGradient, projectMedia } from "@/lib/projects";
import type { PortalWork } from "@/lib/siteContent";
import ProjectCard from "./ProjectCard";

// EDIT: how many reels show on phones before the About section takes over.
const MOBILE_COUNT = 3;

/**
 * Selected-works grid. Cards fade + rise in a stagger on mount (they always
 * end visible — no scroll dependency).
 */
export default function Gallery({ works = [] }: { works?: PortalWork[] }) {
  const root = useRef<HTMLDivElement>(null);

  // Portal tiles override cards position-by-position — tile 1 edits the first
  // card, and any card the portal doesn't cover keeps what's authored here.
  const cards = projects.map((project, i) => {
    const w = works[i];
    if (!w) return { project, media: projectMedia(i), href: undefined };
    return {
      project: {
        ...project,
        title: w.title ?? project.title,
        artist: w.client ?? project.artist,
        // A portal thumbnail replaces the local reel for that card.
        video: w.thumb ? undefined : project.video,
      },
      media: w.thumb ?? projectMedia(i),
      href: w.link,
    };
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-card]", {
        autoAlpha: 0,
        y: 22,
        duration: 0.6,
        ease: "power2.out",
        stagger: { each: 0.03, from: "start" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={root} className="px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
      {/* 1 across on mobile · 2 from sm · 3 across on wide (xl).
          EDIT: phones show only the first MOBILE_COUNT reels — the rest appear
          from sm up — so the mobile page stays one short scroll. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ project, media, href }, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            gradient={placeholderGradient(i)}
            media={media}
            href={href}
            className={i >= MOBILE_COUNT ? "hidden sm:block" : ""}
          />
        ))}
      </div>
    </section>
  );
}
