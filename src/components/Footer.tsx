import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Global footer bar (reference: thin top rule).
 *   © COPYRIGHT 2026 | TRIPTYCH STUDIO ....... [logo®] ....... About Award Contact
 */
export default function Footer() {
  return (
    <footer className="border-t border-hairline px-5 py-6 sm:px-8">
      <div className="grid grid-cols-1 items-center gap-4 text-xs sm:grid-cols-3">
        {/* Left: copyright */}
        <p className="font-mono uppercase tracking-wide text-foreground/70 sm:justify-self-start">
          © Copyright 2026&nbsp;&nbsp;|&nbsp;&nbsp;{site.name} {site.suffix}
        </p>

        {/* Center: brand mark */}
        <Link
          href="/"
          aria-label="Triptych — home"
          className="order-first inline-flex items-start gap-0.5 sm:order-none sm:justify-self-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/triptych-logo.png"
            alt="Triptych"
            className="h-4 w-auto [filter:brightness(0)]"
          />
          <sup className="text-[0.5rem] leading-none text-foreground">®</sup>
        </Link>

        {/* Right: nav */}
        <nav className="flex items-center gap-5 text-foreground/60 sm:justify-self-end">
          {site.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
