// Contact — a raw 3D map of the address, the details grid, then the brief
// builder. Index 009.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BriefBuilder from "@/components/contact/BriefBuilder";
import LocalTime from "@/components/contact/LocalTime";
import StudioMap from "@/components/contact/StudioMapLazy";
import StudioView from "@/components/contact/StudioView";

// EDIT: the hero — "render" (the Higgsfield aerial, at the real time of day
// in Chicago) or "3d" (the live 3D model of the block).
const HERO: "render" | "3d" = "render";
import { site } from "@/lib/site";
import { socials } from "@/lib/about";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Contact", // EDIT
  description: "Contact Triptych Studios — 211 W. Wacker Drive, Chicago. Start a project, or write to the studio or press.", // EDIT
};

// EDIT: what happens after a brief lands.
const NEXT = [
  ["Within a day", "We read it and reply with first thoughts and any questions."],
  ["Within a week", "A call, a treatment, and a quote with a real schedule."],
  ["Then", "Pre-production in the portal — you see every step."],
];

// The address, written out once.
const ADDRESS_LINES = [
  `${site.street}${site.pmb ? `, PMB ${site.pmb}` : ""}`,
  `${site.city}, ${site.region} ${site.postalCode}`,
];
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.street}, ${site.city}, ${site.region} ${site.postalCode}`)}`;
const coord = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(4)}° ${v >= 0 ? pos : neg}`;

export default async function ContactPage() {
  const content = await getSiteContent();
  // EDIT: the details grid — label, value, link. A blank value is left out.
  const details: { label: string; value: React.ReactNode; href?: string }[] = [
    { label: "Mailing address", value: ADDRESS_LINES.map((l) => <span key={l} className="block">{l}</span>), href: MAPS_URL },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Press", value: site.pressEmail, href: `mailto:${site.pressEmail}` },
    ...(site.phone ? [{ label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` }] : []),
    { label: "Studio time", value: <LocalTime /> },
    { label: "Replies", value: "Within 24 hours" }, // EDIT
  ];
  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />

        {/* The map — raw: a plan of the Loop in 3D, with the address marked */}
        <section aria-label="Where we are" className="relative border-b border-hairline bg-[#050505] text-white">
          {HERO === "3d" ? <StudioMap className="h-[72svh] min-h-[460px] w-full" /> : <StudioView className="h-[72svh] min-h-[460px] w-full" />}
          {/* Overlay: corner marks, the title, the address and coordinates */}
          <div aria-hidden className="pointer-events-none absolute inset-4 z-30 sm:inset-6">
            <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-white/60" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-white/60" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-white/60" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-white/60" />
          </div>
          <div className="pointer-events-none absolute left-6 top-6 z-30 sm:left-10 sm:top-10">
            <p className="font-mono text-[11px] text-white/60">009 / Contact</p>
            <h1 className="mt-2 text-[clamp(3rem,9vw,8rem)] font-medium leading-[0.9] tracking-[-0.04em]">Contact</h1>
          </div>
          <div className="pointer-events-none absolute bottom-6 left-6 z-30 font-mono text-[11px] leading-relaxed text-white/80 sm:bottom-10 sm:left-10 sm:text-[12px]">
            {ADDRESS_LINES.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="mt-2 text-white/50">
              {coord(site.lat, "N", "S")} &nbsp; {coord(site.lng, "E", "W")}
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-6 right-6 z-30 hidden text-right font-mono text-[11px] leading-relaxed text-white/50 sm:bottom-10 sm:right-10 sm:block">
            <p>Fig. 01 — W. Wacker Drive, Chicago</p>
            <p className="mt-2 flex items-center justify-end gap-2">
              <span className="inline-block h-px w-16 bg-white/50" /> 200 m
            </p>
          </div>
        </section>

        {/* The details — a raw grid */}
        <section aria-label="Contact details" className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-10">
          <div className="grid border-l border-t border-hairline sm:grid-cols-2 lg:grid-cols-3">
            {details.map((d, i) => {
              const body = (
                <>
                  <p className="font-mono text-[11px] text-muted">
                    {String(i + 1).padStart(2, "0")} — {d.label}
                  </p>
                  <div className="mt-6 text-[clamp(1.3rem,1.85vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] [overflow-wrap:anywhere]">
                    {d.value}
                  </div>
                  {d.href && (
                    <span aria-hidden className="mt-6 inline-block font-mono text-[11px] text-muted transition-colors group-hover:text-foreground">
                      {d.href.startsWith("mailto:") ? "Write →" : d.href.startsWith("tel:") ? "Call →" : "Open in Maps ↗"}
                    </span>
                  )}
                </>
              );
              const cls = "group block border-b border-r border-hairline p-6 sm:p-8 lg:p-10";
              return d.href ? (
                <a key={d.label} href={d.href} {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${cls} transition-colors hover:bg-foreground/[0.04]`}>
                  {body}
                </a>
              ) : (
                <div key={d.label} className={cls}>
                  {body}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-hairline py-6 text-[15px]">
            <span className="font-mono text-[11px] text-muted">Elsewhere</span>
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="text-foreground/80 transition-colors hover:text-foreground">
                {s.label} <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1760px] px-5 pt-20 sm:px-8 sm:pt-28 lg:px-10" aria-label="Start a project">
          <Reveal>
            <p className="font-mono text-[11px] text-muted">Start a project</p>
            <h2 className="mt-6 max-w-[22ch] text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-tight">Tell us what you&apos;re making. The brief writes itself.</h2>
          </Reveal>
          <div className="mt-12">
            <BriefBuilder />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1760px] px-5 pb-28 pt-24 sm:px-8 sm:pt-32 lg:px-10" aria-label="What happens next">
          <div className="grid grid-cols-1 border-l border-t border-hairline lg:grid-cols-3">
            {NEXT.map(([when, what], i) => (
              <Reveal key={when} delay={i * 0.05}>
                <div className="h-full border-b border-r border-hairline p-6 sm:p-8">
                  <p className="font-mono text-[11px] text-accent">0{i + 1} · {when}</p>
                  <p className="mt-4 text-[17px] leading-relaxed text-foreground/80">{what}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
