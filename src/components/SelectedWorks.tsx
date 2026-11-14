import Link from "next/link";
import ReelCard from "@/components/ReelCard";
import { reels } from "@/lib/reels";

// EDIT: the section's copy
const LEAD =
  "Cinematic craft, bold visual storytelling and forward-thinking production. Every frame made with intent, and aligned with your story.";

/**
 * Featured Work: a heading row with a link to every project, then the
 * reels (lib/reels.ts) — 9:16 videos in phone-style frames with a mock
 * social overlay. Edge to edge on desktop, four across and two rows deep;
 * a swipeable row on phones.
 */
export default function SelectedWorks() {
  return (
    <section aria-label="Premium social content" className="overflow-hidden bg-background py-20 text-foreground sm:py-28">
      <div className="px-5 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.03em]">Premium Social Content</h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted sm:text-[18px]">{LEAD}</p>
          </div>
          <Link
            href="/projects"
            className="inline-flex h-11 shrink-0 items-center gap-1.5 self-start rounded-full bg-foreground/[0.09] px-5 text-[15px] font-medium transition-colors hover:bg-foreground/[0.16] lg:hidden"
          >
            See all projects <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* The reels: swipe on phones (snapping card to card), a full-width
          4 × 2 grid on desktop whose last row fades out under a "See all
          projects" pill. EDIT: lg:grid-cols-4 sets how many go across. */}
      <div className="relative mt-10 sm:mt-12 lg:px-10">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:gap-4 lg:grid lg:snap-none lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
          {reels.map((r, i) => (
            <div key={r.src + i} className="w-[72vw] max-w-[320px] shrink-0 snap-center sm:w-[42vw] lg:w-auto lg:max-w-none">
              <ReelCard reel={r} />
            </div>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[24%] bg-gradient-to-t from-background via-background/75 to-transparent lg:block" />
        <Link
          href="/projects"
          className="absolute bottom-10 left-1/2 hidden h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-7 text-[16px] font-medium text-background shadow-[0_8px_30px_rgba(0,0,0,.35)] transition-colors hover:bg-foreground/85 lg:inline-flex"
        >
          See all projects <span aria-hidden>↗</span>
        </Link>
      </div>
    </section>
  );
}
