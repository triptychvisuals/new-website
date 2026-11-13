import Link from "next/link";
import HeroReel from "@/components/HeroReel";

// EDIT: the pills under the headline — quick ways into the site.
const PILLS = [
  { label: "See the work", href: "/projects" },
  { label: "Who we are", href: "/who-we-are" },
  { label: "Services", href: "/services" },
  { label: "Press", href: "/press" },
  { label: "Store", href: "/store" },
];

/**
 * The hero: the reel full-bleed across the top of the page, under the
 * see-through header, with the tagline and a row of pills in the middle —
 * in the spirit of a landing page that opens on one question and a few
 * ways in. The footage fades into the page at the bottom. Type is always
 * white here (the footage is dark), whatever the page's theme.
 */
export default function HeroStudio({
  // EDIT: authored tagline — the portal's tagline replaces it when set.
  tagline = "Imagination in Motion",
}: {
  tagline?: string;
}) {
  return (
    // EDIT: the hero's height — most of the first screen
    <section className="relative isolate flex h-[78svh] min-h-[520px] items-center justify-center overflow-hidden bg-black text-white lg:h-[88svh]">
      {/* The reel (clips cycle every few seconds — EDIT clips in HeroReel) */}
      <HeroReel />
      {/* Shade: darker at the top for the header, a dim middle for the
          headline, and a fade into the page at the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 22%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.55) 82%, var(--background) 100%)",
        }}
      />

      <div className="relative flex w-full max-w-[920px] flex-col items-center px-5 text-center">
        {/* EDIT: the headline size */}
        <h1 className="text-[clamp(2.25rem,5.2vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">{tagline}</h1>
        <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-white/75 sm:text-[18px]">
          {/* EDIT: the line under the headline */}
          Music videos, commercials and brand films from Chicago since 2016.
        </p>
        <nav aria-label="Quick links" className="mt-8 flex flex-wrap justify-center gap-2.5">
          {PILLS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-full border border-white/30 bg-black/25 px-4 py-2 text-[14px] font-medium text-white/90 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white sm:px-5 sm:py-2.5 sm:text-[15px]"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
