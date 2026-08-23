import type { Project } from "@/lib/projects";

/**
 * Gallery card — the reel with a bold uppercase title at the bottom-left and
 * the year as "/26" at the bottom-right, over a gradient scrim for legibility.
 */
export default function ProjectCard({
  project,
  gradient,
  media,
  className = "",
  href,
}: {
  project: Project;
  index: number;
  gradient: string;
  media?: string;
  /** Extra classes on the card link — used to hide overflow cards on mobile. */
  className?: string;
  /** Portal link for this tile; falls back to the local /work/<slug> page. */
  href?: string;
}) {
  const reel = project.video ?? media;
  const isVideo = !!reel && /\.(mp4|webm)$/i.test(reel);
  // "2026" → "/26"
  const shortYear = project.year ? `/${project.year.slice(-2)}` : "";
  const fit = project.objectPosition
    ? { objectPosition: project.objectPosition }
    : undefined;
  const mediaCls =
    "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]";

  return (
    <a data-card href={href || `/work/${project.slug}`} className={`group block ${className}`}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
        {/* Gradient base (poster) */}
        <div className="absolute inset-0" style={{ background: gradient }} />

        {/* Reel — autoplaying loop. Real footage is served as a tiny muted
            <video> (mp4); the SVG placeholders stay as <img>. */}
        {reel &&
          (isVideo ? (
            <video
              src={reel}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              style={fit}
              className={mediaCls}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel}
              alt={project.title}
              loading="lazy"
              decoding="async"
              style={fit}
              className={mediaCls}
            />
          ))}

        {/* Legibility scrim for the overlaid text */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Meta — big uppercase title left, /YY right */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <h3 className="min-w-0 truncate text-[clamp(1.4rem,4.5vw,2rem)] font-bold uppercase leading-none tracking-tight text-white">
            {project.title}
          </h3>
          {shortYear && (
            <span className="shrink-0 text-[clamp(1.4rem,4.5vw,2rem)] font-bold leading-none tracking-tight text-white">
              {shortYear}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
