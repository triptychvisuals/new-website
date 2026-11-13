"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { placeholderGradient } from "@/lib/projects";
import { mergeCards, type CardData } from "@/lib/cards";
import type { PortalWork } from "@/lib/siteContent";
import VideoGearIcon from "./VideoGearIcon";

type View = "grid" | "list";

/**
 * The full project index, in the flat house style: a big lead card for
 * the newest project, a sticky bar with the category filters and a
 * grid / list switch, then the projects — rounded pictures with the name
 * underneath (grid) or a plain index of rows (list).
 */
export default function ProjectsGrid({ works = [] }: { works?: PortalWork[] }) {
  const root = useRef<HTMLDivElement>(null);
  const all = useMemo(() => mergeCards(works), [works]);

  // EDIT: filter pills — derived from the categories in use, "All" first.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(all.map((c) => c.project.category)))],
    [all]
  );
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<View>("grid");

  const filtered = filter === "All" ? all : all.filter((c) => c.project.category === filter);
  // The newest project with a picture leads the unfiltered grid.
  const lead = filter === "All" && view === "grid" ? filtered.find((c) => c.media) : undefined;
  const rest = lead ? filtered.filter((c) => c !== lead) : filtered;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-card]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.5,
        ease: "power2.out",
        stagger: { each: 0.025, from: "start" },
        clearProps: "all",
      });
    }, root);
    return () => ctx.revert();
  }, [filter, view]);

  return (
    <div ref={root}>
      {lead && <LeadCard card={lead} />}

      {/* Filters + view switch — sticks under the header while you browse */}
      <div className="sticky top-14 z-30 -mx-5 mt-14 border-b border-hairline bg-background/95 px-5 backdrop-blur lg:top-16 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4 py-3">
          <div className="-my-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
            {/* With a single category there's nothing to filter by. */}
            {categories.length > 2 && categories.map((cat) => {
              const active = cat === filter;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={active}
                  className={`h-9 shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors ${
                    active
                      ? "bg-foreground text-background"
                      : "bg-foreground/[0.06] text-foreground/75 hover:bg-foreground/[0.12] hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <span className="hidden shrink-0 text-[14px] text-muted md:block">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          </span>
          <div className="flex shrink-0 rounded-full bg-foreground/[0.06] p-1" role="group" aria-label="View">
            {(["grid", "list"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                aria-label={v === "grid" ? "Grid view" : "List view"}
                className={`grid h-7 w-8 place-items-center rounded-full transition-colors ${
                  view === v ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {v === "grid" ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                    <rect x="0" y="0" width="6" height="6" rx="1.5" />
                    <rect x="8" y="0" width="6" height="6" rx="1.5" />
                    <rect x="0" y="8" width="6" height="6" rx="1.5" />
                    <rect x="8" y="8" width="6" height="6" rx="1.5" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                    <rect x="0" y="1" width="14" height="2" rx="1" />
                    <rect x="0" y="6" width="14" height="2" rx="1" />
                    <rect x="0" y="11" width="14" height="2" rx="1" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 pt-10 sm:grid-cols-2 sm:pt-12 xl:grid-cols-3">
          {rest.map((c) => (
            <GridCard key={c.project.slug} card={c} />
          ))}
        </div>
      ) : (
        <ol className="pt-4">
          {rest.map((c) => (
            <ListRow key={c.project.slug} card={c} />
          ))}
        </ol>
      )}

      {filtered.length === 0 && <p className="py-20 text-center text-muted">Nothing here yet.</p>}
    </div>
  );
}

const hrefOf = (c: CardData) => c.href || `/work/${c.project.slug}`;
const isVideo = (src?: string) => !!src && /\.(mp4|webm)(\?.*)?$/i.test(src);

/** The picture for a card: a still, a reel that plays on hover, or a colour poster. */
function Media({ card, sizes = "" }: { card: CardData; sizes?: string }) {
  const { project, index, media } = card;
  const reel = project.video ?? media;
  const fit = project.objectPosition ? { objectPosition: project.objectPosition } : undefined;
  const cls = `absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${sizes}`;
  return (
    <>
      <div className="absolute inset-0" style={{ background: placeholderGradient(index) }} />
      {!reel && (
        <VideoGearIcon index={index} className="absolute left-1/2 top-1/2 h-[42%] w-auto -translate-x-1/2 -translate-y-1/2 text-white/75" />
      )}
      {reel &&
        (isVideo(reel) ? (
          <video
            src={reel}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            style={fit}
            className={cls}
            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
            onMouseLeave={(e) => e.currentTarget.pause()}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={reel} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" style={fit} className={cls} />
        ))}
    </>
  );
}

function LeadCard({ card }: { card: CardData }) {
  const { project } = card;
  return (
    <Link href={hrefOf(card)} data-card className="group relative block overflow-hidden rounded-[20px] bg-surface">
      <div className="relative aspect-[4/5] sm:aspect-[21/9]">
        <Media card={card} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div>
            <p className="text-[14px] text-white/75">
              Latest · {project.category}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <h2 className="mt-2 text-[clamp(2.25rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-[-0.035em]">{project.title}</h2>
            {project.artist && <p className="mt-3 text-[17px] text-white/85 sm:text-[20px]">{project.artist}</p>}
          </div>
          <span className="inline-flex h-11 shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-5 text-[15px] font-medium text-black sm:self-auto">
            Watch <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function GridCard({ card }: { card: CardData }) {
  const { project } = card;
  return (
    <Link href={hrefOf(card)} data-card className="group block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] bg-surface">
        <Media card={card} />
      </div>
      <h3 className="mt-4 text-[18px] font-medium leading-snug tracking-[-0.01em] text-foreground">
        {project.title}
      </h3>
      <p className="mt-1 text-[14px] text-muted">
        {[project.artist, project.category, project.year].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}

function ListRow({ card }: { card: CardData }) {
  const { project } = card;
  return (
    <li data-card className="border-b border-hairline">
      <Link
        href={hrefOf(card)}
        className="group grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-4 py-4 sm:grid-cols-[120px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_60px_24px] sm:gap-6"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-[10px] bg-surface">
          <Media card={card} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[17px] font-medium tracking-[-0.01em]">{project.title}</p>
          <p className="truncate text-[14px] text-muted sm:hidden">
            {[project.artist, project.year].filter(Boolean).join(" · ")}
          </p>
        </div>
        <p className="hidden truncate text-[15px] text-muted sm:block">{project.artist ?? "—"}</p>
        <p className="hidden truncate text-[15px] text-muted sm:block">{project.category}</p>
        <p className="hidden text-[15px] tabular-nums text-muted sm:block">{project.year}</p>
        <span aria-hidden className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-foreground">
          →
        </span>
      </Link>
    </li>
  );
}
