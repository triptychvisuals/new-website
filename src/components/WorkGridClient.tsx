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
 * The count in the middle, and liquid-glass thumbnails orbiting it on a
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

/** One orbiting card: just the video's thumbnail, set in a glass rim. */
function PlayerCard({ c }: { c: OrbitCard; i: number }) {
  return (
    <span
      className="relative block aspect-video w-full overflow-hidden rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
      style={{ background: `radial-gradient(circle at 30% 25%, hsl(${c.hue} 92% 66%), hsl(${(c.hue + 38) % 360} 85% 48%) 55%, hsl(${(c.hue + 70) % 360} 80% 28%))` }}
    >
      {c.thumb && <Thumb src={c.thumb} fallback={c.thumbFallback} />}
      {/* glass sheen across the picture */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_30%,rgba(255,255,255,0)_50%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" />
    </span>
  );
}
