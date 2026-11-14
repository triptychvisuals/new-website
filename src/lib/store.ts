// -------------------------------------------------------------------------
// EDIT: the store. Products, prices (US cents), kinds for the filter, sizes
// for apparel, and the product photo (in /public/store). Products without a
// photo show a line drawing over their colour (hue). Checkout is a hand-off
// (see StoreClient): EDIT there to connect Shopify / Stripe.
// -------------------------------------------------------------------------
export type Kind = "Apparel" | "Accessories" | "Prints" | "Digital";
export type Shape = "tee" | "hoodie" | "cap" | "print" | "digital";

export type Product = {
  id: string;
  name: string;
  kind: Kind;
  shape: Shape;
  price: number;
  blurb: string;
  hue: number;
  /** EDIT: product photo, e.g. "/store/hoodie-black.jpg". */
  image?: string;
  sizes?: string[];
  badge?: string;
};

/**
 * EDIT: the film cause. Half of every sale goes here — it's shown at the
 * top of the store, on every product and in the bag. Name the partner
 * organisation (and link it) once it's chosen.
 */
export const CAUSE = {
  share: 0.5, // the share of each sale that goes to the cause
  title: "50% goes to film",
  line: "Half of every sale funds young filmmakers in Chicago — cameras, workshops and the chance to make their first video.",
  partner: "", // EDIT: e.g. the organisation's name
  url: "", // EDIT: its website
};

const APPAREL = ["S", "M", "L", "XL", "2XL"];

export const products: Product[] = [
  // ── apparel ──
  { id: "windbreaker-black", name: "Crew Windbreaker — Black", kind: "Apparel", shape: "hoodie", price: 12000, image: "/store/windbreaker-black.jpg", blurb: "Water-resistant nylon shell, full zip, packable hood. Mark printed on the chest.", hue: 220, sizes: APPAREL, badge: "New" },
  { id: "anorak-red", name: "Signal Anorak — Red", kind: "Apparel", shape: "hoodie", price: 11500, image: "/store/anorak-red.jpg", blurb: "Half-zip nylon pullover in the studio red, kangaroo pocket, hood.", hue: 8, sizes: APPAREL, badge: "New" },
  { id: "hoodie-black", name: "Heavyweight Hoodie — Black", kind: "Apparel", shape: "hoodie", price: 11000, image: "/store/hoodie-black.jpg", blurb: "500gsm brushed fleece — properly thick. Boxy fit, double-layer hood, embroidered mark.", hue: 262, sizes: APPAREL },
  { id: "hoodie-bone", name: "Heavyweight Hoodie — Bone", kind: "Apparel", shape: "hoodie", price: 11000, image: "/store/hoodie-bone.jpg", blurb: "The same 500gsm hoodie in bone, with the mark embroidered in black.", hue: 40, sizes: APPAREL },
  { id: "hoodie-charcoal", name: "Big Mark Hoodie — Charcoal", kind: "Apparel", shape: "hoodie", price: 12000, image: "/store/hoodie-charcoal.jpg", blurb: "500gsm washed charcoal, oversized, with a large puff-print mark across the back.", hue: 220, sizes: APPAREL },
  { id: "tee-black", name: "Studio Tee — Black", kind: "Apparel", shape: "tee", price: 4000, image: "/store/tee-black.jpg", blurb: "Heavyweight cotton, boxy fit, small mark on the chest.", hue: 20, sizes: APPAREL },
  { id: "cap", name: "Director Cap", kind: "Apparel", shape: "cap", price: 3500, image: "/store/cap.jpg", blurb: "Unstructured six-panel, embroidered mark, adjustable strap.", hue: 200, sizes: ["One size"] },
  // ── accessories & gadgets ──
  { id: "keychain-mark", name: "Mark Keychain", kind: "Accessories", shape: "digital", price: 1500, image: "/store/keychain-mark.jpg", blurb: "Die-cut metal in the shape of the mark, black enamel, polished edges.", hue: 0 },
  { id: "keychain-slate", name: "Mini Slate Keychain", kind: "Accessories", shape: "digital", price: 1800, image: "/store/keychain-slate.jpg", blurb: "A working pocket clapperboard with the mark on the slate.", hue: 0, badge: "New" },
  { id: "key-light", name: "Pocket Key Light", kind: "Accessories", shape: "digital", price: 5900, image: "/store/key-light.jpg", blurb: "Card-sized RGB LED light with a cold-shoe mount — the mark engraved on the back.", hue: 0 },
  { id: "strap", name: "Camera Strap", kind: "Accessories", shape: "digital", price: 4500, image: "/store/strap.jpg", blurb: "Woven nylon, leather ends, quick-release clips, debossed patch.", hue: 0 },
  { id: "card-reader", name: "Card Reader", kind: "Accessories", shape: "digital", price: 2900, image: "/store/card-reader.jpg", blurb: "USB-C SD and microSD reader in aluminium, keyring loop, engraved mark.", hue: 0 },
  // ── prints & digital ──
  { id: "print-01", name: "Frame 01 — Overthink", kind: "Prints", shape: "print", price: 6500, blurb: "Giclée on 310gsm cotton rag, 18 × 24 in. Signed, edition of 50.", hue: 330, badge: "Edition of 50" },
  { id: "print-02", name: "Frame 02 — Ridin Wit It", kind: "Prints", shape: "print", price: 6500, blurb: "Giclée on 310gsm cotton rag, 18 × 24 in. Signed, edition of 50.", hue: 120 },
  { id: "poster", name: "Ten Years Poster", kind: "Prints", shape: "print", price: 3000, blurb: "The 2016 → 2026 film strip, 24 × 36 in, matte.", hue: 8 },
  { id: "lut-01", name: "LUT Pack Vol. 1", kind: "Digital", shape: "digital", price: 4900, blurb: "Twelve looks from the last two years of videos. .cube, Rec.709 and LOG inputs.", hue: 160 },
  { id: "presets", name: "Still Presets", kind: "Digital", shape: "digital", price: 2900, blurb: "Eight Lightroom presets matched to the LUTs, for the stills.", hue: 290 },
];

export const kinds: Kind[] = ["Apparel", "Accessories", "Prints", "Digital"];

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
