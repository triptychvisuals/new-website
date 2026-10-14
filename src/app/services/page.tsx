// Services & partners — what we make, how, and who we make it with. Index 011.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/pages/PageHead";
import ServiceAccordion from "@/components/pages/ServiceAccordion";
import { servicesList, process } from "@/lib/pages";
import { clients, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Services & partners",
  description: "Music videos, commercials, brand films, live and post-production from Triptych Studios in Chicago — for artists and labels including Capitol, Interscope, Atlantic and Warner.",
  alternates: { canonical: "/services" },
};

export default async function Page() {
  const content = await getSiteContent();
  const artists = Array.from(new Set(projects.map((p) => p.artist?.split(" ft.")[0]).filter((a): a is string => !!a)));
  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />
        <PageHead title="Services" index="011" label="Services & partners" lead="Everything from the treatment to the final cutdown, under one roof." facts={[["Services", `${servicesList.length}`], ["Labels", `${clients.length}`], ["Artists", `${artists.length}+`], ["Turnaround", "2–6 weeks"]]} />

        <section className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8 lg:pt-24">
          <Reveal><p className="mb-6 text-[15px] text-muted">What we make</p></Reveal>
          <ServiceAccordion items={servicesList} />
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
              <p className="text-[15px] text-muted">Artists we&apos;ve worked with</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {artists.map((a) => (
                  <li key={a} className="rounded-full border border-hairline px-4 py-2 text-[15px] text-foreground/80">{a}</li>
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
