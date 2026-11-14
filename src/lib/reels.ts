// -------------------------------------------------------------------------
// EDIT: the reels on the home page's Featured Work — vertical (9:16)
// videos shown in a phone-style frame with a mock social overlay.
//
// Clips live in /public/reels/vertical/ (720×1280 mp4) with a small frame
// for the card in /public/reels/insets/. A horizontal clip also works: the
// frame crops it to 9:16 from the centre — set `focus` to move the crop.
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

// EDIT: placeholders — vertical cuts from the studio's brand shoot (Google
// Drive), until the real social pieces are picked. Eight fill the grid
// (four across on desktop).
const shoot = (n: number, title: string, caption: string): Reel => ({
  src: `/reels/vertical/v${n}.mp4`,
  inset: `/reels/insets/v${n}.jpg`,
  href: "/projects",
  title,
  artist: "Triptych Studios",
  caption,
});

export const reels: Reel[] = [
  shoot(1, "The walk-in", "First day in the new office."), // EDIT
  shoot(2, "Skyline", "Chicago from the top."), // EDIT
  shoot(3, "Rooftop", "Golden hour, forty floors up."), // EDIT
  shoot(4, "The office", "Lights, laptop, launch."), // EDIT
  shoot(5, "Dinner", "Cocktails before the close."), // EDIT
  shoot(6, "The menu", "A table worth the wait."), // EDIT
  shoot(7, "Downtown", "Flags, stone and steel."), // EDIT
  shoot(8, "Riverwalk", "Arms crossed, deal done."), // EDIT
];
