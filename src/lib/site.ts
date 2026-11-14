// -------------------------------------------------------------------------
// EDIT: Global branding + header content. One place to rename the studio,
// change the nav, or update contact details.
// -------------------------------------------------------------------------

export const site = {
  name: "Triptych", // EDIT: first word of the hero + wordmark
  suffix: "Studios", // EDIT: second word of the hero headline
  registered: false, // EDIT: true only once "Triptych Studios" is a federally registered trademark (shows ®); false shows ™
  /** EDIT: canonical production URL — Pinterest pin links resolve against it. */
  url: "https://triptychstudios.co",
  /**
   * EDIT: the value Pinterest gives you when you claim this website
   * (Pinterest > Settings > Claimed accounts > Websites > "Add HTML tag",
   * the content="…" part). Claiming puts the studio's name and profile on
   * every pin saved from here and unlocks Pinterest's analytics for them.
   * Leave empty until then and nothing is rendered.
   */
  pinterestVerify: "",
  /**
   * EDIT: the studio's Pinterest profile, e.g.
   * "https://www.pinterest.com/triptychstudios/". Once set it shows with
   * the socials and under every project's finished frames. "" hides it.
   */
  pinterest: "",
  /** EDIT: the legal entity behind the studio, exactly as registered with
   *  the Indiana Secretary of State (Business ID 202305041688505). Named in the legal pages so customers (and Stripe)
   *  can match the site to the business that charges them. */
  legalName: "Triptych Studios LLC",
  /** EDIT: how charges read on a customer's card statement. Keep this in
   *  step with the statement descriptor in Stripe (Settings > Business). */
  statementDescriptor: "TRIPTYCH VISUALS",
  /** EDIT: the state whose law governs the terms, and where disputes go. */
  lawState: "Indiana",
  email: "law@triptychstudios.co", // EDIT: contact email (clients, refunds, billing questions)
  /** EDIT: press enquiries. */
  pressEmail: "law@triptychstudios.co",
  /** EDIT: search + business listing. Paste the Google Search Console HTML-tag
   *  code here once the domain is added there, and the Google Business
   *  Profile link (the "Share" link from the profile) once it's verified. */
  googleVerify: "",
  googleBusinessUrl: "",
  /** EDIT: studio location for search + maps. */
  city: "Chicago",
  region: "IL",
  country: "US",
  /** EDIT: the mailing address (the Contact page map points here). */
  street: "211 W. Wacker Drive",
  /** EDIT: the private mailbox number at that address — shown as "PMB 123"
   *  once it's filled in; leave "" until then. */
  pmb: "",
  postalCode: "60606",
  /** EDIT: the address's map position (decimal degrees). */
  lat: 41.8867,
  lng: -87.6345,
  /** EDIT: the studio phone, as you'd like it shown, e.g. "(312) 555-0123".
   *  Leave "" and the Contact page leaves the phone out. */
  phone: "(219) 231-7048",
  /** EDIT: where every Contact button goes — the portal's project intake. */
  contactUrl: "https://portal.triptychstudios.co/start",
  sectionNumber: "001", // EDIT: hero index label
  sectionLabel: "SELECTED WORKS", // EDIT: hero bracket label
  nav: [
    { label: "Projects", href: "/projects" }, // EDIT: the full project index
    { label: "About", href: "/about" }, // EDIT
    { label: "Press", href: "/press" }, // EDIT
    { label: "Store", href: "/store" }, // EDIT: the store page; shows the ↗
  ],
};
