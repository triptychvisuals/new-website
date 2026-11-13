// Live view count for the "Global Impact" counter. Adds up the YouTube
// view counts of every project video (lib/projects.ts) plus
// LIVE_VIEWS.extraIds, and works out how fast they're growing: the sum of
// each video's average views per day over its life. Rebuilt at most once
// an hour, so the YouTube quota is never a concern (one call per 50 videos).
// Needs YOUTUBE_API_KEY (a YouTube Data API v3 key) in the environment;
// without one it answers { live: false } and the counter falls back.
import { projects } from "@/lib/projects";
import { LIVE_VIEWS } from "@/lib/stats";

export const dynamic = "force-static";
export const revalidate = 3600; // EDIT: seconds between refreshes

type Item = { statistics?: { viewCount?: string }; snippet?: { publishedAt?: string } };

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return Response.json({ live: false });

  const ids = [...new Set([...projects.map((p) => p.youtube), ...LIVE_VIEWS.extraIds].filter((x): x is string => !!x))];
  const now = Date.now();
  let total = 0;
  let perDay = 0;
  let videos = 0;
  try {
    for (let i = 0; i < ids.length; i += 50) {
      const q = new URLSearchParams({ part: "statistics,snippet", id: ids.slice(i, i + 50).join(","), key });
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${q}`, { next: { revalidate } });
      if (!res.ok) throw new Error(`YouTube ${res.status}`);
      const data = (await res.json()) as { items?: Item[] };
      for (const it of data.items ?? []) {
        const views = Number(it.statistics?.viewCount ?? 0);
        const published = Date.parse(it.snippet?.publishedAt ?? "") || now - 365 * 864e5;
        // at least 30 days, so a brand-new upload doesn't run away with the rate
        const days = Math.max(30, (now - published) / 864e5);
        total += views;
        perDay += views / days;
        videos += 1;
      }
    }
  } catch {
    return Response.json({ live: false });
  }
  return Response.json({ live: true, total: total + LIVE_VIEWS.offset, perDay, videos, at: now });
}
