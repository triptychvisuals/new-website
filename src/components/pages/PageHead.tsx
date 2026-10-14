/**
 * The oversized page header shared by the inner pages: big title, index
 * marker on the right, a lead line, and an optional facts strip.
 */
export default function PageHead({
  title,
  index,
  label,
  lead,
  facts = [],
}: {
  title: string;
  index: string;
  label: string;
  lead?: string;
  facts?: [string, string][];
}) {
  return (
    <section className="mx-auto w-full max-w-[1760px] px-4 pb-2 pt-10 sm:px-6 sm:pt-14" aria-label={title}>
      <div className="flex items-center justify-between gap-1.5 sm:gap-3">
        <h1 className="text-[min(12vw,150px)] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[min(11vw,170px)]">{title}</h1>
        <div className="mb-[1.2vw] flex shrink-0 flex-col self-end whitespace-nowrap border-l border-foreground/30 pl-1 leading-tight sm:pl-2">
          <span className="text-[6px] text-muted sm:text-[10px] lg:text-[11px]">{index}</span>
          <span className="text-[6px] font-medium text-foreground sm:text-[10px] lg:text-[11px]">{label}</span>
        </div>
      </div>
      {lead && <p className="mt-6 max-w-[56ch] text-[clamp(1.1rem,1.8vw,1.35rem)] leading-snug text-foreground/70">{lead}</p>}
      {facts.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-x-8 md:grid-cols-4">
          {facts.map(([k, v], i) => (
            <div key={k} className={`flex items-center justify-between gap-3 border-b border-hairline py-2 ${i < 2 ? "border-t" : "md:border-t"}`}>
              <span className="text-[14px] text-muted">{k}</span>
              <span className="truncate text-sm font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
