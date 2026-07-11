import Reveal from "@/components/Reveal";
import RuleLabel from "@/components/RuleLabel";
import { awards, awardsStatement } from "@/lib/about";

/** Left statement, right "Selected Awards / Year" table. */
export default function AboutAwards() {
  return (
    <section id="awards" className="px-5 pt-32 sm:px-8 sm:pt-44">
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
        {/* Left: label + statement */}
        <Reveal>
          <RuleLabel>Awards</RuleLabel>
          <h2 className="mt-8 max-w-xl text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-tight tracking-tight text-foreground">
            {awardsStatement}
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
