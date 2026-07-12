"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Shared top bar: logo left, uppercase text menu right
 *   PROJECTS · JOURNAL · ABOUT · CONTACT ↗
 * Collapses to a hamburger overlay on mobile.
 */
function isContact(label: string) {
  return label.toLowerCase() === "contact";
}

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
      <header
        className="relative z-20 flex items-center justify-between gap-6 px-5 pt-5 sm:px-8"
        style={{ fontFamily: "var(--font-inter), Helvetica, Arial, sans-serif" }}
      >
        <Logo />

        {/* Desktop menu */}
        <nav className="hidden items-center gap-7 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
              {isContact(item.label) && <span aria-hidden>↗</span>}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
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
          style={{ fontFamily: "var(--font-inter), Helvetica, Arial, sans-serif" }}
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
                className="inline-flex items-center gap-2 text-4xl font-normal uppercase tracking-tight text-foreground"
              >
                {item.label}
                {isContact(item.label) && (
                  <span aria-hidden className="text-2xl">
                    ↗
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
