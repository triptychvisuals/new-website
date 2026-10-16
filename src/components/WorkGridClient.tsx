"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export type OrbitCard = {
  href: string;
  title: string;
  /** Artist · year. */
  sub: string;
  /** Still for the card; absent → a color swatch. */
  thumb?: string;
  /** Used if `thumb` fails (YouTube has no SD still for some uploads). */
  thumbFallback?: string;
  /** Base hue (0–360) for the swatch behind the still. */
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
 * The count in the middle, and liquid-glass player cards orbiting it on a
 * tilted ring. The orbit is pure CSS (globals.css, .wo-*): every card runs
 * the same compositor animation — round the ring, counter-turned so it
 * always faces you, fading as it passes behind — offset by a negative
 * delay, so nothing runs on the main thread while it turns. Hovering
 * pauses it; it also pauses while off screen. On scroll-in the counter
 * counts up and the cards fade in one by one.
 */

// EDIT: how long the count-up takes (seconds).
const COUNT_SECONDS = 2.4;
// EDIT: the blurred thumbnails behind the grid — how many, how strong.
const BG_COUNT = 7;
const BG_STRENGTH = 0.85;
// EDIT: one trip round the ring, in seconds.
const ORBIT_SECONDS = 48;
// EDIT: each card's height off the ring (px, cycled) — scatters them so the
// orbit reads as floating cards rather than a flat carousel.
const LIFTS = [-200, 90, -60, 210, -170, 40, 180, -120, 140, -30];

export default function WorkGridClient({
  cards,
  countLabel,
  caption,
}: {
  cards: OrbitCard[];
  countLabel: string;
  caption: string;
}) {
  const root = useRef<HTMLElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  // Thumbnails for the backdrop: the small (320×180) version of the first
  // few distinct tiles — blurred and scaled up, so no one can tell.
  const bgs = Array.from(new Set(cards.map((b) => b.thumbFallback ?? b.thumb).filter((s): s is string => !!s))).slice(0, BG_COUNT);

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
      gsap.from("[data-orbit-slot]", {
        autoAlpha: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.08,
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
      // Overscaled so the blur's soft edges sit off-screen — the colour
      // always reaches both sides of the window.
      const s = Math.max(sec.offsetWidth / 320, sec.offsetHeight / 180) * 1.3;
      sec.style.setProperty("--wg-bg-scale", s.toFixed(2));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (sec) ro.observe(sec);

    // The orbit only turns while it's on screen.
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
        {/* light tint, and the backdrop fades out at the top and bottom so
            the section has no hard edges */}
        <div className="absolute inset-0 bg-background/25" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--background) 0%, transparent 22%, transparent 78%, var(--background) 100%)" }} />
      </div>

      {/* The orbit — a tilted ring in 3D, the count at its centre (inside
          the 3D scene, so cards pass in front of it and behind it). */}
      <div className="wo-stage">
        <div className="wo-ring">
          <div data-count className="wo-count flex flex-col items-center justify-center text-center">
            {/* tabular-nums keeps the width steady while the digits tick */}
            <span
              ref={num}
              className="text-[clamp(3rem,10vw,8rem)] font-medium leading-none tracking-[-0.04em] text-foreground tabular-nums"
            >
              {countLabel}
            </span>
            <span className="mt-2 text-[clamp(0.7rem,1.3vw,1rem)] font-medium uppercase tracking-[0.14em] text-muted sm:mt-3">
              {caption}
            </span>
          </div>

          {cards.map((c, i) => (
            <div key={i} data-orbit-slot className="wo-slot" style={{ ["--lift" as string]: `${LIFTS[i % LIFTS.length]}px` }}>
              <Link
                href={c.href}
                aria-label={`${c.title} — ${c.sub}`}
                className="wo-card"
                style={{
                  animationDuration: `${ORBIT_SECONDS}s`,
                  animationDelay: `${(-i / cards.length) * ORBIT_SECONDS}s`,
                }}
              >
                <PlayerCard c={c} i={i} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** One glass player card: the studio mark, the still with title + artist,
 *  a progress line, and the transport row (decorative — the card is a link). */
function PlayerCard({ c, i }: { c: OrbitCard; i: number }) {
  // A different point in each "track", so the cards don't look cloned.
  const through = `${18 + ((i * 37) % 64)}%`;
  return (
    <>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-white/90">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/triptych-logo.png" alt="" className="h-2.5 w-auto" />
        Triptych
      </span>
      <span className="mt-3 flex items-center gap-3">
        <span
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] sm:h-16 sm:w-16"
          style={{ background: `radial-gradient(circle at 30% 25%, hsl(${c.hue} 92% 66%), hsl(${(c.hue + 38) % 360} 85% 48%) 55%, hsl(${(c.hue + 70) % 360} 80% 28%))` }}
        >
          {c.thumb && <Thumb src={c.thumb} fallback={c.thumbFallback} />}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium leading-tight text-white">{c.title}</span>
          <span className="mt-1 block truncate text-[12px] text-white/65">{c.sub}</span>
        </span>
      </span>
      <span aria-hidden className="relative mt-4 block h-[3px] rounded-full bg-white/25">
        <span className="absolute inset-y-0 left-0 rounded-full bg-white/90" style={{ width: through }} />
        <span className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: through }} />
      </span>
      <span aria-hidden className="mt-3 flex items-center justify-between text-white/90">
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h3l7 8h4M1 11h3l2-2.3M9.5 5.3 11 3h4M13 1l2 2-2 2M13 9l2 2-2 2" /></svg>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1.5" width="2" height="11" rx="0.8" /><path d="M13 1.5v11L4.5 7z" /></svg>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#141414] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]">
          <svg width="12" height="13" viewBox="0 0 12 13" fill="currentColor"><path d="M2 1v11l9.5-5.5z" /></svg>
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M1 1.5v11L9.5 7z" /><rect x="11" y="1.5" width="2" height="11" rx="0.8" /></svg>
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6V5a2 2 0 0 1 2-2h9M11 1l2 2-2 2M14 8v1a2 2 0 0 1-2 2H3M5 13l-2-2 2-2" /></svg>
      </span>
    </>
  );
}
