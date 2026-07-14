import type { Project } from "@/lib/projects";

/**
 * Gallery cell: an autoplaying animated reel over a gradient base, then
 * title · [n] · CLIENT metadata.
 */
export default function ProjectCard({
  project,
  index,
  gradient,
  media,
}: {
  project: Project;
  index: number;
  gradient: string;
  media?: string;
}) {
  const n = index + 1;
  const reel = project.video ?? media;

  return (
    <a data-card href="#" className="group block">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
        {/* Gradient base (poster) */}
        <div className="absolute inset-0" style={{ background: gradient }} />

        {/* Reel — animated loop (autoplays) */}
        {reel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reel}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-normal leading-tight text-foreground">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">[{n}]</span>
      </div>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
        {project.category}
      </p>
    </a>
  );
}
