"use client";

import { useMemo, useState } from "react";
import { awards } from "@/lib/about";

/**
 * The awards table with a year filter: chips for every year (with a
 * count), the list regroups instantly. All local data.
 */
export default function AwardsByYear() {
  const years = useMemo(() => {
    const m = new Map<string, number>();
    awards.forEach((a) => m.set(a.year, (m.get(a.year) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, []);
  const [year, setYear] = useState("All");
  const shown = year === "All" ? awards : awards.filter((a) => a.year === year);
  const groups = useMemo(() => {
    const m = new Map<string, string[]>();
    shown.forEach((a) => m.set(a.year, [...(m.get(a.year) ?? []), a.name]));
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [shown]);

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[13px] tabular-nums transition-colors ${
      on ? "border-foreground bg-foreground text-background" : "border-hairline text-foreground/70 hover:border-foreground/40 hover:text-foreground"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setYear("All")} aria-pressed={year === "All"} className={chip(year === "All")}>
          All <span className="opacity-60">{awards.length}</span>
        </button>
        {years.map(([y, n]) => (
          <button key={y} type="button" onClick={() => setYear(y)} aria-pressed={year === y} className={chip(year === y)}>
            {y} <span className="opacity-60">{n}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-hairline" aria-live="polite">
        {groups.map(([y, names]) => (
          <div key={y} className="grid grid-cols-[72px_1fr] gap-x-6 border-b border-hairline py-5 sm:grid-cols-[120px_1fr]">
            <span className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-none tabular-nums tracking-tight">{y}</span>
            <ul className="space-y-2">
              {names.map((n) => (
                <li key={n} className="flex items-baseline gap-3 text-[15px] text-foreground/75">
                  <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
