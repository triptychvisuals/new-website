import fs from "node:fs";
import path from "node:path";
import { clients } from "@/lib/projects";

// EDIT: partner order in the loop (names come from lib/projects clients).
const PARTNERS = clients;

/**
 * Drop real logo files into /public/partners and they replace the text
 * automatically — file name = the partner's name, lowercased, spaces → "-"
 * (e.g. "Universal Music Group" → universal-music-group.png). Also checks a
 * short alias (first word: universal.png, rca.png, …). png / svg / webp work.
 * Use transparent artwork: dark marks render as-is on the light theme and
 * invert to white on the dark theme ("-white" files do the opposite).
 */
// EDIT: per-logo height (Tailwind class) so dense or portrait marks read at
// the same visual weight as wide wordmarks. Anything not listed uses DEFAULT.
const LOGO_SIZES: Record<string, string> = {
  capitol: "h-14", // detail-heavy oval lockup
  interscope: "h-14", // tall portrait crop
  universal: "h-14", // globe lockup with small sub-line
  atlantic: "h-12",
  warner: "h-11",
};
const DEFAULT_LOGO_SIZE = "h-9";

// EDIT: copies of the partner list inside one loop segment. One segment must
// be wider than the widest screen, or the end of the track shows as a gap
// before it wraps; 5 copies ≈ 4600px, wider than ultrawide monitors.
const REPEAT = 5;
// EDIT: seconds for one logo to pass — higher is slower. Duration scales with
// the logo count so the speed stays the same however many partners there are.
const SECONDS_PER_LOGO = 2.6;

function logoFor(
  name: string
): { src: string; white: boolean; size: string } | undefined {
  const dir = path.join(process.cwd(), "public", "partners");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const alias = slug.split("-")[0];
  for (const base of [slug, alias]) {
    // "-white" suffix = artwork that is already white; rendered without invert.
    for (const [suffix, white] of [
      ["-white", true],
      ["", false],
    ] as const) {
      for (const ext of ["svg", "png", "webp"]) {
        if (fs.existsSync(path.join(dir, `${base}${suffix}.${ext}`))) {
          return {
            src: `/partners/${base}${suffix}.${ext}`,
            white,
            size: LOGO_SIZES[base] ?? DEFAULT_LOGO_SIZE,
          };
        }
      }
    }
  }
  return undefined;
}

/**
 * Full-bleed black partners strip between the hero and the featured-work
 * band. The marks loop horizontally forever — same endless marquee as the
 * Featured© Work title (shared animate-marquee-l timing).
 */
export default function PartnerCard() {
  const items = PARTNERS.map((name) => ({ name, logo: logoFor(name) }));
  const segment = Array.from({ length: REPEAT }, () => items).flat();
  const duration = segment.length * SECONDS_PER_LOGO;

  return (
    <section aria-label="Partners" className="overflow-hidden bg-background py-6 text-foreground">
      {/* Two identical segments; translating -50% lands exactly on the seam,
          so the loop never shows a join or an empty stretch. translate3d +
          will-change keep it on the GPU for a smooth, constant-speed glide. */}
      <div
        className="flex w-max items-center"
        style={{
          animation: `marquee-l ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {[...segment, ...segment].map(({ name, logo }, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="flex shrink-0 items-center whitespace-nowrap pr-16"
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.src}
                alt={name}
                draggable={false}
                className={`${logo.size} w-auto ${
                  logo.white ? "[filter:invert(1)] dark:[filter:none]" : "dark:[filter:invert(1)]"
                }`}
              />
            ) : (
              <span className="text-base font-medium text-foreground/85">{name}</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
