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
      // EDIT: switch size — track h/w here, knob size + travel below
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full ring-1 ring-hairline transition-colors bg-foreground/10"
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full bg-foreground text-background shadow transition-transform duration-300 ease-out ${
          shown ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      >
        {shown ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
        )}
      </span>
    </button>
  );
}
