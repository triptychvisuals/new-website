"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import ThemeToggle from "@/components/ThemeToggle";
import MegaNav from "@/components/MegaNav";

/**
 * Sticky header — a floating liquid-glass pill:
 *   ◬ Triptych Studios® | Projects ⇕  About ⇕  Press ⇕  Store ↗ ....... ☀☾  [Start a project]
 * Below lg it collapses to logo · switch · hamburger, with the menu dropping
 * from under the pill.
 */
/** EDIT: the authored wordmark, used whenever the portal has no logo set. */
const DEFAULT_LOGO = "/triptych-logo.png";

function hasArrow(label: string) {
  return label.toLowerCase() === "store";
}

/**
 * On phones the About content lives inline on the home page, so the menu
 * scrolls to it instead of loading /about — mobile stays one continuous scroll.
 */
function mobileHref(href: string) {
  if (href === "/about") return "/#about";
  if (href.startsWith("/about#")) return `/#${href.split("#")[1]}`;
  return href;
}

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
 * The call-to-action: a dark glass pill inside an iridescent ring of light
 * that flows round its edge, with a soft glow of the same colours behind it.
 * Only a rotation animates (globals.css, .cta-liquid).
 */
function LiquidButton({
  href,
  onClick,
  small = false,
  children,
}: {
  href: string;
  onClick?: () => void;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a href={href} onClick={onClick} className="cta-liquid group">
      <span aria-hidden className="cta-glow">
        <span className="cta-spin" />
      </span>
      <span aria-hidden className="cta-ring">
        <span className="cta-spin" />
      </span>
      <span className={`cta-face ${small ? "px-4 py-2 text-[14px]" : "px-5 py-2.5 text-[15px]"}`}>{children}</span>
    </a>
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* Mark height matches the wordmark's cap height; w-auto keeps its scale */}
      <img
        src={src}
        alt=""
        className={`h-4 w-auto lg:h-5 ${isDefault ? "[filter:brightness(0)] dark:[filter:none]" : ""}`}
      />
      {/* EDIT: wordmark — sits right of the mark, ® floated above its end */}
      <span className="relative whitespace-nowrap pr-2 text-[15px] font-medium leading-none tracking-tight text-foreground lg:pr-2.5 lg:text-[18px]">
        Triptych Studios
        <span aria-hidden className="absolute -top-1.5 right-0 text-[8px] leading-none lg:-top-2 lg:text-[10px]">
          ®
        </span>
      </span>
    </Link>
  );
}

export default function Header({ logo }: { logo?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    // data-site-header: Decade sets data-theme="dark" here while the
    // timeline is on screen, re-theming everything inside (menus included).
    <header data-site-header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      {/* EDIT: max-w-[1240px] = how wide the pill gets on big screens */}
      <div className="nav-pill relative mx-auto flex h-14 max-w-[1240px] items-center rounded-[18px] pl-5 pr-2 sm:pl-6 lg:h-[60px] lg:rounded-[20px]">
        {/* Desktop: logo | links ........ switch + CTA */}
        <div className="hidden min-w-0 flex-1 items-center lg:flex">
          <Logo src={logo} />
          <span aria-hidden className="mx-4 h-6 w-px bg-foreground/15 xl:mx-5" />
          <MegaNav nav={site.nav} />
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            {/* EDIT: the call-to-action button */}
            <LiquidButton href={site.contactUrl}>Start a project</LiquidButton>
          </div>
        </div>

        {/* Mobile: logo .... switch + hamburger */}
        <div className="flex w-full items-center justify-between pr-3 lg:hidden">
          <Logo src={logo} />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="relative flex h-[18px] w-7 flex-col items-end justify-center"
            >
              <span
                className={`block h-[1.5px] w-7 bg-foreground transition-transform duration-300 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`block h-[1.5px] w-7 bg-foreground transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[1.5px] -rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile dropdown — dark glass, drops from under the pill */}
        <div
          className={`glass-menu absolute inset-x-0 top-full mt-2 origin-top overflow-hidden rounded-[18px] transition-all duration-300 ease-out lg:hidden ${
            menuOpen
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-3 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-5 py-2">
            {site.nav.map((item) => (
              <Link
                key={item.label}
                href={mobileHref(item.href)}
                onClick={close}
                className="flex items-center gap-2 border-b border-hairline/70 py-3.5 text-xl font-normal tracking-tight text-foreground last:border-0"
              >
                {item.label}
                {hasArrow(item.label) && <span aria-hidden>↗</span>}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-1">
            <SocialRow />
            <LiquidButton href={site.contactUrl} onClick={close} small>
              Start a project
            </LiquidButton>
          </div>
        </div>
      </div>
    </header>
  );
}
