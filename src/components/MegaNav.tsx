"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, placeholderGradient, projectMedia } from "@/lib/projects";
import { youtubePoster } from "@/lib/youtube";
import { site } from "@/lib/site";

/**
 * Desktop nav: plain text links that open a full-width panel under the
 * header — the menu's main destinations in large type down the left, short
 * lists to their right — while the page behind dims and blurs. Opens on
 * hover with a short grace period, toggles on click, closes on Escape /
 * outside click. Colours run on theme tokens so it follows light/dark.
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
  external?: boolean;
  preview?: Preview;
  /** Wears the NEW badge (see NEWEST_SLUG). */
  isNew?: boolean;
};
type Group = { heading: string; items: Item[] };
/**
 * One dropdown: a full-width panel under the header. The `big` group runs
 * down the left in large type (the menu's main destinations); the `side`
 * groups sit to its right in small type; `preview` adds the project player.
 */
type Menu = {
  big: Group;
  side: Group[];
  preview?: boolean;
  cta?: { label: string; href: string };
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
    big: { heading: "Featured work", items: projectRange(0, 4) },
    side: [{ heading: "Recent", items: projectRange(4, 9) }],
    preview: true,
    cta: { label: "See all projects", href: "/projects" },
  },
  About: {
    big: {
      heading: "The studio",
      items: [
        { title: "Who we are", desc: "", href: "/who-we-are" },
        { title: "Services & partners", desc: "", href: "/services" },
        { title: "Philosophy", desc: "", href: "/philosophy" },
        { title: "Testimonials", desc: "", href: "/testimonials" },
      ],
    },
    side: [
      {
        heading: "Work with us",
        items: [
          { title: "Start a project", desc: "", href: site.contactUrl, external: true },
          { title: "Contact", desc: "", href: "/contact" },
        ],
      },
      {
        heading: "More",
        items: [
          { title: "All projects", desc: "", href: "/projects" },
          { title: "Store", desc: "", href: "/store" },
        ],
      },
    ],
  },
  Press: {
    big: {
      heading: "Press",
      items: [
        { title: "In the news", desc: "", href: "/press" },
        { title: "Press kit", desc: "", href: "/press/kit" },
      ],
    },
    side: [
      {
        heading: "Featured in",
        items: [{ title: "Chicago Reader", desc: "", href: PRESS_URL, external: true }],
      },
      {
        heading: "Press contact",
        items: [{ title: site.pressEmail, desc: "", href: `mailto:${site.pressEmail}`, external: true }],
      },
    ],
  },
};

// EDIT: the nav links' size + weight
const triggerCls =
  "inline-flex items-center whitespace-nowrap px-3 py-2 text-[14px] font-normal tracking-[-0.005em] transition-colors";

function MenuItem({
  item,
  size,
  onPick,
  onPreview,
  previewing = false,
}: {
  item: Item;
  size: "big" | "small";
  onPick: () => void;
  onPreview?: (p: Preview) => void;
  /** This item's clip is the one playing — keep it lit. */
  previewing?: boolean;
}) {
  // EDIT: the big links' size (the left column) and the small links'
  const cls =
    size === "big"
      ? `flex items-center gap-3 py-1 text-[clamp(28px,2.5vw,40px)] font-normal leading-[1.2] tracking-[-0.02em] transition-colors focus-visible:outline-none ${
          previewing ? "text-foreground" : "text-foreground hover:text-muted focus-visible:text-muted"
        }`
      : `flex items-center gap-2 py-1.5 text-[15px] font-medium tracking-[-0.005em] transition-colors focus-visible:outline-none ${
          previewing ? "text-foreground" : "text-foreground/85 hover:text-foreground focus-visible:text-foreground"
        }`;
  const body = (
    <>
      {item.title}
      {item.isNew && <NewBadge />}
      {size === "small" && item.desc && <span className="truncate text-[13px] font-normal text-muted">{item.desc}</span>}
    </>
  );
  // Hover or keyboard focus swaps the preview player to this project.
  const show = item.preview && onPreview ? () => onPreview(item.preview!) : undefined;
  return item.external ? (
    <a href={item.href} target={item.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" onClick={onPick} className={cls}>
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
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black [animation:pvfade_.35s_ease-out]"
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
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
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

export default function MegaNav({
  nav,
  onOpenChange,
}: {
  nav: { label: string; href: string }[];
  /** Tells the header a panel is open (it goes solid to join the panel). */
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpenState] = useState<string | null>(null);
  const setOpen = useCallback(
    (v: string | null) => {
      setOpenState(v);
      onOpenChange?.(v !== null);
    },
    [onOpenChange]
  );
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
  }, [setOpen]);

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
    active?.big.items.find((it) => it.preview)?.preview;

  return (
    // Not positioned: the panel spans the header's full width (the nearest
    // positioned ancestor), wherever the links sit inside it.
    <div ref={root} onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
      <nav className="flex items-center" aria-label="Main">
        {nav.map((item) => {
          const menu = MENUS[item.label];
          const isOpen = open === item.label;
          // EDIT: link colour — full white when its menu is open (or nothing
          // is open), dimmed while another menu is, like the reference.
          const tone = isOpen || !open ? "text-foreground" : "text-foreground/55 hover:text-foreground";
          if (!menu) {
            const external = item.label.toLowerCase() === "store";
            return (
              <Link key={item.label} href={item.href} onMouseEnter={close} className={`${triggerCls} ${tone}`}>
                {item.label}
                {external && <span aria-hidden className="ml-1">↗</span>}
              </Link>
            );
          }
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
              className={`${triggerCls} ${tone}`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* The page behind an open menu: dimmed and blurred (no pointer
          events, so moving onto it closes the menu like leaving it). */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 -z-10 bg-black/55 backdrop-blur-md transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel — full width, solid, under the header */}
      <div
        className={`absolute inset-x-0 top-full z-50 bg-background transition-[opacity,transform] duration-200 ease-out ${
          active ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0"
        }`}
      >
        {active && (
          <div
            role="menu"
            className="mx-auto grid max-w-[1760px] gap-x-16 px-6 pb-12 pt-8 lg:px-10"
            style={{ gridTemplateColumns: active.preview ? "minmax(0,1.1fr) minmax(0,0.8fr) minmax(0,1fr)" : "minmax(0,1.1fr) repeat(2, minmax(0,0.8fr))" }}
          >
            {/* The big column */}
            <div>
              <p className="mb-4 text-[14px] text-muted">{active.big.heading}</p>
              {active.big.items.map((it) => (
                <MenuItem
                  key={it.title + it.href}
                  item={it}
                  size="big"
                  onPick={close}
                  onPreview={(p) => open && setPreview({ panel: open, p })}
                  previewing={!!it.preview && shown?.href === it.preview.href}
                />
              ))}
              {active.cta && (
                <Link href={active.cta.href} onClick={close} className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-muted transition-colors hover:text-foreground">
                  {active.cta.label} <span aria-hidden>→</span>
                </Link>
              )}
            </div>

            {/* The small columns */}
            {active.side.map((g) => (
              <div key={g.heading}>
                <p className="mb-4 text-[14px] text-muted">{g.heading}</p>
                {g.items.map((it) => (
                  <MenuItem
                    key={it.title + it.href}
                    item={it}
                    size="small"
                    onPick={close}
                    onPreview={(p) => open && setPreview({ panel: open, p })}
                    previewing={!!it.preview && shown?.href === it.preview.href}
                  />
                ))}
              </div>
            ))}

            {/* The project player */}
            {active.preview && (
              <div>
                <p className="mb-4 text-[14px] text-muted">Preview</p>
                <PreviewPlayer preview={shown} onPick={close} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
