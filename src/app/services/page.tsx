// Services & partners — what we make, how, and who we make it with. Index 011.
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/pages/PageHead";
import ServiceAccordion from "@/components/pages/ServiceAccordion";
import { servicesList, process } from "@/lib/pages";
import { clients, projects } from "@/lib/projects";
import PreviewLoop from "@/components/PreviewLoop";
import { previewFor, SLUG_ALIASES } from "@/lib/previews";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Services & partners",
  description: "Music videos, commercials, brand films, live and post-production from Triptych Studios in Chicago — for artists and labels including Capitol, Interscope, Atlantic and Warner.",
  alternates: { canonical: "/services" },
};

// EDIT: the recent work beside the labels — project slugs (lib/projects),
// each shown with its looping preview (lib/previews).
const RECENT = ["overthink", "symptom", "obsessive-compulsive-imagination", "hands-up"];

export default async function Page() {
  const content = await getSiteContent();
  const artists = Array.from(new Set(projects.map((p) => p.artist?.split(" ft.")[0]).filter((a): a is string => !!a)));
  const recent = RECENT.map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => !!p)
    .map((p) => ({ p, preview: previewFor(p.slug) }));
  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />
        <PageHead title="Services" index="011" label="Services & partners" lead="Everything from the treatment to the final cutdown, under one roof." facts={[["Services", `${servicesList.length}`], ["Labels", `${clients.length}`], ["Artists", `${artists.length}+`], ["Turnaround", "2–6 weeks"]]} />

        <section className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8 lg:pt-24">
          <Reveal><p className="mb-6 text-[15px] text-muted">What we make</p></Reveal>
          {/* EDIT: prices stay off this page (they are listed in the Terms). To show them again: pass servicesList as it is and set SHOW_PRICES in ServiceAccordion */}
          <ServiceAccordion items={servicesList.map((s) => ({ ...s, from: "" }))} />
        </section>

        {/* Process */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pt-24 sm:px-8 lg:pt-32">
          <Reveal><p className="text-[15px] text-muted">How it works</p></Reveal>
          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.05}>
                <li className="relative h-full rounded-2xl border border-hairline p-7">
                  <span className="text-[clamp(3rem,6vw,5rem)] font-normal leading-none tabular-nums tracking-tight text-foreground/15">{i + 1}</span>
                  <h3 className="mt-6 text-2xl font-normal tracking-tight">{s.step}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Partners */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pb-28 pt-24 sm:px-8 lg:pt-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-[15px] text-muted">Labels &amp; partners</p>
              <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
                {clients.map((c) => (
                  <li key={c} className="py-4 text-[clamp(1.4rem,2.6vw,2.1rem)] font-normal tracking-tight">{c}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-[15px] text-muted">Recent work</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6">
                {recent.map(({ p, preview }) => (
                  <li key={p.slug}>
                    <Link href={`/work/${SLUG_ALIASES[p.slug] ?? p.slug}`} className="group block">
                      <div className="relative aspect-video overflow-hidden rounded-[14px] bg-surface">
                        {preview && (
                          <PreviewLoop
                            src={preview.src}
                            poster={preview.poster}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        )}
                      </div>
                      <p className="mt-3 text-[16px] font-medium leading-snug tracking-[-0.01em]">
                        {p.title} <span aria-hidden className="text-foreground/40 transition-colors group-hover:text-foreground">↗</span>
                      </p>
                      {p.artist && <p className="text-[14px] text-muted">{p.artist}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
              <a href={site.contactUrl} className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background hover:opacity-85">
                Start a project <span aria-hidden>→</span>
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
