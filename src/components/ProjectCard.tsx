import type { Project } from "@/lib/projects";

/**
 * Gallery card — the reel itself with the meta overlaid on it: a small logo,
 * the title, and the type (category/artist) at the bottom-left, and the year
 * at the bottom-right, over a gradient scrim for legibility.
 */
export default function ProjectCard({
  project,
  gradient,
  media,
}: {
  project: Project;
  index: number;
  gradient: string;
  media?: string;
}) {
  const reel = project.video ?? media;
  const isVideo = !!reel && /\.(mp4|webm)$/i.test(reel);
  const subtitle = project.artist ?? project.category;
  const fit = project.objectPosition
    ? { objectPosition: project.objectPosition }
    : undefined;
  const mediaCls =
    "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]";

  return (
    <a data-card href="#" className="group block">
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

        {/* Meta — overlaid on the video */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          {/* Bottom-left: title + type */}
          <div className="min-w-0">
            <h3 className="text-[15px] font-normal leading-tight tracking-[-0.03em] text-white">
              {project.title}
            </h3>
            <p className="mt-0.5 text-[12px] leading-tight text-white/70">
              {subtitle}
            </p>
          </div>

          {/* Bottom-right: small logo above the year */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {/* EDIT: small per-project logo — set project.logo to an image path */}
            {project.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.logo}
                alt=""
                className="h-4 w-auto max-w-[80px] object-contain"
              />
            ) : (
              <span aria-hidden className="block h-4 w-4 rounded bg-white/25" />
            )}
            {project.year && (
              <span className="text-[13px] font-medium text-white/85">
                {project.year}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
