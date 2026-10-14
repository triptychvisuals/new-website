"use client";

import { useState } from "react";
import type { Service } from "@/lib/pages";

/** Services as an accordion: one open at a time, what's included inside. */
export default function ServiceAccordion({ items }: { items: Service[] }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="border-t border-hairline">
      {items.map((s, i) => {
        const on = open === i;
        return (
          <li key={s.name} className="border-b border-hairline">
            <button
              type="button"
              onClick={() => setOpen(on ? -1 : i)}
              aria-expanded={on}
              className="flex w-full items-baseline gap-5 py-6 text-left"
            >
              <span className="w-8 shrink-0 text-[14px] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-[clamp(1.6rem,3.6vw,3rem)] font-normal leading-none tracking-tight">{s.name}</span>
              <span className="hidden text-[14px] text-muted sm:inline">{s.from}</span>
              <span aria-hidden className={`text-2xl leading-none transition-transform duration-300 ${on ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 gap-6 pb-8 pl-13 sm:grid-cols-2 sm:pl-[3.25rem]">
                  <p className="max-w-[44ch] text-[17px] leading-relaxed text-foreground/75">{s.blurb}</p>
                  <ul className="flex flex-wrap content-start gap-2">
                    {s.includes.map((x) => (
                      <li key={x} className="rounded-full border border-hairline px-3.5 py-1.5 text-[13px] text-foreground/80">{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
