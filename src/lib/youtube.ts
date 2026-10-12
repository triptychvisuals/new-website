// -------------------------------------------------------------------------
// EDIT: official music videos from Lawrence Mahone's YouTube — each one's
// thumbnail fills a tile on the 500+ work grid (in this order, first tile
// first) and the tile opens the video. With fewer videos than tiles the list
// repeats to keep the grid full, so every video added here replaces a
// repeat. Add a video: copy the id after "watch?v=" in its URL and add a
// line. Thumbnails load straight from YouTube, so nothing needs downloading.
// -------------------------------------------------------------------------

export type YouTubeVideo = { id: string; title: string };

export const musicVideos: YouTubeVideo[] = [
  { id: "_3WOkRKuB9c", title: "Queen Key — My Way (Official Music Video)" },
  { id: "FiT7-3-EWEU", title: "MVP Tino — Blackout (Official Music Video)" },
  { id: "-wZKgZlHK-c", title: "Sumo — Lean on Me (Official Music Video)" },
  { id: "EB9IAu9weTk", title: "Tone The Artist — Broken Seal (Official Music Video)" },
  { id: "EBX9TMi5tao", title: "Young Tee Tee — Letter to the Game (Official Music Video)" },
  { id: "kJmhphsjQeQ", title: "VonMar — Ready (Official Music Video)" },
  { id: "4yVaIs9jXj0", title: "Khaliyah X — Impulses (Official Music Video)" },
  { id: "r6RXpiIrVZ4", title: "Jay Wood — Petro (Official Music Video)" },
  { id: "APCsiZ0lIfE", title: "Captain Jaybe — Ain't Sh*t (Official Music Video)" },
  { id: "SC_VS1pLwKo", title: "Chulo ft. Rodie — 2DB (Official Music Video)" },
  { id: "d48ptwLKnng", title: "Jay Wood — Food for Thought (Official Music Video)" },
  { id: "zwa5UybNXpk", title: "Bali Baby — Coupe (Official Music Video)" },
  { id: "bYbFS0aDm4I", title: "Sumo — Hip Hopper (Remix) (Official Music Video)" },
  { id: "FmhTALb6JTc", title: "Solly Bandz — NIGHTMARES (Official Video)" },
  { id: "4LQP9E6W-3w", title: "FEEL THE LOVE (Official Video)" },
];

/**
 * Thumbnail URLs, best first. maxresdefault (1280×720) isn't generated for
 * every upload; mqdefault (320×180) always is. Both are 16:9 with no
 * letterbox bars, so they crop cleanly to a square tile.
 */
export function youtubeThumbs(id: string): [string, string] {
  return [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
  ];
}

export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
