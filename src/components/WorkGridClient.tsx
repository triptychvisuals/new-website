"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import TenYears from "@/components/TenYears";

// EDIT: how strongly the blurred stills show over the colour field (0–1).
const BG_STRENGTH = 1;

/**
 * "10 years strong", huge, on a vivid colour field: a fixed spread of
 * colour underneath, and blurred video stills over it that crossfade one
 * into the next as the section scrolls by (opacity only — nothing repaints).
 * Opens straight into the timeline below.
 */
export default function WorkGridClient({ backdrops }: { backdrops: string[] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-wg-bg]");
      if (layers.length > 1) {
        const state = { p: 0 };
        const paint = () => {
          const i0 = Math.min(Math.floor(state.p), layers.length - 2);
          const f = state.p - i0;
          layers.forEach((l, i) => {
            l.style.opacity = String(i === i0 ? (1 - f) * BG_STRENGTH : i === i0 + 1 ? f * BG_STRENGTH : 0);
          });
        };
        paint();
        gsap.to(state, {
          p: layers.length - 1,
          ease: "none",
          onUpdate: paint,
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom 15%", scrub: true },
        });
      }
    }, root);

    // The backdrop images are tiny; scale them to cover the section.
    const sec = root.current;
    const fit = () => {
      if (!sec) return;
      // Overscaled so the blur's soft edges sit off-screen.
      const s = Math.max(sec.offsetWidth / 320, sec.offsetHeight / 180) * 1.3;
      sec.style.setProperty("--wg-bg-scale", s.toFixed(2));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (sec) ro.observe(sec);

    return () => {
      ctx.revert();
      ro.disconnect();
    };
  }, []);

  return (
    <section
      ref={root}
      id="work"
      aria-label="Ten years strong"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-4 py-28 sm:px-8 sm:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* EDIT: the colour field under the stills — vivid from the first
            frame, and still colourful if the stills don't load */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 55% at 22% 30%, #ff2d7a 0%, transparent 70%), radial-gradient(45% 55% at 80% 28%, #ff9a1f 0%, transparent 70%), radial-gradient(50% 55% at 70% 78%, #1fb8ff 0%, transparent 70%), radial-gradient(45% 50% at 25% 80%, #7a2dff 0%, transparent 70%), #2a0f3a",
          }}
        />
        {backdrops.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} data-wg-bg src={src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="wg-bg" />
        ))}
        {/* soft fade into the page at the top */}
        <div className="absolute inset-x-0 top-0 h-[14%]" style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }} />
      </div>

      <div className="relative w-full">
        <TenYears />
      </div>
    </section>
  );
}
