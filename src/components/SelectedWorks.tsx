/**
 * Oversized title band that leads into the gallery.
 * A full-width grotesk line — "Featured  ·001 [SELECTED WORKS]·  Work" —
 * black on the page background (inverts in dark mode).
 */

const wordCls =
  "text-[13vw] font-normal leading-[0.9] tracking-[-0.03em] lg:text-[12.5vw]";

export default function SelectedWorks() {
  return (
    <section
      className="px-4 pb-2 pt-10 sm:px-6 sm:pt-14"
      aria-label="Featured work"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className={wordCls}>Featured</h2>

        {/* Index marker (hidden on small screens so the words never overflow) */}
        <div className="mb-[1.2vw] hidden flex-col self-end border-l border-foreground/30 pl-2 leading-tight lg:flex">
          <span className="text-[11px] text-muted sm:text-xs">001</span>
          <span className="text-[11px] font-semibold tracking-wide text-foreground sm:text-xs">
            [SELECTED WORKS]
          </span>
        </div>

        <span className={wordCls}>Work</span>
      </div>
    </section>
  );
}
