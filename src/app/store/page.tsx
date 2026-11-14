// Store — one shirt, the star of the page: big and in 3D up top (the
// featured layout in StoreClient), its details underneath, then the film
// cause half of every sale goes to.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreClient from "@/components/store/StoreClient";
import { CAUSE, products } from "@/lib/store";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Store", // EDIT
  description: `${products[0]?.name ?? "Studio merch"}: limited edition, half of every sale funds young filmmakers in Chicago.`, // EDIT
};

export default async function StorePage() {
  const content = await getSiteContent();
  const pct = `${Math.round(CAUSE.share * 100)}%`;

  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        <Header logo={content.logo} />
        <div className="mx-auto w-full max-w-[1760px] pt-8 sm:pt-12 lg:px-5">
          <StoreClient />
        </div>

        {/* The cause (EDIT: lib/store.ts → CAUSE) */}
        <section aria-label="Where the money goes" className="mx-auto w-full max-w-[1760px] px-5 pb-24 sm:px-8 lg:px-13">
          <div className="grid gap-8 rounded-[28px] bg-foreground p-8 text-background sm:p-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-16">
            <p className="text-[clamp(4rem,9vw,8rem)] font-medium leading-none tracking-[-0.05em]">{pct}</p>
            <div>
              <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-tight tracking-[-0.02em]">of every sale goes to film.</p>
              <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-background/70">{CAUSE.line}</p>
              {CAUSE.partner && (
                <p className="mt-4 text-[14px] text-background/70">
                  In partnership with{" "}
                  {CAUSE.url ? (
                    <a href={CAUSE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-background underline underline-offset-4">
                      {CAUSE.partner}
                    </a>
                  ) : (
                    <span className="font-medium text-background">{CAUSE.partner}</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
