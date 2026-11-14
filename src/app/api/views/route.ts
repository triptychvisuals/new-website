// Live view count for the "Global Impact" counter. Adds up the YouTube
// view counts of:
//   1. every project video on the site (lib/projects.ts) plus
//      LIVE_VIEWS.extraIds, and
//   2. every upload on the studio's own channel (LIVE_VIEWS.channel), less
//      any upload that is already one of the videos in 1 — the same video,
//      or a copy of a project already counted (same song and artist in the
//      title) — so nothing is counted twice.
// It also works out how fast the total is growing: the sum of each video's
// average views per day over its life. Rebuilt at most once an hour, so the
// YouTube quota is never a concern.
//
// The answer also lists what it did — which channel uploads it counted,
// which it skipped as duplicates, and any site video YouTube didn't return
// (private, deleted or a wrong id) — so the numbers can be checked.
//
// Needs YOUTUBE_API_KEY (a YouTube Data API v3 key) in the environment;
// without one it answers { live: false } and the counter falls back.
import { projects, POST_PRODUCTION, type Project } from "@/lib/projects";
import { LIVE_VIEWS } from "@/lib/stats";

export const dynamic = "force-static";
export const revalidate = 3600; // EDIT: seconds between refreshes

const API = "https://www.googleapis.com/youtube/v3";

type VideoItem = { id?: string; statistics?: { viewCount?: string }; snippet?: { publishedAt?: string; title?: string } };

/** Lower-case words only, padded so " word " matching works on whole words. */
const norm = (s: string) =>
  ` ${s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;

/** Does a channel upload's title name this project (its song, and its artist when known)? */
function sameSong(title: string, p: Project): boolean {
  const t = norm(title);
  const song = norm(p.title.replace(/\(.*?\)|\[.*?\]/g, ""));
  if (song.trim().length < 2 || !t.includes(song)) return false;
  if (!p.artist) return true;
  const lead = norm(p.artist.split(/\s+(?:ft\.?|feat\.?|featuring|x|&|and|with)\s+/i)[0]);
  return t.includes(lead);
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`YouTube ${res.status}`);
  return (await res.json()) as T;
}

/** Every upload on a channel (id + title), newest first. */
async function channelUploads(handle: string, key: string): Promise<{ id: string; title: string }[]> {
  const ch = await get<{ items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[] }>(
    `${API}/channels?${new URLSearchParams({ part: "contentDetails", forHandle: handle, key })}`
  );
  const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error("channel not found");
  const out: { id: string; title: string }[] = [];
  let page: string | undefined;
  for (let n = 0; n < 40; n++) {
    const q = new URLSearchParams({ part: "snippet", playlistId: uploads, maxResults: "50", key });
    if (page) q.set("pageToken", page);
    const pl = await get<{
      items?: { snippet?: { title?: string; resourceId?: { videoId?: string } } }[];
      nextPageToken?: string;
    }>(`${API}/playlistItems?${q}`);
    for (const it of pl.items ?? []) {
      const id = it.snippet?.resourceId?.videoId;
      if (id) out.push({ id, title: it.snippet?.title ?? "" });
    }
    page = pl.nextPageToken;
    if (!page) break;
  }
  return out;
}

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return Response.json({ live: false });

  const counted = projects.filter((p) => LIVE_VIEWS.includePostProduction || p.category !== POST_PRODUCTION);
  const siteIds = [...new Set([...counted.map((p) => p.youtube), ...LIVE_VIEWS.extraIds].filter((x): x is string => !!x))];
  const known = new Set(siteIds);

  // The channel's uploads, minus anything already counted.
  const channelCounted: string[] = [];
  const channelSkipped: string[] = [];
  const channelIds: string[] = [];
  let channelError: string | undefined;
  if (LIVE_VIEWS.channel) {
    try {
      for (const v of await channelUploads(LIVE_VIEWS.channel, key)) {
        // Only projects that already count a YouTube video can make a copy a
        // duplicate — one with no video on the site isn't counted yet.
        const dupe = known.has(v.id) ? "same video" : counted.find((p) => p.youtube && sameSong(v.title, p))?.title;
        if (dupe || LIVE_VIEWS.skipChannelIds.includes(v.id)) {
          channelSkipped.push(`${v.title} — ${dupe ? `already counted (${dupe})` : "skipped in lib/stats.ts"}`);
          continue;
        }
        known.add(v.id);
        channelIds.push(v.id);
        channelCounted.push(v.title);
      }
    } catch (e) {
      channelError = e instanceof Error ? e.message : "channel unavailable";
    }
  }

  const ids = [...siteIds, ...channelIds];
  const returned = new Set<string>();
  const now = Date.now();
  let total = 0;
  let perDay = 0;
  try {
    for (let i = 0; i < ids.length; i += 50) {
      const q = new URLSearchParams({ part: "statistics,snippet", id: ids.slice(i, i + 50).join(","), key });
      const data = await get<{ items?: VideoItem[] }>(`${API}/videos?${q}`);
      for (const it of data.items ?? []) {
        const views = Number(it.statistics?.viewCount ?? 0);
        const published = Date.parse(it.snippet?.publishedAt ?? "") || now - 365 * 864e5;
        // at least 30 days, so a brand-new upload doesn't run away with the rate
        const days = Math.max(30, (now - published) / 864e5);
        total += views;
        perDay += views / days;
        if (it.id) returned.add(it.id);
      }
    }
  } catch {
    return Response.json({ live: false });
  }

  // Site videos YouTube didn't return — private, deleted, or a wrong id.
  const missing = siteIds
    .filter((id) => !returned.has(id))
    .map((id) => {
      const p = projects.find((x) => x.youtube === id);
      return p ? `${p.title}${p.artist ? ` — ${p.artist}` : ""} (${id})` : id;
    });

  return Response.json({
    live: true,
    total: total + LIVE_VIEWS.offset,
    perDay,
    videos: returned.size,
    at: now,
    report: {
      siteVideos: siteIds.length - missing.length,
      channelVideos: channelIds.filter((id) => returned.has(id)).length,
      channelCounted,
      channelSkipped,
      missing,
      ...(channelError ? { channelError } : {}),
    },
  });
}
