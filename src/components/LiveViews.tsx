"use client";

import { useEffect, useRef, useState } from "react";
import { LIVE_VIEWS } from "@/lib/stats";

type Source = { base: number; perDay: number; at: number; live: boolean; videos?: number };

const fallback = (): Source => ({
  base: LIVE_VIEWS.FALLBACK_BASE,
  perDay: LIVE_VIEWS.FALLBACK_PER_DAY,
  at: Date.parse(LIVE_VIEWS.FALLBACK_SINCE),
  live: false,
});

const fmt = new Intl.NumberFormat("en-US");

/**
 * The view counter under "Global Impact": a big odometer whose digits roll
 * into place when it comes on screen, then keep ticking. Numbers come from
 * /api/views (real YouTube counts, refreshed hourly) — see lib/stats.ts.
 * It runs a little behind the real total and catches up over the month
 * (LIVE_VIEWS.leeway), so it's always climbing and never ahead.
 */
export default function LiveViews() {
  const wrap = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<Source | null>(null);
  const [value, setValue] = useState<number | null>(null);

  // Ask for the numbers once the counter is near the screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch("/api/views")
          .then((r) => r.json())
          .then((d) =>
            setSrc(d.live ? { base: d.total, perDay: d.perDay, at: d.at, live: true, videos: d.videos } : fallback())
          )
          .catch(() => setSrc(fallback()));
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tick: the last count plus the views since, at the current pace — less
  // the month's leeway, which shrinks to nothing by the month's end.
  useEffect(() => {
    if (!src) return;
    const tick = () => {
      const now = Date.now();
      const real = src.base + (src.perDay * (now - src.at)) / 864e5;
      const d = new Date(now);
      const start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
      const end = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
      const left = 1 - (now - start) / (end - start);
      setValue(Math.floor(real * (1 - LIVE_VIEWS.leeway * left)));
    };
    const first = requestAnimationFrame(tick);
    const id = setInterval(tick, 500); // EDIT: how often it updates (ms)
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
    };
  }, [src]);

  // Before the numbers arrive, every digit sits on 0 — then rolls up.
  const text = fmt.format(value ?? LIVE_VIEWS.FALLBACK_BASE);
  const chars = text.split("");

  return (
    <div ref={wrap} className="flex flex-col items-center">
      <p className="sr-only">{value ? `${fmt.format(value)} views` : "Over 190 million views"}</p>
      {/* EDIT: the number's size: fills a phone's width, capped at 7rem on bigger screens */}
      <div
        aria-hidden
        className="flex text-[clamp(2.5rem,14.5vw,7rem)] font-medium leading-none tracking-[-0.04em] tabular-nums"
      >
        {chars.map((c, i) => {
          const key = chars.length - i; // keyed from the right, so new digits slot in on the left
          if (!/\d/.test(c)) {
            return (
              <span key={`s${key}`} className="inline-block h-[1em]">
                {c}
              </span>
            );
          }
          const d = value === null ? 0 : Number(c);
          return (
            <span key={key} className="inline-block h-[1em] overflow-hidden">
              <span
                className="block transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(-${d * 10}%)`, transitionDelay: value === null ? "0ms" : `${i * 35}ms` }}
              >
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n} className="block h-[1em]">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-[15px] text-muted">
        {src?.live ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live views on YouTube{src.videos ? ` · ${src.videos} videos` : ""}
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-accent" />
            Views and counting
          </>
        )}
      </p>
    </div>
  );
}
