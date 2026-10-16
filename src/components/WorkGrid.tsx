import { projects } from "@/lib/projects";
import { youtubeThumbs } from "@/lib/youtube";
import WorkGridClient, { type OrbitCard } from "./WorkGridClient";

// EDIT: the headline number and its label in the middle of the orbit.
const COUNT_LABEL = "500+";
const CAPTION = "Projects completed";

// EDIT: how many glass cards ride the orbit (more = a denser ring).
const CARDS = 10;

/**
 * "Body of work" — the project count in the middle with liquid-glass
 * cards orbiting it, one per music video (projects with a YouTube id in
 * lib/projects.ts, newest first). Each card opens that project's page.
 */
export default function WorkGrid() {
  const withVideo = projects.filter((p) => p.youtube);
  const cards: OrbitCard[] = Array.from({ length: Math.min(CARDS, Math.max(withVideo.length, 1) * 3) }, (_, i) => {
    const p = withVideo[i % Math.max(withVideo.length, 1)];
    // Golden-angle hues: the swatch behind a still that hasn't loaded.
    const hue = Math.round((i * 137.508) % 360);
    if (!p) return { href: "/projects", title: "All projects", sub: "Triptych Studios", hue };
    const [thumb, thumbFallback] = youtubeThumbs(p.youtube!);
    return {
      href: `/work/${p.slug}`,
      title: p.title,
      sub: [p.artist, p.year].filter(Boolean).join(" · "),
      thumb,
      thumbFallback,
      hue,
    };
  });

  return <WorkGridClient cards={cards} countLabel={COUNT_LABEL} caption={CAPTION} />;
}
