"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/site";

/* EDIT: hero stat rows (right column) */
const stats = [
  { label: "Started in", value: "2016" },
  { label: "Total projects", value: "500+" },
  { label: "Based in", value: "Chicago" },
  { label: "Creators", value: "23" },
];

/**
 * Oversized split headline: {name} … [index label] … {suffix} on the left,
 * with a stats block pinned to the right margin at the same level.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        y: 44,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.09,
      });
      gsap.from("[data-hero-label]", {
        autoAlpha: 0,
        duration: 1,
        delay: 0.35,
        ease: "power2.out",
      });
      gsap.from("[data-hero-stats]", {
        autoAlpha: 0,
        y: 20,
        duration: 1,
        delay: 0.45,
        ease: "power2.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const display =
    "whitespace-nowrap text-[clamp(1.75rem,8vw,7rem)] font-normal leading-[0.95] tracking-[-0.03em] text-foreground";

  return (
    <section id="top" ref={root} className="px-5 pb-4 pt-8 sm:px-8 sm:pt-10">
      {/* Wordmark — one horizontal line across the top */}
      <div className="flex items-start justify-between gap-4">
        <h1 data-hero-line className={display}>
          {site.name} {site.suffix}
        </h1>

        {/* Index label to the right (only where there's room) */}
        <div
          data-hero-label
          className="hidden shrink-0 border-l-2 border-accent pl-3 text-[11px] leading-relaxed lg:block"
        >
          <div className="text-muted">{site.sectionNumber}</div>
          <div className="text-foreground">[{site.sectionLabel}]</div>
        </div>
      </div>

      {/* Stats, then the reel directly under them (under "Creators") */}
      <div className="mt-8 flex flex-col items-end gap-4 sm:mt-10">
        <div data-hero-stats className="w-full sm:w-[340px]">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center justify-between border-b border-hairline py-2 ${
                i === 0 ? "border-t" : ""
              }`}
            >
              <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
                {s.label}
              </span>
              <span className="text-sm font-medium uppercase tracking-wide text-foreground">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Reel — sits under the stats block */}
        <div
          data-hero-stats
          className="aspect-video w-full overflow-hidden rounded-2xl bg-black sm:w-[440px] lg:w-[560px]"
        >
          {/* EDIT: swap for the reel you want here */}
          <video
            className="h-full w-full object-cover"
            src="/hero/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Triptych reel"
          />
        </div>
      </div>
    </section>
  );
}
