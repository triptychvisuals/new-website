"use client";

import Link from "next/link";
import { useRef } from "react";
import { projects, placeholderGradient } from "@/lib/projects";

/**
 * Full-bleed horizontal carousel of portrait project cards with prev/next
 * arrows. Cards link through to the /projects page.
 */
export default function ProjectCarousel() {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl text-foreground ring-1 ring-black/10 backdrop-blur transition-colors hover:bg-white md:flex";

  return (
    <section className="relative mt-12 sm:mt-16">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous projects"
        className={`${arrow} left-4`}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next projects"
        className={`${arrow} right-4`}
      >
        ›
      </button>

      <div
        ref={scroller}
        data-lenis-prevent
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-6 sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <Link
            key={p.title}
            href="/projects"
            className="group relative aspect-[3/4] w-[72vw] shrink-0 snap-start overflow-hidden rounded-xl sm:w-[42vw] lg:w-[26vw] xl:w-[22vw]"
            style={{ background: placeholderGradient(i) }}
          >
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-sm font-medium text-white">{p.title}</span>
              <span className="font-mono text-[11px] uppercase text-white/70">
                {p.client}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
