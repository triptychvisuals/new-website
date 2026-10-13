"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export type Bubble = {
  href: string;
  title: string;
  /** Still for the bubble; absent → a color swatch. */
  thumb?: string;
  /** Used if `thumb` fails (YouTube has no SD still for some uploads). */
  thumbFallback?: string;
  /** Opens off-site (a YouTube video) in a new tab. */
  external?: boolean;
  /** Base hue (0–360) for the swatch gradient / thumbnail tint. */
  hue: number;
};

/**
 * Tile image. Swaps to the fallback on a load error, or when YouTube answers
 * a missing still with its 120×90 grey placeholder instead of a 404. A
 * YouTube SD still is letterboxed 4:3, so it's zoomed 4/3 to crop the bars;
 * the fallback (already 16:9) isn't.
 */
function Thumb({ src, fallback }: { src: string; fallback?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [onFallback, setOnFallback] = useState(false);
  const letterboxed = !onFallback && src.includes("/sddefault.");
  const swap = (img: HTMLImageElement) => {
    if (fallback && img.src !== fallback) {
      img.src = fallback;
      setOnFallback(true);
    }
  };
  // An image that finished before hydration never fires React's handlers.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth <= 120) swap(img);
  });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => swap(e.currentTarget)}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 120) swap(e.currentTarget);
      }}
      className={`absolute inset-0 h-full w-full object-cover ${letterboxed ? "scale-[1.34]" : ""}`}
    />
  );
}

/**
 * Renders the 6×6 grid. The counter tile is placed explicitly in the middle
 * 2×2; the 32 rounded-square tiles auto-flow into the remaining cells around
 * it. On scroll-in the tiles pop in radiating out from the center (GSAP grid
 * stagger) while the counter counts up from 0, then each tile drifts gently
 * on its own rhythm.
 */

// EDIT: how long the count-up takes (seconds).
const COUNT_SECONDS = 2.4;
// EDIT: the blurred thumbnails behind the grid — how many, how strong.
const BG_COUNT = 5;
const BG_STRENGTH = 0.55;
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
  // Thumbnails for the backdrop: the small (320×180) version of the first
  // few distinct tiles — blurred and scaled up, so no one can tell.
  const bgs = Array.from(new Set(bubbles.map((b) => b.thumbFallback ?? b.thumb).filter((s): s is string => !!s))).slice(0, BG_COUNT);

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

      // Backdrop: as the grid scrolls through, one blurred thumbnail fades
      // into the next (opacity only — compositor work, nothing repaints).
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
      const s = Math.max(sec.offsetWidth / 320, sec.offsetHeight / 180) * 1.08;
      sec.style.setProperty("--wg-bg-scale", s.toFixed(2));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (sec) ro.observe(sec);

    // The tiles' idle drift only runs while the grid is on screen.
    const el = root.current;
    const io = new IntersectionObserver(([e]) => el?.toggleAttribute("data-idle", !e.isIntersecting));
    if (el) io.observe(el);

    return () => {
      ctx.revert();
      io.disconnect();
      ro.disconnect();
    };
  }, [target, suffix]);

  return (
    <section
      ref={root}
      id="work"
      aria-label={`${countLabel} ${caption}`}
      className="relative overflow-hidden bg-background px-4 py-20 sm:px-8 sm:py-28"
    >
      {/* Backdrop — blurred thumbnails crossfading with scroll, under a
          tint of the page colour so the tiles stay the focus */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {bgs.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} data-wg-bg src={src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="wg-bg" />
        ))}
        <div className="absolute inset-0 bg-background/55" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1100px] grid-cols-6 gap-2.5 sm:gap-4">
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
            {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
              {b.thumb && <Thumb src={b.thumb} fallback={b.thumbFallback} />}
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
