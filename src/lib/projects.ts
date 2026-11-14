// -------------------------------------------------------------------------
// EDIT: Projects. Each card shows title (top) + category (bottom) and
// autoplays a reel. `clients` (below) feeds the About page.
// -------------------------------------------------------------------------

export type Project = {
  title: string;
  /** URL-safe id for the /work/[slug] detail page. */
  slug: string;
  category: string;
  /** EDIT: real still image, e.g. "/work/x.jpg" */
  src?: string;
  /** EDIT: real reel — a file in /public/reels */
  video?: string;
  /**
   * EDIT: focal point for the object-cover crop, e.g. "50% 30%".
   * Only needed when a clip isn't natively 16:9 and the default center
   * crop cuts the subject. Higher second value = show more of the bottom.
   */
  objectPosition?: string;
  /** EDIT: gray subtitle under the title (e.g. the artist). Falls back to category. */
  artist?: string;
  /** EDIT: year shown at the top-right of the card, e.g. "2020". */
  year?: string;
  /** EDIT: small logo shown under the year, e.g. "/logos/label.svg". */
  logo?: string;
  /**
   * EDIT: the video's YouTube id (the part after "watch?v=" in its link).
   * Gives the card its thumbnail, the project page its player, and puts
   * the video on the home page's 500+ grid.
   */
  youtube?: string;
  /** Post-production credits: what Triptych did on it, e.g. ["Edit", "Color"]. */
  roles?: string[];
  /** Post-production credits: who directed / produced it. */
  director?: string;
};

// EDIT: the category name post-production credits file under.
export const POST_PRODUCTION = "Post Production";

// EDIT: brands / labels Triptych works with (used on the About page + hero marquee)
export const clients = [
  "Universal Music Group",
  "Interscope Records",
  "Warner Music Group",
  "RCA",
  "Atlantic Records",
  "Capitol Records",
  "Republic Records",
];

// -------------------------------------------------------------------------
// EDIT: the projects, newest first. Each one: title, artist, year, and
// where its video lives —
//   youtube: the id after "watch?v=" in its YouTube link (thumbnail, player
//            on its page, and a tile on the home page's 500+ grid)
//   video:   a local reel in /public/reels that loops on its card
// Years marked "~" in a comment are estimates from the upload date — fix
// them as you go. Projects with no youtube id yet show a colour poster
// until one is pasted in.
// -------------------------------------------------------------------------
type Authored = Omit<Project, "slug" | "category"> & { category?: string };

const AUTHORED: Authored[] = [
  { title: "Overthink", artist: "Wale ft. Elmiene", year: "2026", youtube: "aEfoHSFeTII" },
  { title: "Dramatic", artist: "Jay Wood ft. Quintin & Jonah Renna", year: "2025" }, // EDIT: youtube id
  { title: "Timmy Story", year: "2025", video: "/reels/reel-a.mp4" }, // EDIT: artist + youtube id
  { title: "Hands Up!!!", artist: "Jay Wood", year: "2025", video: "/reels/reel-b.mp4" }, // EDIT: youtube id
  {
    title: "Good Morning America",
    year: "2025",
    video: "/reels/reel-c.mp4",
    // 4:3 source in a 16:9 cell — bias the crop down so the seated subject's
    // face + hands stay in frame instead of empty text headroom up top.
    objectPosition: "50% 60%",
  }, // EDIT: artist + youtube id
  { title: "Feel the Love", year: "2024", video: "/reels/feel-the-love.mp4", youtube: "4LQP9E6W-3w" }, // EDIT: artist
  { title: "Locked In", artist: "G Herbo", year: "2022", youtube: "n3JAY-3H8Ao" },
  { title: "Ridin Wit It", artist: "G Herbo", year: "2020", youtube: "k5coDLFQrj0" }, // Triptych's most-watched video
  { title: "OK Cool", year: "2023" }, // EDIT: artist + youtube id
  { title: "Wiscansin", year: "2023" }, // EDIT: artist + youtube id
  { title: "Bogus", year: "2022" }, // EDIT: artist + youtube id
  { title: "Letter to the Game", artist: "Young Tee Tee", year: "2021", youtube: "EBX9TMi5tao" },
  { title: "Shooters", artist: "Lil Zay Osama ft. Doe Boy", year: "2021", youtube: "n0IiWdpcn5U" },
  { title: "Too Hot", artist: "Queen Key", year: "2021" }, // EDIT: youtube id
  { title: "Blackout", artist: "MVP Tino", year: "2019", youtube: "FiT7-3-EWEU" }, // ~
  { title: "Nightmares", artist: "Solly Bandz", year: "2019", youtube: "FmhTALb6JTc" }, // ~
  { title: "Dimple (Next Song Remix)", artist: "Queen Key", year: "2019", youtube: "n8f3ygPPIEY" }, // ~
  { title: "Timing", artist: "Khaliyah X", year: "2018" }, // EDIT: youtube id
  { title: "Impulses", artist: "Khaliyah X", year: "2018", youtube: "4yVaIs9jXj0" }, // ~
  { title: "Overweight", artist: "Trippie Redd ft. Chris King", year: "2017", youtube: "OvMwvYklW0I" },
  { title: "Who Dat", artist: "Lil Pump", year: "2017" }, // EDIT: youtube id
  { title: "My Way", artist: "Queen Key", year: "2017", youtube: "_3WOkRKuB9c" },
  { title: "Hip Hopper (Remix)", artist: "Sumo", year: "2017", youtube: "bYbFS0aDm4I" }, // ~
  { title: "Lean on Me", artist: "Sumo", year: "2017", youtube: "-wZKgZlHK-c" }, // ~
  { title: "Broken Seal", artist: "Tone The Artist", year: "2018", youtube: "EB9IAu9weTk" }, // ~
  { title: "Ready", artist: "VonMar", year: "2018", youtube: "kJmhphsjQeQ" }, // ~
  { title: "Petro", artist: "Jay Wood", year: "2018", youtube: "r6RXpiIrVZ4" }, // ~
  { title: "Ain't Sh*t", artist: "Captain Jaybe", year: "2017", youtube: "APCsiZ0lIfE" }, // ~
  { title: "2DB", artist: "Chulo ft. Rodie", year: "2017", youtube: "SC_VS1pLwKo" }, // ~
  { title: "Food for Thought", artist: "Jay Wood", year: "2016", youtube: "d48ptwLKnng" },
];

// -------------------------------------------------------------------------
// EDIT: post-production credits — work Triptych edited, coloured, finished
// or did VFX / sound on, for other directors and production companies.
// One line each, newest first. They get the "Post Production" filter on
// /projects, a page of their own like any project, and the roles show on
// the card. Fields:
//   title     the video's name
//   artist    the artist (or brand)
//   year      e.g. "2025"
//   roles     what you did — any of "Edit", "Color", "VFX", "Sound",
//             "Finishing", "Motion graphics", … (as many as apply)
//   director  who directed / produced it (optional)
//   youtube   the id after "watch?v=" in its YouTube link (thumbnail +
//             player, and its views count toward the live counter)
//   video     or a local clip in /public/reels instead
// Example:
//   { title: "Song Name", artist: "Artist", year: "2025", roles: ["Edit", "Color"], director: "Jane Doe", youtube: "dQw4w9WgXcQ" },
// -------------------------------------------------------------------------
const POST_CREDITS: Authored[] = [
  // ← add credits here
  // EDIT: roles — add what you did on each, e.g. roles: ["Edit", "Color"]
  { title: "Effortless", artist: "Polo G", year: "2019", director: "Laka Films", youtube: "kQZJbGifttw" },
  { title: "hellboy", artist: "Lil Peep", year: "2020", director: "Paul John", youtube: "s9t1ZfMZfH4" },
  { title: "Coupe", artist: "Bali Baby", year: "2017", roles: ["Edit"], director: "Spiffy Global", youtube: "zwa5UybNXpk" }, // ~
];

// EDIT: placeholder years for portal works that don't carry one
const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021"];

// EDIT: placeholder logos (generic marks) so the logo slot is visible — replace
// with real per-project logos (drop files in /public/logos and set them here).
const PLACEHOLDER_LOGOS = [
  "/logos/mark-1.svg",
  "/logos/mark-2.svg",
  "/logos/mark-3.svg",
  "/logos/mark-4.svg",
];

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const own: Project[] = AUTHORED.map((a, i) => ({
  ...a,
  slug: slugify(a.title),
  category: a.category ?? "Music Video", // EDIT: default category
  logo: a.logo ?? PLACEHOLDER_LOGOS[i % PLACEHOLDER_LOGOS.length],
}));

const taken = new Set(own.map((p) => p.slug));
const post: Project[] = POST_CREDITS.map((a, i) => {
  // a credit sharing a title with a studio project gets the artist on its address
  let slug = slugify(a.title);
  if (taken.has(slug)) slug = slugify(`${a.title} ${a.artist ?? "post"}`);
  taken.add(slug);
  return { ...a, slug, category: POST_PRODUCTION, logo: a.logo ?? PLACEHOLDER_LOGOS[i % PLACEHOLDER_LOGOS.length] };
});

/** Every project — the studio's own productions, then the post credits. */
export const projects: Project[] = [...own, ...post];

/** Just the post-production credits. */
export const postCredits: Project[] = post;

/** Look up a project (and its index) by slug — for the detail route. */
export function projectBySlug(
  slug: string
): { project: Project; index: number } | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  return index === -1 ? undefined : { project: projects[index], index };
}

// ── portal-driven projects ──────────────────────────────────────────
// When the portal feed carries works, THEY are the project list —
// adding or removing a project in the portal adds or removes it here.
// The authored list above stays as the fallback for an empty or
// unreachable feed.

/** The portal work shape this module needs (structural — see siteContent.ts). */
type WorkLike = {
  title?: string;
  client?: string;
  slug?: string;
  category?: string;
  year?: string;
  reel?: string;
  /** A clip published from the portal's delivery: the player when no reel is set. */
  clip?: string;
};

/** A feed work as a gallery/detail Project, with authored-style defaults. */
export function projectFromWork(w: WorkLike, index: number): Project {
  const title = w.title || `Untitled ${index + 1}`;
  return {
    title,
    slug: w.slug || slugify(title),
    category: w.category || "Music Video",
    artist: w.client,
    year: w.year ?? YEARS[index % YEARS.length],
    video: w.reel || w.clip,
    logo: PLACEHOLDER_LOGOS[index % PLACEHOLDER_LOGOS.length],
  };
}

// Deterministic gradient base per card (poster behind the reel).
const GRADIENTS = [
  ["#3a2e26", "#7a5c3e"],
  ["#1c1c22", "#40404d"],
  ["#2a1618", "#7c2b2f"],
  ["#12211f", "#2f5d54"],
  ["#241f2e", "#5a4a7a"],
  ["#0f1720", "#334155"],
];

export function placeholderGradient(index: number): string {
  const [a, b] = GRADIENTS[index % GRADIENTS.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

// Animated reel loops (local, autoplay). EDIT: replace with real footage.
const MEDIA = [
  "/reels/reel-01.svg",
  "/reels/reel-02.svg",
  "/reels/reel-03.svg",
  "/reels/reel-04.svg",
  "/reels/reel-05.svg",
  "/reels/reel-06.svg",
  "/reels/reel-07.svg",
  "/reels/reel-08.svg",
];

export function projectMedia(index: number): string {
  return MEDIA[index % MEDIA.length];
}
