import Reveal from "@/components/Reveal";
import { founded, timeline, aboutGradient } from "@/lib/about";

/** Featured still, two-tone "…was founded." statement, then the timeline. */
export default function AboutFounded() {
  return (
    <section className="px-5 pt-24 sm:px-8 sm:pt-32">
      {/* Featured still (top-right) — EDIT: swap gradient for a real image */}
      <div className="flex justify-end">
        <div
          className="aspect-video w-full max-w-md overflow-hidden"
          style={{ background: aboutGradient(0) }}
          aria-hidden
        />
      </div>

      {/* Two-tone statement */}
      <Reveal className="mt-16 max-w-5xl">
        <h2 className="text-[clamp(2.25rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
          <span className="text-muted">{founded.lead} </span>
          <span className="text-foreground">{founded.tail}</span>
        </h2>
      </Reveal>

      {/* Timeline */}
      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
        {timeline.map((item, i) => (
          <Reveal key={item.year} delay={i * 0.05}>
            <div
              className="aspect-[4/3] w-full overflow-hidden"
              style={{ background: aboutGradient(i + 1) }}
              aria-hidden
            />
            <p className="mt-5 text-2xl font-medium tracking-tight text-foreground">
              {item.year}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
              {item.title}
            </p>
            <p className="mt-3 font-mono text-[12px] uppercase leading-relaxed tracking-wide text-foreground/60">
              {item.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
