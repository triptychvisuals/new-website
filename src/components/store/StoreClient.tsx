"use client";

import { useEffect, useMemo, useState } from "react";
import { products, kinds, money, type Kind, type Product } from "@/lib/store";
import { site } from "@/lib/site";
import ProductArt from "./ProductArt";

type Line = { id: string; size?: string; qty: number };
const KEY = "triptych-bag";

/**
 * The shop: kind filter, product cards (size picker on apparel, add to
 * bag), and a bag drawer with quantities and a subtotal. The bag lives in
 * localStorage so it survives a reload. Checkout hands the order off —
 * EDIT `checkout()` to connect Shopify / Stripe.
 */
export default function StoreClient() {
  const [kind, setKind] = useState<"All" | Kind>("All");
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [bag, setBag] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Hydrate the bag after mount (server HTML is the empty state) — on the
  // next frame, so hydration finishes first.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(KEY);
        if (saved) setBag(JSON.parse(saved));
      } catch {}
      setLoaded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(bag));
    } catch {}
  }, [bag, loaded]);
  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const shown = kind === "All" ? products : products.filter((p) => p.kind === kind);
  const count = bag.reduce((n, l) => n + l.qty, 0);
  const lines = useMemo(
    () => bag.map((l) => ({ ...l, product: products.find((p) => p.id === l.id)! })).filter((l) => l.product),
    [bag]
  );
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);

  const add = (p: Product) => {
    const size = p.sizes ? (sizes[p.id] ?? p.sizes[0]) : undefined;
    setBag((b) => {
      const i = b.findIndex((l) => l.id === p.id && l.size === size);
      if (i >= 0) return b.map((l, k) => (k === i ? { ...l, qty: l.qty + 1 } : l));
      return [...b, { id: p.id, size, qty: 1 }];
    });
    setOpen(true);
  };
  const setQty = (i: number, qty: number) => setBag((b) => (qty <= 0 ? b.filter((_, k) => k !== i) : b.map((l, k) => (k === i ? { ...l, qty } : l))));

  // EDIT: checkout — for now an email order; swap for your Shopify / Stripe
  // checkout URL.
  const checkout = () => {
    const body = lines.map((l) => `${l.qty} × ${l.product.name}${l.size ? ` (${l.size})` : ""} — ${money(l.product.price * l.qty)}`).join("\n");
    window.location.assign(`mailto:${site.email}?subject=${encodeURIComponent("Store order")}&body=${encodeURIComponent(`${body}\n\nSubtotal ${money(subtotal)}\n\nShip to:\n`)}`);
  };

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-[13px] transition-colors ${on ? "border-foreground bg-foreground text-background" : "border-hairline text-foreground/70 hover:border-foreground/40 hover:text-foreground"}`;

  return (
    <section className="px-5 pb-24 sm:px-8">
      {/* Filter + bag button */}
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8">
        <button type="button" onClick={() => setKind("All")} aria-pressed={kind === "All"} className={chip(kind === "All")}>All</button>
        {kinds.map((k) => (
          <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={chip(kind === k)}>{k}</button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-foreground px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-foreground hover:text-background"
        >
          Bag
          <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] tabular-nums ${count ? "bg-accent text-white" : "bg-foreground/10"}`}>{count}</span>
        </button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {shown.map((p) => {
          const size = p.sizes ? (sizes[p.id] ?? p.sizes[0]) : undefined;
          return (
            <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-hairline">
              <div
                className="relative aspect-[4/3] w-full"
                style={{ background: `radial-gradient(circle at 30% 25%, hsl(${p.hue} 70% 62%), hsl(${(p.hue + 30) % 360} 60% 40%) 55%, hsl(${(p.hue + 60) % 360} 55% 18%))` }}
              >
                <ProductArt shape={p.shape} className="absolute left-1/2 top-1/2 h-[58%] w-auto -translate-x-1/2 -translate-y-1/2 text-white opacity-90 transition-transform duration-500 ease-out group-hover:scale-105" />
                {p.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">{p.badge}</span>
                )}
                <span className="absolute right-4 top-4 font-mono text-[11px] uppercase tracking-[0.15em] text-white/80">{p.kind}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[17px] font-medium leading-tight tracking-tight">{p.name}</h2>
                  <span className="shrink-0 text-[15px] tabular-nums">{money(p.price)}</span>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.blurb}</p>
                <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                  {p.sizes ? (
                    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${p.name} size`}>
                      {p.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={size === s}
                          onClick={() => setSizes((m) => ({ ...m, [p.id]: s }))}
                          className={`min-w-9 rounded-md border px-2 py-1 text-[12px] transition-colors ${size === s ? "border-foreground bg-foreground text-background" : "border-hairline text-foreground/70 hover:border-foreground/40"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[12px] text-muted">{p.kind === "Digital" ? "Instant download" : "Ships rolled, worldwide"}</span>
                  )}
                  <button type="button" onClick={() => add(p)} className="shrink-0 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-85">
                    Add to bag
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bag drawer */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Your bag"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-background text-foreground shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2 className="text-lg font-medium tracking-tight">
            Bag <span className="text-muted">({count})</span>
          </h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close bag" className="rounded-full border border-hairline px-3 py-1 text-[13px] hover:border-foreground/40">
            Close
          </button>
        </div>
        <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-6">
          {lines.length === 0 && <li className="py-10 text-center text-sm text-muted">Nothing in the bag yet.</li>}
          {lines.map((l, i) => (
            <li key={`${l.id}-${l.size}`} className="flex gap-4 py-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg" style={{ background: `radial-gradient(circle at 30% 25%, hsl(${l.product.hue} 70% 62%), hsl(${(l.product.hue + 60) % 360} 55% 18%))` }}>
                <ProductArt shape={l.product.shape} className="h-full w-full p-3 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-[14px] font-medium">{l.product.name}</p>
                  <span className="shrink-0 text-[14px] tabular-nums">{money(l.product.price * l.qty)}</span>
                </div>
                {l.size && <p className="mt-0.5 text-[12px] text-muted">Size {l.size}</p>}
                <div className="mt-2 inline-flex items-center rounded-full border border-hairline">
                  <button type="button" onClick={() => setQty(i, l.qty - 1)} aria-label="Remove one" className="px-3 py-1 text-[14px]">−</button>
                  <span className="min-w-6 text-center text-[13px] tabular-nums">{l.qty}</span>
                  <button type="button" onClick={() => setQty(i, l.qty + 1)} aria-label="Add one" className="px-3 py-1 text-[14px]">+</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-hairline px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] text-muted">Subtotal</span>
            <span className="text-lg font-medium tabular-nums">{money(subtotal)}</span>
          </div>
          <p className="mt-1 text-[12px] text-muted">Shipping and tax at checkout.</p>
          <button
            type="button"
            onClick={checkout}
            disabled={lines.length === 0}
            className="mt-4 w-full rounded-full bg-foreground py-3 text-[14px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            Checkout <span aria-hidden>→</span>
          </button>
        </div>
      </aside>
    </section>
  );
}
