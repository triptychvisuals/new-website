// -------------------------------------------------------------------------
// EDIT: lighter copies of the big videos for phones. The full file plays on
// screens wider than PHONE_MAX; narrower screens get the copy listed here.
// The browser picks while loading the page (no JavaScript, nothing
// downloaded twice).
// -------------------------------------------------------------------------
export const PHONE_MAX = 899; // px
const PHONE_COPIES: Record<string, string> = {
  "/hero/hero.mp4": "/hero/hero-m.mp4",
};

/** The phone copy of a video (keeping any #t= start), or undefined if there isn't one. */
export function phoneCopy(src: string): string | undefined {
  const [path, frag] = src.split("#");
  const copy = PHONE_COPIES[path];
  return copy ? copy + (frag ? `#${frag}` : "") : undefined;
}
