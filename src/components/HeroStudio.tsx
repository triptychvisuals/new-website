import Link from "next/link";

/**
 * Dark "studio" hero panel (fabrica-style), placed above the gallery.
 * Rounded near-black panel inset in a cream page, with a massive wordmark,
 * a services list, a two-tone tagline, plus-mark crosshairs, and a
 * team-lead business card. Everything customizable is marked // EDIT.
 */

// EDIT: the four services shown top-right of the hero.
const SERVICES = [
  "Music Video Production",
  "Commercial and Brand Film",
  "Directing and Treatments",
  "Editing and Color",
];

function Plus() {
  return (
    <span className="select-none text-3xl font-extralight leading-none text-white/25">
      +
    </span>
  );
}

// EDIT: replace with a real headshot — drop /public/team/lead.jpg and swap the
// <AvatarPlaceholder /> below for <img src="/team/lead.jpg" ... />.
function AvatarPlaceholder() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="tv-av" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcd9d3" />
          <stop offset="1" stopColor="#b7b3ab" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#tv-av)" />
      <circle cx="50" cy="41" r="15" fill="#948f86" />
      <path d="M23 85c0-15 12-25 27-25s27 10 27 25z" fill="#948f86" />
    </svg>
  );
}

export default function HeroStudio() {
  return (
    <section className="bg-[#f4f2ec] px-2 pb-2 pt-2 dark:bg-[#0a0a0a] sm:px-3 sm:pb-3">
      <div className="relative isolate flex min-h-[88vh] flex-col overflow-hidden rounded-[26px] bg-[#0e0e10] text-white">
        {/* Background: soft marble glow + film grain.
            EDIT: for the exact photographic look, drop /public/hero-bg.jpg and
            uncomment the <img> layer below. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(56% 44% at 60% 15%, rgba(232,232,236,0.17), rgba(232,232,236,0.04) 42%, transparent 68%), #0e0e10",
          }}
        />
        {/* <img src="/hero-bg.jpg" alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" /> */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Top: wordmark (left) + services (right) */}
        <div className="flex flex-1 flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:gap-6 lg:p-10">
          <h1 className="lg:flex-1" aria-label="Triptych — Imagination in Motion">
            <span className="flex items-start leading-[0.78]">
              <span className="text-[20vw] font-normal tracking-[-0.03em] lg:text-[16vw]">
                triptych
              </span>
              <span className="mt-[0.1em] text-[7vw] font-normal leading-none lg:text-[5.4vw]">
                ®
              </span>
            </span>
            {/* EDIT: sub-line under the wordmark (cleared below the p/y descenders) */}
            <span className="mt-[5vw] block pl-[2%] text-[6.4vw] font-normal leading-[0.95] tracking-[-0.03em] lg:mt-[3.6vw] lg:text-[4.1vw]">
              Imagination in Motion
            </span>
          </h1>

          <ul className="flex shrink-0 flex-col gap-2 text-[15px] font-semibold sm:text-base lg:w-[26%] lg:pt-[3vw]">
            {SERVICES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Plus-mark crosshairs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-[60%] hidden justify-between lg:flex"
        >
          <Plus />
          <Plus />
          <Plus />
          <Plus />
        </div>

        {/* Bottom: tagline (left) · copyright (center) · team card (right) */}
        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
          {/* EDIT: tagline copy */}
          <p className="max-w-[30rem] text-[22px] font-bold leading-[1.15] tracking-[-0.01em] sm:text-2xl">
            No stock footage. No empty concepts.{" "}
            <span className="text-white/45">
              Just cinematic stories that move audiences and make your brand
              impossible to ignore.
            </span>
          </p>

          {/* EDIT: copyright line */}
          <p className="order-last text-sm text-white/45 lg:absolute lg:bottom-10 lg:left-1/2 lg:order-none lg:-translate-x-1/2">
            © 2025 triptych® Studio
          </p>

          {/* Team-lead card */}
          <div className="flex items-stretch gap-2">
            <div className="w-[92px] shrink-0 rounded-2xl bg-white p-1.5">
              <div className="h-full w-full overflow-hidden rounded-xl">
                <AvatarPlaceholder />
              </div>
            </div>
            <div className="flex flex-col rounded-2xl bg-white px-5 py-4 text-black">
              <p className="text-[13px] font-medium leading-tight">Team Lead</p>
              <p className="text-[13px] leading-tight text-black/50">
                at triptych®
              </p>
              {/* EDIT: real team-member name */}
              <p className="mt-2 text-lg font-semibold leading-tight">
                Lauren Thompson
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-6 self-start rounded-full bg-black py-1.5 pl-4 pr-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                Let&rsquo;s talk
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-black">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
