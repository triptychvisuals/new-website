import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RuleLabel from "@/components/RuleLabel";
import ProjectFinder from "@/components/notfound/ProjectFinder";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = { title: "Not found" };

/**
 * 404 — "this frame didn't make the cut": an oversized 404 with an empty
 * film strip running through it, and a project finder so a dead link still
 * gets you somewhere.
 */
export default async function NotFound() {
  const content = await getSiteContent();
  return (
    <>
      <main className="relative flex min-h-[calc(100vh-64px)] flex-col">
        <Header logo={content.logo} />
        <section className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col justify-center px-5 py-16 sm:px-8 sm:py-24" aria-label="Page not found">
          <RuleLabel>Error · 404</RuleLabel>
          <div className="relative mt-6">
            <h1 className="text-[min(34vw,420px)] font-medium leading-[0.82] tracking-[-0.06em] text-foreground">404</h1>
            {/* An empty strip of film across the number */}
            <div aria-hidden className="film-strip pointer-events-none absolute left-[-6%] right-[-6%] top-[52%] -rotate-[9deg] opacity-90" />
          </div>
          <p className="mt-8 max-w-[40ch] text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-snug tracking-tight">
            This frame didn&apos;t make the cut.
          </p>
          <p className="mt-2 max-w-[48ch] text-[15px] text-muted">
            The page you asked for isn&apos;t here — it may have moved, or the link was mistyped.
          </p>
          <div className="mt-10">
            <ProjectFinder />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
