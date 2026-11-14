// -------------------------------------------------------------------------
// EDIT: the store. Products, prices (US cents), kinds for the filter, sizes
// for apparel, and the product photo (in /public/store). Products without a
// photo show a line drawing over their colour (hue). Checkout is a hand-off
// (see StoreClient): EDIT there to connect Shopify / Stripe.
// -------------------------------------------------------------------------
export type Kind = "Apparel" | "Accessories" | "Prints" | "Digital";
export type Shape = "tee" | "hoodie" | "cap" | "print" | "digital";

export type Decal = { kind: "embroidery" | "patch" | "tag"; lines?: string[]; u: number; v: number; w: number };

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
  /** EDIT: a 3D model (.glb in /public/store/3d) — the card shows it floating
   *  and turning, and it spins when dragged. Wins over the photos. */
  model?: string;
  /** EDIT: optional back view — the card gets a Front / Back switch. */
  imageBack?: string;
  sizes?: string[];
  badge?: string;
  /**
   * EDIT: details drawn sharp onto the 3D model (AI models blur small text):
   * kind, the words, and where on the front of the shirt it sits — u / v
   * are the centre as a share of the shirt's width / height (0,0 = top
   * left as you look at it), w its width as a share of the shirt's width.
   */
  decals?: Decal[];
  /** EDIT: the line above the name on the featured layout. */
  eyebrow?: string;
  /** EDIT: spec rows on the featured layout — label, value. */
  specs?: [string, string][];
  /** EDIT: the callouts under the featured product — title, close-up photo, words. */
  details?: { title: string; image: string; text: string }[];
};

/**
 * EDIT: shipping at checkout — where we ship (two-letter country codes)
 * and the options the buyer picks from (cents). Stripe collects the
 * address.
 */
export const SHIPPING = {
  countries: ["US"],
  options: [
    { name: "Standard", amount: 800, days: [3, 7] },
    { name: "Express", amount: 2000, days: [1, 3] },
  ],
};

/** Most of one item in one order. */
export const MAX_QTY = 10; // EDIT

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

// One product = the featured layout (the shirt, big, in 3D); two or more
// = the grid of cards.
export const products: Product[] = [
  {
    id: "shirt-008",
    name: "Shirt Style 008",
    eyebrow: "Limited edition coll.",
    kind: "Apparel",
    shape: "tee",
    price: 4500, // EDIT: price (cents)
    image: "/store/shirt-008.jpg",
    model: "/store/3d/shirt-008.glb",
    blurb: "Heavyweight white tee with the studio's details: our name embroidered on the chest, the mark on a woven tag at the neck, and the Believers patch at the hem.",
    hue: 0,
    sizes: APPAREL,
    badge: "Drop 008",
    decals: [
      { kind: "embroidery", lines: ["TRIPTYCH VISUALS LLC", "BASED IN CHICAGO, IL", "ESTABLISHED 2016"], u: 0.662, v: 0.269, w: 0.14 },
      { kind: "patch", lines: ["DESIGNED FOR", "THE DAY ONES & BELIEVERS", "LIMITED EDITION COLL.", "ALL RIGHTS RESERVED"], u: 0.711, v: 0.905, w: 0.1 },
      { kind: "tag", u: 0.506, v: 0.069, w: 0.055 },
    ],
    specs: [
      ["Fabric", "100% cotton"], // EDIT
      ["Quantity", "Limited"], // EDIT: e.g. "100 made"
      ["Drop", "TBD"], // EDIT: the release date
    ],
    details: [
      { title: "Embroidery", image: "/store/shirt-008-embroidery.jpg", text: "Triptych Visuals LLC · Based in Chicago, IL · Established 2016, stitched on the left chest." },
      { title: "Logo tag", image: "/store/shirt-008-tag.jpg", text: "The mark, woven in white on a black tag inside the neck." },
      { title: "Believers patch", image: "/store/shirt-008-patch.jpg", text: "Designed for the day ones & believers. Limited edition coll. Sewn at the hem." },
    ],
  },
];

// The filter shows only the kinds that have products (and hides itself
// when there is just one).
export const kinds: Kind[] = (["Apparel", "Accessories", "Prints", "Digital"] as Kind[]).filter((k) => products.some((p) => p.kind === k));

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
