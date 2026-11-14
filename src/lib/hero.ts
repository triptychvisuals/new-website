// -------------------------------------------------------------------------
// EDIT: the lead video at the top of the home page. The YouTube id (the part
// after "watch?v=") plays muted, looped and full-bleed behind the hero.
// Leave it "" and the hero goes back to the local clips in HeroReel.
// -------------------------------------------------------------------------
export const HERO_YOUTUBE = "IEqccPhsqgA";

/** The full video with sound, for the "Watch the reel" link under the hero. */
export const HERO_WATCH_URL = HERO_YOUTUBE ? `https://www.youtube.com/watch?v=${HERO_YOUTUBE}` : "";
