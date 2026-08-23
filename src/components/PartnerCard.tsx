import { clients } from "@/lib/projects";

// EDIT: partner "logos" — text stand-ins until real marks land in
// /public/partners (then swap each <span> for an <img className="h-4 w-auto" />).
const PARTNERS = clients;

/**
 * Full-bleed black partners strip between the hero and the featured-work
 * band. The names loop horizontally forever — same endless marquee as the
 * Featured© Work title (shared animate-marquee-l timing).
 */
export default function PartnerCard() {
  return (
    <section aria-label="Partners" className="overflow-hidden bg-[#0e0e10] py-4 text-white">
      {/* Two identical copies; the -50% loop lands on the seam invisibly. */}
      <div className="flex w-max animate-marquee-l">
        {[...PARTNERS, ...PARTNERS].map((name, i) => (
          <span
            key={i}
            aria-hidden={i >= PARTNERS.length}
            className="whitespace-nowrap pr-14 text-sm font-medium text-white/85"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
