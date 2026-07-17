"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/site";

/* EDIT: hero stat rows (right column) */
const stats = [
  { label: "Response time", value: "3H" },
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
    "text-[clamp(2.5rem,11.5vw,9rem)] font-normal leading-[0.9] tracking-[-0.03em] text-foreground";

  return (
    <section id="top" ref={root} className="px-5 pb-4 pt-8 sm:px-8 sm:pt-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12">
        {/* Headline (wraps within its column so it stays large) */}
        <div className="flex flex-col gap-x-8 gap-y-3 md:flex-row md:flex-wrap md:items-baseline">
          <h1 data-hero-line className={display}>
            {site.name}
          </h1>

          {/* Index label tucked between the words */}
          <div
            data-hero-label
            className="border-l-2 border-accent pl-3 text-[11px] leading-relaxed md:self-end md:pb-[0.7em]"
          >
            <div className="text-muted">{site.sectionNumber}</div>
            <div className="text-foreground">[{site.sectionLabel}]</div>
          </div>

          <h1 data-hero-line className={display}>
            {site.suffix}
          </h1>
        </div>

        {/* Stats — right margin, level with the headline */}
        <div data-hero-stats className="w-full shrink-0 lg:w-[300px] lg:pt-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center justify-between border-b border-hairline py-4 ${
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
      </div>
    </section>
  );
}
