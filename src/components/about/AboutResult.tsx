import Reveal from "@/components/Reveal";
import RuleLabel from "@/components/RuleLabel";
import { stats, aboutGradient } from "@/lib/about";

/** "Production Experience & Result" — a stats bento. */
export default function AboutResult() {
  return (
    <section className="px-5 pt-20 sm:px-8 sm:pt-28">
      {/* Centered header */}
      <Reveal className="text-center">
        <RuleLabel className="justify-center">Result</RuleLabel>
        <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight">
          Production Experience &amp; Result
        </h2>
      </Reveal>

      {/* Bento */}
      <Reveal className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Left: hero image + best-ads badge */}
        <div
          className="relative min-h-[360px] overflow-hidden rounded-2xl md:min-h-[460px]"
          style={{ background: aboutGradient(4) }}
        >
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
            <span aria-hidden className="text-lg">
              {/* EDIT: swap for a laurel mark */}
              ❖
            </span>
            <span className="text-sm font-medium leading-tight">{stats.bestAds}</span>
          </div>
        </div>

        {/* Middle column */}
        <div className="flex flex-col gap-4">
          <div className="py-6 text-center">
            <div className="text-6xl font-medium tracking-tight">
              {stats.awards.value}
            </div>
            <p className="mt-2 text-sm text-muted">{stats.awards.label}</p>
          </div>

          <div className="flex flex-1 flex-col justify-between rounded-2xl bg-accent p-6 text-white">
            <div className="flex items-start justify-between gap-3">
              <span className="text-5xl font-medium tracking-tight">
                {stats.partners.value}
              </span>
              <span className="pt-2 text-sm">{stats.partners.label}</span>
            </div>
            <p className="ml-auto mt-10 max-w-[16rem] text-right text-sm leading-relaxed">
              {stats.partners.body}
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <div className="flex min-h-[120px] items-start rounded-2xl bg-foreground p-6">
            <p className="text-xl leading-snug text-background/70">
              {stats.decade}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">{stats.satisfaction.label}</span>
            <span className="tracking-widest text-foreground/70" aria-hidden>
              ★★★★★
            </span>
          </div>

          <div
            className="aspect-[16/10] w-full overflow-hidden rounded-2xl"
            style={{ background: aboutGradient(1) }}
            aria-hidden
          />

          <p className="text-sm leading-relaxed text-foreground/70">
            {stats.satisfaction.body}
          </p>

          <div className="mt-auto flex items-center gap-3">
            <div className="flex -space-x-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-7 w-7 rounded-full ring-2 ring-background"
                  style={{ background: aboutGradient(i + 2) }}
                />
              ))}
            </div>
            <span className="text-sm text-muted">
              {stats.satisfaction.clients}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
