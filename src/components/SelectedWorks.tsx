import Link from "next/link";

// EDIT: featured-work band copy ------------------------------------------------
const META_LEFT = "© All Rights Reserved";
const META_RIGHT = "Imagination in Motion"; // the tagline
const STATEMENT_1 =
  "Fusing cinematic craft, bold visual storytelling, and forward-thinking production. A signature look driven by the Triptych aesthetic.";
const STATEMENT_2_LEAD =
  "A modern approach to creative work — every frame executed with intent, continuously refined, and perfectly aligned with ";
const STATEMENT_2_ACCENT = "your story."; // accent-underlined tail
// ------------------------------------------------------------------------------

/**
 * Featured-work band — full-bleed black (no side margins): meta row, the
 * oversized "Featured© Work" line looping horizontally forever, then bold
 * uppercase statements with a vertical /WORK label and a SEE WORKS pill.
 */
export default function SelectedWorks() {
  return (
    <section aria-label="Featured work" className="mt-2 bg-[#0e0e10] text-white">
      {/* Meta row */}
      <div className="flex items-center justify-between gap-3 px-5 pt-6 text-[10px] font-bold uppercase tracking-[0.08em] sm:px-8 sm:text-[12px]">
        <span>{META_LEFT}</span>
        <span className="text-white/80">{META_RIGHT}</span>
      </div>

      {/* Endless title marquee between hairlines */}
      <div className="mt-5 overflow-hidden border-y border-white/15">
        <div className="flex w-max animate-marquee-l">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              aria-hidden={i > 0}
              className="whitespace-nowrap pr-[7vw] text-[13vw] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[11.5vw]"
            >
              Featured
              <span aria-hidden className="align-[0.12em] text-[0.62em]">
                ©
              </span>{" "}
              Work
            </span>
          ))}
        </div>
      </div>

      {/* Bold uppercase statements + vertical label */}
      <div className="relative px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
        {/* Crosshair accents */}
        <span aria-hidden className="absolute right-6 top-8 text-2xl font-extralight text-[color:var(--accent)]">
          +
        </span>
        <span aria-hidden className="absolute bottom-8 left-5 text-2xl font-extralight text-[color:var(--accent)] sm:left-8">
          +
        </span>

        {/* Vertical section label */}
        <span
          aria-hidden
          className="absolute right-2 top-1/2 -translate-y-1/2 rotate-180 text-[clamp(2.5rem,7vw,4.5rem)] font-bold uppercase leading-none tracking-tight [writing-mode:vertical-rl] sm:right-5"
        >
          /Work
        </span>

        <div className="max-w-2xl pr-16 sm:pr-24">
          <p className="text-[clamp(1.05rem,2.2vw,1.6rem)] font-bold uppercase leading-[1.35] tracking-tight">
            {STATEMENT_1}
          </p>
          <p className="mt-8 text-[clamp(1.05rem,2.2vw,1.6rem)] font-bold uppercase leading-[1.35] tracking-tight sm:mt-10">
            {STATEMENT_2_LEAD}
            <span className="text-[color:var(--accent)] underline decoration-2 underline-offset-4">
              {STATEMENT_2_ACCENT}
            </span>
          </p>

          <Link
            href="/projects"
            className="mt-9 inline-flex items-center rounded-full border-2 border-white px-7 py-3 text-[15px] font-bold uppercase tracking-tight transition-colors hover:bg-white hover:text-black sm:mt-11"
          >
            See Works
          </Link>
        </div>
      </div>
    </section>
  );
}
