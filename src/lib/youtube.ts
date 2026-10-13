// -------------------------------------------------------------------------
// YouTube helpers. The videos themselves are the projects in lib/projects.ts
// that have a `youtube` id — add one there and it appears on the 500+ grid,
// gets a thumbnail on its card and a player on its page.
// -------------------------------------------------------------------------
import { projects } from "./projects";

export type YouTubeVideo = { id: string; title: string };

/** Every project with a YouTube video, in project order (newest first). */
export const musicVideos: YouTubeVideo[] = projects
  .filter((p): p is typeof p & { youtube: string } => !!p.youtube)
  .map((p) => ({ id: p.youtube, title: p.artist ? `${p.artist} — ${p.title}` : p.title }));

/**
 * Thumbnail URLs, best first. sddefault (640×480) is plenty for a ~170px
 * tile on a retina screen and a fifth of maxres' weight to download and
 * decode — but it's 4:3 with the 16:9 frame letterboxed inside, so the tile
 * zooms it 4/3 to crop the bars off (see Thumb in WorkGridClient). mqdefault
 * (320×180, no bars) is the fallback for the odd upload without an SD still.
 */
export function youtubeThumbs(id: string): [string, string] {
  return [
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
  ];
}

export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** The embeddable player (privacy-enhanced domain — no cookies until play). */
export const youtubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&color=white`;

/**
 * Card / poster still: sddefault is 4:3 with the 16:9 frame letterboxed
 * inside, which an object-cover 16:9 box crops exactly, so no zoom needed.
 */
export const youtubePoster = (id: string) => youtubeThumbs(id)[0];
