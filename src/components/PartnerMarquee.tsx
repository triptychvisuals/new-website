import { clients } from "@/lib/projects";

// EDIT: partner "logos". These are text stand-ins — swap each <span> for a real
// logo <img src="/partners/xyz.svg" alt="…" className="h-4 w-auto" /> when you
// have the files (drop them in /public/partners/).
const PARTNERS = clients.slice(0, 7);

/**
 * Horizontal partner marquee for the hero's bottom-left corner. Stays in a
 * fixed-width strip, scrolls left → right, loops seamlessly, and fades out at
 * both edges via a gradient mask.
 */
export default function PartnerMarquee() {
  return (
    <div className="relative w-[240px] overflow-hidden sm:w-[340px] [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]">
      {/* Track is two identical copies; -50% shift loops seamlessly. */}
      <div className="flex w-max animate-marquee-r">
        {[...PARTNERS, ...PARTNERS].map((name, i) => (
          <span
            key={i}
            className="mr-12 whitespace-nowrap text-sm font-semibold text-white/85"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
