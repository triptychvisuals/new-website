"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects, placeholderGradient, projectMedia } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

/**
 * Selected-works grid. Cards fade + rise in a stagger on mount (they always
 * end visible — no scroll dependency).
 */
export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);

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
      {/* 2 across from the smallest screens · 4 across on wide (xl) */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            gradient={placeholderGradient(i)}
            media={projectMedia(i)}
          />
        ))}
      </div>
    </section>
  );
}
