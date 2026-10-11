"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export type Bubble = {
  href: string;
  title: string;
  /** Still for the bubble; absent → a color swatch. */
  thumb?: string;
  /** Base hue (0–360) for the swatch gradient / thumbnail tint. */
  hue: number;
};

/**
 * Renders the 6×6 grid. The counter tile is placed explicitly in the middle
 * 2×2; the 32 rounded-square tiles auto-flow into the remaining cells around
 * it. On scroll-in the tiles pop in radiating out from the center (GSAP grid
 * stagger) while the counter counts up from 0, then each tile drifts gently
 * on its own rhythm.
 */

// EDIT: how long the count-up takes (seconds).
const COUNT_SECONDS = 2.4;
export default function WorkGridClient({
  bubbles,
  countLabel,
  caption,
}: {
  bubbles: Bubble[];
  countLabel: string;
  caption: string;
}) {
  const root = useRef<HTMLElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  // "500+" → 500 and "+": the number counts, the suffix rides along.
  const match = countLabel.match(/^([\d,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (target !== null && num.current) {
        // Server HTML says the real number (SEO / no-JS); the client resets
        // to 0 off-screen and counts up when the grid scrolls into view.
        const el = num.current;
        const counter = { v: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(counter, {
          v: target,
          duration: COUNT_SECONDS,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.v).toLocaleString()}${suffix}`;
          },
        });
      }
      gsap.from("[data-bubble]", {
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: { grid: [6, 6], from: "center", amount: 0.9 },
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from("[data-count]", {
        scale: 0.85,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, [target, suffix]);

  return (
    <section
      ref={root}
      id="work"
      aria-label={`${countLabel} ${caption}`}
      className="bg-background px-4 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-6 gap-2.5 sm:gap-4">
        {/* Counter — middle 2×2 */}
        <div
          data-count
          className="col-span-2 col-start-3 row-span-2 row-start-3 flex flex-col items-center justify-center text-center"
        >
          {/* tabular-nums keeps the width steady while the digits tick */}
          <span
            ref={num}
            className="text-[clamp(2.25rem,9vw,7rem)] font-medium leading-none tracking-[-0.04em] text-foreground tabular-nums"
          >
            {countLabel}
          </span>
          <span className="mt-1 text-[clamp(0.6rem,1.3vw,1rem)] font-medium uppercase tracking-[0.14em] text-muted sm:mt-3">
            {caption}
          </span>
        </div>

        {bubbles.map((b, i) => (
          <Link
            key={i}
            href={b.href}
            data-bubble
            aria-label={b.title}
            title={b.title}
            className="group relative aspect-square"
          >
            <span
              className="wg-drift absolute inset-0 block overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_-10px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out group-hover:scale-[1.08]"
              style={{
                // EDIT: swatch colors — vivid hue-to-hue radial gradients.
                background: `radial-gradient(circle at 30% 25%, hsl(${b.hue} 92% 70%), hsl(${(b.hue + 38) % 360} 85% 52%) 55%, hsl(${(b.hue + 70) % 360} 80% 34%))`,
                animationDelay: `${(i % 7) * -0.9}s`,
                animationDuration: `${6 + (i % 5)}s`,
              }}
            >
              {b.thumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {/* Play glyph on hover */}
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                <svg width="22%" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
