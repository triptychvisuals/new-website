import type { Project } from "@/lib/projects";

/**
 * Gallery card — a rounded card (white in light mode / near-black in dark) with
 * an inset rounded reel, then the title with the year on the right and a gray
 * subtitle (artist, falling back to category) beneath.
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
    <a
      data-card
      href="#"
      className="group block rounded-3xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-none dark:hover:shadow-none"
    >
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
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      {/* Meta */}
      <div className="px-1.5 pb-1 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-semibold leading-tight text-foreground">
            {project.title}
          </h3>
          {project.year && (
            <span className="shrink-0 text-sm text-muted">{project.year}</span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
    </a>
  );
}
