// Press — features, who has covered the work, every award by year, and a
// press kit (bios you can copy, facts, logo downloads). Index 007.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RuleLabel from "@/components/RuleLabel";
import Reveal from "@/components/Reveal";
import CopyButton from "@/components/press/CopyButton";
import AwardsByYear from "@/components/press/AwardsByYear";
import { features, mentions, bios, facts, logoFiles } from "@/lib/press";
import { awards } from "@/lib/about";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Press — Triptych", // EDIT
  description: "Features, awards and the press kit for Triptych Studios.", // EDIT
};

export default async function PressPage() {
  const content = await getSiteContent();
  const years = awards.map((a) => Number(a.year));
  const stats = [
    ["Features", `${features.length}`],
    ["Awards", `${awards.length}`],
    ["Years", `${Math.min(...years)} — ${Math.max(...years)}`],
    ["Press contact", site.email],
  ] as const;

  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />

        {/* Oversized header band */}
        <section className="mx-auto w-full max-w-[1760px] px-4 pb-2 pt-10 sm:px-6 sm:pt-14" aria-label="Press">
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            <h1 className="text-[min(13vw,150px)] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[min(12.5vw,170px)]">Press</h1>
            <div className="mb-[1.2vw] flex shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-1 leading-tight sm:pl-2">
              <span className="text-[6px] text-muted sm:text-[10px] lg:text-[11px]">007</span>
              <span className="text-[6px] font-semibold tracking-wide text-foreground sm:text-[10px] lg:text-[11px]">[PRESS &amp; AWARDS]</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-8 sm:mt-8 md:grid-cols-4">
            {stats.map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between gap-3 border-b border-hairline py-2 ${i < 2 ? "border-t md:border-t" : "md:border-t"}`}>
                <span className="text-[11px] uppercase tracking-[0.15em] text-muted">{label}</span>
                <span className="truncate text-sm font-medium uppercase tracking-wide text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature(s) */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8 sm:pt-20" aria-label="Featured press">
          <Reveal>
            <RuleLabel>Featured</RuleLabel>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {features.map((f) => (
              <Reveal key={f.url}>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-hairline">
                  <div
                    className="relative aspect-[16/9] w-full"
                    style={{ background: `radial-gradient(circle at 30% 25%, hsl(${f.hue} 60% 55%), hsl(${(f.hue + 30) % 360} 55% 32%) 55%, hsl(${(f.hue + 60) % 360} 50% 14%))` }}
                  >
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/70">
                        {f.outlet}
                        {f.series && <span className="text-white/45"> · {f.series}</span>}
                      </p>
                      <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-tight tracking-tight">{f.title}</h2>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-6 p-6 sm:p-8">
                    <blockquote className="max-w-[48ch] text-[17px] leading-relaxed text-foreground/75">“{f.quote}”</blockquote>
                    <span className="shrink-0 text-[13px] font-medium text-foreground/70 transition-colors group-hover:text-foreground">
                      Read <span aria-hidden>↗</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}

            {/* Mentions */}
            <Reveal delay={0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-hairline p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Premiered &amp; covered by</p>
                <ul className="mt-6 flex-1 divide-y divide-hairline">
                  {mentions.map((m) => (
                    <li key={m.outlet} className="flex items-baseline justify-between gap-4 py-4">
                      {m.url ? (
                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium tracking-tight transition-colors hover:text-accent">
                          {m.outlet}
                        </a>
                      ) : (
                        <span className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium tracking-tight">{m.outlet}</span>
                      )}
                      <span className="text-right text-[13px] text-muted">{m.what}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Awards */}
        <section id="awards" className="mx-auto w-full max-w-[1760px] scroll-mt-20 px-5 pt-24 sm:px-8 sm:pt-32" aria-label="Awards">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <RuleLabel>Selected Honors</RuleLabel>
              <h2 className="mt-8 text-[clamp(3.25rem,10vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
                Awards
                <sup className="ml-[0.15em] align-[1em] text-[0.26em] font-normal tracking-normal text-muted">({awards.length})</sup>
              </h2>
              <p className="mt-6 max-w-[36ch] text-[15px] text-muted">Filter by year. EDIT: the list lives in lib/about.ts.</p>
            </Reveal>
            <Reveal delay={0.05}>
              <AwardsByYear />
            </Reveal>
          </div>
        </section>

        {/* Press kit */}
        <section id="kit" className="mx-auto w-full max-w-[1760px] scroll-mt-20 px-5 pb-28 pt-24 sm:px-8 sm:pt-32" aria-label="Press kit">
          <Reveal>
            <RuleLabel>Press kit</RuleLabel>
            <h2 className="mt-8 text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight">Everything you need to write about us.</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Bios */}
            <Reveal className="lg:col-span-2">
              <div className="rounded-2xl border border-hairline p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Short bio · {bios.short.split(/\s+/).length} words</p>
                  <CopyButton text={bios.short} />
                </div>
                <p className="mt-4 text-[17px] leading-relaxed text-foreground/80">{bios.short}</p>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-hairline pt-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Long bio · {bios.long.split(/\s+/).length} words</p>
                  <CopyButton text={bios.long} />
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">{bios.long}</p>
              </div>
            </Reveal>

            {/* Facts + logos */}
            <Reveal delay={0.05}>
              <div className="flex h-full flex-col gap-4">
                <div className="rounded-2xl border border-hairline p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Fast facts</p>
                  <dl className="mt-4 divide-y divide-hairline">
                    {facts.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4 py-2.5 text-[14px]">
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="rounded-2xl border border-hairline p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Logo</p>
                  {logoFiles.map((l) => (
                    <div key={l.file} className="mt-4">
                      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-hairline">
                        <div className="flex items-center justify-center bg-[#0a0a0a] p-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.file} alt="" className="h-7 w-auto" />
                        </div>
                        <div className="flex items-center justify-center bg-[#f4f2ec] p-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.file} alt="" className="h-7 w-auto [filter:brightness(0)]" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-[13px] text-muted">{l.note}</span>
                        <a href={l.file} download className="text-[13px] font-medium transition-colors hover:text-accent">
                          Download <span aria-hidden>↓</span>
                        </a>
                      </div>
                    </div>
                  ))}
                  <a href={`mailto:${site.email}?subject=Press%20enquiry`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[14px] font-medium text-background transition-opacity hover:opacity-85">
                    Press enquiries <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
