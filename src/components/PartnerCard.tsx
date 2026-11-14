import fs from "node:fs";
import path from "node:path";
import { clients } from "@/lib/projects";
import { IMPACT_STATS } from "@/lib/stats";
import LiveViews from "./LiveViews";

// EDIT: the partners shown here — the labels (lib/projects clients) plus
// Concordia University Chicago. Its logo: drop concordia.png (or .svg) in
// /public/partners and it replaces the name.
const PARTNERS = [...clients, "Concordia University Chicago"];

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
  capitol: "h-12", // oval lockup — PNG cropped tight to the artwork
  interscope: "h-14", // tall portrait crop
  universal: "h-14", // globe lockup with small sub-line
  atlantic: "h-12", // PNG cropped tight to the artwork
  warner: "h-11",
};
const DEFAULT_LOGO_SIZE = "h-9";


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

// EDIT: where each logo tile floats round the headline (desktop), as % of
// the section — left, top — plus how long its slow bob takes (s). Tiles
// past the list's length are skipped; extra logos reuse the last spots.
const SPOTS: [number, number, number][] = [
  [7, 16, 7],
  [85, 12, 8],
  [16, 4, 8.5],
  [90, 40, 6.8],
  [9, 64, 9],
  [84, 70, 9.4],
  [4, 40, 7.5],
  [76, 2, 7.2],
  [14, 86, 6.5],
];

/**
 * The labels section: the partner logos on dark rounded tiles floating
 * round a centred headline with two buttons. On phones the tiles sit in a
 * row above the headline instead. Logos are the files in /public/partners
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
        className={`max-h-[46%] max-w-[64%] object-contain ${it.logo.white ? "[filter:invert(1)] dark:[filter:none]" : "dark:[filter:invert(1)]"}`}
      />
    ) : (
      <span className="px-2 text-center text-[12px] font-medium leading-tight text-foreground/80">{it.name}</span>
    );

  return (
    <section aria-label="Labels we work with" className="relative overflow-hidden bg-background px-5 py-20 sm:py-28 lg:min-h-[900px] lg:py-0">
      {/* Desktop: tiles floating round the headline */}
      <div aria-hidden className="absolute inset-0 hidden lg:block">
        {items.map((it, i) => {
          const [left, top, secs] = SPOTS[Math.min(i, SPOTS.length - 1)];
          return (
            <span
              key={it.name}
              className="partner-tile absolute grid h-[104px] w-[104px] place-items-center rounded-[26px] bg-surface"
              style={{ left: `${left}%`, top: `${top}%`, animationDuration: `${secs}s`, animationDelay: `${-i * 1.3}s` }}
            >
              {tile(it)}
            </span>
          );
        })}
      </div>

      <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center lg:min-h-[900px] lg:justify-center lg:py-24">
        {/* Phones / tablets: the tiles in rows of four above — the studio's
            own mark rounds out the last row (EDIT: drop it once there's an
            eighth label logo in /public/partners). */}
        <div className="mb-10 grid grid-cols-4 gap-3 lg:hidden">
          {items.map((it) => (
            <span key={it.name} className="grid aspect-square w-[68px] place-items-center rounded-[18px] bg-surface sm:w-[76px]">
              {tile(it)}
            </span>
          ))}
          {items.length % 4 !== 0 && (
            <span className="grid aspect-square w-[68px] place-items-center rounded-[18px] bg-surface sm:w-[76px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/triptych-logo.png" alt="Triptych Studios" draggable={false} className="max-h-[34%] max-w-[60%] object-contain [filter:brightness(0)] dark:[filter:none]" />
            </span>
          )}
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
    </section>
  );
}
