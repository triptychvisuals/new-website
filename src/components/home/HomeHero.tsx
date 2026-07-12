import Link from "next/link";
import { site } from "@/lib/site";

/* EDIT: right-hand stat rows */
const stats = [
  { label: "Response time", value: "3H" },
  { label: "Based in", value: "Chicago" },
  { label: "Creators", value: "23" },
];

export default function HomeHero() {
  return (
    <section className="px-5 pt-10 sm:px-8 sm:pt-16">
      <h1 className="text-[clamp(2.5rem,9vw,7rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-foreground">
        {site.name} {site.suffix}
      </h1>

      <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-8">
        {/* Left: subline + CTAs */}
        <div className="max-w-md">
          <p className="text-lg leading-snug text-foreground/70">
            {/* EDIT: hero subline */}
            Film, motion, and design that actually make real sense for your
            growing brand.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <Link
              href="/about#contact"
              className="rounded-full bg-zinc-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-zinc-800"
            >
              Start Project
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition-opacity hover:opacity-60"
            >
              Our Approach <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>

        {/* Right: stats */}
        <div className="md:w-full md:max-w-sm md:justify-self-end">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center justify-between border-b border-hairline py-4 ${
                i === 0 ? "border-t" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                {s.label}
              </span>
              <span className="text-sm font-medium uppercase tracking-wide text-foreground">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
