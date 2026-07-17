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
  const subtitle = project.artist ?? project.category;

  return (
    <a data-card href="#" className="group block">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
        {/* Gradient base (poster) */}
        <div className="absolute inset-0" style={{ background: gradient }} />

        {/* Reel — animated loop (autoplays) */}
        {reel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reel}
            alt={project.title}
            style={project.objectPosition ? { objectPosition: project.objectPosition } : undefined}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        {/* Legibility scrim for the overlaid text */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Meta — overlaid on the video */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          {/* Bottom-left: small logo, title, type */}
          <div className="flex flex-col gap-1.5">
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
            <div>
              <h3 className="text-[15px] font-semibold leading-tight text-white">
                {project.title}
              </h3>
              <p className="mt-0.5 text-[12px] leading-tight text-white/70">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Bottom-right: year */}
          {project.year && (
            <span className="shrink-0 text-[13px] font-medium text-white/85">
              {project.year}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
