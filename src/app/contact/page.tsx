// Contact — start a project: a brief that writes itself. Index 009.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RuleLabel from "@/components/RuleLabel";
import Reveal from "@/components/Reveal";
import BriefBuilder from "@/components/contact/BriefBuilder";
import LocalTime from "@/components/contact/LocalTime";
import { site } from "@/lib/site";
import { socials } from "@/lib/about";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Contact", // EDIT
  description: "Start a project with Triptych Studios.", // EDIT
};

// EDIT: what happens after a brief lands.
const NEXT = [
  ["Within a day", "We read it and reply with first thoughts and any questions."],
  ["Within a week", "A call, a treatment, and a quote with a real schedule."],
  ["Then", "Pre-production in the portal — you see every step."],
];

export default async function ContactPage() {
  const content = await getSiteContent();
  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />

        <section className="mx-auto w-full max-w-[1760px] px-4 pb-2 pt-10 sm:px-6 sm:pt-14" aria-label="Contact">
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            <h1 className="text-[min(13vw,150px)] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[min(12.5vw,170px)]">Contact</h1>
            <div className="mb-[1.2vw] flex shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-1 leading-tight sm:pl-2">
              <span className="text-[6px] text-muted sm:text-[10px] lg:text-[11px]">009</span>
              <span className="text-[6px] font-semibold tracking-wide text-foreground sm:text-[10px] lg:text-[11px]">[START A PROJECT]</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-8 sm:mt-8 md:grid-cols-4">
            {(
              [
                ["Based in", "Chicago, IL"], // EDIT
                ["Studio time", <LocalTime key="t" />],
                ["Replies", "Within 24h"], // EDIT
                ["Email", <a key="e" href={`mailto:${site.email}`} className="truncate hover:text-accent">{site.email}</a>],
              ] as const
            ).map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between gap-3 border-b border-hairline py-2 ${i < 2 ? "border-t md:border-t" : "md:border-t"}`}>
                <span className="text-[11px] uppercase tracking-[0.15em] text-muted">{label}</span>
                <span className="truncate text-sm font-medium tracking-wide text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1760px] px-5 pt-14 sm:px-8 sm:pt-20" aria-label="Start a project">
          <Reveal>
            <RuleLabel>Start a project</RuleLabel>
            <h2 className="mt-6 max-w-[22ch] text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-tight">Tell us what you&apos;re making. The brief writes itself.</h2>
          </Reveal>
          <div className="mt-12">
            <BriefBuilder />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1760px] px-5 pb-28 pt-24 sm:px-8 sm:pt-32" aria-label="What happens next">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {NEXT.map(([when, what], i) => (
              <Reveal key={when} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-hairline p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">0{i + 1} · {when}</p>
                  <p className="mt-4 text-[17px] leading-relaxed text-foreground/80">{what}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[15px] text-foreground/70">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Elsewhere</span>
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="transition-colors hover:text-foreground">
                {s.label} <span aria-hidden>↗</span>
              </a>
            ))}
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
