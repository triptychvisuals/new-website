import PartnerMarquee from "@/components/PartnerMarquee";
import HeroReel from "@/components/HeroReel";

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
        {/* Background: horizontal reel carousel (clips cycle every 2.5s with
            dots), a legibility overlay, and film grain. EDIT clips in HeroReel. */}
        <HeroReel />
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

        {/* Bottom band */}
        <div className="relative p-6 sm:p-8 md:p-10">
          {/* ---- Mobile (9:16 square): logos + copyright (left) · Watch reel / Play (right) ---- */}
          <div className="flex items-end justify-between gap-3 md:hidden">
            <div className="flex min-w-0 flex-col gap-2">
              <PartnerMarquee className="w-[150px]" />
              {/* EDIT: copyright */}
              <p className="text-xs text-white/45">© 2026 Triptych Studio</p>
            </div>
            {/* EDIT: point to your showreel (YouTube / Vimeo / file) */}
            <a
              href="#reel"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-4 pr-1.5 text-white backdrop-blur-md"
            >
              <span className="text-[13px] font-medium">Watch reel</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[13px] font-medium text-black">
                Play
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </a>
          </div>

          {/* ---- Desktop: partners (left) · copyright (center) · card (right) ---- */}
          <div className="hidden md:flex md:items-end md:justify-between md:gap-8">
            <div className="flex flex-col items-start gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                Partners
              </p>
              <PartnerMarquee />
            </div>

            <div className="flex items-stretch gap-2">
              <div className="w-[92px] shrink-0 rounded-2xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-md">
                <div className="h-full w-full overflow-hidden rounded-xl">
                  <AvatarPlaceholder />
                </div>
              </div>
              <div className="flex flex-col rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-md">
                <p className="text-[13px] font-medium leading-tight">Team Lead</p>
                <p className="text-[13px] leading-tight text-white/50">
                  at triptych®
                </p>
                {/* EDIT: real team-member name */}
                <p className="mt-2 text-lg font-semibold leading-tight">
                  Lauren Thompson
                </p>
                <p className="mt-3 text-[13px] text-white/70">Watch video reel</p>
                <a
                  href="#reel"
                  className="mt-2 inline-flex items-center gap-6 self-start rounded-full bg-white py-1.5 pl-4 pr-1.5 text-sm font-medium text-black transition-opacity hover:opacity-80"
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

          {/* Desktop copyright — centered */}
          <p className="hidden text-sm text-white/45 md:absolute md:bottom-10 md:left-1/2 md:block md:-translate-x-1/2">
            © 2026 Triptych Studio
          </p>
        </div>
      </div>
    </section>
  );
}
