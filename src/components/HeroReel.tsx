"use client";

import { useEffect, useState } from "react";

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
 * copy that slides every AUTO_MS, with small dots (one per clip) near the
 * bottom showing how many there are + which is active.
 */
export default function HeroReel() {
  const [active, setActive] = useState(0);
  const count = HERO_VIDEOS.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => clearInterval(id);
  }, [count]);

  return (
    <>
      {/* Clip track — one clip per slide, translated by the active index */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={`${src}-${i}`}
              className="h-full w-full shrink-0 object-cover"
              src={src}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {/* Dots — one per clip, centered near the bottom */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {HERO_VIDEOS.map((src, i) => (
            <button
              key={`dot-${src}-${i}`}
              type="button"
              aria-label={`Hero clip ${i + 1}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
