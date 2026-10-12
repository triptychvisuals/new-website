import fs from "node:fs";
import path from "node:path";
import { projects } from "@/lib/projects";
import { musicVideos, youtubeThumbs, youtubeUrl } from "@/lib/youtube";
import WorkGridClient, { type Bubble } from "./WorkGridClient";

// EDIT: the headline number and its label in the middle of the grid.
const COUNT_LABEL = "500+";
const CAPTION = "Projects completed";

// 6×6 grid; the middle 2×2 is the counter, so 32 tiles surround it.
const BUBBLES = 32;

/**
 * Thumbnails for the tiles: every image in /public/grid/ (jpg / png /
 * webp), in numeric filename order — 01.jpg fills the first tile, and so
 * on. EDIT: drop stills there; bubbles without one stay a color swatch.
 */
function gridThumbs(): string[] {
  const dir = path.join(process.cwd(), "public", "grid");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `/grid/${encodeURIComponent(f)}`);
}

/**
 * "Body of work" — a big, colorful 6×6 grid of rounded video tiles with the
 * project count in the middle, to make the sheer volume of work land.
 */
export default function WorkGrid() {
  const thumbs = gridThumbs();

  // Tiles fill in order: each YouTube music video (lib/youtube.ts) once,
  // then any stills from /public/grid/, then the videos again on repeat so
  // the grid stays full. Color swatches only show if there are no videos.
  const bubbles: Bubble[] = Array.from({ length: BUBBLES }, (_, i) => {
    // Golden-angle hue steps: neighbors never share a color, so the whole
    // grid reads as a spread of the spectrum.
    const hue = Math.round((i * 137.508) % 360);
    const k = i - musicVideos.length;
    if (k >= 0 && (k < thumbs.length || musicVideos.length === 0)) {
      const p = projects[k];
      return {
        href: p ? `/work/${p.slug}` : "/projects",
        title: p?.title ?? "All projects",
        thumb: thumbs[k],
        hue,
      };
    }
    const n = i < musicVideos.length ? i : (k - thumbs.length) % musicVideos.length;
    const video = musicVideos[n];
    const [thumb, thumbFallback] = youtubeThumbs(video.id);
    return { href: youtubeUrl(video.id), title: video.title, thumb, thumbFallback, external: true, hue };
  });

  return (
    <WorkGridClient bubbles={bubbles} countLabel={COUNT_LABEL} caption={CAPTION} />
  );
}
