"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/site";

/**
 * Oversized split headline: {name} … [index label] … {suffix}
 * spanning the full width, with a masked rise-in on mount.
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
    }, root);
    return () => ctx.revert();
  }, []);

  const display =
    "text-[clamp(2.75rem,13vw,11rem)] font-medium leading-[0.85] tracking-[-0.045em] text-foreground";

  return (
    <section
      id="top"
      ref={root}
      className="px-5 pb-6 pt-10 sm:px-8 sm:pt-14"
    >
      <div className="flex flex-col gap-x-8 gap-y-3 md:flex-row md:items-baseline md:justify-between">
        <h1 data-hero-line className={display}>
          {site.name}
        </h1>

        {/* Index label in the gap */}
        <div
          data-hero-label
          className="border-l-2 border-accent pl-3 font-mono text-[11px] leading-relaxed md:self-end md:pb-[0.9em]"
        >
          <div className="text-muted">{site.sectionNumber}</div>
          <div className="text-foreground">[{site.sectionLabel}]</div>
        </div>

        <h1 data-hero-line className={display}>
          {site.suffix}
        </h1>
      </div>
    </section>
  );
}
