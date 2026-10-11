"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";

/**
 * Desktop nav: pill-shaped triggers with an up/down chevron that open a
 * dropdown panel — a column grid with titles + one-line descriptions (and
 * optional column headings, icons, and a footer row). Opens on hover with a
 * short grace period, toggles on click, closes on Escape / outside click.
 * Panel colors run on theme tokens so it follows light/dark mode.
 */

type Item = { title: string; desc: string; href: string; icon?: IconName; external?: boolean };
type Column = { heading?: string; items: Item[] };
type Menu = {
  label: string;
  columns: Column[];
  footer?: { cta: { label: string; href: string }; links: { label: string; href: string }[] };
  /** EDIT: panel width — wide for the projects grid, narrower for the rest. */
  width: string;
};

// EDIT: the Chicago Reader feature (also linked from the About press card).
const PRESS_URL =
  "https://chicagoreader.com/music/chicagoans-of-note/lawrence-law-mahone-triptych-visuals-video/";

const projectItem = (i: number): Item | null => {
  const p = projects[i];
  if (!p) return null;
  return {
    title: p.title,
    desc: [p.artist ?? p.category, p.year].filter(Boolean).join(" · "),
    href: `/work/${p.slug}`,
  };
};
const projectRange = (from: number, to: number) =>
  Array.from({ length: to - from }, (_, k) => projectItem(from + k)).filter(
    (x): x is Item => !!x
  );

// EDIT: dropdown contents, keyed by the nav label in lib/site.ts. A label
// with no entry here (e.g. Store) renders as a plain link.
const MENUS: Record<string, Menu> = {
  Projects: {
    label: "Projects",
    width: "w-[min(1080px,calc(100vw-48px))]",
    columns: [
      { heading: "Featured", items: projectRange(0, 4) },
      { heading: "Recent", items: projectRange(4, 8) },
      {
        heading: "Browse",
        items: [
          { title: "All projects", desc: "Every film, filterable by type", href: "/projects" },
          { title: "Music videos", desc: "Performance & narrative work", href: "/projects" },
          { title: "Finished frames", desc: "Stills you can pin to Pinterest", href: "/projects" },
        ],
      },
    ],
    footer: {
      cta: { label: "See all projects", href: "/projects" },
      links: [
        { label: "Press", href: "/about#press" },
        { label: "Awards", href: "/about#awards" },
        { label: "Contact", href: "/about#contact" },
      ],
    },
  },
  About: {
    label: "About",
    width: "w-[min(900px,calc(100vw-48px))]",
    columns: [
      {
        items: [
          { title: "Who we are", desc: "The studio, the people, and the process", href: "/about#about-intro", icon: "spark" },
          { title: "Services & partners", desc: "Music video, commercial, and brand film for the labels we work with", href: "/about#about-intro", icon: "globe" },
        ],
      },
      {
        items: [
          { title: "Philosophy", desc: "How we think about every frame we make", href: "/about#philosophy", icon: "film" },
          { title: "Testimonials", desc: "What collaborators say — and a note from our founder", href: "/about#testimonials", icon: "quote" },
        ],
      },
      {
        items: [
          { title: "Contact", desc: "Start a project with Triptych Studios", href: "/about#contact", icon: "mail" },
        ],
      },
    ],
  },
  Press: {
    label: "Press",
    width: "w-[min(900px,calc(100vw-48px))]",
    columns: [
      {
        items: [
          { title: "Production experience", desc: "A decade of credits, partners, and releases", href: "/about#press", icon: "bolt" },
        ],
      },
      {
        items: [
          { title: "Chicago Reader", desc: "Featured: Lawrence “Law” Mahone of Triptych", href: PRESS_URL, icon: "news", external: true },
        ],
      },
      {
        items: [
          { title: "Awards", desc: "Selected honors from festivals and the industry", href: "/about#awards", icon: "award" },
        ],
      },
    ],
  },
};

/* ── icons (stroke, currentColor) ───────────────────────────────────────── */
type IconName = "spark" | "globe" | "bolt" | "film" | "quote" | "mail" | "news" | "award";
const ICON_PATHS: Record<IconName, string> = {
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.5 9h17M3.5 15h17M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  film: "M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4",
  quote: "M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  news: "M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5",
  award: "M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM8.5 12 7 21l5-3 5 3-1.5-9",
};
function Icon({ name }: { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-0.5 shrink-0 text-foreground/70"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/** Up/down chevron pair, like a select affordance. */
function Chevrons() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="opacity-60">
      <path d="M2 5l3-3 3 3M2 9l3 3 3-3" />
    </svg>
  );
}

const triggerCls =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2 text-[15px] font-medium tracking-tight text-foreground transition-colors";

function MenuItem({ item, onPick }: { item: Item; onPick: () => void }) {
  const body = (
    <>
      {item.icon && <Icon name={item.icon} />}
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-snug tracking-tight text-foreground">
          {item.title}
        </span>
        <span className="mt-1 block text-[14px] leading-snug text-muted">{item.desc}</span>
      </span>
    </>
  );
  const cls =
    "-mx-3 flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] focus-visible:outline-none";
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onPick} className={cls}>
      {body}
    </a>
  ) : (
    <Link href={item.href} onClick={onPick} className={cls}>
      {body}
    </Link>
  );
}

export default function MegaNav({ nav }: { nav: { label: string; href: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  // EDIT: grace period (ms) so the panel survives the gap between trigger
  // and panel while the cursor travels down.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  const close = useCallback(() => {
    cancelClose();
    setOpen(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [close]);

  const active = open ? MENUS[open] : undefined;

  return (
    <div ref={root} className="relative" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
      <nav className="flex items-center gap-1" aria-label="Main">
        {nav.map((item) => {
          const menu = MENUS[item.label];
          if (!menu) {
            const external = item.label.toLowerCase() === "store";
            return (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={close}
                className={`${triggerCls} border-transparent hover:bg-foreground/[0.05]`}
              >
                {item.label}
                {external && <span aria-hidden>↗</span>}
              </Link>
            );
          }
          const isOpen = open === item.label;
          return (
            <button
              key={item.label}
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onMouseEnter={() => {
                cancelClose();
                setOpen(item.label);
              }}
              onClick={() => setOpen(isOpen ? null : item.label)}
              className={`${triggerCls} ${
                isOpen
                  ? "border-hairline bg-foreground/[0.05]"
                  : "border-transparent hover:bg-foreground/[0.05]"
              }`}
            >
              {item.label}
              <Chevrons />
            </button>
          );
        })}
      </nav>

      {/* Panel — outer frame + inner bordered grid, like a framed card */}
      <div
        className={`absolute left-1/2 top-full z-50 pt-3 transition-[opacity,transform] duration-200 ease-out ${
          active
            ? "visible -translate-x-1/2 translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-x-1/2 -translate-y-1 opacity-0"
        }`}
      >
        {active && (
          <div
            className={`${active.width} rounded-2xl border border-hairline bg-background p-2 dark:bg-[#151515] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)]`}
            role="menu"
          >
            <div
              className="grid divide-x divide-hairline rounded-xl border border-hairline"
              style={{ gridTemplateColumns: `repeat(${active.columns.length}, minmax(0,1fr))` }}
            >
              {active.columns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-1 px-7 py-6">
                  {col.heading && (
                    <p className="mb-2 text-[13px] font-medium text-muted">{col.heading}</p>
                  )}
                  {col.items.map((it) => (
                    <MenuItem key={it.title + it.href} item={it} onPick={close} />
                  ))}
                </div>
              ))}
            </div>

            {active.footer && (
              <div className="flex items-center justify-between px-5 pb-2 pt-4">
                <Link
                  href={active.footer.cta.href}
                  onClick={close}
                  className="text-[15px] font-medium text-[color:var(--accent)] transition-opacity hover:opacity-75"
                >
                  {active.footer.cta.label} <span aria-hidden>→</span>
                </Link>
                <div className="flex items-center gap-7">
                  {active.footer.links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={close}
                      className="text-[14px] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
