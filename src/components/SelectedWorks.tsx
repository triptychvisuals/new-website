import Link from "next/link";
import FeaturedGrid, { type FeaturedCard, type FeaturedTab } from "@/components/FeaturedGrid";
import { projects, placeholderGradient } from "@/lib/projects";
import { youtubeThumbs } from "@/lib/youtube";

// EDIT: the section's copy
const LEAD =
  "Cinematic craft, bold visual storytelling and forward-thinking production. Every frame made with intent, and aligned with your story.";

// EDIT: the tabs — each one a stretch of years (inclusive), newest first.
// "Latest" takes the newest projects whatever their year.
const ERAS: { label: string; from: number; to: number }[] = [
  { label: "2021 – 2024", from: 2021, to: 2024 },
  { label: "2016 – 2020", from: 2016, to: 2020 },
];
// EDIT: cards per tab
const PER_TAB = 6;

/**
 * Featured Work: a heading row with a link to every project, tabs by era,
 * and the projects as a grid of rounded cards with their names underneath.
 */
export default function SelectedWorks() {
  const card = (i: number): FeaturedCard => {
    const p = projects[i];
    const [image, fallback] = p.youtube ? youtubeThumbs(p.youtube) : [undefined, undefined];
    return {
      href: `/work/${p.slug}`,
      title: p.title,
      meta: [p.artist ?? p.category, p.year].filter(Boolean).join(" · "),
      image,
      fallback,
      video: !image && p.video && /\.(mp4|webm)$/i.test(p.video) ? p.video : undefined,
      gradient: placeholderGradient(i),
    };
  };
  // Projects with a picture or a clip make the grid; the rest stay on /projects.
  const shown = projects.map((p, i) => ({ p, i })).filter(({ p }) => p.youtube || p.video);
  const tabs: FeaturedTab[] = [
    { label: "Latest", cards: shown.slice(0, PER_TAB).map(({ i }) => card(i)) },
    ...ERAS.map((e) => ({
      label: e.label,
      cards: shown
        .filter(({ p }) => Number(p.year) >= e.from && Number(p.year) <= e.to)
        .slice(0, PER_TAB)
        .map(({ i }) => card(i)),
    })).filter((t) => t.cards.length > 0),
  ];

  return (
    <section aria-label="Featured work" className="bg-background px-5 py-20 text-foreground sm:py-28 lg:px-10">
      <div className="mx-auto max-w-[1760px]">
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
        <div className="mt-10 sm:mt-12">
          <FeaturedGrid tabs={tabs} />
        </div>
      </div>
    </section>
  );
}
