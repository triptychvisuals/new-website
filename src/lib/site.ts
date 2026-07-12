// -------------------------------------------------------------------------
// EDIT: Global branding + header content. One place to rename the studio,
// change the nav, or update contact details.
// -------------------------------------------------------------------------

export const site = {
  name: "Triptych", // EDIT: first word of the hero + wordmark
  suffix: "Studios", // EDIT: second word of the hero headline
  registered: true, // EDIT: show the ® mark next to the wordmark
  email: "hello@triptychvisuals.com", // EDIT: contact email (also confirm law@…)
  sectionNumber: "001", // EDIT: hero index label
  sectionLabel: "SELECTED WORKS", // EDIT: hero bracket label
  nav: [
    { label: "Projects", href: "/#work" }, // EDIT: works grid on the home page
    { label: "Journal", href: "#" }, // EDIT: no Journal page yet — placeholder
    { label: "About", href: "/about" }, // EDIT
    { label: "Contact", href: "/about#contact" }, // EDIT: shows the ↗
  ],
};
