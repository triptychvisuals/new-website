// -------------------------------------------------------------------------
// EDIT: the numbers under "Global Impact" (PartnerCard) and the live view
// counter.
// -------------------------------------------------------------------------

/** The row of headline stats — value and what it counts. */
export const IMPACT_STATS: { value: string; label: string }[] = [
  { value: "50M+", label: "Views across all videos" }, // EDIT
  { value: "500+", label: "Projects delivered" }, // EDIT
  { value: "7", label: "Major labels" }, // EDIT
  { value: "10", label: "Years in Chicago" }, // EDIT
];

/**
 * The live counter. With YOUTUBE_API_KEY set on Vercel (Project → Settings
 * → Environment Variables), /api/views adds up the real YouTube view counts
 * of every project with a `youtube` id (lib/projects.ts) plus the ids
 * below, once an hour. Between refreshes the counter ticks at each video's
 * average daily pace.
 *
 * Without a key it counts on from FALLBACK_BASE at FALLBACK_PER_DAY, from
 * FALLBACK_SINCE — labelled "and counting", not "live".
 */
export const LIVE_VIEWS = {
  // EDIT: how far below the real total the counter sits on the 1st of each
  // month (0.03 = 3%). It then climbs faster than the real views so it
  // meets the real total at the end of the month — a steady trickle that
  // never overshoots. On the 1st it steps back down and starts again.
  leeway: 0.03,
  // EDIT: count the views of post-production credits too (true/false).
  includePostProduction: true,
  // EDIT: YouTube ids of videos you made that aren't projects on the site
  // (the part after "watch?v="), so they count too.
  extraIds: [
    "VbONF4saaIU", // Lil Durk — EDIT: give it a project entry in lib/projects.ts once titled
  ] as string[],
  // EDIT: views from places the API can't see (Instagram, TikTok, TV…),
  // added on top of the YouTube total.
  offset: 0,
  FALLBACK_BASE: 50_000_000, // EDIT
  FALLBACK_SINCE: "2026-11-13T00:00:00Z", // EDIT: the day FALLBACK_BASE was true
  FALLBACK_PER_DAY: 25_000, // EDIT: estimated new views per day
};
