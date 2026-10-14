// Press — features, who has covered the work, and a press kit (bios you
// can copy, facts, logo downloads). Index 007.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PressTabs from "@/components/press/PressTabs";
import Reveal from "@/components/Reveal";
import CopyButton from "@/components/press/CopyButton";
import { features, mentions, bios, facts, logoFiles, boilerplate, founderQuote, usage, downloads, brandColors, nameStyle, angles, availability } from "@/lib/press";
import { projects, clients } from "@/lib/projects";
import { socials } from "@/lib/about";
import { site } from "@/lib/site";
import { youtubePoster, youtubeUrl } from "@/lib/youtube";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Press kit", // EDIT
  description: "Bios, fast facts, logos and credits for writing about Triptych Studios.", // EDIT
  alternates: { canonical: "/press/kit" },
};

export default async function PressKitPage() {
  const content = await getSiteContent();
  // EDIT: how many credits the press kit lists (newest with an artist first)
  // EDIT: how many stills the press kit shows
  const stills = projects.filter((p) => p.youtube).slice(0, 8);
  const credits = projects.filter((p) => p.artist).slice(0, 8);
  const stats = [
    ["Features", `${features.length}`],
    ["Covered by", `${mentions.length} outlets`],
    ["Since", "2016"], // EDIT
    ["Press contact", site.pressEmail],
  ] as const;

  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />

        {/* Oversized header band */}
        <section className="mx-auto w-full max-w-[1760px] px-4 pb-2 pt-10 sm:px-6 sm:pt-14" aria-label="Press">
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            <h1 className="text-[min(13vw,150px)] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[min(12.5vw,170px)]">Press kit</h1>
            <div className="mb-[1.2vw] flex shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-1 leading-tight sm:pl-2">
              <span className="text-[6px] text-muted sm:text-[10px] lg:text-[11px]">007</span>
              <span className="text-[6px] font-medium text-foreground sm:text-[10px] lg:text-[11px]">Press</span>
            </div>
          </div>
          <PressTabs active="kit" />
          <div className="mt-6 grid grid-cols-2 gap-x-8 sm:mt-8 md:grid-cols-4">
            {stats.map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between gap-3 border-b border-hairline py-2 ${i < 2 ? "border-t md:border-t" : "md:border-t"}`}>
                <span className="text-[14px] text-muted">{label}</span>
                <span className="truncate text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Press kit */}
        <section id="kit" className="mx-auto w-full max-w-[1760px] scroll-mt-20 px-5 pb-16 pt-16 sm:px-8 sm:pt-20" aria-label="Press kit">
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
                  <a href={`mailto:${site.pressEmail}?subject=Press%20enquiry`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[14px] font-medium text-background transition-opacity hover:opacity-85">
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

        {/* Resources: downloads, stills, brand, angles */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pb-28 sm:px-8" aria-label="Press resources">
          <Reveal>
            <p className="text-[15px] text-muted">Resources</p>
            <h2 className="mt-8 text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight">Logos, stills and the brand.</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {downloads.map((d) => (
              <Reveal key={d.file}>
                <a href={d.file} download className="group block overflow-hidden rounded-2xl border border-hairline">
                  <div className={`flex aspect-[4/3] items-center justify-center p-8 ${d.dark ? "bg-[#0a0a0a]" : "bg-[#f4f2ec]"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.file} alt={d.label} loading="lazy" className="max-h-full w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <span><span className="block text-sm font-medium">{d.label}</span><span className="text-[13px] text-muted">{d.note}</span></span>
                    <span aria-hidden className="text-[13px] transition-colors group-hover:text-accent">↓</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 flex items-end justify-between gap-4">
              <p className="text-[15px] text-muted">Stills</p>
              <a href={`mailto:${site.pressEmail}?subject=High-res%20stills`} className="text-[13px] text-muted transition-colors hover:text-foreground">Request high-res ↗</a>
            </div>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stills.map((p) => (
              <a key={p.slug} href={youtubeUrl(p.youtube!)} target="_blank" rel="noreferrer" className="group block">
                <div className="aspect-video overflow-hidden rounded-xl bg-hairline">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={youtubePoster(p.youtube!)} alt={`${p.artist ?? ""} — ${p.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="mt-2 truncate text-[13px]">{p.artist ? `${p.artist} — ` : ""}<span className="text-muted">{p.title}</span></p>
              </a>
            ))}
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-2xl border border-hairline p-6 sm:p-8">
                <p className="text-[14px] text-muted">Brand colours</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {brandColors.map((c) => (
                    <div key={c.hex}>
                      <div className="h-16 rounded-lg border border-hairline" style={{ background: c.hex }} />
                      <p className="mt-2 text-sm">{c.name}</p>
                      <p className="text-[13px] text-muted">{c.hex}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 border-t border-hairline pt-6 text-[14px] text-muted">Typeface</p>
                <p className="mt-2 text-2xl">Google Sans</p>
                <p className="text-[13px] text-muted">Regular, Medium</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="h-full rounded-2xl border border-hairline p-6 sm:p-8">
                <p className="text-[14px] text-muted">Writing the name</p>
                <ul className="mt-6 space-y-3">
                  {nameStyle.map((n) => (
                    <li key={n.text} className="flex gap-3 text-[15px]">
                      <span aria-hidden className={n.ok ? "text-foreground" : "text-accent"}>{n.ok ? "✓" : "✕"}</span>
                      <span className={n.ok ? "" : "text-muted"}>{n.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-hairline pt-6 text-[14px] text-muted">Founder available for</p>
                <ul className="mt-4 space-y-2 text-[15px]">
                  {availability.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal>
              <div className="h-full rounded-2xl border border-hairline p-6 sm:p-8">
                <p className="text-[14px] text-muted">Story angles</p>
                <ol className="mt-6 space-y-5">
                  {angles.map((a, i) => (
                    <li key={a} className="flex gap-4 text-[15px] leading-snug">
                      <span className="text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ol>
                <a href={`mailto:${site.pressEmail}`} className="mt-8 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Pitch a story →</a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
