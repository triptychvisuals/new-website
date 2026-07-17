import PartnerMarquee from "@/components/PartnerMarquee";

/**
 * Dark "studio" hero panel (fabrica-style), placed above the gallery.
 * Rounded near-black panel inset in a cream page, with a massive wordmark,
 * a brands-we've-worked-with list, plus-mark crosshairs, and a team-lead
 * business card. Everything customizable is marked // EDIT.
 */

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
      <div className="relative isolate flex aspect-square min-h-0 flex-col overflow-hidden rounded-[26px] bg-[#0e0e10] text-white md:aspect-auto md:min-h-[88vh]">
        {/* Background: looping hero video, a legibility overlay, and film grain.
            EDIT: replace /public/hero/hero.mp4 (and optionally add a poster). */}
        <video
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
          src="/hero/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        {/* Darken top + bottom so the white text / card stay readable */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.24) 35%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.62) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Top: small, transparent labels across the top corners */}
        <div className="flex flex-1 items-start justify-between gap-4 p-6 sm:p-8 lg:p-10">
          <h1 className="text-sm font-medium text-white/50 sm:text-[15px]">
            Imagination in Motion
          </h1>
          {/* EDIT: founding year */}
          <p className="text-right text-sm font-medium text-white/50 sm:text-[15px]">
            Est. 2016
          </p>
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

        {/* Bottom band.
            Desktop: partners (left) · copyright (center) · card (right).
            Mobile: partners centered on top, then copyright (left) + card (right). */}
        <div className="relative grid grid-cols-2 items-end gap-x-3 gap-y-6 p-6 sm:p-8 lg:flex lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:p-10">
          {/* Partners — logo marquee (centered on mobile) */}
          <div className="col-span-2 flex flex-col items-center gap-2 lg:col-auto lg:items-start lg:gap-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              Partners
            </p>
            <PartnerMarquee />
          </div>

          {/* EDIT: copyright line — bottom-left on mobile, centered on desktop */}
          <p className="self-end text-xs text-white/45 sm:text-sm lg:absolute lg:bottom-10 lg:left-1/2 lg:-translate-x-1/2">
            © 2026 Triptych Studio
          </p>

          {/* Watch-reel card — semi-transparent glass (compact + bottom-right on mobile) */}
          <div className="flex items-stretch gap-2 justify-self-end lg:justify-self-auto">
            <div className="hidden w-[92px] shrink-0 rounded-2xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-md lg:block">
              <div className="h-full w-full overflow-hidden rounded-xl">
                <AvatarPlaceholder />
              </div>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md lg:px-5 lg:py-4">
              <p className="text-[12px] font-medium leading-tight lg:text-[13px]">
                Team Lead
              </p>
              <p className="text-[12px] leading-tight text-white/50 lg:text-[13px]">
                at triptych®
              </p>
              {/* EDIT: real team-member name */}
              <p className="mt-1.5 text-sm font-semibold leading-tight lg:mt-2 lg:text-lg">
                Lauren Thompson
              </p>
              <p className="mt-2 text-[12px] text-white/70 lg:mt-3 lg:text-[13px]">
                Watch video reel
              </p>
              {/* EDIT: point to your showreel (YouTube / Vimeo / file) */}
              <a
                href="#reel"
                className="mt-2 inline-flex items-center gap-4 self-start rounded-full bg-white py-1.5 pl-4 pr-1.5 text-sm font-medium text-black transition-opacity hover:opacity-80 lg:gap-6"
              >
                Play
                <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
