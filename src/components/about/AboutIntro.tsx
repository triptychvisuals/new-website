import ScrollFill from "@/components/ScrollFill";
import { recentClients, services } from "@/lib/about";

const label = "text-sm text-muted";
const listItem =
  "text-sm font-medium leading-tight tracking-tight text-foreground sm:text-lg lg:text-xl";

// EDIT: placeholder brand marks — swap for real logos (drop files in
// /public/logos and list them here in the same order as `recentClients`).
const BRAND_LOGOS = [
  "/logos/mark-1.svg",
  "/logos/mark-2.svg",
  "/logos/mark-3.svg",
  "/logos/mark-4.svg",
];

/**
 * Intro: "Recent Clients" and "Services" side by side as two lists that fill
 * grey→white on scroll. The Result bento follows directly beneath.
 */
export default function AboutIntro() {
  return (
    <section id="about-intro" className="px-5 pt-10 sm:px-8 sm:pt-16">
      {/* Two columns side by side on mobile; tight side-by-side from sm up */}
      <div className="grid grid-cols-2 gap-x-6 sm:flex sm:flex-row sm:items-start sm:gap-x-16">
        <ScrollFill>
          <p className={label} data-fill>
            Partners
          </p>
          <ul className="mt-6 space-y-2.5">
            {recentClients.map((c, i) => (
              <li
                key={c}
                data-fill
                className={`${listItem} flex items-center gap-1.5 sm:gap-2`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BRAND_LOGOS[i % BRAND_LOGOS.length]}
                  alt=""
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0 opacity-70 [filter:brightness(0)] dark:[filter:none] sm:h-4 sm:w-4"
                />
                <span className="min-w-0">{c}</span>
              </li>
            ))}
          </ul>
        </ScrollFill>

        <ScrollFill>
          <p className={label} data-fill>
            Services
          </p>
          <ul className="mt-6 space-y-2">
            {services.map((s) => (
              <li key={s} data-fill className={listItem}>
                {s}
              </li>
            ))}
          </ul>
        </ScrollFill>

        {/* Reel in the open space to the right: hidden on phones, 1:1 at the
            tablet breakpoint, 16:9 filling the space on desktop. */}
        <div className="hidden sm:block sm:flex-1">
          <div className="aspect-square overflow-hidden rounded-2xl bg-black lg:aspect-video">
            {/* EDIT: swap for the reel you want here */}
            <video
              className="h-full w-full object-cover"
              src="/hero/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Triptych reel"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
