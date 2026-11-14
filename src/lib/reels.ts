// -------------------------------------------------------------------------
// EDIT: the reels on the home page's Featured Work — vertical (9:16)
// videos shown in a phone-style frame with a mock social overlay.
//
// Drop vertical clips in /public/reels/vertical/ and list them here. Until
// then these entries use the studio's existing (horizontal) clips, which
// the frame crops to 9:16 from the centre — set `focus` to move the crop.
// -------------------------------------------------------------------------

export type Reel = {
  /** The video file (mp4 / webm), ideally 1080×1920. */
  src: string;
  /** The project it opens, e.g. "/work/overthink" — or "/projects". */
  href: string;
  title: string;
  /** The line under the title, e.g. the artist. */
  artist?: string;
  /** The caption under it (keep it to a line or two). */
  caption: string;
  /** The audio line, e.g. "Wale · Overthink". Defaults to "Original audio". */
  audio?: string;
  /** Crop focus for a horizontal clip, as CSS object-position (e.g. "35% 50%"). */
  focus?: string;
  /** EDIT: real numbers for the card's bottom-left, e.g. "198.8K" — left
   *  out, the card shows the title and artist there instead. */
  views?: string;
  likes?: string;
  comments?: string;
  /** The words that pop up one at a time in the middle (defaults to the caption). */
  words?: string;
  /** A small frame from the video, bottom-right (/public/reels/insets/). */
  inset?: string;
};

export const reels: Reel[] = [
  {
    src: "/hero/hero.mp4",
    inset: "/reels/insets/showreel.jpg",
    href: "/projects",
    title: "Showreel",
    artist: "Triptych Studios",
    caption: "Selected work, 2016 to now.", // EDIT
  },
  {
    src: "/reels/reel-b.mp4",
    inset: "/reels/insets/hands-up.jpg",
    href: "/work/hands-up",
    title: "Hands Up!!!",
    artist: "Jay Wood",
    caption: "Color, movement and a lot of paint.", // EDIT
    audio: "Jay Wood · Hands Up!!!",
    focus: "45% 50%",
  },
  {
    src: "/reels/reel-a.mp4",
    inset: "/reels/insets/timmy-story.jpg",
    href: "/work/timmy-story",
    title: "Timmy Story",
    caption: "One room, one light.", // EDIT
  },
  {
    src: "/reels/feel-the-love.mp4",
    inset: "/reels/insets/feel-the-love.jpg",
    href: "/work/feel-the-love",
    title: "Feel the Love",
    caption: "Music video, 2024.", // EDIT
  },
  {
    src: "/reels/reel-c.mp4",
    inset: "/reels/insets/good-morning-america.jpg",
    href: "/work/good-morning-america",
    title: "Good Morning America",
    caption: "Music video, 2025.", // EDIT
    focus: "50% 60%",
  },
  {
    // EDIT: placeholder — a later moment of the showreel (#t= start, in
    // seconds) with a different crop, until a sixth vertical clip arrives.
    src: "/hero/hero.mp4#t=8",
    inset: "/reels/insets/behind-the-lens.jpg",
    href: "/projects",
    title: "Behind the lens",
    artist: "Triptych Studios",
    caption: "On set in Chicago.", // EDIT
    focus: "30% 50%",
  },
];
