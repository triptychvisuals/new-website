"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, placeholderGradient, projectMedia } from "@/lib/projects";
import { youtubePoster } from "@/lib/youtube";
import { site } from "@/lib/site";

/**
 * Desktop nav: pill-shaped triggers with an up/down chevron that open a
 * dropdown panel — a column grid with titles + one-line descriptions (and
 * optional column headings, icons, and a footer row). Opens on hover with a
 * short grace period, toggles on click, closes on Escape / outside click.
 * Panel colors run on theme tokens so it follows light/dark mode.
 *
 * The Projects panel's last column is a live preview: hovering (or
 * focusing) a project name plays that project's clip in a small player.
 */

/** What the preview player shows for a project. */
type Preview = {
  title: string;
  meta: string;
  href: string;
  /** mp4/webm clip — plays muted on loop. */
  video?: string;
  /** Fallback while a project has no clip: animated reel art over a gradient. */
  still: string;
  gradient: string;
  isNew?: boolean;
};
type Item = {
  title: string;
  desc: string;
  href: string;
  icon?: IconName;
  external?: boolean;
  preview?: Preview;
  /** Wears the NEW badge (see NEWEST_SLUG). */
  isNew?: boolean;
};
type Column = { heading?: string; items: Item[]; kind?: "preview" };
type Menu = {
  label: string;
  columns: Column[];
  footer?: { cta: { label: string; href: string }; links: { label: string; href: string }[] };
  /** EDIT: panel width — wide for the projects grid, narrower for the rest. */
  width: string;
  /** Optional CSS grid-template-columns (defaults to equal columns). */
  template?: string;
};

// EDIT: the Chicago Reader feature (also linked from the About press card).
const PRESS_URL =
  "https://chicagoreader.com/music/chicagoans-of-note/lawrence-law-mahone-triptych-visuals-video/";

// EDIT: the newest video — its slug (the end of its /work/… link) gets the
// NEW badge in the Projects dropdown and on the preview player. Set it to
// the next release when it drops; "" hides the badge.
const NEWEST_SLUG = "overthink";

/**
 * The ✦ NEW badge — pulses: a copy of the pill swells out behind it and
 * fades (badge-pulse in globals.css). `onMedia` = over the preview video.
 */
function NewBadge({ onMedia = false }: { onMedia?: boolean }) {
  return (
    <span
      className={`relative isolate inline-flex shrink-0 items-center gap-1 rounded-full bg-[color:var(--accent)] px-2 py-[3px] text-[10px] font-bold uppercase leading-none tracking-[0.1em] text-white ${
        onMedia ? "shadow-[0_2px_10px_rgba(229,54,31,0.55)]" : ""
      }`}
    >
      <span aria-hidden className="badge-pulse absolute inset-0 -z-10 rounded-full bg-[color:var(--accent)]" />
      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0c.6 5.6 6.4 11.4 12 12-5.6.6-11.4 6.4-12 12-.6-5.6-6.4-11.4-12-12C5.6 11.4 11.4 5.6 12 0z" />
      </svg>
      New
    </span>
  );
}

const projectItem = (i: number): Item | null => {
  const p = projects[i];
  if (!p) return null;
  const desc = [p.artist ?? p.category, p.year].filter(Boolean).join(" · ");
  const href = `/work/${p.slug}`;
  const isNew = !!NEWEST_SLUG && p.slug === NEWEST_SLUG;
  return {
    title: p.title,
    desc,
    href,
    isNew,
    preview: {
      isNew,
      title: p.title,
      meta: desc,
      href,
      video: p.video && /\.(mp4|webm)$/i.test(p.video) ? p.video : undefined,
      still: p.youtube ? youtubePoster(p.youtube) : projectMedia(i),
      gradient: placeholderGradient(i),
    },
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
    // EDIT: the preview column runs a touch wider than the name lists.
    template: "minmax(0,1fr) minmax(0,1fr) minmax(0,1.25fr)",
    columns: [
      { heading: "Featured", items: projectRange(0, 4) },
      { heading: "Recent", items: projectRange(4, 8) },
      { heading: "Preview", items: [], kind: "preview" },
    ],
    footer: {
      cta: { label: "See all projects", href: "/projects" },
      links: [
        { label: "Press", href: "/press" },
        { label: "Contact", href: site.contactUrl },
      ],
    },
  },
  About: {
    label: "About",
    width: "w-[min(900px,calc(100vw-48px))]",
    columns: [
      {
        items: [
          { title: "Who we are", desc: "The studio, the people, and the process", href: "/who-we-are", icon: "spark" },
          { title: "Services & partners", desc: "Music video, commercial, and brand film for the labels we work with", href: "/services", icon: "globe" },
        ],
      },
      {
        items: [
          { title: "Philosophy", desc: "How we think about every frame we make", href: "/philosophy", icon: "film" },
          { title: "Testimonials", desc: "What collaborators say — and a note from our founder", href: "/testimonials", icon: "quote" },
        ],
      },
      {
        items: [
          { title: "Contact", desc: "Start a project with Triptych Studios", href: site.contactUrl, icon: "mail" },
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
          { title: "In the news", desc: "Features and coverage of the studio", href: "/press", icon: "bolt" },
          { title: "Press kit", desc: "Bios, facts, logos, and credits", href: "/press/kit", icon: "spark" },
        ],
      },
      {
        items: [
          { title: "Chicago Reader", desc: "Featured: Lawrence “Law” Mahone of Triptych", href: PRESS_URL, icon: "news", external: true },
        ],
      },
    ],
  },
};

/* ── icons (stroke, currentColor) ───────────────────────────────────────── */
type IconName = "spark" | "globe" | "bolt" | "film" | "quote" | "mail" | "news";
const ICON_PATHS: Record<IconName, string> = {
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.5 9h17M3.5 15h17M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  film: "M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4",
  quote: "M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  news: "M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5",
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
      className="nav-icon mt-0.5 shrink-0 text-foreground/70"
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

function MenuItem({
  item,
  onPick,
  onPreview,
  previewing = false,
}: {
  item: Item;
  onPick: () => void;
  onPreview?: (p: Preview) => void;
  /** This item's clip is the one playing — keep its row lit. */
  previewing?: boolean;
}) {
  const body = (
    <>
      {item.icon && <Icon name={item.icon} />}
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-[15px] font-medium leading-snug tracking-tight text-foreground">
          {item.title}
          {item.isNew && <NewBadge />}
        </span>
        <span className="mt-1 block text-[14px] leading-snug text-muted">{item.desc}</span>
      </span>
    </>
  );
  const cls = `group/item -mx-3 flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-foreground/[0.07] hover:shadow-[inset_0_1px_0_var(--glass-rim)] focus-visible:bg-foreground/[0.07] focus-visible:outline-none ${
    previewing ? "bg-foreground/[0.07] shadow-[inset_0_1px_0_var(--glass-rim)]" : ""
  }`;
  // Hover or keyboard focus swaps the preview player to this project.
  const show = item.preview && onPreview ? () => onPreview(item.preview!) : undefined;
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onPick} className={cls}>
      {body}
    </a>
  ) : (
    <Link href={item.href} onClick={onPick} onMouseEnter={show} onFocus={show} className={cls}>
      {body}
    </Link>
  );
}

/**
 * The preview column: a small 16:9 player that plays whichever project is
 * hovered. Projects with a clip play it muted on loop; the rest show their
 * animated reel art over the project gradient until a clip is added. Each
 * swap fades in (keyed remount).
 */
function PreviewPlayer({ preview, onPick }: { preview?: Preview; onPick: () => void }) {
  if (!preview) return null;
  return (
    <Link href={preview.href} onClick={onPick} className="group/pv block">
      <div
        key={preview.href}
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-hairline bg-black [animation:pvfade_.35s_ease-out]"
        style={{ background: preview.gradient }}
      >
        {preview.video ? (
          <video
            src={preview.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.still}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Lower scrim + "playing" pip */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--accent)]" />
          {preview.video ? "Now playing" : "Preview"}
        </span>
        {preview.isNew && (
          <span className="absolute right-3 top-3">
            <NewBadge onMedia />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium tracking-tight text-foreground">
            {preview.title}
          </span>
          <span className="mt-0.5 block text-[13px] text-muted">{preview.meta}</span>
        </span>
        <span className="shrink-0 text-[13px] font-medium text-foreground/70 transition-colors group-hover/pv:text-foreground">
          Watch <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export default function MegaNav({ nav }: { nav: { label: string; href: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  // The hovered project, remembered with the panel it was hovered in — so a
  // panel that opens again starts the player on its default.
  const [preview, setPreview] = useState<{ panel: string; p: Preview } | undefined>(undefined);
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
  // Until something is hovered, the player shows the panel's first project.
  const shown =
    (preview?.panel === open ? preview.p : undefined) ??
    active?.columns.flatMap((c) => c.items).find((it) => it.preview)?.preview;

  return (
    // Not positioned: the dropdown panel centres on the header pill (the
    // nearest positioned ancestor), wherever the links sit inside it.
    <div ref={root} onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
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
            // Dark liquid glass: frosted over the page (.glass-menu in globals.css)
            className={`${active.width} glass-menu rounded-[26px] p-2`}
            role="menu"
          >
            <div
              className="grid divide-x divide-[color:var(--glass-edge)] rounded-[20px] bg-foreground/[0.03] shadow-[inset_0_0_0_1px_var(--glass-edge)]"
              style={{
                gridTemplateColumns:
                  active.template ?? `repeat(${active.columns.length}, minmax(0,1fr))`,
              }}
            >
              {active.columns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-1 px-7 py-6">
                  {col.heading && (
                    <p className="mb-2 text-[13px] font-medium text-muted">{col.heading}</p>
                  )}
                  {col.kind === "preview" && <PreviewPlayer preview={shown} onPick={close} />}
                  {col.items.map((it) => (
                    <MenuItem
                      key={it.title + it.href}
                      item={it}
                      onPick={close}
                      onPreview={(p) => open && setPreview({ panel: open, p })}
                      previewing={!!it.preview && shown?.href === it.preview.href}
                    />
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
