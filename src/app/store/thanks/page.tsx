// Where Stripe sends a buyer after paying: the order, read back from Stripe
// (so it can't be faked by editing the address), what happens next, and
// how much of it goes to film. The bag empties here.
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearBag from "@/components/store/ClearBag";
import { CAUSE, money } from "@/lib/store";
import { stripe, stripeMode } from "@/lib/stripe";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

type Session = {
  id: string;
  payment_status: string;
  amount_total: number | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  line_items?: { data: { description: string; quantity: number | null; amount_total: number }[] };
  total_details?: { amount_shipping?: number } | null;
};

async function order(id: string | undefined): Promise<Session | null> {
  if (!id || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(id) || stripeMode() === "off") return null;
  try {
    return await stripe<Session>("GET", `checkout/sessions/${id}`, { expand: ["line_items"] });
  } catch {
    return null;
  }
}

export default async function Thanks({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const [content, s] = await Promise.all([getSiteContent(), order(session_id)]);
  const paid = s?.payment_status === "paid";
  const total = s?.amount_total ?? 0;

  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        <Header logo={content.logo} />
        <ClearBag when={paid} />
        <section className="mx-auto w-full max-w-[880px] px-5 pb-24 pt-14 sm:pt-24">
          <p className="text-[15px] text-muted">Store</p>
          <h1 className="mt-4 text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.04em]">
            {paid ? "Thank you." : s ? "Almost there." : "Thanks for stopping by."}
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-muted sm:text-[19px]">
            {paid
              ? `Your order is in. A receipt is on its way${s?.customer_details?.email ? ` to ${s.customer_details.email}` : ""}, and we'll email tracking when it ships.`
              : s
                ? "Your payment is still going through. We'll email you as soon as it clears."
                : "We couldn't find that order. If you paid, your receipt from Stripe has the details."}
          </p>

          {s?.line_items?.data.length ? (
            <div className="mt-10 overflow-hidden rounded-[20px] bg-surface">
              <ul className="divide-y divide-hairline">
                {s.line_items.data.map((l, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-4 px-6 py-4 text-[16px]">
                    <span>
                      {l.quantity ?? 1} × {l.description}
                    </span>
                    <span className="tabular-nums">{money(l.amount_total)}</span>
                  </li>
                ))}
                {!!s.total_details?.amount_shipping && (
                  <li className="flex items-baseline justify-between gap-4 px-6 py-4 text-[15px] text-muted">
                    <span>Shipping</span>
                    <span className="tabular-nums">{money(s.total_details.amount_shipping)}</span>
                  </li>
                )}
                <li className="flex items-baseline justify-between gap-4 px-6 py-5 text-[18px] font-medium">
                  <span>Total</span>
                  <span className="tabular-nums">{money(total)}</span>
                </li>
              </ul>
            </div>
          ) : null}

          {paid && (
            <div className="mt-6 rounded-[20px] bg-foreground p-6 text-background sm:p-8">
              <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight tracking-[-0.02em]">
                {money(Math.round(total * CAUSE.share))} of this goes to film.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-background/70">{CAUSE.line}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/store" className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-opacity hover:opacity-85">
              Back to the store
            </Link>
            <a href={`mailto:${site.email}`} className="inline-flex h-11 items-center rounded-full bg-foreground/[0.09] px-6 text-[15px] font-medium transition-colors hover:bg-foreground/[0.16]">
              Questions? Email us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
