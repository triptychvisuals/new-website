/**
 * Oversized "Selected Works" title band that leads into the gallery.
 * A full-width grotesk line — "Triptych  ·001 [SELECTED WORKS]·  Studio" —
 * black on the page background (inverts in dark mode).
 */

const wordCls =
  "text-[15vw] font-normal leading-[0.85] tracking-[-0.03em] lg:text-[12.5vw]";

export default function SelectedWorks() {
  return (
    <section
      className="px-4 pb-2 pt-10 sm:px-6 sm:pt-14"
      aria-label="Selected works"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className={wordCls}>Triptych</h2>

        {/* Index marker — EDIT: bump the number as the catalog grows */}
        <div className="mb-[1.2vw] flex flex-col self-end border-l border-foreground/30 pl-2 leading-tight">
          <span className="font-mono text-[11px] text-muted sm:text-xs">001</span>
          <span className="font-mono text-[11px] font-semibold tracking-wide text-foreground sm:text-xs">
            [SELECTED WORKS]
          </span>
        </div>

        <span className={wordCls}>Studio</span>
      </div>
    </section>
  );
}
