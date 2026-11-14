"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HERO_CLIPS, HERO_FEATURED, HERO_OPENING, type HeroClip } from "@/lib/heroClips";
import { projects } from "@/lib/projects";
import { SLUG_ALIASES } from "@/lib/previews";
import { PHONE_MAX } from "@/lib/video";

// EDIT: how long the crossfade between shots takes (ms).
const FADE_MS = 700;

/**
 * The hero reel: approved shots from the studio's work (lib/heroClips.ts),
 * played one after another in a new random order on every visit.
 *
 * Two video elements take turns: one plays while the other quietly loads
 * the next shot, then they crossfade — so only two shots are ever in
 * memory, however long the list. Phones get lighter 720p copies. Nothing
 * plays while the hero is off screen.
 *
 * Bottom-left, a label names the video the shot on screen is from (and
 * links to it); it changes as the reel moves on to another video.
 */
export default function HeroReel() {
  const first = HERO_OPENING[0] ?? HERO_CLIPS[0];
  const [playing, setPlaying] = useState<string | undefined>(first?.project);
  const box = useRef<HTMLDivElement>(null);
  const one = useRef<HTMLVideoElement>(null);
  const two = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = one.current;
    const b = two.current;
    const root = box.current;
    if (!a || !b || !root) return;
    const els = [a, b];
    const phone = window.matchMedia(`(max-width: ${PHONE_MAX}px)`).matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The opening plays first, in order (its first shot is in the page's
    // HTML so it starts at once); then the rest, shuffled for this visit,
    // with the featured shots dropped in at their places.
    const rest: HeroClip[] = [...HERO_CLIPS];
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    [...HERO_FEATURED].sort((x, y) => x.at - y.at).forEach((f) => rest.splice(Math.min(f.at, rest.length), 0, f.clip));
    const order = [...HERO_OPENING, ...rest];
    if (order.length < 2) return;
    const srcAt = (k: number) => {
      const c = order[k % order.length];
      return phone ? c.phone : c.src;
    };

    let front = 0; // which element is showing
    let pos = 0; // where we are in `order`
    let onScreen = true;
    let alive = true;
    const timers: number[] = [];

    const prime = (el: HTMLVideoElement, k: number) => {
      el.src = srcAt(k);
      el.load();
    };
    prime(b, 1);

    const advance = () => {
      if (!alive) return;
      const cur = els[front];
      const next = els[1 - front];
      next.currentTime = 0;
      if (onScreen) next.play().catch(() => {});
      next.style.opacity = "1";
      cur.style.opacity = "0";
      front = 1 - front;
      pos += 1;
      setPlaying(order[pos % order.length].project);
      // once it has faded out, the old one loads the shot after next
      timers.push(window.setTimeout(() => {
        cur.pause();
        prime(cur, pos + 1);
      }, reduced ? 0 : FADE_MS + 50));
    };

    const onEnded = (e: Event) => {
      if (e.target === els[front]) advance();
    };
    // a shot that won't load is skipped
    const onError = (e: Event) => {
      const el = e.target as HTMLVideoElement;
      if (el !== els[front]) {
        pos += 1;
        prime(el, pos + 1);
      } else advance();
    };
    for (const el of els) {
      el.addEventListener("ended", onEnded);
      el.addEventListener("error", onError);
    }

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      const v = els[front];
      if (onScreen) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(root);

    return () => {
      alive = false;
      io.disconnect();
      timers.forEach(clearTimeout);
      for (const el of els) {
        el.removeEventListener("ended", onEnded);
        el.removeEventListener("error", onError);
      }
    };
  }, []);

  const now = playing ? projects.find((p) => p.slug === playing) : undefined;
  const layer = "absolute inset-0 h-full w-full object-cover transition-opacity ease-out motion-reduce:transition-none";

  return (
    <>
    <div ref={box} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black">
      <video
        ref={one}
        className={layer}
        style={{ opacity: 1, transitionDuration: `${FADE_MS}ms` }}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src={first.phone} type="video/mp4" media={`(max-width: ${PHONE_MAX}px)`} />
        <source src={first.src} type="video/mp4" />
      </video>
      <video
        ref={two}
        className={layer}
        style={{ opacity: 0, transitionDuration: `${FADE_MS}ms` }}
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
    </div>

    {/* What's playing — sits on the fade at the bottom, so it takes the
        page's text colour. EDIT: position and sizes. */}
    <div aria-live="polite" className="pointer-events-none absolute bottom-6 left-5 z-10 lg:bottom-10 lg:left-10">
      {now && (
        <Link
          key={now.slug}
          href={`/work/${SLUG_ALIASES[now.slug] ?? now.slug}`}
          className="hero-label group pointer-events-auto flex flex-col text-foreground"
        >
          <span className="font-mono text-[11px] text-foreground/55">Now playing</span>
          <span className="mt-1 text-[18px] font-medium leading-tight tracking-[-0.01em] sm:text-[22px]">
            {now.title} <span aria-hidden className="inline-block text-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </span>
          {now.artist && <span className="text-[14px] text-foreground/70 sm:text-[15px]">{now.artist}</span>}
        </Link>
      )}
    </div>
    </>
  );
}
