"use client";

import { useEffect, useState } from "react";

/** Light/dark toggle — sets data-theme on <html> and persists to localStorage. */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const el = document.documentElement;
    if (next) {
      el.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      el.removeAttribute("data-theme");
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground ring-1 ring-hairline transition-colors hover:bg-foreground/5"
    >
      {dark ? (
        // Sun
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // Moon
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
