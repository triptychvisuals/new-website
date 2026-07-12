"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Shared editorial top bar, matching the reference placement:
 *   [logo®] ................ nav · live clock · email · [Contact]
 * Logo sits far-left; everything else clusters to the right.
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

export default function Header() {
  const time = useClock();

  return (
    <header className="relative z-20 flex items-center justify-between gap-6 px-5 pt-5 sm:px-8">
      {/* Logo top-left — real Triptych mark (white PNG rendered black) + ® */}
      <Link
        href="/"
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

      {/* Right cluster: nav · clock · email · Contact */}
      <div className="flex items-center gap-6 lg:gap-8">
        <nav className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
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

        {/* Solid dark Contact button */}
        <Link
          href="/about#contact"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
