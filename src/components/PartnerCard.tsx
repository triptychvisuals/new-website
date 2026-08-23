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
 * Black-on-white or black-on-transparent artwork is fine: it's inverted and
 * screen-blended, so the mark renders white and any background melts into the
 * black strip — clearly visible in both site themes (the strip stays black).
 */
function logoFor(name: string): { src: string; white: boolean } | undefined {
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
          return { src: `/partners/${base}${suffix}.${ext}`, white };
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

  return (
    <section aria-label="Partners" className="overflow-hidden bg-[#0e0e10] py-4 text-white">
      {/* Two identical copies; the -50% loop lands on the seam invisibly. */}
      {/* bg on the track too: the transform creates a stacking context, so the
          screen blend needs its black inside that context to melt logo boxes. */}
      <div className="flex w-max animate-marquee-l items-center bg-[#0e0e10]">
        {[...items, ...items].map(({ name, logo }, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="flex items-center whitespace-nowrap pr-14"
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.src}
                alt={name}
                className={`h-6 w-auto mix-blend-screen ${
                  logo.white ? "" : "[filter:invert(1)]"
                }`}
              />
            ) : (
              <span className="text-sm font-medium text-white/85">{name}</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
