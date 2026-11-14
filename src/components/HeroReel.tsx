"use client";

import { useEffect, useRef } from "react";
import { HERO_CLIPS } from "@/lib/heroClips";
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
 */
export default function HeroReel() {
  const box = useRef<HTMLDivElement>(null);
  const one = useRef<HTMLVideoElement>(null);
  const two = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = one.current;
    const b = two.current;
    const root = box.current;
    if (!a || !b || !root || HERO_CLIPS.length < 2) return;
    const els = [a, b];
    const phone = window.matchMedia(`(max-width: ${PHONE_MAX}px)`).matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The first shot is fixed (it's in the page's HTML so it starts at once);
    // the rest are shuffled for this visit.
    const rest = HERO_CLIPS.map((_, i) => i).slice(1);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const order = [0, ...rest];
    const srcAt = (k: number) => {
      const c = HERO_CLIPS[order[k % order.length]];
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

  const first = HERO_CLIPS[0];
  const layer = "absolute inset-0 h-full w-full object-cover transition-opacity ease-out motion-reduce:transition-none";

  return (
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
  );
}
