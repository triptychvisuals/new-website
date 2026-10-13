// -------------------------------------------------------------------------
// EDIT: the store. Products, prices (US cents), kinds for the filter, sizes
// for apparel, and the art hue. Checkout is a hand-off (see StoreClient):
// EDIT there to connect Shopify / Stripe when the store goes live.
// -------------------------------------------------------------------------
export type Kind = "Apparel" | "Prints" | "Digital";
export type Shape = "tee" | "hoodie" | "cap" | "print" | "digital";

export type Product = {
  id: string;
  name: string;
  kind: Kind;
  shape: Shape;
  price: number;
  blurb: string;
  hue: number;
  sizes?: string[];
  badge?: string;
};

const APPAREL = ["S", "M", "L", "XL", "2XL"];

export const products: Product[] = [
  { id: "tee-black", name: "Studio Tee — Black", kind: "Apparel", shape: "tee", price: 4000, blurb: "Heavyweight cotton, Triptych mark front, “Imagination in Motion” back.", hue: 20, sizes: APPAREL, badge: "New" },
  { id: "tee-bone", name: "Studio Tee — Bone", kind: "Apparel", shape: "tee", price: 4000, blurb: "Same tee, off-white, tonal print.", hue: 40, sizes: APPAREL },
  { id: "hoodie", name: "Crew Hoodie", kind: "Apparel", shape: "hoodie", price: 8500, blurb: "Fleece-lined, dropped shoulder, embroidered mark.", hue: 262, sizes: APPAREL },
  { id: "cap", name: "Director Cap", kind: "Apparel", shape: "cap", price: 3500, blurb: "Unstructured six-panel, embroidered ◬, brass clasp.", hue: 200, sizes: ["One size"] },
  { id: "print-01", name: "Frame 01 — Overthink", kind: "Prints", shape: "print", price: 6500, blurb: "Giclée on 310gsm cotton rag, 18 × 24 in. Signed, edition of 50.", hue: 330, badge: "Edition of 50" },
  { id: "print-02", name: "Frame 02 — Ridin Wit It", kind: "Prints", shape: "print", price: 6500, blurb: "Giclée on 310gsm cotton rag, 18 × 24 in. Signed, edition of 50.", hue: 120 },
  { id: "poster", name: "Ten Years Poster", kind: "Prints", shape: "print", price: 3000, blurb: "The 2016 → 2026 film strip, 24 × 36 in, matte.", hue: 8 },
  { id: "lut-01", name: "LUT Pack Vol. 1", kind: "Digital", shape: "digital", price: 4900, blurb: "Twelve looks from the last two years of videos. .cube, Rec.709 and LOG inputs.", hue: 160 },
  { id: "presets", name: "Still Presets", kind: "Digital", shape: "digital", price: 2900, blurb: "Eight Lightroom presets matched to the LUTs, for the stills.", hue: 290 },
];

export const kinds: Kind[] = ["Apparel", "Prints", "Digital"];

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
