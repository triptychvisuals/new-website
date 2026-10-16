import Link from "next/link";
import HeroReel from "@/components/HeroReel";

/**
 * Dark "studio" hero panel — a rounded near-black video panel inset in the
 * page. Deliberately text-free: the reel carousel carries it, with only the
 * plus-mark crosshairs as decoration. Partner logos live in the card below.
 */

function Plus() {
  return (
    <span aria-hidden className="select-none text-3xl font-extralight leading-none text-white/25">
      +
    </span>
  );
}

export default function HeroStudio({
  // EDIT: authored tagline — the portal's tagline replaces it when set.
  tagline = "Imagination in Motion",
}: {
  tagline?: string;
}) {
  return (
    // Inset in a container: dashed rules above/below, a small gutter, and a
    // rounded, beveled panel (see the bevel overlay at the end).
    <section className="relative isolate overflow-hidden border-b border-dashed border-hairline bg-background px-2 py-2 sm:px-4 sm:py-4">
      {/* Ambient light behind the glass, so the frame has something to
          catch — soft colour pools, painted once (no blur filter). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // EDIT: ambient glow colours behind the hero glass
          background:
            "radial-gradient(40% 55% at 18% 85%, rgb(229 54 31 / 0.22), transparent 70%), radial-gradient(45% 55% at 85% 15%, rgb(120 140 255 / 0.16), transparent 70%)",
        }}
      />
      {/* Liquid-glass frame — the footage sits inset in a frosted slab.
          EDIT: p-2.5 / sm:p-3 = frame thickness. */}
      <div className="glass mx-auto w-full max-w-[1760px] rounded-[30px] p-2 sm:rounded-[36px] sm:p-3">
      {/* Panel — square on phones, 16:9 on desktop.
          EDIT: rounded-[22px] = corner radius. */}
      <div className="relative isolate flex aspect-square min-h-0 w-full flex-col overflow-hidden rounded-[22px] bg-[#0e0e10] text-white sm:rounded-[26px] md:aspect-video">
        {/* Background: horizontal reel carousel (clips cycle every 2.5s with
            dots), a legibility overlay, and film grain. EDIT clips in HeroReel. */}
        <HeroReel />
        {/* Darken top + bottom so the white text / card stay readable */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.24) 35%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.62) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* No visible text sits on the hero video. The page still needs one
            h1 for search engines / screen readers, so the tagline stays as
            screen-reader-only copy (and the portal can still drive it). */}
        <h1 className="sr-only">{tagline}</h1>
        <div className="flex-1" />

        {/* Plus-mark crosshairs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-[60%] hidden justify-between lg:flex"
        >
          <Plus />
          <Plus />
          <Plus />
          <Plus />
        </div>

        {/* Top-left glass chip — straight to the work. */}
        <Link
          href="/projects"
          className="glass-dark absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-transform duration-200 hover:scale-[1.03] sm:left-5 sm:top-5"
        >
          <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M7.5 1.5h3v3M4.5 10.5h-3v-3M10.5 1.5 7 5M1.5 10.5 5 7" />
          </svg>
          See the work
        </Link>

        {/* Bottom band — room for the glass control bar. */}
        <div className="relative p-6 sm:p-8 md:p-10" />

        {/* Bevel — sits above the video: a hairline inner border, a lit top
            edge, and a soft inner shadow so the footage reads as set into a
            container. Inset shadows on the panel itself would be painted
            under the video, hence the overlay. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[22px] sm:rounded-[26px]"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.35)",
          }}
        />
      </div>
      </div>
    </section>
  );
}
