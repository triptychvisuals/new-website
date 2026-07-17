/**
 * Oversized title band that leads into the gallery.
 * A full-width grotesk line — "Featured  ·001 [SELECTED WORKS]·  Work" —
 * black on the page background (inverts in dark mode).
 */

const wordCls =
  "text-[11vw] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[12vw] lg:text-[12.5vw]";

export default function SelectedWorks() {
  return (
    <section
      className="px-4 pb-2 pt-10 sm:px-6 sm:pt-14"
      aria-label="Featured work"
    >
      <div className="flex items-center justify-between gap-1.5 sm:gap-3">
        <h2 className={wordCls}>Featured</h2>

        {/* Index marker — kept between the words at every size (tiny on phones). */}
        <div className="mb-[1.2vw] flex shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-1 leading-tight sm:pl-2">
          <span className="text-[6px] text-muted sm:text-[10px] lg:text-[11px]">
            001
          </span>
          <span className="text-[6px] font-semibold tracking-wide text-foreground sm:text-[10px] lg:text-[11px]">
            [SELECTED WORKS]
          </span>
        </div>

        <span className={wordCls}>Work</span>
      </div>
    </section>
  );
}
