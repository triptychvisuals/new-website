// Store — studio merch, gadgets, prints and digital packs, in the flat house
// style: a title block with the film cause beside it, then the shop and bag.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreClient from "@/components/store/StoreClient";
import { CAUSE } from "@/lib/store";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Store", // EDIT
  description: "Triptych windbreakers, heavyweight hoodies, keychains and gadgets — half of every sale funds young filmmakers.", // EDIT
};

export default async function StorePage() {
  const content = await getSiteContent();
  const pct = `${Math.round(CAUSE.share * 100)}%`;

  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        <Header logo={content.logo} />
        <div className="mx-auto w-full max-w-[1760px] px-5 lg:px-10">
          <section aria-label="Store" className="grid gap-10 pb-10 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:pb-12 lg:pt-24">
            <div>
              <p className="text-[15px] text-muted">Store</p>
              {/* EDIT: the page's headline and lead */}
              <h1 className="mt-4 text-[clamp(2.75rem,7vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.04em]">
                Wear the mark.
                <br />
                Fund the next one.
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-muted sm:text-[19px]">
                Windbreakers, heavyweight hoodies, keychains and gadgets for the set — made in small runs, shipped from Chicago.
              </p>
            </div>
            {/* The cause (EDIT: lib/store.ts → CAUSE) */}
            <div className="rounded-[20px] bg-foreground p-7 text-background sm:p-8">
              <p className="text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em]">{pct}</p>
              <p className="mt-3 text-[19px] font-medium">of every sale goes to film.</p>
              <p className="mt-3 text-[15px] leading-relaxed text-background/70">{CAUSE.line}</p>
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
          </section>
        </div>
        <div className="mx-auto w-full max-w-[1760px] pb-24">
          <StoreClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
