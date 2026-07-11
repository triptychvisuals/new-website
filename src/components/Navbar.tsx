"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/* ------------------------------------------------------------------ *
 * Nav data — EDIT: labels, links, and mega-menu content live here.
 * Items with a `mega` block open a two-column dropdown on hover.
 * ------------------------------------------------------------------ */
type MegaLink = { label: string; href: string };
type MegaCategory = {
  label: string;
  href: string;
  title: string; // EDIT: right-panel heading for this category
  description: string; // EDIT: right-panel blurb
  links: MegaLink[];
};
type NavItem = {
  label: string;
  href?: string;
  mega?: MegaCategory[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Work", // EDIT
    mega: [
      {
        label: "Selected Projects",
        href: "#work",
        title: "Selected Projects",
        description:
          "A rotating cut of recent builds — interaction, motion, and 3D.",
        links: [
          { label: "Case study one", href: "#" },
          { label: "Case study two", href: "#" },
          { label: "Case study three", href: "#" },
          { label: "View all work", href: "#" },
        ],
      },
      {
        label: "Capabilities",
        href: "#capabilities",
        title: "What we do",
        description: "From concept to a shipped, scroll-driven experience.",
        links: [
          { label: "Art direction", href: "#" },
          { label: "WebGL / 3D", href: "#" },
          { label: "Motion design", href: "#" },
          { label: "Frontend engineering", href: "#" },
        ],
      },
      {
        label: "Process",
        href: "#process",
        title: "How we work",
        description: "Reference-driven, built one section at a time.",
        links: [
          { label: "Discovery", href: "#" },
          { label: "Prototype", href: "#" },
          { label: "Build & polish", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Studio", // EDIT
    mega: [
      {
        label: "About",
        href: "#about",
        title: "The studio",
        description: "A small team obsessed with motion-first web.",
        links: [
          { label: "Our story", href: "#" },
          { label: "Team", href: "#" },
          { label: "Careers", href: "#" },
        ],
      },
      {
        label: "Journal",
        href: "#journal",
        title: "Journal",
        description: "Notes on craft, experiments, and breakdowns.",
        links: [
          { label: "Latest posts", href: "#" },
          { label: "Experiments", href: "#" },
        ],
      },
    ],
  },
  { label: "About", href: "#about" }, // EDIT: plain link, no dropdown
  { label: "Contact", href: "#contact" }, // EDIT
];

const SCROLL_THRESHOLD = 80; // EDIT: px scrolled before the bar collapses

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Collapse/expand driven by scroll position (synced to Lenis via ScrollTrigger).
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScrolled(self.scroll() > SCROLL_THRESHOLD),
    });
    return () => st.kill();
  }, []);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenItem(label);
    setActiveCat(0);
  };
  // Small delay so moving from the bar into the panel doesn't flicker shut.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenItem(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const activeMega = NAV_ITEMS.find((i) => i.label === openItem)?.mega ?? null;

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3"
      onMouseLeave={scheduleClose}
    >
      {/* ---- Morphing bar ---------------------------------------------- */}
      <nav
        className={[
          "pointer-events-auto mx-auto flex items-center justify-between gap-4",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? // Collapsed: dark floating pill (Neutra-style)
              "max-w-3xl rounded-full bg-zinc-900/80 px-4 py-2 text-zinc-100 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-md"
            : // Expanded: full-width white bar
              "max-w-6xl rounded-2xl bg-white/95 px-6 py-3 text-zinc-900 shadow-lg shadow-black/5 ring-1 ring-black/5 backdrop-blur-sm",
        ].join(" ")}
      >
        {/* Logo — glows on hover */}
        <a
          href="#top"
          className="group relative inline-flex items-center"
          aria-label="Home"
        >
          <span
            className="absolute -inset-2 rounded-full bg-[var(--accent)] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"
            aria-hidden
          />
          {/* EDIT: replace with your logo mark / <Image> */}
          <span
            className={[
              "relative grid h-8 w-8 place-items-center rounded-lg text-lg font-bold transition-colors duration-500",
              scrolled
                ? "bg-white/10 text-white"
                : "bg-zinc-900 text-white",
            ].join(" ")}
          >
            ◬
          </span>
        </a>

        {/* Center links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isOpen = openItem === item.label;
            return (
              <li
                key={item.label}
                onMouseEnter={() => (item.mega ? open(item.label) : scheduleClose())}
              >
                <a
                  href={item.href ?? "#"}
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    scrolled
                      ? "text-zinc-300 hover:bg-white/10 hover:text-white"
                      : "text-zinc-600 hover:bg-black/5 hover:text-zinc-900",
                    isOpen && (scrolled ? "bg-white/10 text-white" : "bg-black/5 text-zinc-900"),
                  ].join(" ")}
                >
                  {item.label}
                  {item.mega && (
                    <svg
                      className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                    >
                      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <a
          href="#contact" // EDIT
          className={[
            "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
            scrolled
              ? "bg-white text-zinc-900 hover:bg-zinc-200"
              : "bg-zinc-900 text-white hover:bg-zinc-700",
          ].join(" ")}
        >
          Get in touch
        </a>
      </nav>

      {/* ---- Mega-menu panel ------------------------------------------- */}
      <div
        className={[
          "pointer-events-none mx-auto max-w-3xl px-2",
          "transition-all duration-300 ease-out",
          activeMega
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0",
        ].join(" ")}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {activeMega && (
          <div className="pointer-events-auto mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-2 rounded-2xl bg-zinc-900/90 p-2 shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-md">
            {/* Left: category list */}
            <ul className="flex flex-col">
              {activeMega.map((cat, i) => (
                <li key={cat.label}>
                  <a
                    href={cat.href}
                    onMouseEnter={() => setActiveCat(i)}
                    className={[
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                      i === activeCat
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:text-white",
                    ].join(" ")}
                  >
                    {cat.label}
                    <svg className="h-3.5 w-3.5 opacity-60" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M4.5 3 7.5 6 4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            {/* Right: detail panel for the active category */}
            <div className="rounded-xl bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">
                {activeMega[activeCat].title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {activeMega[activeCat].description}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                {activeMega[activeCat].links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center gap-1 py-1 text-sm text-zinc-300 transition-colors hover:text-white"
                    >
                      {l.label}
                      <span className="opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
