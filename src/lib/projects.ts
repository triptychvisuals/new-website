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
};

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

// EDIT: placeholder titles for the not-yet-filled cards
const titles = [
  "Echoes of the City",
  "Shadow of Tomorrow",
  "Silent Horizon",
  "Beyond the Last Frame",
  "The Midnight Route",
  "Broken Skyline",
  "Fragments of Light",
  "The Final Signal",
  "Drive the Future",
  "Pure Motion",
  "Urban Energy",
  "The Midnight Route V2",
  "Neon Divide",
  "Slow Tide",
  "Afterglow",
  "Paper Moon",
  "Cold Open",
  "Dust & Gold",
  "The Long Exposure",
  "Static Bloom",
  "Undertow",
  "Signal Fire",
  "Glass Horizon",
  "Night Shift",
  "Half Light",
  "The Understudy",
  "Wildcard",
  "Foreign Tongue",
  "Paper Trail",
  "Terminal Velocity",
];

// EDIT: real projects wired to specific cards — { title, category, video }
const OVERRIDES: Record<number, Partial<Project>> = {
  0: { title: "Timmy Story", category: "Music Video", video: "/reels/reel-a.mp4" },
  1: { title: "Hands Up", category: "Music Video", video: "/reels/reel-b.mp4" },
  2: {
    title: "Good Morning America",
    category: "Music Video",
    video: "/reels/reel-c.mp4",
    // 4:3 source in a 16:9 cell — bias the crop down so the seated subject's
    // face + hands stay in frame instead of empty text headroom up top.
    objectPosition: "50% 60%",
  },
  3: { title: "Feel the Love", category: "Music Video", video: "/reels/feel-the-love.mp4" },
};

// EDIT: placeholder years shown top-right of each card (swap for the real ones)
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

export const projects: Project[] = titles.map((title, i) => {
  const t = OVERRIDES[i]?.title ?? title;
  return {
    title: t,
    slug: slugify(t),
    category: OVERRIDES[i]?.category ?? "Music Video", // EDIT: default category
    video: OVERRIDES[i]?.video,
    objectPosition: OVERRIDES[i]?.objectPosition,
    artist: OVERRIDES[i]?.artist, // EDIT: set an artist to show instead of category
    year: OVERRIDES[i]?.year ?? YEARS[i % YEARS.length],
    logo: OVERRIDES[i]?.logo ?? PLACEHOLDER_LOGOS[i % PLACEHOLDER_LOGOS.length],
  };
});

/** Look up a project (and its index) by slug — for the detail route. */
export function projectBySlug(
  slug: string
): { project: Project; index: number } | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  return index === -1 ? undefined : { project: projects[index], index };
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
