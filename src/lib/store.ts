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
  { id: "windbreaker-black", name: "Crew Windbreaker", kind: "Apparel", shape: "hoodie", price: 12000, image: "/store/windbreaker-black.jpg", blurb: "Water-resistant black nylon shell, full zip, packable hood. Mark printed on the chest.", hue: 220, sizes: APPAREL },
  { id: "hoodie-black", name: "Heavyweight Hoodie", kind: "Apparel", shape: "hoodie", price: 11000, image: "/store/hoodie-black.jpg", blurb: "500gsm brushed fleece, properly thick. Boxy fit, double-layer hood, embroidered mark.", hue: 262, sizes: APPAREL },
  { id: "varsity", name: "Studio Varsity", kind: "Apparel", shape: "hoodie", price: 22000, image: "/store/varsity.jpg", blurb: "Heavy black wool body, cream leather sleeves, striped rib trims and a chenille mark on the chest.", hue: 30, sizes: APPAREL, badge: "New" },
];

// The filter shows only the kinds that have products (and hides itself
// when there is just one).
export const kinds: Kind[] = (["Apparel", "Accessories", "Prints", "Digital"] as Kind[]).filter((k) => products.some((p) => p.kind === k));

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
