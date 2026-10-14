// -------------------------------------------------------------------------
// EDIT: everything on the Press page — the feature(s), who has covered the
// work, the press-kit copy and the fast facts.
// -------------------------------------------------------------------------
import { site } from "./site";

export type Feature = {
  outlet: string;
  series?: string;
  title: string;
  url: string;
  date: string;
  /** A line from the piece, quoted on the card. */
  quote: string;
  /** Hue for the card's colour art (0–360). */
  hue: number;
};

export const features: Feature[] = [
  {
    outlet: "Chicago Reader",
    series: "Chicagoans of Note",
    title: "Law Mahone, founder of Triptych Visuals",
    url: "https://chicagoreader.com/music/chicagoans-of-note/lawrence-law-mahone-triptych-visuals-video/",
    date: "2025", // EDIT
    quote:
      "Lawrence “Law” Mahone and his video company, Triptych Visuals, have been commissioned by a long list of hip-hop artists.",
    hue: 262,
  },
];

/** Outlets that have premiered or covered the work. EDIT */
export const mentions: { outlet: string; what: string; url?: string }[] = [
  { outlet: "Chicago Reader", what: "Profile — Chicagoans of Note" },
  { outlet: "Lyrical Lemonade", what: "Premieres — Khaliyah X, Queen Key, ’LGado", url: "https://lyricallemonade.com/search?query=triptych+visuals" },
  { outlet: "Complex", what: "Lil Zay Osama — “Shooters”", url: "https://www.complex.com/music/lil-zay-osama-trench-baby-mixtape" },
  { outlet: "Hypebeast", what: "Trippie Redd — “Overweight”", url: "https://hypebeast.com/2018/11/trippie-redd-chris-king-overweight-video" },
];

/** Press-kit copy — copy-to-clipboard on the page. EDIT */
export const bios = {
  short: `${site.name} ${site.suffix} is a Chicago video production studio founded in 2016 by director Lawrence “Law” Mahone. Ten years, 500+ projects — music videos, commercials and brand films for artists and labels including G Herbo, Wale, Lil Zay Osama, Trippie Redd and Queen Key.`,
  long: `${site.name} ${site.suffix} is a video production studio based in Chicago, founded in 2016 by director Lawrence “Law” Mahone while he was still a teenager. What began as one camera and a run-and-gun approach to local artists’ videos has grown into a studio with 500+ projects behind it: music videos, commercials and brand films for artists and labels including G Herbo, Wale, Lil Zay Osama, Trippie Redd, Lil Pump, Queen Key and Khaliyah X, with work premiered by Lyrical Lemonade and covered by Complex, Hypebeast and the Chicago Reader. The studio’s signature is cinematic, colour-driven storytelling with an obsession for the frame — strategy, film and post handled in-house.`,
};

/** One line for programmes, captions and bylines. EDIT */
export const boilerplate = `${site.name} ${site.suffix} is a Chicago video production studio making cinematic music videos, commercials and brand films since 2016.`;

/** A quote from the founder, cleared for press. EDIT — placeholder wording. */
export const founderQuote = {
  text: "Every video starts with one question: what does this song look like when you close your eyes? Our job is to make that real.",
  by: "Lawrence “Law” Mahone, founder & director",
};

/** How press may use the material on this page. EDIT */
export const usage = "Logo, bios and stills may be used for editorial coverage of the studio and its work. Please credit “Triptych Studios” and don’t alter the logo. For anything else, ask first.";

export const facts: [string, string][] = [
  ["Founded", "2016"],
  ["Based in", "Chicago, IL"],
  ["Founder", "Lawrence “Law” Mahone"],
  ["Projects", "500+"],
  ["Partners", "80+"],
  ["Press contact", site.pressEmail],
];

export const logoFiles: { label: string; file: string; note: string }[] = [
  { label: "Logo — white", file: "/triptych-logo.png", note: "PNG, transparent · for dark backgrounds" },
];
