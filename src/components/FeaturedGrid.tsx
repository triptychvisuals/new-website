"use client";

import Link from "next/link";
import { useState } from "react";

export type FeaturedCard = {
  href: string;
  title: string;
  /** Artist · year */
  meta: string;
  /** A still (YouTube) — preferred. */
  image?: string;
  fallback?: string;
  /** Else a local clip, played while hovered. */
  video?: string;
  /** Behind everything while loading, or when there's neither. */
  gradient: string;
};
export type FeaturedTab = { label: string; cards: FeaturedCard[] };

/**
 * Featured Work's grid: tabs along the top (each a set of projects), and
 * the set as rounded cards — picture, then the title and artist · year
 * underneath. Clips play only while the pointer is over their card.
 */
export default function FeaturedGrid({ tabs }: { tabs: FeaturedTab[] }) {
  const [tab, setTab] = useState(0);
  const cards = tabs[tab]?.cards ?? [];
  return (
    <>
      {/* Tabs */}
      <div role="tablist" aria-label="Featured work" className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            type="button"
            aria-selected={i === tab}
            onClick={() => setTab(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
              i === tab ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cards — keyed by tab so each set fades in */}
      <div key={tab} className="mt-8 grid gap-x-6 gap-y-10 [animation:pvfade_.4s_ease-out] sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]" style={{ background: c.gradient }}>
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (c.fallback && e.currentTarget.src !== c.fallback) e.currentTarget.src = c.fallback;
                  }}
                  // a YouTube SD still is 4:3 with the 16:9 frame letterboxed; the zoom crops the bars
                  className="absolute inset-0 h-full w-full scale-[1.34] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.4]"
                />
              ) : c.video ? (
                <video
                  src={c.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                  onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : null}
            </div>
            <p className="mt-4 text-[18px] font-medium leading-snug tracking-[-0.01em] text-foreground">{c.title}</p>
            <p className="mt-1 text-[14px] text-muted">{c.meta}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
