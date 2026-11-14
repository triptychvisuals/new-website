import fs from "node:fs";
import path from "node:path";
import { clients } from "@/lib/projects";
import { IMPACT_STATS } from "@/lib/stats";
import LiveViews from "./LiveViews";

// EDIT: the partners shown here — the labels (lib/projects clients) plus
// brands. A partner with no logo file in /public/partners shows its name.
const PARTNERS = [...clients, "Under Armour"];

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
  capitol: "h-[72%]", // oval lockup — PNG cropped tight to the artwork
  interscope: "h-[78%]", // tall portrait crop
  universal: "h-[78%]", // globe lockup with small sub-line
  atlantic: "h-[72%]", // PNG cropped tight to the artwork
  warner: "h-[68%]",
  "under-armour": "h-[46%]", // solid square mark — smaller reads the same weight
};
const DEFAULT_LOGO_SIZE = "h-[60%]";

// EDIT: the largest a logo tile gets (px) on wide screens, where they
// float in their own columns either side of the words. Narrower screens
// set them in rows of three above the headline.
const TILE = 176;


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

// EDIT: how long each tile's slow bob takes (s), in turn.
const BOB = [7, 8, 8.5, 6.8, 9, 9.4, 7.5, 7.2];


/**
 * The labels section: the partner logos on dark rounded tiles floating
 * either side of a centred headline with two buttons. The tiles live in
 * their own columns, so they never touch the words at any width; where
 * the columns don't fit, the tiles sit in rows above the headline instead. Logos are the files in /public/partners
 * (see above); a partner with no file shows its name.
 */
export default function PartnerCard() {
  const items = PARTNERS.map((name) => ({ name, logo: logoFor(name) }));
  const tile = (it: (typeof items)[number]) =>
    it.logo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={it.logo.src}
        alt={it.name}
        draggable={false}
        // the marks are dark artwork: white on the dark theme
        className={`absolute inset-0 m-auto ${it.logo.size} w-auto max-w-[80%] object-contain ${it.logo.white ? "[filter:invert(1)] dark:[filter:none]" : "dark:[filter:invert(1)]"}`}
      />
    ) : (
      <span className="px-3 text-center text-[15px] font-medium leading-tight text-foreground/80 xl:text-[17px]">{it.name}</span>
    );

  return (
    <section aria-label="Labels we work with" className="relative overflow-hidden bg-background px-5 py-20 sm:py-28 xl:px-10 xl:py-20">
      <div className="mx-auto xl:grid xl:min-h-[960px] xl:max-w-[1760px] xl:grid-cols-[minmax(0,1fr)_minmax(0,760px)_minmax(0,1fr)] xl:gap-x-12">
      {/* Wide screens: a column of tiles each side, staggered */}
      {[0, 1].map((side) => (
        <div key={side} aria-hidden className={`hidden xl:flex xl:flex-col xl:justify-between ${side === 1 ? "xl:order-3" : ""}`}>
          {items
            .map((it, i) => ({ it, i }))
            .filter(({ i }) => i % 2 === side)
            .map(({ it, i }, k) => (
              <span
                key={it.name}
                className={`partner-tile relative grid aspect-square w-full place-items-center rounded-[36px] bg-surface ${
                  // zig-zag: in towards the words, then out to the edge
                  (k % 2 === 0) === (side === 0) ? "self-start" : "self-end"
                }`}
                style={{ maxWidth: TILE, animationDuration: `${BOB[i % BOB.length]}s`, animationDelay: `${-i * 1.3}s` }}
              >
                {tile(it)}
              </span>
            ))}
        </div>
      ))}

      <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center xl:order-2 xl:w-full xl:justify-center">
        {/* Narrower screens: the tiles in rows of three above */}
        <div className="mb-10 flex w-full max-w-[560px] flex-wrap justify-center gap-3 sm:gap-4 xl:hidden">
          {items.map((it) => (
            <span key={it.name} className="relative grid aspect-square w-[calc((100%-1.5rem)/3)] place-items-center rounded-[24px] bg-surface sm:w-[calc((100%-2rem)/3)]">
              {tile(it)}
            </span>
          ))}
        </div>
        {/* EDIT: the section's copy */}
        <p className="text-[15px] text-muted">Labels we work with</p>
        <h2 className="mt-4 text-[clamp(2.25rem,5.5vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.03em]">
          Global Impact
        </h2>
        <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted">
          Music videos and campaigns made with artists across the major labels, from treatment to final grade.
        </p>

        {/* The live counter, then the headline numbers (EDIT: lib/stats.ts) */}
        <div className="mt-14 w-full">
          <LiveViews />
        </div>
        <dl className="mt-12 grid w-full grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-hairline sm:grid-cols-4">
          {IMPACT_STATS.map((st) => (
            <div key={st.label} className="flex flex-col-reverse justify-end bg-surface px-4 py-6">
              <dt className="mt-2 text-[14px] leading-snug text-muted">{st.label}</dt>
              <dd className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em]">{st.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="/projects" className="inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85">
            See the work <span aria-hidden>↓</span>
          </a>
          <a href="/services" className="inline-flex h-11 items-center rounded-full bg-foreground/[0.09] px-6 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/[0.16]">
            Services & partners
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
