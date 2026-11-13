// Projects — the full index, in the flat house style: a plain title block
// with a line about the work and a few numbers, then the index itself
// (lead card, filters, grid or list), then the closing call to action.
import type { Metadata } from "next";
import Header from "@/components/Header";
import ProjectsGrid from "@/components/ProjectsGrid";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";
import { clients, projects } from "@/lib/projects";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Projects", // EDIT
  description: "Every project — music videos, commercials and brand films from Chicago since 2016.", // EDIT
};

// EDIT: the numbers under the title (value / label).
function pageStats(count: number) {
  const years = projects.map((p) => Number(p.year)).filter(Boolean);
  return [
    [`${count}`, "Projects"],
    [`${clients.length}`, "Major labels"],
    [`${Math.min(...years)}–${Math.max(...years)}`, "Years"],
    ["Chicago", "Based in"], // EDIT
  ] as const;
}

export default async function ProjectsPage() {
  const content = await getSiteContent();
  const count = content.works.length || projects.length;

  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        <Header logo={content.logo} />

        <div className="mx-auto w-full max-w-[1760px] px-5 pb-24 lg:px-10">
          <section aria-label="Projects" className="grid gap-10 pb-12 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:pb-14 lg:pt-24">
            <div>
              <p className="text-[15px] text-muted">Projects</p>
              {/* EDIT: the page's headline and lead */}
              <h1 className="mt-4 text-[clamp(2.75rem,7vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.04em]">
                Every frame,
                <br />
                since 2016.
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-muted sm:text-[19px]">
                Music videos, commercials and brand films for artists, labels and brands — directed, shot and finished in Chicago.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] bg-hairline sm:grid-cols-4 lg:grid-cols-2">
              {pageStats(count).map(([value, label]) => (
                <div key={label} className="flex flex-col-reverse bg-surface px-5 py-5">
                  <dt className="mt-2 text-[14px] text-muted">{label}</dt>
                  <dd className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-none tracking-[-0.03em]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <ProjectsGrid works={content.works} />
        </div>

        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
