// Testimonials — what collaborators say. Index 013.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/pages/PageHead";
import QuoteCarousel from "@/components/pages/QuoteCarousel";
import { testimonials } from "@/lib/about";
import { founder } from "@/lib/pages";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What artists, labels and brands say about working with Triptych Studios.",
  alternates: { canonical: "/testimonials" },
};

export default async function Page() {
  const content = await getSiteContent();
  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />
        <PageHead title="Testimonials" index="013" label="In their words" lead="What the people we make work with say about it." facts={[["Projects", "500+"], ["Repeat clients", "Most of them"], ["Since", "2016"], ["Rating", "★★★★★"]]} />

        <section className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8 lg:pt-24">
          <Reveal>
            <QuoteCarousel items={testimonials} />
          </Reveal>
        </section>

        <section className="mx-auto w-full max-w-[1760px] px-5 pt-16 sm:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 0.05}>
                <figure className="h-full rounded-2xl border border-hairline p-7">
                  <blockquote className="text-[17px] leading-relaxed text-foreground/80">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 text-[14px]">
                    <span className="font-medium">{t.author}</span> <span className="text-muted">· {t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* A note from the founder */}
        <section className="mx-auto w-full max-w-[1760px] px-5 pb-28 pt-24 sm:px-8 lg:pt-32">
          <Reveal>
            <div className="grid grid-cols-1 gap-8 border-t border-hairline pt-12 lg:grid-cols-[1fr_1.5fr]">
              <p className="text-[15px] text-muted">A note from {founder.name}</p>
              <div>
                <p className="text-[clamp(1.5rem,3vw,2.4rem)] font-normal leading-[1.2] tracking-tight">
                  Thank you to every artist who trusted us with their song, and every brand that trusted us with their name. {/* EDIT */}
                </p>
                <a href={`mailto:${site.email}?subject=A%20testimonial`} className="mt-8 inline-flex rounded-full border border-hairline px-5 py-2.5 text-[14px] hover:border-foreground/40">
                  Worked with us? Leave a word
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
