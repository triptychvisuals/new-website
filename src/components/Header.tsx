"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Sticky header:
 *   [switch] Imagination in Motion .... NAV ◬logo NAV .... TIME  icons
 * On mobile it collapses to a hamburger that drops a compact panel from the top.
 */
function hasArrow(label: string) {
  return label.toLowerCase() === "store";
}

const linkCls =
  "inline-flex items-center gap-1 text-[13px] font-medium uppercase tracking-tight text-foreground transition-opacity hover:opacity-60 whitespace-nowrap";

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = () => {
      const d = new Date();
      const ampm = d.getHours() >= 12 ? "PM" : "AM";
      const h = d.getHours() % 12 || 12;
      return `${pad(h)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
    };
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* Social icons */
function IgIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07L16.44 0z" />
    </svg>
  );
}
function YtIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.4 12 31 31 0 0 0 23 7.5zM9.8 15.5v-7l6 3.5z" />
    </svg>
  );
}
function LiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
    <div className="flex items-center gap-3 text-foreground">
      {socials.map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} className="transition-opacity hover:opacity-60">
          <s.Icon />
        </a>
      ))}
    </div>
  );
}

function NavLink({ item }: { item: { label: string; href: string } }) {
  return (
    <Link href={item.href} className={linkCls}>
      {item.label}
      {hasArrow(item.label) && <span aria-hidden>↗</span>}
    </Link>
  );
}

function Logo({ onClick, className = "" }: { onClick?: () => void; className?: string }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Triptych — home" className={`inline-flex items-start gap-0.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/triptych-logo.png" alt="Triptych" className="h-5 w-auto [filter:brightness(0)] dark:[filter:none]" />
      <sup className="text-[0.5rem] leading-none text-foreground">®</sup>
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const time = useClock();

  const mid = Math.ceil(site.nav.length / 2);
  const left = site.nav.slice(0, mid);
  const right = site.nav.slice(mid);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-background/80 px-5 py-4 backdrop-blur-md sm:px-8">
      {/* Left: light-switch toggle + tagline */}
      <div className="hidden items-center gap-3 md:flex">
        <ThemeToggle />
        <span className="hidden text-[11px] tracking-wide text-foreground/55 lg:inline">
          Imagination in Motion
        </span>
      </div>

      {/* Center: nav clustered around the logo */}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
        <span className="flex items-center gap-6">
          {left.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </span>
        <Logo className="mx-8" />
        <span className="flex items-center gap-6">
          {right.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </span>
      </nav>

      {/* Right: clock + social icons */}
      <div className="hidden items-center gap-5 md:flex">
        <span className="hidden font-mono text-xs tabular-nums text-foreground/70 lg:inline" suppressHydrationWarning>
          {time || "--:--:-- --"}
        </span>
        <SocialRow />
      </div>

      {/* Mobile: logo + centered clock + toggle + hamburger */}
      <div className="relative flex w-full items-center justify-between md:hidden">
        <Logo />
        <span
          className="absolute left-1/2 -translate-x-1/2 font-mono text-xs tabular-nums text-foreground/70"
          suppressHydrationWarning
        >
          {time || "--:--:-- --"}
        </span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative flex h-5 w-7 flex-col items-end justify-center"
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

      {/* Mobile dropdown — drops from the top, sized to content */}
      <div
        className={`absolute inset-x-0 top-full origin-top border-b border-hairline bg-background shadow-xl transition-all duration-300 ease-out md:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-3 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-5 py-2">
          {site.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
              className="flex items-center gap-2 border-b border-hairline/70 py-3.5 text-xl font-normal uppercase tracking-tight text-foreground last:border-0"
            >
              {item.label}
              {hasArrow(item.label) && <span aria-hidden>↗</span>}
            </Link>
          ))}
        </nav>
        <div className="px-5 pb-4 pt-1">
          <SocialRow />
        </div>
      </div>
    </header>
  );
}
