// Philosophy — how we think about every frame. Index 012.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/pages/PageHead";
import { principles, triptych } from "@/lib/pages";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "How Triptych Studios thinks about every frame — idea, image, impact.",
  alternates: { canonical: "/philosophy" },
};

export default async function Page() {
  const content = await getSiteContent();
  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />
        <PageHead title="Philosophy" index="012" label="How we think" lead="A triptych is one picture told in three panels. So is every project we make." />

        {/* The three panels */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8 lg:pt-24">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {triptych.map((t, i) => (
              <Reveal key={t.label} delay={i * 0.08}>
                <div className="flex aspect-[3/4] flex-col justify-between rounded-3xl p-8 text-white" style={{ background: `radial-gradient(circle at 30% 25%, hsl(${(i * 137.5 + 8) % 360} 75% 58%), hsl(${(i * 137.5 + 48) % 360} 65% 32%) 60%, #0a0a0a)` }}>
                  <span className="text-[clamp(4rem,8vw,7rem)] font-normal leading-none opacity-80">{t.label}</span>
                  <div>
                    <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-normal tracking-tight">{t.title}</h2>
                    <p className="mt-3 text-[16px] leading-relaxed opacity-85">{t.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pb-28 pt-24 sm:px-8 lg:pt-32">
          <Reveal><p className="text-[15px] text-muted">Six things we hold to</p></Reveal>
          <ol className="mt-6 border-t border-hairline">
            {principles.map((p, i) => (
              <Reveal key={p.title}>
                <li className="grid grid-cols-[56px_1fr] gap-x-6 gap-y-3 border-b border-hairline py-10 md:grid-cols-[96px_1fr_1fr]">
                  <span className="text-[15px] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[clamp(1.75rem,3.6vw,3rem)] font-normal leading-[1.05] tracking-tight">{p.title}</h3>
                  <p className="col-start-2 max-w-[48ch] text-[17px] leading-relaxed text-foreground/70 md:col-start-3">{p.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
