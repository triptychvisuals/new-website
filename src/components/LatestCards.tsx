import Link from "next/link";
import { projects, POST_PRODUCTION } from "@/lib/projects";
import { youtubeThumbs } from "@/lib/youtube";

// EDIT: which projects lead the page — the newest ones with a YouTube video.
const LEAD = projects.filter((p) => p.youtube && p.category !== POST_PRODUCTION).slice(0, 2);

/**
 * Straight under the hero: the newest release as a big card with its name
 * set large over the picture, and the one before it as a smaller card with
 * its name underneath. Flat, rounded, no frames.
 */
export default function LatestCards() {
  const [big, small] = LEAD;
  if (!big) return null;
  const still = (id: string) => youtubeThumbs(id)[0];
  return (
    <section aria-label="Latest work" className="bg-background px-5 pb-20 pt-4 sm:pb-28 lg:px-10">
      <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-7">
        <Link href={`/work/${big.slug}`} className="group relative block overflow-hidden rounded-[20px] bg-surface">
          <div className="relative aspect-[4/5] sm:aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={still(big.youtube!)}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full scale-[1.34] object-cover transition-transform duration-700 group-hover:scale-[1.38]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
              <p className="text-[14px] text-white/75">Latest release{big.year ? ` · ${big.year}` : ""}</p>
              <h2 className="mt-2 text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.035em]">{big.title}</h2>
              {big.artist && <p className="mt-3 text-[17px] text-white/85 sm:text-[20px]">{big.artist}</p>}
            </div>
          </div>
        </Link>

        {small && (
          <Link href={`/work/${small.slug}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-surface lg:aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={still(small.youtube!)}
                alt=""
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full scale-[1.34] object-cover transition-transform duration-700 group-hover:scale-[1.38]"
              />
            </div>
            <p className="mt-4 text-[18px] font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-[20px]">
              {small.artist ? `${small.artist} — ` : ""}
              {small.title}
            </p>
            <p className="mt-1 text-[14px] text-muted">{small.year}</p>
          </Link>
        )}
      </div>
    </section>
  );
}
