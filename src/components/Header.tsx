"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Shared editorial top bar:
 *   [logo®] ................ nav · [Contact]   (desktop)
 *   [logo®] ................. [hamburger]      (mobile → overlay)
 *
 * The "Contact" nav link renders as the button; the footer keeps the full nav.
 */

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
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <>
      <header className="relative z-20 flex items-center justify-between gap-6 px-5 pt-5 sm:px-8">
        <Logo />

        {/* Desktop: nav · Contact */}
        <div className="hidden items-center gap-8 md:flex">
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

          <div className="flex justify-end px-5 pb-10">
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
