// Who we are — the studio, the founder, what we stand for. Index 010.
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/pages/PageHead";
import { founder, values } from "@/lib/pages";
import { intro } from "@/lib/about";
import { decade } from "@/lib/about";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Who we are",
  description: "Triptych Studios is a Chicago video production company founded in 2016 by director Lawrence “Law” Mahone. 500+ music videos, commercials and brand films.",
  alternates: { canonical: "/who-we-are" },
};

export default async function Page() {
  const content = await getSiteContent();
  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />
        <PageHead
          title="Who we are"
          index="010"
          label="The studio"
          lead={intro.statement}
          facts={[["Founded", "2016"], ["Based in", "Chicago, IL"], ["Projects", "500+"], ["Partners", "80+"]]}
        />

        {/* The studio */}
        <section className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 pt-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:pt-28">
          <Reveal>
            <p className="text-[15px] text-muted">The studio</p>
            <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.75rem)] font-normal leading-[1.02] tracking-tight">Ten years of making Chicago look like a film.</h2>
          </Reveal>
          <Reveal delay={0.05} className="space-y-5">
            {intro.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="text-[17px] leading-relaxed text-foreground/75">{p}</p>
            ))}
          </Reveal>
        </section>

        {/* Founder */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pt-24 sm:px-8 lg:pt-32">
          <Reveal>
            <div className="grid grid-cols-1 overflow-hidden rounded-3xl bg-foreground text-background md:grid-cols-[1fr_1.3fr]">
              <div className="relative min-h-[320px]" style={{ background: "radial-gradient(circle at 30% 30%, hsl(8 80% 55%), hsl(330 60% 30%) 55%, #0a0a0a)" }}>
                <span className="absolute bottom-6 left-6 text-[14px] opacity-70">{/* EDIT: drop a portrait here */}Portrait coming soon</span>
              </div>
              <div className="p-8 sm:p-12">
                <p className="text-[15px] opacity-60">{founder.role}</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-normal leading-none tracking-tight">{founder.name}</h2>
                <div className="mt-8 space-y-4">
                  {founder.bio.map((p) => (
                    <p key={p.slice(0, 20)} className="text-[17px] leading-relaxed opacity-80">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Values */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pt-24 sm:px-8 lg:pt-32">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-hairline p-7">
                  <span className="text-[14px] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-2xl font-normal tracking-tight">{v.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-foreground/70">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Milestones, compact */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pb-28 pt-24 sm:px-8 lg:pt-32">
          <Reveal>
            <p className="text-[15px] text-muted">Milestones</p>
          </Reveal>
          <ol className="mt-6 border-t border-hairline">
            {decade.map((d) => (
              <li key={d.year} className="grid grid-cols-[80px_1fr] gap-6 border-b border-hairline py-4 sm:grid-cols-[140px_1fr_2fr]">
                <span className="text-[clamp(1.25rem,2vw,1.75rem)] font-medium tabular-nums tracking-tight">{d.year}</span>
                <span className="text-[17px]">{d.title}</span>
                <span className="col-span-2 text-[15px] text-muted sm:col-span-1">{d.body}</span>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background hover:opacity-85">See the work</Link>
            <Link href="/philosophy" className="rounded-full border border-hairline px-5 py-2.5 text-[14px] hover:border-foreground/40">Our philosophy</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
