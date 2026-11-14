// -------------------------------------------------------------------------
// The hero reel: approved shots from the studio's work, cut from the masters
// in Google Drive (Overthink, Hands Up!!!, Good Morning America, Englewood
// Tommy, Obsessive Compulsive Imagination, Symptom). They play in a random
// order on every visit (components/HeroReel.tsx); the first one listed
// opens the reel. EDIT: delete a line to drop a shot; files live in
// /public/hero/reel (NAME.mp4 1080p, NAME-m.mp4 720p for phones).
// -------------------------------------------------------------------------
export type HeroClip = { src: string; phone: string };

const shot = (name: string): HeroClip => ({ src: `/hero/reel/${name}.mp4`, phone: `/hero/reel/${name}-m.mp4` });

export const HERO_CLIPS: HeroClip[] = [
  shot("r04"),
  shot("r01"),
  shot("r02"),
  shot("r05"),
  shot("r06"),
  shot("r07"),
  shot("r08"),
  shot("r09"),
  shot("r10"),
  shot("r11"),
  shot("r12"),
  shot("r13"),
  shot("r14"),
  shot("r15"),
  shot("r16"),
  shot("r17"),
  shot("r18"),
  shot("r19"),
  shot("r20"),
  shot("r21"),
  shot("r22"),
  shot("r23"),
  shot("r24"),
  shot("r25"),
  shot("r26"),
  shot("r27"),
  shot("r28"),
  shot("r29"),
  shot("r30"),
  shot("r31"),
  shot("r32"),
  shot("r33"),
  shot("r35"),
  shot("r36"),
  shot("r37"),
  shot("r38"),
  shot("r39"),
  shot("r40"),
  shot("r42"),
  shot("r43"),
  shot("r44"),
  shot("r45"),
];
