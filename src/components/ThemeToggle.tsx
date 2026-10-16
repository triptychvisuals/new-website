"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Theme switch — a glass capsule with a sun and a moon; a bead slides behind
 * the active mode. Sets data-theme on <html> (kept for the visit).
 */
export default function ThemeToggle() {
  const btn = useRef<HTMLButtonElement>(null);
  const [dark, setDark] = useState(false);
  // The header is forced dark while the timeline section is on screen —
  // the knob follows it there, without touching the saved preference.
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const header = btn.current?.closest<HTMLElement>("[data-site-header]");
    const sync = () => setForced(header?.getAttribute("data-theme") === "dark");
    // Read the saved theme + the header's state on the next frame (after
    // hydration), then follow the header as the timeline toggles it.
    const first = requestAnimationFrame(() => {
      setDark(document.documentElement.getAttribute("data-theme") === "dark");
      sync();
    });
    const mo = new MutationObserver(sync);
    if (header) mo.observe(header, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelAnimationFrame(first);
      mo.disconnect();
    };
  }, []);
  const shown = dark || forced;

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const el = document.documentElement;
    // sessionStorage so the choice follows them across pages this visit, but
    // the next visit starts light again.
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
      data-on={shown ? "" : undefined}
      // Glass capsule: sun | moon, with a lit bead behind the active one.
      // Styles in globals.css (.seg-switch); EDIT: size via --seg there.
      className="seg-switch"
    >
      <span className="seg-bead" aria-hidden />
      <span className="seg-icon seg-sun" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      </span>
      <span className="seg-icon seg-moon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}
