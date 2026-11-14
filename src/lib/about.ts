// -------------------------------------------------------------------------
// EDIT: All About-page copy lives here. Rebranded to Triptych from the
// reference; swap in real clients, services, history and testimonials.
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

export const stats = {
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
  bestAds: "Featured in Chicago Reader", // EDIT: press feature shown in the purple box
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

/**
 * "10 years in business" scroll timeline on the home page, 2016 → 2026.
 * Built from the record: YouTube upload dates and view counts of the
 * studio's videos (as of November 2026 — the counts keep climbing), the
 * Chicago Reader's "Chicagoans of Note" profile, and press coverage.
 * EDIT any line; view counts are rounded down so they stay true.
 */
export const decade: { year: string; title: string; body: string }[] = [
  {
    year: "2016",
    title: "Triptych is founded",
    body: "Law Mahone starts the studio in Chicago straight out of Homewood-Flossmoor High School, the same year he enrolls at Tribeca Flashpoint. By December, Orlando Brown's “Picasso's Nightmare” passes 200K views.",
  }, // EDIT
  {
    year: "2017",
    title: "The breakout year",
    body: "Nineteen music videos in twelve months. Queen Key's “My Way” goes on to 16M+ views, and Trippie Redd's “Overweight” ft. Chris King, edited by Triptych, passes 4M.",
  }, // EDIT
  {
    year: "2018",
    title: "Known for the cut",
    body: "Law makes his name in the edit, and national outlets pick up the work: Hypebeast covers Trippie Redd's “Overweight.” Sumo's “Mo' Swag” keeps the run going.",
  }, // EDIT
  {
    year: "2019",
    title: "Fifty million views",
    body: "A degree in post-production, and the biggest year yet: Polo G's “Effortless” passes 50M views, Lil Durk's “Weirdo Hoes” 25M. Calboy's “Jazz” and Queen Key's “Dimple” remix follow.",
  }, // EDIT
  {
    year: "2020",
    title: "G Herbo and Lil Peep",
    body: "G Herbo's “Ridin Wit It” climbs past 48M views and Lil Peep's “hellboy” past 31M — together nearly 80M for the year's releases.",
  }, // EDIT
  {
    year: "2021",
    title: "Behind the scenes",
    body: "Complex runs Lil Zay Osama's “Shooters” ft. Doe Boy, and the studio starts sharing its sets — from Queen Key's “Too Hot” to Lil Zay Osama's “SBA.”",
  }, // EDIT
  {
    year: "2022",
    title: "Cinema cameras",
    body: "G Herbo's “Locked In” passes 8.5M views. Law directs Jssan's “City of Mine,” and the studio moves up to the Sony FX6 and RED Komodo.",
  }, // EDIT
  {
    year: "2023",
    title: "Building the studio",
    body: "A new reel and a look inside the rigs — the camera setups and process behind every frame, shared with a growing audience.",
  }, // EDIT
  {
    year: "2024",
    title: "Gold Haze, in four parts",
    body: "A four-video run for Gold Haze — “This Forever,” “For Certain,” “Tears Fly” and “Realest Truth” — plus Jay Wood's “Practice” ft. theMIND.",
  }, // EDIT
  {
    year: "2025",
    title: "Chicagoans of Note",
    body: "The Chicago Reader profiles Law in its “Chicagoans of Note” series, and “Feel the Love” arrives.",
  }, // EDIT
  {
    year: "2026",
    title: "Ten years, 190M+ views",
    body: "Wale's “Overthink” ft. Elmiene passes 2.5M views in its first months. A decade in: 500+ projects, and 190M+ views across the videos.",
  }, // EDIT
];
