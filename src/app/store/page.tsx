// Store — merch, prints and digital packs with a bag. Index 008.
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreClient from "@/components/store/StoreClient";
import { products } from "@/lib/store";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Store — Triptych", // EDIT
  description: "Studio apparel, signed prints and the LUTs behind the videos.", // EDIT
};

export default async function StorePage() {
  const content = await getSiteContent();
  const stats = [
    ["Items", `${products.length}`],
    ["Ships from", "Chicago"], // EDIT
    ["Returns", "14 days"], // EDIT
    ["Digital", "Instant"],
  ] as const;

  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />
        <section className="mx-auto w-full max-w-[1760px] px-4 pb-2 pt-10 sm:px-6 sm:pt-14" aria-label="Store">
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            <h1 className="text-[min(13vw,150px)] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[min(12.5vw,170px)]">Store</h1>
            <div className="mb-[1.2vw] flex shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-1 leading-tight sm:pl-2">
              <span className="text-[6px] text-muted sm:text-[10px] lg:text-[11px]">008</span>
              <span className="text-[6px] font-semibold tracking-wide text-foreground sm:text-[10px] lg:text-[11px]">[STUDIO STORE]</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-8 sm:mt-8 md:grid-cols-4">
            {stats.map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between border-b border-hairline py-2 ${i < 2 ? "border-t md:border-t" : "md:border-t"}`}>
                <span className="text-[11px] uppercase tracking-[0.15em] text-muted">{label}</span>
                <span className="text-sm font-medium uppercase tracking-wide text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="mx-auto w-full max-w-[1760px] pt-6 sm:pt-8">
          <StoreClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
