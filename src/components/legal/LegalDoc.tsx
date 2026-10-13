import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RuleLabel from "@/components/RuleLabel";
import DocNav from "./DocNav";
import PrintButton from "./PrintButton";
import ReadingProgress from "./ReadingProgress";
import type { LegalDoc as Doc } from "@/lib/legal";
import { getSiteContent } from "@/lib/siteContent";

/**
 * The document template shared by Privacy / Terms / Disclaimer: index
 * marker + oversized title, the updated date and a print button, then a
 * sticky section nav beside numbered sections. Reading progress runs along
 * the top. Prints clean (nav, header and footer hidden).
 */
export default async function LegalDoc({ doc }: { doc: Doc }) {
  const content = await getSiteContent();
  const words = doc.sections.reduce((n, s) => n + s.body.join(" ").split(/\s+/).length, 0);
  const minutes = Math.max(1, Math.round(words / 220));

  return (
    <>
      <main className="relative min-h-screen">
        <div className="print:hidden">
          <Header logo={content.logo} />
        </div>
        <ReadingProgress />

        <section className="mx-auto w-full max-w-[1760px] px-5 pt-10 sm:px-8 sm:pt-14" aria-label={doc.title}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <RuleLabel>Legal · {doc.number}</RuleLabel>
              <h1 className="mt-6 text-[min(11vw,120px)] font-normal leading-[0.92] tracking-[-0.03em]">{doc.title}</h1>
            </div>
            <div className="mb-[1.2vw] hidden shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-2 leading-tight sm:flex">
              <span className="text-[10px] text-muted lg:text-[11px]">{doc.number}</span>
              <span className="text-[10px] font-semibold tracking-wide text-foreground lg:text-[11px]">[{doc.title.toUpperCase()}]</span>
            </div>
          </div>
          <p className="mt-6 max-w-[52ch] text-lg text-foreground/70">{doc.lead}</p>

          {/* Meta strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-hairline py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            <span>
              Last updated <span className="text-foreground">{doc.updated}</span>
            </span>
            <span>
              {doc.sections.length} sections · {minutes} min read
            </span>
            <span className="ml-auto">
              <PrintButton />
            </span>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[260px_1fr] lg:gap-16 lg:py-16">
          <div className="print:hidden">
            <DocNav sections={doc.sections} />
          </div>

          <article className="max-w-[72ch]">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-hairline py-10 first:border-t-0 first:pt-0">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-tight tracking-tight">{s.heading}</h2>
                </div>
                <div className="mt-5 space-y-4 pl-9">
                  {s.body.map((p, k) => (
                    <p key={k} className="text-[17px] leading-relaxed text-foreground/75">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </section>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
