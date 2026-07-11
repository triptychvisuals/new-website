import BracketBox from "@/components/BracketBox";
import { site } from "@/lib/site";
import { cta, aboutGradient } from "@/lib/about";

/** Full-bleed black closing section with the big invitation + CONTACT. */
export default function AboutCTA() {
  return (
    <section className="relative mt-32 overflow-hidden bg-[#050505] text-white sm:mt-44">
      {/* Collage of stills, bottom-right — EDIT: swap gradients for real frames */}
      <div className="pointer-events-none absolute bottom-0 right-0 hidden items-end gap-2 opacity-90 md:flex">
        <div
          className="h-52 w-72 translate-y-8"
          style={{ background: aboutGradient(2) }}
        />
        <div
          className="h-64 w-80"
          style={{ background: aboutGradient(4) }}
        />
        <div
          className="h-44 w-40 translate-y-4"
          style={{ background: aboutGradient(0) }}
        />
      </div>

      <div className="relative z-10 px-5 py-32 sm:px-8 sm:py-44">
        <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-medium leading-[0.9] tracking-[-0.03em]">
          {cta.lead}
        </h2>
        <p className="mt-8 max-w-xl font-mono text-[12px] uppercase leading-relaxed tracking-wide text-white/60">
          {cta.body}
        </p>
        <a href={`mailto:${site.email}`} className="inline-block">
          <BracketBox
            light
            className="mt-12 flex w-56 items-center justify-between px-4 py-3.5"
          >
            <span className="font-mono text-xs uppercase tracking-[0.15em]">
              Contact
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </BracketBox>
        </a>
      </div>
    </section>
  );
}
