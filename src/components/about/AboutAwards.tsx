import Reveal from "@/components/Reveal";
import RuleLabel from "@/components/RuleLabel";
import { awards } from "@/lib/about";

/** Left: giant "Awards (N)" headline. Right: "Selected Awards / Year" table. */
export default function AboutAwards() {
  return (
    <section id="awards" className="px-5 pt-32 sm:px-8 sm:pt-44">
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
        {/* Left: label + oversized count headline */}
        <Reveal>
          <RuleLabel>Selected Honors</RuleLabel>
          <h2 className="mt-8 text-[clamp(3.25rem,10vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-foreground">
            Awards
            <sup className="ml-[0.15em] align-[1em] text-[0.26em] font-normal tracking-normal text-muted">
              ({awards.length})
            </sup>
          </h2>
        </Reveal>

        {/* Right: table */}
        <Reveal delay={0.05}>
          <div className="flex items-center justify-between border-b border-hairline pb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            <span>Selected Awards</span>
            <span>Year</span>
          </div>
          <ul>
            {awards.map((a) => (
              <li
                key={`${a.name}-${a.year}`}
                className="flex items-baseline justify-between gap-4 py-1.5 text-[15px] text-foreground/70"
              >
                <span>{a.name}</span>
                <span className="shrink-0 tabular-nums text-muted">{a.year}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
