// -------------------------------------------------------------------------
// EDIT: the numbers under "Global Impact" (PartnerCard) and the live view
// counter.
// -------------------------------------------------------------------------

import { clients } from "./projects";
/** The row of headline stats — value and what it counts. */
export const IMPACT_STATS: { value: string; label: string }[] = [
  { value: "2016", label: "Founded in Chicago" }, // EDIT
  { value: "500+", label: "Projects delivered" }, // EDIT
  { value: `${clients.length}`, label: "Major labels" }, // EDIT: counts the labels in lib/projects clients
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
    "XpK6-LT1YoI", // EDIT: name it here once identified
  ] as string[],
  // EDIT: the studio's own YouTube channel (its @handle). Every upload on it
  // counts too, except copies of videos already counted above — the same
  // video, or the same song and artist in the title. "" turns this off.
  channel: "@law.mahone",
  // EDIT: channel uploads to leave out anyway (ids), e.g. trailers or BTS.
  skipChannelIds: [] as string[],
  // EDIT: views from places the API can't see (Instagram, TikTok, TV…),
  // added on top of the YouTube total.
  offset: 0,
  FALLBACK_BASE: 191_000_000, // EDIT: last real total (from /api/views)
  FALLBACK_SINCE: "2026-11-14T00:00:00Z", // EDIT: the day FALLBACK_BASE was true
  FALLBACK_PER_DAY: 100_000, // EDIT: new views per day (YouTube pace)
};
