"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Light-switch toggle — a pill track with a sliding knob. Sets data-theme on
 * <html> (persisted); the page fades between themes via the global transition.
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
      // Liquid-glass switch: a frosted pill track with the mode's name, and
      // an oversized glass knob that sits proud of the track's edge, its
      // icon lit from inside. Styles live in globals.css (.lg-switch).
      // EDIT: size — the --lg-h custom property sets the track height;
      // everything else scales from it.
      className="lg-switch"
    >
      <span className="lg-track" aria-hidden>
        <span className="lg-label lg-label-dark">Dark</span>
        <span className="lg-label lg-label-light">Light</span>
      </span>
      <span className="lg-knob" aria-hidden>
        <span className="lg-icon">
          {shown ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
