// The store's checkout: turns the bag into a Stripe Checkout Session (on the
// Stripe sandbox — see lib/stripe.ts) and answers with the page to send the
// buyer to. Prices, names and sizes come from lib/store.ts on the server;
// the browser only says which product, which size and how many, so a
// tampered request can't change what anything costs.
//
// Stripe collects the card, the shipping address and the email, and sends
// the receipt. Orders show up in the Stripe dashboard (sandbox), tagged
// source=store with the sizes in the metadata.
import { products, SHIPPING, MAX_QTY, CAUSE } from "@/lib/store";
import { stripe, stripeMode } from "@/lib/stripe";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Line = { id?: unknown; size?: unknown; qty?: unknown };

export async function GET() {
  return Response.json({ mode: stripeMode() });
}

export async function POST(req: Request) {
  if (stripeMode() === "off") {
    return Response.json({ error: "Checkout isn't switched on yet." }, { status: 503 });
  }

  let body: { lines?: Line[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  const raw = Array.isArray(body.lines) ? body.lines.slice(0, 20) : [];

  // Every line checked against the catalogue
  const lines: { name: string; image?: string; amount: number; qty: number; id: string; size?: string }[] = [];
  for (const l of raw) {
    const p = products.find((x) => x.id === l.id);
    if (!p) continue;
    const size = typeof l.size === "string" ? l.size : undefined;
    if (p.sizes && (!size || !p.sizes.includes(size))) continue;
    const qty = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(l.qty) || 0)));
    lines.push({
      id: p.id,
      size,
      qty,
      amount: p.price,
      name: size ? `${p.name} — ${size}` : p.name,
      image: p.image ? `${site.url}${p.image}` : undefined,
    });
  }
  if (!lines.length) return Response.json({ error: "Your bag is empty." }, { status: 400 });
  // back to wherever the buyer came from (the live site, a preview, localhost)
  const origin = new URL(req.url).origin;

  try {
    const session = await stripe<{ url: string }>("POST", "checkout/sessions", {
      mode: "payment",
      line_items: lines.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: "usd",
          unit_amount: l.amount,
          product_data: { name: l.name, ...(l.image ? { images: [l.image] } : {}) },
        },
      })),
      shipping_address_collection: { allowed_countries: SHIPPING.countries },
      shipping_options: SHIPPING.options.map((o) => ({
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: o.name,
          fixed_amount: { amount: o.amount, currency: "usd" },
          delivery_estimate: {
            minimum: { unit: "business_day", value: o.days[0] },
            maximum: { unit: "business_day", value: o.days[1] },
          },
        },
      })),
      phone_number_collection: { enabled: true },
      // what the buyer reads on Stripe's page, above the pay button
      custom_text: {
        submit: { message: `${Math.round(CAUSE.share * 100)}% of this order funds young filmmakers in Chicago.` },
      },
      // EDIT: where Stripe sends the buyer back
      success_url: `${origin}/store/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store`,
      // the order, readable in the dashboard; and marked as a store sale
      metadata: {
        source: "store",
        items: lines.map((l) => `${l.qty}× ${l.id}${l.size ? ` ${l.size}` : ""}`).join(", ").slice(0, 490),
      },
      payment_intent_data: { metadata: { source: "store" } },
    });
    return Response.json({ url: session.url });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Checkout failed." }, { status: 502 });
  }
}
