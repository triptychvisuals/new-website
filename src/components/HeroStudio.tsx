import Link from "next/link";
import HeroReel from "@/components/HeroReel";
import { features } from "@/lib/press";

// EDIT: the quick links in the strip under the video.
const PILLS = [
  { label: "See the work", href: "/projects" },
  { label: "Who we are", href: "/who-we-are" },
  { label: "Services", href: "/services" },
  { label: "Press", href: "/press" },
  { label: "Store", href: "/store" },
];

// EDIT: the press feature linked under the tagline — the first feature in
// lib/press.ts (the Chicago Reader profile).
const PRESS_FEATURE = features[0];

/**
 * The hero: the reel full-bleed across the top of the page, under the
 * see-through header, with nothing on top of it. The footage fades into
 * the page at the bottom, and a quiet strip under it carries the tagline
 * and a few text links.
 */
export default function HeroStudio({
  // EDIT: authored tagline — the portal's tagline replaces it when set.
  tagline = "Imagination in Motion",
}: {
  tagline?: string;
}) {
  return (
    <>
    {/* EDIT: the hero's height — most of the first screen */}
    <section className="relative isolate flex h-[78svh] min-h-[520px] items-center justify-center overflow-hidden bg-black text-white lg:h-[88svh]" aria-label="Showreel">
      {/* The reel (clips cycle every few seconds — EDIT clips in HeroReel) */}
      <HeroReel />
      {/* Shade: darker at the top for the header, a dim middle for the
          headline, and a fade into the page at the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, var(--background) 100%)",
        }}
      />

      {/* The video carries the hero on its own; the tagline and the ways in
          sit in a quiet strip under it (below). The h1 stays for search. */}
    </section>

    {/* Under the video: the tagline small on the left, the ways in as
        plain text links on the right. */}
    <section aria-label="Introduction" className="bg-background px-5 pb-10 pt-8 text-foreground lg:px-10">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {/* EDIT: the tagline size */}
          <h1 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-tight tracking-[-0.02em]">{tagline}</h1>
          <p className="mt-1.5 text-[15px] text-muted sm:text-[16px]">
            {/* EDIT: the line under the tagline */}
            Music videos, commercials and brand films from Chicago since 2016.
          </p>
          {/* Press feature (EDIT: PRESS_FEATURE above) */}
          {PRESS_FEATURE && (
          <a
            href={PRESS_FEATURE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 inline-flex max-w-full items-center gap-3 rounded-full bg-foreground/[0.06] py-1.5 pl-1.5 pr-4 text-[14px] transition-colors hover:bg-foreground/[0.12]"
          >
            <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
              {PRESS_FEATURE.outlet}
            </span>
            <span className="truncate text-foreground/85 group-hover:text-foreground">{PRESS_FEATURE.series}: {PRESS_FEATURE.title}</span>
            <span aria-hidden className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
          )}
        </div>
        <nav aria-label="Quick links" className="flex flex-wrap gap-x-6 gap-y-2">
          {PILLS.map((p) => (
            <Link key={p.href} href={p.href} className="text-[15px] text-muted transition-colors hover:text-foreground">
              {p.label} <span aria-hidden>→</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
    </>
  );
}
