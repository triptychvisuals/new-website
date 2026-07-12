"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Centered-logo header: nav · nav  ◬logo◬  nav · nav
 * Nav links cluster close to the centered logo. Hamburger overlay on mobile.
 */
const linkCls =
  "text-sm text-foreground transition-opacity hover:opacity-60 whitespace-nowrap";

function Logo({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Triptych — home"
      className={`inline-flex items-start gap-0.5 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/triptych-logo.png"
        alt="Triptych"
        className="h-6 w-auto [filter:brightness(0)]"
      />
      <sup className="text-[0.5rem] leading-none text-foreground">®</sup>
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  const mid = Math.ceil(site.nav.length / 2);
  const left = site.nav.slice(0, mid);
  const right = site.nav.slice(mid);

  return (
    <>
      <header className="relative z-20 flex items-center justify-center px-5 pt-5 sm:px-8">
        {/* Desktop: nav clustered around the centered logo */}
        <nav className="hidden items-center md:flex">
          <span className="flex items-center gap-6">
            {left.map((item) => (
              <Link key={item.label} href={item.href} className={linkCls}>
                {item.label}
              </Link>
            ))}
          </span>
          <Logo className="mx-8" />
          <span className="flex items-center gap-6">
            {right.map((item) => (
              <Link key={item.label} href={item.href} className={linkCls}>
                {item.label}
              </Link>
            ))}
          </span>
        </nav>

        {/* Mobile: logo + hamburger */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Logo />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex flex-col items-end justify-center gap-[6px] py-2"
          >
            <span className="block h-[1.5px] w-7 bg-foreground" />
            <span className="block h-[1.5px] w-7 bg-foreground" />
          </button>
        </div>
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

          <nav className="flex flex-1 flex-col justify-center gap-4 px-5">
            {site.nav.map((item) => (
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
        </div>
      )}
    </>
  );
}
