"use client";

import { useEffect, useState } from "react";

/** Copies `text` to the clipboard; shows "Copied" for a moment. */
export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1800);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(text).then(() => setDone(true))}
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
        done ? "border-accent text-accent" : "border-hairline text-foreground/70 hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {done ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12l5 5L20 7" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
      {done ? "Copied" : label}
    </button>
  );
}
