"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Shared editorial top bar:
 *   wordmark · nav · live clock + email  [· featured thumbnail on home]
 *
 * Sits in the normal page flow at the top and scrolls away with the content.
 * `featured` renders the home-only still in the far-right slot.
 */
function useClock() {
  // Empty until mounted so server + client markup match (no hydration mismatch).
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

export default function Header({ featured = false }: { featured?: boolean }) {
  const time = useClock();

  return (
    <header className="relative z-20 flex items-start justify-between gap-6 px-5 pt-5 sm:px-8">
      {/* Wordmark */}
      <Link
        href="/"
        className="shrink-0 text-sm font-medium tracking-tight text-foreground"
      >
        {site.name}
        {site.registered && <sup className="text-[0.6em]">®</sup>}
      </Link>

      {/* Center nav */}
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

      {/* Live clock + email */}
      <div className="hidden items-center gap-6 font-mono text-xs text-foreground lg:flex">
        <span className="tabular-nums text-foreground/80" suppressHydrationWarning>
          {time || "--:--:-- --"}
        </span>
        <a
          href={`mailto:${site.email}`}
          className="transition-colors hover:text-foreground/60"
        >
          {site.email}
        </a>
      </div>

      {/* Featured thumbnail — home only. EDIT: swap the gradient for a real still */}
      {featured && (
        <div
          className="hidden aspect-[3/4] w-20 shrink-0 overflow-hidden sm:block sm:w-24"
          style={{ background: "linear-gradient(150deg, #2a2620 0%, #6b5a44 100%)" }}
          aria-hidden
        />
      )}
    </header>
  );
}
