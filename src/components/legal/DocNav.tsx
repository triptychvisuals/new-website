"use client";

import { useEffect, useState } from "react";

/**
 * Section nav for a long document: lists the sections, marks the one
 * you're reading (IntersectionObserver — no scroll listener). Sticky beside
 * the text on wide screens, a scrolling row of chips above it on phones.
 */
export default function DocNav({ sections }: { sections: { id: string; heading: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        // The topmost section that's inside the reading band wins.
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Sections" className="lg:sticky lg:top-24">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Contents</p>
      <ol className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
        {sections.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={`flex items-baseline gap-3 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] transition-colors lg:rounded-none lg:border-0 lg:border-l-2 lg:px-4 lg:py-2 ${
                  on
                    ? "border-foreground bg-foreground text-background lg:bg-transparent lg:text-foreground lg:border-accent"
                    : "border-hairline text-foreground/60 hover:text-foreground lg:border-hairline"
                }`}
              >
                <span className="font-mono text-[10px] tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
