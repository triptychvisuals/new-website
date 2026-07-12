"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

/**
 * Gallery cell: an HD reel that autoplays while on-screen (paused off-screen
 * for performance), over a gradient/still base, then title · [n] · CLIENT.
 */
export default function ProjectCard({
  project,
  index,
  gradient,
  video,
}: {
  project: Project;
  index: number;
  gradient: string;
  video?: string;
}) {
  const n = index + 1;
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <a data-card href="#" className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
        {/* Base still / gradient */}
        {project.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.src}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: gradient }} />
        )}

        {/* HD reel — autoplays while visible */}
        {video && (
          <video
            ref={vref}
            src={video}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-normal leading-tight text-foreground">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">[{n}]</span>
      </div>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
        {project.client}
      </p>
    </a>
  );
}
