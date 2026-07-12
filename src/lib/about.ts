// -------------------------------------------------------------------------
// EDIT: All About-page copy lives here. Rebranded to Triptych from the
// reference; swap in real clients, services, history, awards and testimonials.
// -------------------------------------------------------------------------

export { clients as recentClients } from "./projects"; // EDIT: real clients

export const services: string[] = [
  "Commercial Film",
  "Brand Video",
  "Corporate Video",
  "Short Film",
  "Documentary",
  "Music Video",
]; // EDIT

export const socials: { label: string; href: string }[] = [
  { label: "Instagram", href: "#" }, // EDIT
  { label: "Vimeo", href: "#" }, // EDIT
  { label: "YouTube", href: "#" }, // EDIT
  { label: "LinkedIn", href: "#" }, // EDIT
];

export const phone = "+142 1700 123 456"; // EDIT

export const intro = {
  statement: "Communicate philosophy and creative mindset to grow your brand.", // EDIT
  paragraphs: [
    "Triptych is a creative production company specializing in cinematic storytelling for brands, filmmakers, and organizations. We transform ideas into compelling visual experiences through film, commercials, and digital content. Our approach blends creative direction, strategic thinking, and modern production techniques to craft visuals that feel both meaningful and visually striking. From concept development to final edit, we work closely with our clients to ensure every project reflects a clear vision, strong narrative, and refined aesthetic.",
    "Our work is built on the belief that strong visuals are more than just beautiful images — they are powerful tools for communication. Every project begins with understanding the purpose behind the story: the message a brand wants to deliver, the emotion a filmmaker wants to capture, or the experience an organization wants to share.",
  ], // EDIT
};

export const founded = {
  lead: "Triptych Studios", // EDIT: gray part of the sentence
  tail: "was founded.", // EDIT: black part
};

export const timeline: { year: string; title: string; body: string }[] = [
  {
    year: "2022",
    title: "The beginning of visual storytelling",
    body: "Triptych was founded with a simple vision — to create meaningful visual stories through film and creative production. Starting as a small creative team, we focused on building strong storytelling foundations and exploring cinematic techniques.",
  }, // EDIT
  {
    year: "2023",
    title: "Expanding creative capabilities",
    body: "As the studio gained momentum, we expanded our services into commercial production and brand storytelling. Collaborating with agencies and creative partners, we began producing larger projects and developing a more refined production process.",
  }, // EDIT
  {
    year: "2025",
    title: "Pushing the future of visual production",
    body: "Today, Triptych continues to push creative boundaries through innovative filmmaking, modern production techniques, and bold visual storytelling that connects brands with audiences.",
  }, // EDIT
];

export const awardsStatement =
  "Honored by international festivals and industry leaders for exceptional visual storytelling"; // EDIT

export const awards: { name: string; year: string }[] = [
  { name: "Best Cinematic Storytelling Award", year: "2017" },
  { name: "International Film Production Excellence Award", year: "2018" },
  { name: "Creative Visual Direction Award", year: "2019" },
  { name: "Best Brand Film Production Award", year: "2019" },
  { name: "Global Cinematic Craft Award", year: "2020" },
  { name: "Best Commercial Film Award", year: "2020" },
  { name: "Visual Innovation Award", year: "2020" },
  { name: "Creative Production Excellence Award", year: "2021" },
  { name: "International Storytelling Award", year: "2021" },
  { name: "Best Cinematography Achievement", year: "2021" },
  { name: "Global Visual Design Award", year: "2022" },
  { name: "Best Digital Film Production Award", year: "2022" },
  { name: "Excellence in Motion Picture Production", year: "2022" },
  { name: "Outstanding Visual Narrative Award", year: "2022" },
  { name: "Global Production Leadership Award", year: "2023" },
  { name: "Artistic Cinematic Achievement Award", year: "2023" },
  { name: "International Creative Production Award", year: "2023" },
  { name: "Best Visual Composition Award", year: "2023" },
  { name: "Outstanding Film Craft Award", year: "2024" },
  { name: "Creative Innovation in Film Award", year: "2024" },
  { name: "Global Creative Vision Award", year: "2024" },
  { name: "Best Cinematic Editing Award", year: "2024" },
  { name: "Best Motion Story Award", year: "2025" },
  { name: "Global Storytelling Innovation Award", year: "2025" },
  { name: "Cinematic Artistry Award", year: "2026" },
  { name: "Creative Production Leaders", year: "2026" },
]; // EDIT: add/trim as needed

export const stats = {
  awards: { value: "35+", label: "Industry Awards & Recognitions" }, // EDIT
  partners: {
    value: "80+",
    label: "Creative Partners",
    body:
      "Collaborated with brands, agencies, and filmmakers to bring powerful visual stories to life.",
  }, // EDIT
  decade: "A decade of storytelling, filmmaking", // EDIT
  satisfaction: {
    label: "Client Satisfaction Rate",
    body:
      "Our clients consistently rate our production process and final results as highly professional and impactful.",
    clients: "500+ Happy Clients",
  }, // EDIT
  bestAds: "BEST ADS in 2026", // EDIT
};

export const testimonials: { quote: string; author: string; role: string }[] = [
  {
    quote:
      "Triptych delivered a production experience that exceeded our expectations. Their ability to translate creative ideas into cinematic visuals is truly impressive. The final film captured our brand perfectly.",
    author: "David Harrison",
    role: "Founder, IronPeak Manufacturing",
  }, // EDIT
  {
    quote:
      "From the first concept to the final cut, the team brought a level of craft and clarity that made the whole process effortless. The result spoke for itself.",
    author: "Mara Lindqvist",
    role: "Brand Director, Vista Motion",
  }, // EDIT
];

export const cta = {
  lead: "At Triptych Studios", // EDIT
  body:
    "You share your vision, message, or concept — and our team shapes the creative direction, visual rhythm, and cinematic composition to produce a powerful visual narrative.", // EDIT
};

// Deterministic placeholder gradients for the About page imagery.
// EDIT: replace with real stills once available.
const A_GRADIENTS = [
  ["#2a1f16", "#8a6b3e"],
  ["#1a1c22", "#3d4652"],
  ["#221820", "#5a3644"],
  ["#14201c", "#2f5148"],
  ["#241c2e", "#4a3d6a"],
];

export function aboutGradient(index: number): string {
  const [a, b] = A_GRADIENTS[index % A_GRADIENTS.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}
