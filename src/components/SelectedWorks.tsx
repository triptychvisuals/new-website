import Link from "next/link";

/**
 * Featured-work title band — black inset panel (matching the hero + partner
 * card): meta row between hairlines, an oversized "Featured© Work" line, then
 * an intro blurb with a SEE WORKS pill into /projects.
 */
export default function SelectedWorks() {
  return (
    <section aria-label="Featured work" className="px-2 pt-2 sm:px-3">
      <div className="rounded-[26px] bg-[#0e0e10] px-5 pb-10 pt-5 text-white sm:px-8 sm:pb-14 sm:pt-6">
        {/* Meta row — EDIT: the three labels */}
        <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4 text-[9px] font-medium uppercase tracking-[0.08em] sm:text-[12px]">
          <span>
            © Featured Projects{" "}
            {/* EDIT: katakana accent from the reference — delete if unwanted */}
            <span aria-hidden className="text-white/50">
              プロジェクト
            </span>
          </span>
          <span className="hidden text-white/50 md:block">(Triptych® — 001)</span>
          <span className="text-white/80">Creative Development</span>
        </div>

        {/* Giant line between the hairlines */}
        <h2 className="whitespace-nowrap py-[1.5vw] text-center text-[11.5vw] font-medium leading-[1.02] tracking-[-0.04em]">
          Featured
          <span aria-hidden className="align-[0.12em] text-[0.62em]">
            ©
          </span>{" "}
          Work
        </h2>

        <div className="border-t border-white/15" />

        {/* Blurb + CTA */}
        <div className="mt-8 max-w-xl sm:mt-12">
          {/* EDIT: featured-work intro copy */}
          <p className="text-[15px] leading-relaxed text-white/70 sm:text-lg">
            Every project is a chance to blend cinematography and story, shaping
            bold ideas into{" "}
            <strong className="font-semibold text-white">
              striking cinematic visuals
            </strong>{" "}
            — <strong className="font-semibold text-white">built with</strong>{" "}
            intent, rhythm, and visual clarity that moves people.
          </p>
          <Link
            href="/projects"
            className="mt-7 inline-flex items-center rounded-full border-2 border-white px-7 py-3 text-[15px] font-bold uppercase tracking-tight transition-colors hover:bg-white hover:text-black sm:mt-9"
          >
            See Works
          </Link>
        </div>
      </div>
    </section>
  );
}
