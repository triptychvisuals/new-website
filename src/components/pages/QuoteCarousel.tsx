"use client";

import { useEffect, useState } from "react";

type Q = { quote: string; author: string; role: string };

/**
 * One big quote at a time: arrows, dots, the keyboard's left/right keys,
 * and it advances on its own every few seconds until you take over.
 */
export default function QuoteCarousel({ items }: { items: Q[] }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const go = (n: number) => {
    setAuto(false);
    setI((n + items.length) % items.length);
  };
  useEffect(() => {
    if (!auto || items.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 6000); // EDIT: ms per quote
    return () => clearInterval(id);
  }, [auto, items.length]);
  const q = items[i];
  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      aria-roledescription="carousel"
      className="rounded-3xl bg-foreground p-8 text-background outline-none sm:p-14"
    >
      <span aria-hidden className="block text-[5rem] leading-[0.6] text-accent">“</span>
      <blockquote key={i} className="mt-4 max-w-[30ch] text-[clamp(1.6rem,3.4vw,2.9rem)] font-normal leading-[1.15] tracking-tight [animation:pvfade_.5s_ease-out]" aria-live="polite">
        {q.quote}
      </blockquote>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <p>
          <span className="block text-[17px] font-medium">{q.author}</span>
          <span className="block text-[14px] opacity-60">{q.role}</span>
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {items.map((_, k) => (
              <button key={k} type="button" onClick={() => go(k)} aria-label={`Quote ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-background" : "w-1.5 bg-background/35"}`} />
            ))}
          </div>
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-background/30 hover:border-background">←</button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-background/30 hover:border-background">→</button>
        </div>
      </div>
    </div>
  );
}
