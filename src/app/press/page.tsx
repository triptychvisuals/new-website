// Press — features, who has covered the work, and a press kit (bios you
// can copy, facts, logo downloads). Index 007.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CopyButton from "@/components/press/CopyButton";
import { features, mentions, bios, facts, logoFiles, boilerplate, founderQuote, usage } from "@/lib/press";
import { projects, clients } from "@/lib/projects";
import { socials } from "@/lib/about";
import fs from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Press — Triptych", // EDIT
  description: "Features, coverage and the press kit for Triptych Studios.", // EDIT
};

// EDIT: the Chicago Reader photo — save it as public/press/chicago-reader.jpg
// and it fills the feature card (until then the colour art shows).
const READER_PHOTO = "/press/chicago-reader.jpg";
const hasReaderPhoto = fs.existsSync(path.join(process.cwd(), "public", READER_PHOTO));

export default async function PressPage() {
  const content = await getSiteContent();
  // EDIT: how many credits the press kit lists (newest with an artist first)
  const credits = projects.filter((p) => p.artist).slice(0, 8);
  const stats = [
    ["Features", `${features.length}`],
    ["Covered by", `${mentions.length} outlets`],
    ["Since", "2016"], // EDIT
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
              <span className="text-[6px] font-medium text-foreground sm:text-[10px] lg:text-[11px]">Press</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-8 sm:mt-8 md:grid-cols-4">
            {stats.map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between gap-3 border-b border-hairline py-2 ${i < 2 ? "border-t md:border-t" : "md:border-t"}`}>
                <span className="text-[14px] text-muted">{label}</span>
                <span className="truncate text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature(s) */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8 sm:pt-20" aria-label="Featured press">
          <Reveal>
            <p className="text-[15px] text-muted">Featured</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {features.map((f) => (
              <Reveal key={f.url}>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-hairline">
                  <div
                    className="relative aspect-[16/9] w-full"
                    style={{ background: `radial-gradient(circle at 30% 25%, hsl(${f.hue} 60% 55%), hsl(${(f.hue + 30) % 360} 55% 32%) 55%, hsl(${(f.hue + 60) % 360} 50% 14%))` }}
                  >
                    {hasReaderPhoto && f.outlet === "Chicago Reader" && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={READER_PHOTO} alt="Lawrence “Law” Mahone, photographed for the Chicago Reader" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
                      </>
                    )}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-8">
                      <p className="text-[14px] text-white/75">
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
                <p className="text-[14px] text-muted">Premiered &amp; covered by</p>
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

        {/* Press kit */}
        <section id="kit" className="mx-auto w-full max-w-[1760px] scroll-mt-20 px-5 pb-28 pt-24 sm:px-8 sm:pt-32" aria-label="Press kit">
          <Reveal>
            <p className="text-[15px] text-muted">Press kit</p>
            <h2 className="mt-8 text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight">Everything you need to write about us.</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Bios */}
            <Reveal className="lg:col-span-2">
              <div className="rounded-2xl border border-hairline p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[14px] text-muted">Short bio · {bios.short.split(/\s+/).length} words</p>
                  <CopyButton text={bios.short} />
                </div>
                <p className="mt-4 text-[17px] leading-relaxed text-foreground/80">{bios.short}</p>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-hairline pt-8">
                  <p className="text-[14px] text-muted">Long bio · {bios.long.split(/\s+/).length} words</p>
                  <CopyButton text={bios.long} />
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">{bios.long}</p>
              </div>
            </Reveal>

            {/* Facts + logos */}
            <Reveal delay={0.05}>
              <div className="flex h-full flex-col gap-4">
                <div className="rounded-2xl border border-hairline p-6 sm:p-8">
                  <p className="text-[14px] text-muted">Fast facts</p>
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
                  <p className="text-[14px] text-muted">Logo</p>
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

          {/* Boilerplate, quote, selected credits, labels, socials */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-2xl border border-hairline p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[14px] text-muted">One-line boilerplate</p>
                  <CopyButton text={boilerplate} />
                </div>
                <p className="mt-4 text-[17px] leading-relaxed text-foreground/80">{boilerplate}</p>
                <div className="mt-8 border-t border-hairline pt-8">
                  <p className="text-[14px] text-muted">From the founder</p>
                  <blockquote className="mt-4 text-[clamp(1.25rem,2vw,1.6rem)] font-normal leading-snug tracking-tight">“{founderQuote.text}”</blockquote>
                  <p className="mt-3 text-[14px] text-muted">{founderQuote.by}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="h-full rounded-2xl border border-hairline p-6 sm:p-8">
                <p className="text-[14px] text-muted">Selected credits</p>
                <ul className="mt-4 divide-y divide-hairline">
                  {credits.map((c) => (
                    <li key={c.slug}>
                      <a href={`/work/${c.slug}`} className="flex items-baseline justify-between gap-4 py-2.5 text-[15px] transition-colors hover:text-accent">
                        <span>
                          {c.artist} <span className="text-muted">— {c.title}</span>
                        </span>
                        <span className="shrink-0 tabular-nums text-muted">{c.year}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-hairline p-6 sm:p-8">
                <p className="text-[14px] text-muted">Labels &amp; partners</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {clients.map((c) => (
                    <li key={c} className="rounded-full border border-hairline px-3.5 py-1.5 text-[13px] text-foreground/80">{c}</li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-hairline pt-8 text-[14px] text-muted">Find us</p>
                <ul className="mt-3 space-y-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} className="text-[15px] transition-colors hover:text-accent">
                        {s.label} <span aria-hidden>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-hairline pt-8 text-[14px] text-muted">Usage</p>
                <p className="mt-3 text-[14px] leading-relaxed text-foreground/70">{usage}</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
