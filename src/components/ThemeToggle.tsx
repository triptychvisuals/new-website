"use client";

import { useEffect, useState } from "react";

/**
 * Light-switch toggle — a pill track with a sliding knob. Sets data-theme on
 * <html> (persisted); the page fades between themes via the global transition.
 */
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
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full ring-1 ring-hairline transition-colors bg-foreground/10"
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full bg-foreground text-background shadow transition-transform duration-300 ease-out ${
          dark ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      >
        {dark ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
        )}
      </span>
    </button>
  );
}
