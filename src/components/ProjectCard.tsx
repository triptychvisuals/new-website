import type { Project } from "@/lib/projects";

/**
 * One gallery cell: media (still/video/gradient) with a hover zoom + PLAY
 * affordance, then title · [n] · CLIENT metadata underneath.
 */
export default function ProjectCard({
  project,
  index,
  gradient,
}: {
  project: Project;
  index: number;
  gradient: string;
}) {
  const n = index + 1;

  return (
    <a data-card href="#" className="group block">
      {/* Media */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
        {project.video ? (
          // EDIT: muted looping hover preview
          <video
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            src={project.video}
            poster={project.src}
            muted
            loop
            playsInline
            preload="none"
          />
        ) : project.src ? (
          // EDIT: real still image
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            src={project.src}
            alt={project.title}
          />
        ) : (
          // Placeholder gradient until real media is dropped in
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            style={{ background: gradient }}
          />
        )}

        {/* PLAY affordance */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-mono text-xs tracking-[0.35em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
            PLAY
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-medium leading-tight text-foreground">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">[{n}]</span>
      </div>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
        {project.client}
      </p>
    </a>
  );
}
