// -------------------------------------------------------------------------
// The hero reel: approved shots from the studio's work, cut from the masters
// in Google Drive (Overthink, Hands Up!!!, Good Morning America, Englewood
// Tommy, Obsessive Compulsive Imagination, Symptom, Feel the Love). They play in a random
// order on every visit (components/HeroReel.tsx), after a fixed opening.
// EDIT: delete a line to drop a shot; files live in /public/hero/reel
// (NAME.mp4 1080p, NAME-m.mp4 720p for phones).
// -------------------------------------------------------------------------
/** One shot: its files, and the project (slug in lib/projects) it's from. */
export type HeroClip = { src: string; phone: string; project?: string };

// EDIT: which project each shot is from — the label on the hero names it.
// The r-numbered shots were cut in this order, so a range of numbers is
// one video; the others go by their name.
const SOURCES: { from: number; to: number; project: string }[] = [
  { from: 1, to: 32, project: "overthink" },
  { from: 33, to: 47, project: "hands-up" },
  { from: 48, to: 64, project: "good-morning-america" },
  { from: 65, to: 84, project: "poetic-street-talk" },
  { from: 85, to: 113, project: "obsessive-compulsive-imagination" },
  { from: 114, to: 999, project: "symptom" },
];
function sourceOf(name: string): string | undefined {
  if (name.startsWith("ftl")) return "feel-the-love";
  if (name.startsWith("sym")) return "symptom";
  if (name.startsWith("hu-")) return "hands-up";
  const n = Number(name.replace(/^r/, ""));
  return SOURCES.find((s) => n >= s.from && n <= s.to)?.project;
}

const shot = (name: string): HeroClip => ({
  src: `/hero/reel/${name}.mp4`,
  phone: `/hero/reel/${name}-m.mp4`,
  project: sourceOf(name),
});

// EDIT: the opening, always first and in this order: Wale, Overthink.
export const HERO_OPENING: HeroClip[] = [shot("r04"), shot("r20"), shot("r11"), shot("r28")];

// EDIT: shots that always play early, at this place among the shuffled
// shots after the opening (0 = straight after it).
export const HERO_FEATURED: { clip: HeroClip; at: number }[] = [
  { clip: shot("r38"), at: 1 }, // Hands Up!!! — the four-square split
  { clip: shot("hu-whips"), at: 4 }, // Hands Up!!! — the whole whip-pan run, 1:05–1:50 (41 s)
];

// Everything else, shuffled on every visit.
export const HERO_CLIPS: HeroClip[] = [
  shot("ftl01"),
  shot("ftl02"),
  shot("ftl03"),
  shot("ftl04"),
  shot("ftl05"),
  shot("ftl06"),
  shot("ftl07"),
  shot("ftl08"),
  shot("ftl09"),
  shot("ftl10"),
  shot("r01"),
  shot("r02"),
  shot("r05"),
  shot("r06"),
  shot("r07"),
  shot("r08"),
  shot("r09"),
  shot("r10"),
  shot("r100"),
  shot("r101"),
  shot("r102"),
  shot("r103"),
  shot("r104"),
  shot("r105"),
  shot("r106"),
  shot("r107"),
  shot("r108"),
  shot("r109"),
  shot("r110"),
  shot("r111"),
  shot("r112"),
  shot("r113"),
  shot("r114"),
  shot("r115"),
  shot("r118"),
  shot("r119"),
  shot("r12"),
  shot("r120"),
  shot("r121"),
  shot("r122"),
  shot("r123"),
  shot("r124"),
  shot("r125"),
  shot("r126"),
  shot("r127"),
  shot("r128"),
  shot("r129"),
  shot("r13"),
  shot("r130"),
  shot("r131"),
  shot("r132"),
  shot("r133"),
  shot("r134"),
  shot("r135"),
  shot("r136"),
  shot("r137"),
  shot("r138"),
  shot("r139"),
  shot("r14"),
  shot("r140"),
  shot("r141"),
  shot("r142"),
  shot("r143"),
  shot("r15"),
  shot("r16"),
  shot("r17"),
  shot("r18"),
  shot("r19"),
  shot("r21"),
  shot("r22"),
  shot("r23"),
  shot("r24"),
  shot("r25"),
  shot("r26"),
  shot("r27"),
  shot("r29"),
  shot("r30"),
  shot("r31"),
  shot("r32"),
  shot("r33"),
  shot("r35"),
  shot("r36"),
  shot("r37"),
  shot("r39"),
  shot("r40"),
  shot("r42"),
  shot("r49"),
  shot("r50"),
  shot("r51"),
  shot("r52"),
  shot("r53"),
  shot("r54"),
  shot("r55"),
  shot("r56"),
  shot("r57"),
  shot("r58"),
  shot("r59"),
  shot("r60"),
  shot("r61"),
  shot("r62"),
  shot("r63"),
  shot("r65"),
  shot("r67"),
  shot("r68"),
  shot("r69"),
  shot("r70"),
  shot("r71"),
  shot("r72"),
  shot("r73"),
  shot("r74"),
  shot("r75"),
  shot("r76"),
  shot("r77"),
  shot("r78"),
  shot("r79"),
  shot("r80"),
  shot("r81"),
  shot("r82"),
  shot("r83"),
  shot("r84"),
  shot("r85"),
  shot("r87"),
  shot("r88"),
  shot("r89"),
  shot("r90"),
  shot("r91"),
  shot("r92"),
  shot("r93"),
  shot("r94"),
  shot("r95"),
  shot("r96"),
  shot("r97"),
  shot("r98"),
  shot("r99"),
  shot("sym-grillz"),
  shot("sym-red1"),
  shot("sym-red2"),
];
