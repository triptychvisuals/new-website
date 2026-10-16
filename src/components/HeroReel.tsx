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

// EDIT: the name shown in the glass control bar for each clip (same order).
const HERO_LABELS = ["Showreel", "Reel 02", "Reel 03", "Reel 04"];

// EDIT: auto-advance interval in milliseconds.
const AUTO_MS = 2500;

/**
 * Hero background reel gallery: a horizontal track of clips behind the hero
 * copy that slides every AUTO_MS, with small dots (one per clip) near the
 * bottom showing how many there are + which is active.
 *
 * Only the clip on screen plays — the others sit paused — and the whole
 * reel pauses once the hero scrolls out of view, so no video is decoding
 * while you scroll the rest of the page.
 */
export default function HeroReel() {
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(true);
  // Paused from the glass control bar: the clip stops and the reel holds.
  const [paused, setPaused] = useState(false);
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
      if (onScreen && !paused && i === active) v.play().catch(() => {});
      else v.pause();
    });
    // Buffer the next clip ahead so it's ready when the track slides to it.
    const next = vids[(active + 1) % vids.length];
    if (next) next.preload = "auto";
  }, [active, onScreen, paused]);

  // Advance when the clip's time is up. A timeout restarted on every change
  // (not an interval), so stepping by hand gives the new clip its full time
  // and the progress line below always starts from empty.
  useEffect(() => {
    if (count <= 1 || !onScreen || paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => clearTimeout(id);
  }, [count, onScreen, paused, active]);

  const go = (step: number) => setActive((a) => (a + step + count) % count);

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
              preload={i <= 1 ? "auto" : "metadata"}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {/* Glass control bar — one long, slim pill across the bottom:
          prev / play-pause / next and the clip's name on the left, the
          count and one dot per clip on the right.
          EDIT: max-w-[860px] = bar length. */}
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-3 sm:bottom-5 sm:px-6">
          <div className="glass-dark flex w-full max-w-[860px] items-center gap-0.5 rounded-full py-1 pl-1.5 pr-4 sm:gap-1 sm:pr-5">
            <GlassButton label="Previous clip" onClick={() => go(-1)}>
              <svg width="16" height="11" viewBox="0 0 20 14" fill="currentColor"><path d="M9 1v12L1 7zM19 1v12l-8-6z" /></svg>
            </GlassButton>
            <GlassButton label={paused ? "Play" : "Pause"} onClick={() => setPaused((p) => !p)}>
              {paused ? (
                <svg width="11" height="13" viewBox="0 0 14 16" fill="currentColor"><path d="M2 1.5v13l11-6.5z" /></svg>
              ) : (
                <svg width="11" height="13" viewBox="0 0 14 16" fill="currentColor"><rect x="1.5" y="1" width="4" height="14" rx="1.2" /><rect x="8.5" y="1" width="4" height="14" rx="1.2" /></svg>
              )}
            </GlassButton>
            <GlassButton label="Next clip" onClick={() => go(1)}>
              <svg width="16" height="11" viewBox="0 0 20 14" fill="currentColor"><path d="M1 1v12l8-6zM11 1v12l8-6z" /></svg>
            </GlassButton>

            <span className="ml-2 hidden shrink-0 text-[13px] font-medium leading-none sm:block">
              {HERO_LABELS[active] ?? `Reel ${active + 1}`}
            </span>
            <span className="flex-1" />
            <span className="hidden shrink-0 text-[12px] leading-none text-white/60 tabular-nums sm:block">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>

            <div className="ml-3 flex shrink-0 items-center gap-1.5 sm:ml-4">
              {HERO_VIDEOS.map((src, i) => (
                <button
                  key={`dot-${src}-${i}`}
                  type="button"
                  aria-label={`Hero clip ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** A round glass button in the hero's control bar. */
function GlassButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full text-white transition-[background-color,transform] duration-200 hover:bg-white/15 active:scale-90 sm:h-9 sm:w-9"
    >
      {children}
    </button>
  );
}
