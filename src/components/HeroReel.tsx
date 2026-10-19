"use client";

import { useEffect, useRef, useState } from "react";

// EDIT: hero background clips. Drop your real files in /public/hero and list
// them here — they cycle horizontally every AUTO_MS. These are placeholders
// (existing clips) so the carousel is visibly working until you swap them.
const HERO_VIDEOS = [
  "/hero/hero.mp4",
  "/reels/reel-c.mp4",
  "/reels/reel-b.mp4",
  "/reels/reel-a.mp4",
];

// EDIT: auto-advance interval in milliseconds.
const AUTO_MS = 2500;

/**
 * Hero background reel gallery: a horizontal track of clips behind the hero
 * copy that slides every AUTO_MS, with no controls on top.
 *
 * Only the clip on screen plays — the others sit paused — and the whole
 * reel pauses once the hero scrolls out of view, so no video is decoding
 * while you scroll the rest of the page.
 */
export default function HeroReel() {
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(true);
  const track = useRef<HTMLDivElement>(null);
  const count = HERO_VIDEOS.length;

  // Is the hero on screen at all?
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play the active clip (while visible); keep every other clip paused.
  useEffect(() => {
    const vids = track.current?.querySelectorAll("video") ?? [];
    vids.forEach((v, i) => {
      if (onScreen && i === active) v.play().catch(() => {});
      else v.pause();
    });
    // Buffer the next clip ahead so it's ready when the track slides to it.
    const next = vids[(active + 1) % vids.length];
    if (next) next.preload = "auto";
  }, [active, onScreen]);

  // Ambient colour: a few times a second, shrink the playing frame to a
  // 16×9 canvas and average its left half, right half and the whole, then
  // hand those to the glow layer as --amb-l / --amb-r / --amb-c. The
  // glow round the panel (HeroStudio, .hero-ambient) eases between them,
  // so the area round the video follows what's on screen.
  useEffect(() => {
    const el = track.current;
    const host = el?.closest("section")?.querySelector<HTMLElement>(".hero-ambient");
    // The glow is hidden on phones — don't sample for nothing there.
    if (!el || !host || !onScreen || host.offsetParent === null) return;
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 9;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const avg = (d: Uint8ClampedArray, x0: number, x1: number) => {
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = 0; y < 9; y++)
        for (let x = x0; x < x1; x++) {
          const k = (y * 16 + x) * 4;
          r += d[k]; g += d[k + 1]; b += d[k + 2]; n++;
        }
      // Lift it: frames run dark, the glow should read as colour, not grey.
      const max = Math.max(r, g, b) / n || 1;
      const lift = Math.min(2.4, 200 / max);
      return [Math.round((r / n) * lift), Math.round((g / n) * lift), Math.round((b / n) * lift)];
    };
    // Only repaint the glow when the colour has really moved (the eased
    // transition repaints it, so small flickers are skipped).
    const last: Record<string, number[]> = {};
    const put = (name: string, c: number[]) => {
      const p = last[name];
      if (p && Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]) + Math.abs(p[2] - c[2]) < 36) return;
      last[name] = c;
      host.style.setProperty(name, `rgb(${c[0]} ${c[1]} ${c[2]})`);
    };
    const sample = () => {
      const v = el.querySelectorAll("video")[active];
      if (!v || v.readyState < 2) return;
      try {
        ctx.drawImage(v, 0, 0, 16, 9);
        const d = ctx.getImageData(0, 0, 16, 9).data;
        put("--amb-l", avg(d, 0, 8));
        put("--amb-r", avg(d, 8, 16));
        put("--amb-c", avg(d, 0, 16));
      } catch {
        // a cross-origin clip can't be read — the glow keeps its last colours
      }
    };
    sample();
    // EDIT: how often the glow re-reads the video (ms)
    const id = setInterval(sample, 800);
    return () => clearInterval(id);
  }, [active, onScreen]);

  // Advance when the clip's time is up.
  useEffect(() => {
    if (count <= 1 || !onScreen) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => clearTimeout(id);
  }, [count, onScreen, active]);


  return (
    <>
      {/* Clip track — one clip per slide, translated by the active index */}
      <div ref={track} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={`${src}-${i}`}
              className="h-full w-full shrink-0 object-cover"
              src={src}
              // First clip autoplays for an instant start; the effect above
              // takes over from there.
              autoPlay={i === 0}
              muted
              loop
              playsInline
              // Only the first clip is buffered up front; the effect above
              // readies the next one as each plays (keeps phone data + CPU down)
              preload={i === 0 ? "auto" : "metadata"}
              aria-hidden
            />
          ))}
        </div>
      </div>

    </>
  );
}

