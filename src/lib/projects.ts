// -------------------------------------------------------------------------
// EDIT: Projects + clients. Titles are placeholders; clients are real.
// Cards autoplay an animated reel (public/reels/*.svg) over a gradient base.
// -------------------------------------------------------------------------

export type Project = {
  title: string;
  client: string;
  /** EDIT: real still image, e.g. "/work/echoes.jpg" */
  src?: string;
  /** EDIT: real reel — drop a .gif/.mp4/.webm in /public and point here */
  video?: string;
};

// EDIT: labels + artists Triptych works with
export const clients = [
  "Universal Music Group",
  "Interscope Records",
  "Warner Music Group",
  "RCA",
  "Atlantic Records",
  "Capitol Records",
  "Republic Records",
  "G Herbo",
  "Lil Zay Osama",
  "Queen Key",
  "Lil Peep",
  "Polo G",
  "Nardo Wick",
  "Lil Durk",
];

// EDIT: project / video titles
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

// EDIT: real reels for specific cards (card index -> file in /public/reels)
const REELS: Record<number, string> = {
  0: "/reels/reel-a.gif",
  1: "/reels/reel-b.gif",
};

export const projects: Project[] = titles.map((title, i) => ({
  title,
  client: clients[i % clients.length],
  video: REELS[i],
}));

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

// Animated reel loops (local, autoplay via SVG animation — no network needed).
// EDIT: replace with real GIF/MP4 reels when available.
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
