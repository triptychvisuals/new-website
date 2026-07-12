"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects, placeholderGradient } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

/**
 * Selected-works grid. Cards fade + rise in a stagger as each row scrolls into
 * view (ScrollTrigger.batch), driven by the shared Lenis scroll.
 */
export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      gsap.set(cards, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={root} className="px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
      {/* 1 (phone) · 2 (tablet) · 4 · 5 (widest) — even gaps */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            gradient={placeholderGradient(i)}
          />
        ))}
      </div>
    </section>
  );
}
