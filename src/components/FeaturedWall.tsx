import { projects } from "@/lib/projects";
import { youtubeThumbs } from "@/lib/youtube";
import DriftWall from "@/components/DriftWall";

// EDIT: the drifting wall under Featured Work — how many projects it shows
// (every project with a YouTube video, newest first; they repeat to fill).
const WALL_COUNT = 20;

/**
 * A wall of project stills drifting past, tilted into the page, under the
 * Featured Work band. Each tile opens its project. Desktop gets five
 * columns of big tiles; phones three smaller ones (see .drift-wall-band).
 */
export default function FeaturedWall() {
  const items = projects
    .filter((p) => p.youtube)
    .slice(0, WALL_COUNT)
    .map((p) => {
      const [image, fallback] = youtubeThumbs(p.youtube!);
      return { image, fallback, title: p.artist ? `${p.artist} — ${p.title}` : p.title, href: `/work/${p.slug}` };
    });
  return (
    <section aria-label="More work" className="drift-wall-band relative bg-background">
      {/* Desktop wall */}
      <div className="hidden h-full sm:block">
        <DriftWall items={items} columns={5} tileWidth={220} tileHeight={138} gap={18} tilt={16} turn={-14} perspective={1200} depth={120} speed={42} direction="up" variance={0.45} parallax={0.6} lift={64} fade={0.6} dim={0.55} />
      </div>
      {/* Phone wall: three narrower columns, a touch less tilt */}
      <div className="h-full sm:hidden">
        <DriftWall items={items} columns={3} tileWidth={150} tileHeight={96} gap={12} tilt={12} turn={-10} perspective={900} depth={80} speed={34} direction="up" variance={0.45} parallax={0} lift={40} fade={0.6} dim={0.55} />
      </div>
    </section>
  );
}
