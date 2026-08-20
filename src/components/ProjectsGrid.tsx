"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { placeholderGradient } from "@/lib/projects";
import { mergeCards } from "@/lib/cards";
import type { PortalWork } from "@/lib/siteContent";
import ProjectCard from "./ProjectCard";

// EDIT: how many oversized cards lead the unfiltered view.
const FEATURED_COUNT = 2;

/**
 * The full project index: filter pills by project type, a two-up featured row
 * (unfiltered view only), then the grid. Cards restagger in on every filter
 * change.
 */
export default function ProjectsGrid({ works = [] }: { works?: PortalWork[] }) {
  const root = useRef<HTMLDivElement>(null);
  const all = useMemo(() => mergeCards(works), [works]);

  // EDIT: filter pills — derived from the categories in use, "All" first.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(all.map((c) => c.project.category)))],
    [all]
  );
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? all : all.filter((c) => c.project.category === filter);
  const featured = filter === "All" ? filtered.slice(0, FEATURED_COUNT) : [];
  const rest = filter === "All" ? filtered.slice(FEATURED_COUNT) : filtered;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-card]", {
        autoAlpha: 0,
        y: 22,
        duration: 0.55,
        ease: "power2.out",
        stagger: { each: 0.03, from: "start" },
      });
    }, root);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section ref={root} className="px-5 pb-16 sm:px-8">
      {/* Filter pills */}
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8">
        {categories.map((cat) => {
          const active = cat === filter;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-hairline text-foreground/70 hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
        <span className="ml-auto hidden text-[11px] uppercase tracking-[0.15em] text-muted sm:block">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {/* Featured pair — oversized, unfiltered view only */}
      {featured.length > 0 && (
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {featured.map(({ project, index, media, href }) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              gradient={placeholderGradient(index)}
              media={media}
              href={href}
            />
          ))}
        </div>
      )}

      {/* The grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rest.map(({ project, index, media, href }) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            gradient={placeholderGradient(index)}
            media={media}
            href={href}
          />
        ))}
      </div>
    </section>
  );
}
