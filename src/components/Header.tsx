"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import ThemeToggle from "@/components/ThemeToggle";
import MegaNav from "@/components/MegaNav";
import { haptic } from "@/lib/haptics";

/**
 * Sticky header — a flat bar:
 *   ◬ Triptych Studios®  Projects  About  Press  Store ↗ ......... ☾  (Contact)  (Start a project ↗)
 * Desktop menus open a full-width panel under it (MegaNav). Phones get
 * logo · theme · menu, the menu filling the screen. On the home page it
 * floats over the hero video, see-through with white type, until scrolled.
 */
/** EDIT: the authored wordmark, used whenever the portal has no logo set. */
const DEFAULT_LOGO = "/triptych-logo.png";

/* Social icons — EDIT: sizes are the width/height on each svg */
function IgIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07L16.44 0z" />
    </svg>
  );
}
function YtIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.4 12 31 31 0 0 0 23 7.5zM9.8 15.5v-7l6 3.5z" />
    </svg>
  );
}
function LiIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.65h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.86V21H9z" />
    </svg>
  );
}
const socials = [
  { label: "Instagram", href: "#", Icon: IgIcon },
  { label: "TikTok", href: "#", Icon: TkIcon },
  { label: "YouTube", href: "#", Icon: YtIcon },
  { label: "LinkedIn", href: "#", Icon: LiIcon },
];
function SocialRow() {
  return (
    <div className="flex items-center gap-4 text-foreground">
      {socials.map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} className="transition-opacity hover:opacity-60">
          <s.Icon />
        </a>
      ))}
    </div>
  );
}

/**
 * The header's two buttons, flat: the primary a solid pill in the page's
 * ink (white on the dark theme), the secondary a quiet filled pill.
 */
function PillLink({
  href,
  onClick,
  primary = false,
  external = false,
  children,
}: {
  href: string;
  onClick?: () => void;
  primary?: boolean;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls = `inline-flex h-9 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full px-4 text-[14px] font-medium tracking-[-0.005em] transition-colors ${
    primary ? "bg-foreground text-background hover:bg-foreground/85" : "bg-foreground/[0.09] text-foreground hover:bg-foreground/[0.16]"
  }`;
  return external ? (
    <a href={href} onClick={() => { haptic("tap"); onClick?.(); }} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} onClick={() => { haptic("tap"); onClick?.(); }} className={cls}>
      {children}
    </Link>
  );
}

function Logo({
  onClick,
  className = "",
  src = DEFAULT_LOGO,
}: {
  onClick?: () => void;
  className?: string;
  src?: string;
}) {
  // A portal logo is used as-is; only the authored mark gets the theme filter
  // (it's white artwork that has to invert on the light background).
  const isDefault = src === DEFAULT_LOGO;
  return (
    <Link href="/" onClick={onClick} aria-label="Triptych Studios — home" className={`inline-flex items-center gap-2 lg:gap-2.5 ${className}`}>
      {/* Mark height matches the wordmark's cap height; w-auto keeps its scale */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`h-4 w-auto ${isDefault ? "[filter:brightness(0)] dark:[filter:none]" : ""}`}
      />
      {/* EDIT: wordmark — sits right of the mark, ® floated above its end */}
      <span className="relative whitespace-nowrap pr-2 text-[15px] font-medium leading-none tracking-tight text-foreground lg:pr-2.5 lg:text-[16px]">
        Triptych Studios
        <span aria-hidden className="absolute -top-1.5 right-0 text-[8px] leading-none lg:-top-1.5 lg:text-[9px]">
          ®
        </span>
      </span>
    </Link>
  );
}

/**
 * Phone menu: the whole screen under the bar, the destinations in large type.
 * EDIT: the list.
 */
const MOBILE_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Who we are", href: "/who-we-are" },
  { label: "Services & partners", href: "/services" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Press", href: "/press" },
  { label: "Store", href: "/store" },
];

export default function Header({ logo, overlay = false }: { logo?: string; overlay?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setMenuOpen(false);

  // Over the hero (home page): see-through, white type on a soft top shade,
  // until the page scrolls past most of the video — then solid.
  useEffect(() => {
    if (!overlay) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      // EDIT: how far down (× screen height) the bar turns solid
      setScrolled(window.scrollY > window.innerHeight * 0.55);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [overlay]);

  // The phone menu takes the screen: the page under it stays put.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const clear = overlay && !scrolled && !panelOpen && !menuOpen;

  return (
    // data-site-header: the header's hook for anything that needs to find it.
    // On the home page (overlay) -mb pulls the hero up under the bar.
    <header data-site-header className={`sticky top-0 z-40 ${overlay ? "-mb-14 lg:-mb-16" : ""}`}>
      <div
        // Over the hero the bar is forced dark, so the links read white on
        // the footage whatever the page's theme.
        data-theme={clear ? "dark" : undefined}
        className={`relative transition-colors duration-300 ${clear ? "bg-transparent" : "bg-background"}`}
      >
        {clear && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        )}
        <div className="mx-auto flex h-14 max-w-[1760px] items-center px-5 lg:h-16 lg:px-10">
          {/* Desktop: logo · links ............ theme · Contact · Start a project */}
          <div className="hidden min-w-0 flex-1 items-center gap-6 lg:flex">
            <Logo src={logo} />
            <MegaNav nav={site.nav} onOpenChange={setPanelOpen} />
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <PillLink href="/contact">Contact</PillLink>
              <PillLink href={site.contactUrl} primary external>
                Start a project <span aria-hidden>↗</span>
              </PillLink>
            </div>
          </div>

          {/* Phones: logo ............ theme · menu */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <Logo src={logo} onClick={close} />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => {
                  haptic("tap");
                  setMenuOpen((o) => !o);
                }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="grid h-10 w-10 place-items-center text-foreground"
              >
                {menuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l12 12M16 4L4 16" /></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><path d="M9.5 4.5v15" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phone menu — the full screen under the bar */}
      <div
        className={`fixed inset-x-0 bottom-0 top-14 overflow-y-auto bg-background transition-opacity duration-200 lg:hidden ${
          menuOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col px-5 pb-6 pt-4" aria-label="Main">
          {MOBILE_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="py-2 text-[30px] font-normal leading-[1.2] tracking-[-0.02em] text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 px-5 pb-10">
          <PillLink href={site.contactUrl} onClick={close} primary external>
            Start a project <span aria-hidden>↗</span>
          </PillLink>
          <PillLink href="/contact" onClick={close}>Contact</PillLink>
          <div className="pt-4">
            <SocialRow />
          </div>
        </div>
      </div>
    </header>
  );
}
