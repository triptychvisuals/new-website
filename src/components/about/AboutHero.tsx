import { site } from "@/lib/site";

/** "About {name}" oversized headline + 002 / [WHO ARE WE] label. */
export default function AboutHero() {
  return (
    <section className="px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
      <div className="flex flex-col gap-x-6 gap-y-3 md:flex-row md:items-baseline">
        <h1 className="text-[clamp(2.75rem,12vw,10rem)] font-medium leading-[0.85] tracking-[-0.045em]">
          About {site.name}
        </h1>
        <div className="border-l-2 border-accent pl-3 font-mono text-[11px] leading-relaxed md:self-end md:pb-[0.9em]">
          <div className="text-muted">002</div>
          <div className="text-foreground">[WHO ARE WE]</div>
        </div>
      </div>
    </section>
  );
}
