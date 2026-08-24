import fs from "fs";
import path from "path";
import Reveal from "@/components/Reveal";
import RuleLabel from "@/components/RuleLabel";
import { stats, aboutGradient } from "@/lib/about";

// EDIT: the featured press card (purple box) links here.
const PRESS_URL =
  "https://chicagoreader.com/music/chicagoans-of-note/lawrence-law-mahone-triptych-visuals-video/";
// EDIT: drop the article photo at public/about/press-chicago-reader.jpg and it
// becomes the card background automatically (until then, the gradient shows).
const PRESS_PHOTO = "/about/press-chicago-reader.jpg";
const hasPressPhoto = fs.existsSync(
  path.join(process.cwd(), "public", PRESS_PHOTO)
);

// Phones: the three bento blocks stack into the top wallet-style while
// scrolling, matching the homepage reel cards. EDIT: same numbers as
// WalletStack — where block 1 parks, and the peek strip each next one leaves.
const STACK_TOP = 84;
const STACK_PEEK = 26;

/** Sticky-on-mobile wrapper for one bento block (plain grid item on md+). */
function StackItem({
  i,
  className = "",
  children,
}: {
  i: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`max-md:sticky ${className}`}
      style={{ top: STACK_TOP + i * STACK_PEEK, zIndex: i + 1 }}
    >
      {children}
    </div>
  );
}

/** "Production Experience & Press" — a stats bento. */
export default function AboutResult() {
  return (
    <section className="px-5 pt-20 sm:px-8 sm:pt-28">
      {/* Centered header */}
      <Reveal className="text-center">
        <RuleLabel className="justify-center">Press</RuleLabel>
        <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight">
          Production Experience &amp; Press
        </h2>
      </Reveal>

      {/* Bento — full-bleed on phones (bleeds out of the section padding) */}
      <Reveal className="mt-14 grid grid-cols-1 gap-4 max-md:-mx-5 md:grid-cols-3">
        {/* Left: Chicago Reader feature — photo (when present) + badge, links out */}
        <StackItem i={0}>
        <a
          href={PRESS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block min-h-[360px] overflow-hidden rounded-2xl max-md:rounded-none md:min-h-[460px]"
          style={{ background: aboutGradient(4) }}
        >
          {hasPressPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={PRESS_PHOTO}
              alt="Lawrence “Law” Mahone of Triptych featured in the Chicago Reader"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          {/* Bottom scrim so the badge stays readable over any photo */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
            <span aria-hidden className="text-lg">
              {/* EDIT: swap for a laurel mark */}
              ❖
            </span>
            <span className="text-sm font-medium leading-tight underline-offset-4 group-hover:underline">
              {stats.bestAds}
            </span>
          </div>
        </a>
        </StackItem>

        {/* Middle column — the 80+ partners card fills the height */}
        <StackItem i={1} className="flex flex-col gap-4">
          <div className="flex flex-1 flex-col justify-between rounded-2xl bg-accent p-6 text-white max-md:rounded-none">
            <div className="flex items-start justify-between gap-3">
              <span className="text-5xl font-medium tracking-tight">
                {stats.partners.value}
              </span>
              <span className="pt-2 text-sm">{stats.partners.label}</span>
            </div>
            <p className="ml-auto mt-10 max-w-[16rem] text-right text-sm leading-relaxed">
              {stats.partners.body}
            </p>
          </div>
        </StackItem>

        {/* Right column — opaque panel on phones so it occludes the cards
            beneath it while stacking */}
        <StackItem
          i={2}
          className="flex flex-col gap-4 max-md:bg-background max-md:px-5 max-md:pt-2"
        >
          <div className="flex min-h-[120px] items-start rounded-2xl bg-foreground p-6 max-md:-mx-5 max-md:rounded-none">
            <p className="text-xl leading-snug text-background/70">
              {stats.decade}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">{stats.satisfaction.label}</span>
            <span className="tracking-widest text-foreground/70" aria-hidden>
              ★★★★★
            </span>
          </div>

          <div
            className="aspect-[16/10] w-full overflow-hidden rounded-2xl max-md:-mx-5 max-md:w-auto max-md:self-stretch max-md:rounded-none"
            style={{ background: aboutGradient(1) }}
            aria-hidden
          />

          <p className="text-sm leading-relaxed text-foreground/70">
            {stats.satisfaction.body}
          </p>

          <div className="mt-auto flex items-center gap-3">
            <div className="flex -space-x-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-7 w-7 rounded-full ring-2 ring-background"
                  style={{ background: aboutGradient(i + 2) }}
                />
              ))}
            </div>
            <span className="text-sm text-muted">
              {stats.satisfaction.clients}
            </span>
          </div>
        </StackItem>
      </Reveal>
    </section>
  );
}
