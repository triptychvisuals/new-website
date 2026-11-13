import Link from "next/link";
import ReelCard from "@/components/ReelCard";
import { reels } from "@/lib/reels";

// EDIT: the section's copy
const LEAD =
  "Cinematic craft, bold visual storytelling and forward-thinking production. Every frame made with intent, and aligned with your story.";

/**
 * Featured Work: a heading row with a link to every project, then the
 * reels (lib/reels.ts) — 9:16 videos in phone-style frames with a mock
 * social overlay. A row of five on desktop; a swipeable row on phones.
 */
export default function SelectedWorks() {
  return (
    <section aria-label="Featured work" className="overflow-hidden bg-background py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-[1760px] px-5 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.03em]">Featured work</h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted sm:text-[18px]">{LEAD}</p>
          </div>
          <Link
            href="/projects"
            className="inline-flex h-11 shrink-0 items-center gap-1.5 self-start rounded-full bg-foreground/[0.09] px-5 text-[15px] font-medium transition-colors hover:bg-foreground/[0.16] lg:self-auto"
          >
            See all projects <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* The reels: swipe on phones (snapping card to card), a row on desktop */}
      <div className="mx-auto mt-10 max-w-[1760px] sm:mt-12 lg:px-10">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:gap-4 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {reels.map((r, i) => (
            <div key={r.src + i} className="w-[72vw] max-w-[320px] shrink-0 snap-center sm:w-[42vw] lg:w-auto lg:max-w-none">
              <ReelCard reel={r} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
