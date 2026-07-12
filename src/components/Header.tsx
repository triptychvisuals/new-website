"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Shared editorial top bar:
 *   [logo®] ................ nav · live clock · [Contact]   (desktop)
 *   [logo®] ................................... [hamburger] (mobile → overlay)
 *
 * The "Contact" nav link is dropped from the header (there's a Contact button);
 * the footer keeps the full nav.
 */
function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const format = () => {
      const d = new Date();
      const ampm = d.getHours() >= 12 ? "PM" : "AM";
      const h = d.getHours() % 12 || 12;
      return `${pad(h)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
    };
    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

// Header nav omits "Contact" — the button covers it.
const navLinks = site.nav.filter((i) => i.label.toLowerCase() !== "contact");

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Triptych — home"
      className="inline-flex shrink-0 items-start gap-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/triptych-logo.png"
        alt="Triptych"
        className="h-4 w-auto [filter:brightness(0)] sm:h-5"
      />
      <sup className="text-[0.5rem] leading-none text-foreground">®</sup>
    </Link>
  );
}

export default function Header() {
  const time = useClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <>
      <header className="relative z-20 flex items-center justify-between gap-6 px-5 pt-5 sm:px-8">
        <Logo />

        {/* Desktop: nav · clock · Contact */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <nav className="flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center font-mono text-xs text-foreground lg:flex">
            <span className="tabular-nums text-foreground/80" suppressHydrationWarning>
              {time || "--:--:-- --"}
            </span>
          </div>

          <Link
            href="/about#contact"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Contact
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="flex flex-col items-end justify-center gap-[6px] py-2 md:hidden"
        >
          <span className="block h-[1.5px] w-7 bg-foreground" />
          <span className="block h-[1.5px] w-7 bg-foreground" />
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
          data-lenis-prevent
        >
          <div className="flex items-center justify-between px-5 pt-5">
            <Logo onClick={close} />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="text-2xl leading-none text-foreground"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-3 px-5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className="text-4xl font-normal tracking-tight text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-between px-5 pb-10">
            <span
              className="font-mono text-xs tabular-nums text-foreground/70"
              suppressHydrationWarning
            >
              {time}
            </span>
            <Link
              href="/about#contact"
              onClick={close}
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
