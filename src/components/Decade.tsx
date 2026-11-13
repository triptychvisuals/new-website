"use client";

import { useEffect, useRef, useState } from "react";
import { decade } from "@/lib/about";
import { haptic } from "@/lib/haptics";

// EDIT: the section's heading copy
const LABEL = "Our story";
const HEADING = "Ten years of imagination in motion";

/** Same golden-angle hues as the rest of the site — one colour per year. */
const hueFor = (i: number) => Math.round((i * 137.508) % 360);

/**
 * The 2016 → 2026 timeline. Desktop: the current year huge in a sticky
 * column on the left, with a segmented progress bar and the chapter's
 * title under it; the years' stories run down the right, the one at the
 * middle of the screen lit and the rest dimmed. Phones: each story with its
 * year above it, lighting up as it reaches the middle. Every new year taps
 * on phones that allow it (lib/haptics). No 3D, no pinning — the page
 * scrolls normally and only opacity changes.
 */
export default function Decade() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const last = useRef(0);

  useEffect(() => {
    // A story is "now" while it crosses a thin band at the middle of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.i);
          if (i !== last.current) {
            haptic(i === decade.length - 1 ? "bump" : "tick");
            last.current = i;
            setActive(i);
          }
        }
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const d = decade[active];
  const first = decade[0].year;
  const final = decade[decade.length - 1].year;

  return (
    <section aria-label={`Ten years, ${first} to ${final}`} className="bg-background px-5 py-24 text-foreground sm:py-32 lg:px-10">
      <div className="mx-auto max-w-[1760px]">
        {/* Heading row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[15px] text-muted">{LABEL}</p>
            <h2 className="mt-4 max-w-[820px] text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.03em]">{HEADING}</h2>
          </div>
          <p className="text-[15px] text-muted tabular-nums">
            {first} — {final}
          </p>
        </div>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* Desktop: the sticky year */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <p
                key={d.year}
                aria-hidden
                className="tl-year text-[clamp(8rem,15vw,16rem)] font-medium leading-[0.85] tracking-[-0.05em] tabular-nums"
              >
                {d.year}
              </p>
              {/* One segment per year, filled up to now */}
              <div aria-hidden className="mt-10 flex max-w-[520px] gap-1.5">
                {decade.map((y, i) => (
                  <span
                    key={y.year}
                    className="h-1 flex-1 rounded-full transition-colors duration-500"
                    style={{ background: i <= active ? `hsl(${hueFor(i)} 80% 58%)` : "var(--hairline)" }}
                  />
                ))}
              </div>
              <p className="mt-5 text-[15px] text-muted">
                Chapter {String(active + 1).padStart(2, "0")} of {decade.length}
              </p>
              <p key={`t-${d.year}`} className="tl-year mt-1 text-[22px] font-medium tracking-[-0.01em]">
                {d.title}
              </p>
            </div>
          </div>

          {/* The stories */}
          <ol className="border-b border-hairline">
            {decade.map((y, i) => {
              const on = i === active;
              return (
                <li
                  key={y.year}
                  data-i={i}
                  ref={(el) => {
                    rows.current[i] = el;
                  }}
                  className={`border-t border-hairline py-10 transition-opacity duration-500 sm:py-14 ${on ? "opacity-100" : "opacity-35"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full transition-transform duration-500"
                      style={{ background: `hsl(${hueFor(i)} 80% 58%)`, transform: on ? "scale(1)" : "scale(0.6)" }}
                    />
                    {/* the year: large on phones (no sticky column), small on desktop */}
                    <span className="text-[44px] font-medium leading-none tracking-[-0.03em] tabular-nums lg:text-[15px] lg:font-normal lg:tracking-normal lg:text-muted">
                      {y.year}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em]">{y.title}</h3>
                  <p className="mt-3 max-w-[560px] text-[17px] leading-relaxed text-muted">{y.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
