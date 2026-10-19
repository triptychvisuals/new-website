"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// EDIT: the headline copy.
const TOP = "10 years";
const BOTTOM = "strong";

/** "10 years" → "10" (drawn as the outline) and "years" (the words). */
const tenOf = (text: string) => text.match(/^\s*(\d+)/)?.[1] ?? text;
const restOf = (text: string) => text.replace(/^\s*\d+\s*/, "");

/**
 * "10 years strong", huge. The outlined "10" draws itself stroke by stroke,
 * then a band of iridescent light sweeps through the outline; "years" and
 * "strong" flip up letter by letter out of a blur and a light runs along
 * "strong". While it scrolls by, the "10" rises a little faster than the
 * words (parallax) and the words drift across — transforms only.
 */
export default function TenYears() {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%" } });
        // EDIT: the outline's dash length — longer than any one stroke of
        // the "10", so each draws in full
        const DASH = 3400;
        tl.fromTo(
          "[data-ty-stroke]",
          { strokeDasharray: DASH, strokeDashoffset: DASH },
          { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" }
        );
        tl.fromTo("[data-ty-sweep]", { attr: { x1: -1400, x2: -600 } }, { attr: { x1: 1400, x2: 2200 }, duration: 1.8, ease: "power1.inOut" }, 1.2);
        tl.from(
          "[data-ty-char]",
          {
            yPercent: 115,
            rotateX: -85,
            opacity: 0,
            filter: "blur(14px)",
            transformOrigin: "50% 100%",
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.045,
            clearProps: "filter",
          },
          0.35
        );
        tl.to("[data-ty-shine]", { opacity: 1, duration: 0.25, stagger: 0.06, ease: "power1.out" }, ">-0.2").to(
          "[data-ty-shine]",
          { opacity: 0.7, duration: 0.6, stagger: 0.06, ease: "power2.inOut" },
          "<0.25"
        );
        // EDIT: parallax depth (how far the "10" and the words travel)
        const scrub = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo("[data-ty-ten]", { yPercent: 16 }, { yPercent: -12, ease: "none", scrollTrigger: scrub });
        gsap.fromTo("[data-ty-words]", { xPercent: 8 }, { xPercent: -4, ease: "none", scrollTrigger: scrub });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <h2
      ref={root}
      aria-label={`${TOP} ${BOTTOM}`}
      className="relative flex flex-col items-center justify-center text-white md:flex-row md:items-center md:gap-[2.5vw]"
    >
      {/* The "10" — outline only, drawn in with a sweep of iridescent light.
          EDIT: its size is the width on this span. */}
      <span data-ty-ten aria-hidden className="block w-[min(96vw,760px)] will-change-transform md:w-[clamp(420px,56vw,1100px)]">
        <svg viewBox="0 0 1000 720" className="block h-auto w-full overflow-visible">
          <defs>
            <linearGradient id="ty-sweep" data-ty-sweep gradientUnits="userSpaceOnUse" x1="-1400" y1="0" x2="-600" y2="200">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.35" stopColor="#ffd36b" />
              <stop offset="0.45" stopColor="#ffffff" />
              <stop offset="0.55" stopColor="#57d7ff" />
              <stop offset="0.65" stopColor="#ff4fa3" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <text
            data-ty-stroke
            x="500"
            y="660"
            textAnchor="middle"
            fontSize="860"
            fontWeight="500"
            letterSpacing="-40"
            fill="none"
            stroke="url(#ty-sweep)"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
            className="font-sans"
          >
            {tenOf(TOP)}
          </text>
        </svg>
      </span>

      {/* The words, stacked beside it; letters flip in. */}
      <span
        data-ty-words
        aria-hidden
        className="-mt-[5vw] block text-center text-[clamp(4rem,19vw,9rem)] font-medium leading-[0.86] tracking-[-0.05em] will-change-transform [text-shadow:0_8px_40px_rgba(0,0,0,0.18)] md:mt-0 md:text-left md:text-[clamp(5rem,13vw,15rem)]"
      >
        <span className="block overflow-hidden pb-[0.04em] [perspective:900px]">
          {restOf(TOP).split("").map((ch, k) => (
            <span key={k} data-ty-char className="inline-block">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
        <span className="block overflow-hidden pb-[0.16em] [perspective:900px]">
          {BOTTOM.split("").map((ch, k) => (
            <span key={k} data-ty-char data-ty-shine className="inline-block opacity-70">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
      </span>
    </h2>
  );
}
