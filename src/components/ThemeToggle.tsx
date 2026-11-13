"use client";

import { useEffect, useRef, useState } from "react";
import { haptic } from "@/lib/haptics";

/**
 * Theme switch — a plain icon button. Sets data-theme on <html> (kept for
 * the visit). The site starts dark (layout.tsx).
 */
export default function ThemeToggle() {
  const btn = useRef<HTMLButtonElement>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Read the saved theme on the next frame (after hydration).
    const first = requestAnimationFrame(() => setDark(document.documentElement.getAttribute("data-theme") === "dark"));
    return () => cancelAnimationFrame(first);
  }, []);

  const toggle = () => {
    haptic("tap");
    const next = !dark;
    setDark(next);
    const el = document.documentElement;
    // sessionStorage so the choice follows them across pages this visit, but
    // the next visit starts dark again.
    if (next) {
      el.setAttribute("data-theme", "dark");
      try {
        sessionStorage.setItem("theme", "dark");
      } catch {}
    } else {
      el.removeAttribute("data-theme");
      try {
        sessionStorage.setItem("theme", "light");
      } catch {}
    }
  };

  return (
    <button
      ref={btn}
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      // A plain icon button: the moon on light, the sun on dark.
      className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.08]"
    >
      {dark ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
          <path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z" />
        </svg>
      )}
    </button>
  );
}
