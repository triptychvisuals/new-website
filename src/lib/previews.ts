// -------------------------------------------------------------------------
// EDIT: the animated previews on the project cards — a few seconds of the
// finished video, silent and looping, that play while the card is on
// screen. Files: /public/previews/<slug>.mp4 (640×360, ~200 KB) plus a
// .jpg poster frame. Add a project's slug here once its files are in.
// Cards without one show their thumbnail with a slow push-in instead.
// -------------------------------------------------------------------------
const SLUGS = [
  "overthinking",
  "hands-up",
  "good-morning-america",
  "feel-the-love",
  "bogus",
  "poetic-street-talk",
  "obsessive-compulsive-imagination",
  "symptom",
];

// The same project under another address (the portal's slug vs the
// authored one) → the slug its files are under.
export const SLUG_ALIASES: Record<string, string> = {
  overthink: "overthinking",
};

export type Preview = { src: string; poster: string };

export function previewFor(slug: string): Preview | undefined {
  const s = SLUG_ALIASES[slug] ?? slug;
  return SLUGS.includes(s) ? { src: `/previews/${s}.mp4`, poster: `/previews/${s}.jpg` } : undefined;
}
