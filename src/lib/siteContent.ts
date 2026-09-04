// ---------------------------------------------------------------------------
// Triptych Portal feed. Values set on the portal's Content tab override what's
// authored in the code; anything empty — or an unreachable portal — leaves the
// site exactly as authored. Content never blanks out.
//
// This is the "raw feed" integration from the portal docs (section 3): the
// embed.js script is for hosted builders and can't be used here, because React
// re-renders would overwrite whatever it rewrote in the DOM.
// ---------------------------------------------------------------------------

/** EDIT: portal feed URL (override with PORTAL_FEED_URL in Vercel). */
export const FEED_URL =
  process.env.PORTAL_FEED_URL ||
  "https://triptych-portal.vercel.app/api/site-content";

/** EDIT: seconds before the feed is re-fetched. The portal caches for ~60s. */
const REVALIDATE = 60;

/** EDIT: how long to wait on the portal before falling back to authored copy. */
const TIMEOUT_MS = 4000;

/** How many work tiles to look for when the feed uses flat work-N-* keys. */
const MAX_WORKS = 40;

export type PortalCrewRow = {
  name?: string;
  role?: string;
  group?: "production" | "post";
};

export type PortalWork = {
  title?: string;
  client?: string;
  thumb?: string;
  link?: string;
  // ── the /work/<slug> project page, all optional — absent fields
  //    keep the site's authored placeholders ──
  slug?: string;
  category?: string;
  year?: string;
  synopsis?: string;
  /** Player source for the detail page (a /reels/… path, mp4/webm). */
  reel?: string;
  clientCompany?: string;
  dateShot?: string;
  dateReleased?: string;
  runtime?: string;
  location?: string;
  format?: string;
  camera?: { name?: string; sensor?: string; codec?: string; frameRate?: string; image?: string };
  lens?: { name?: string; focalSet?: string; aperture?: string; mount?: string };
  color?: { name?: string; gradedIn?: string; colorSpace?: string; delivery?: string };
  crew?: PortalCrewRow[];
  /** BTS stills — data-URLs from the portal. */
  stills?: string[];
};

export type SiteContent = {
  heroTitle?: string;
  tagline?: string;
  logo?: string;
  works: PortalWork[];
};

/** Empty content — every field absent, so callers fall back to what's authored. */
export const EMPTY_CONTENT: SiteContent = { works: [] };

type Bag = Record<string, unknown>;

const isBag = (v: unknown): v is Bag =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** A non-blank string, trimmed — anything else reads as "not set". */
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/**
 * First non-empty value among several spellings of the same field. The live
 * feed serves camelCase ({ heroTitle, tagline, logo, works } — confirmed
 * against the portal 2026-09-04); the other spellings stay as insurance.
 */
function pick(src: Bag, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const direct = str(src[key]);
    if (direct) return direct;
  }
  return undefined;
}

/** Feeds sometimes wrap the payload — unwrap one level of the usual suspects. */
function unwrap(raw: unknown): Bag {
  if (!isBag(raw)) return {};
  for (const key of ["content", "data", "siteContent", "site_content", "site"]) {
    const inner = raw[key];
    if (isBag(inner)) return { ...inner, ...raw };
  }
  return raw;
}

/** A sub-object ({camera}, {lens}, {color}) read tolerantly, field by field. */
function subBag(raw: unknown, ...fields: string[]): Record<string, string | undefined> | undefined {
  if (!isBag(raw)) return undefined;
  const out: Record<string, string | undefined> = {};
  let any = false;
  for (const f of fields) {
    const v = str(raw[f]);
    if (v) any = true;
    out[f] = v;
  }
  return any ? out : undefined;
}

/** A tile can name its fields a few ways; images/links likewise. */
function toWork(raw: unknown): PortalWork | undefined {
  if (!isBag(raw)) return undefined;
  const work: PortalWork = {
    title: pick(raw, "title", "workTitle", "work_title", "work-title", "name"),
    client: pick(raw, "client", "workClient", "work_client", "work-client", "artist"),
    thumb: pick(
      raw,
      "thumb",
      "workThumb",
      "work_thumb",
      "work-thumb",
      "thumbnail",
      "image",
      "src"
    ),
    link: pick(raw, "link", "workLink", "work_link", "work-link", "url", "href"),
    // Project-page fields — the portal serves these names exactly.
    slug: pick(raw, "slug"),
    category: pick(raw, "category"),
    year: pick(raw, "year"),
    synopsis: pick(raw, "synopsis", "description"),
    reel: pick(raw, "reel", "video"),
    clientCompany: pick(raw, "clientCompany", "client_company"),
    dateShot: pick(raw, "dateShot", "date_shot"),
    dateReleased: pick(raw, "dateReleased", "date_released"),
    runtime: pick(raw, "runtime"),
    location: pick(raw, "location"),
    format: pick(raw, "format"),
    camera: subBag(raw.camera, "name", "sensor", "codec", "frameRate", "image"),
    lens: subBag(raw.lens, "name", "focalSet", "aperture", "mount"),
    color: subBag(raw.color, "name", "gradedIn", "colorSpace", "delivery"),
    crew: Array.isArray(raw.crew)
      ? raw.crew
          .map((c): PortalCrewRow | undefined => {
            if (!isBag(c)) return undefined;
            const name = str(c.name);
            if (!name) return undefined;
            return { name, role: str(c.role), group: c.group === "post" ? "post" : "production" };
          })
          .filter((c): c is PortalCrewRow => !!c)
      : undefined,
    stills: Array.isArray(raw.stills)
      ? raw.stills.map(str).filter((s): s is string => !!s)
      : undefined,
  };
  return work.title || work.client || work.thumb || work.link ? work : undefined;
}

/** Tiles as an array, or as flat work-1-title / work-2-title… keys. */
function readWorks(src: Bag): PortalWork[] {
  for (const key of ["works", "work", "tiles", "projects"]) {
    const list = src[key];
    if (Array.isArray(list)) {
      return list.map(toWork).filter((w): w is PortalWork => !!w);
    }
  }

  const flat: PortalWork[] = [];
  for (let i = 1; i <= MAX_WORKS; i++) {
    const work = toWork({
      title: pick(src, `work-${i}-title`, `work_${i}_title`, `work${i}Title`),
      client: pick(src, `work-${i}-client`, `work_${i}_client`, `work${i}Client`),
      thumb: pick(src, `work-${i}-thumb`, `work_${i}_thumb`, `work${i}Thumb`),
      link: pick(src, `work-${i}-link`, `work_${i}_link`, `work${i}Link`),
    });
    // Tiles are 1..N contiguous; the first gap ends the list.
    if (!work) break;
    flat.push(work);
  }
  return flat;
}

/** Shape whatever the portal returned into the fields this site consumes. */
export function normalize(raw: unknown): SiteContent {
  const src = unwrap(raw);
  return {
    heroTitle: pick(src, "heroTitle", "hero_title", "hero-title", "headline"),
    tagline: pick(src, "tagline", "subtitle", "sub_title", "hero-tagline"),
    logo: pick(src, "logo", "logoUrl", "logo_url", "logo-url"),
    works: readWorks(src),
  };
}

/**
 * Read the portal feed. Never throws and never returns partial junk — any
 * network error, timeout, non-200, or unparseable body yields EMPTY_CONTENT so
 * the site renders exactly as authored.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return EMPTY_CONTENT;
    return normalize(await res.json());
  } catch {
    // Portal unreachable / slow / malformed — authored content stands.
    return EMPTY_CONTENT;
  }
}
