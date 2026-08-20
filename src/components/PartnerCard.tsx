import { clients } from "@/lib/projects";

// EDIT: partner "logos" — text stand-ins until real marks land in
// /public/partners (then swap each <span> for an <img className="h-4 w-auto" />).
const PARTNERS = clients;

// EDIT: seconds each partner stays on screen before the next one steps up.
const SECONDS_PER_NAME = 2.2;

/**
 * Skinny full-width card that sits between the hero video and "Featured Work".
 * The partner list scrolls vertically inside it — one row visible at a time,
 * looping seamlessly — with the label pinned to the left.
 */
export default function PartnerCard() {
  return (
    <section className="px-2 pt-2 sm:px-3">
      <div className="flex items-center gap-5 rounded-2xl border border-hairline px-5 py-3 sm:gap-8 sm:px-7">
        <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[11px]">
          Partners
        </span>

        {/* Viewport is exactly one row tall. The track is two identical copies,
            so travelling -50% lands back at the start invisibly. steps() moves
            a whole row at a time, so a name is never caught mid-scroll. */}
        <div className="relative h-6 flex-1 overflow-hidden">
          <div
            className="flex flex-col"
            style={{
              // EDIT: SECONDS_PER_NAME controls how long each partner holds.
              animation: `marquee-up ${PARTNERS.length * SECONDS_PER_NAME}s steps(${PARTNERS.length}) infinite`,
            }}
          >
            {[...PARTNERS, ...PARTNERS].map((name, i) => (
              <span
                key={i}
                className="flex h-6 shrink-0 items-center whitespace-nowrap text-[13px] font-medium text-foreground/80 sm:text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
