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
    <section className="border-b border-dashed border-hairline bg-background px-2 py-2 sm:px-3 sm:py-3">
      {/* Panel — square on phones, 16:9 on desktop, capped wide.
          EDIT: rounded-[22px] = corner radius. */}
      <div className="relative isolate mx-auto flex aspect-square min-h-0 w-full max-w-[1760px] flex-col overflow-hidden rounded-[22px] bg-[#0e0e10] text-white shadow-[0_1px_0_rgba(255,255,255,0.06),0_18px_40px_-18px_rgba(0,0,0,0.55)] md:aspect-video">
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

        {/* Bottom band — kept empty so the carousel dots clear the frame edge. */}
        <div className="relative p-6 sm:p-8 md:p-10" />

        {/* Bevel — sits above the video: a hairline inner border, a lit top
            edge, and a soft inner shadow so the footage reads as set into a
            container. Inset shadows on the panel itself would be painted
            under the video, hence the overlay. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[22px]"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.35)",
          }}
        />
      </div>
    </section>
  );
}
