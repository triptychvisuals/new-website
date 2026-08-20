// Projects — the full index (003): oversized header, studio metadata, two
// featured cards, then the filterable grid.
import type { Metadata } from "next";
import Header from "@/components/Header";
import ProjectsGrid from "@/components/ProjectsGrid";
import Footer from "@/components/Footer";
import { projects } from "@/lib/projects";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Projects — Triptych", // EDIT
  description: "Every project — music videos, films, and motion.", // EDIT
};

// EDIT: metadata strip under the page title (label / value pairs).
function pageStats() {
  const categories = new Set(projects.map((p) => p.category)).size;
  const years = projects.map((p) => Number(p.year)).filter(Boolean);
  return [
    ["Total Projects", `${projects.length}`],
    ["Categories", `${categories}`],
    ["Years", `${Math.min(...years)} — ${Math.max(...years)}`],
    ["Based in", "Chicago"], // EDIT
  ] as const;
}

export default async function ProjectsPage() {
  const content = await getSiteContent();

  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />

        {/* Oversized header band — mirrors the home "Featured Work" type */}
        <section className="px-4 pb-2 pt-10 sm:px-6 sm:pt-14" aria-label="Projects">
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            <h1 className="text-[13vw] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[12.5vw]">
              Projects
            </h1>

            {/* Index marker — matches the hero / featured-work bracket labels */}
            <div className="mb-[1.2vw] flex shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-1 leading-tight sm:pl-2">
              <span className="text-[6px] text-muted sm:text-[10px] lg:text-[11px]">
                003
              </span>
              <span className="text-[6px] font-semibold tracking-wide text-foreground sm:text-[10px] lg:text-[11px]">
                [ALL PROJECTS]
              </span>
            </div>
          </div>

          {/* Metadata strip */}
          <div className="mt-6 grid grid-cols-2 gap-x-8 sm:mt-8 md:grid-cols-4">
            {pageStats().map(([label, value], i) => (
              <div
                key={label}
                className={`flex items-center justify-between border-b border-hairline py-2 ${
                  i < 2 ? "border-t md:border-t" : "md:border-t"
                }`}
              >
                <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
                  {label}
                </span>
                <span className="text-sm font-medium uppercase tracking-wide text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 sm:pt-8">
          <ProjectsGrid works={content.works} />
        </div>
      </main>
      <Footer />
    </>
  );
}
