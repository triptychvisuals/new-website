import Link from "next/link";
import { site } from "@/lib/site";
import { socials } from "@/lib/about";

/* EDIT: footer legal links */
const legal = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Disclaimer", href: "#" },
  { label: "404", href: "/404" },
];

// Header-matching nav link style.
const navLinkCls =
  "inline-flex items-center gap-1 text-[13px] font-medium uppercase tracking-tight text-foreground transition-opacity hover:opacity-60 whitespace-nowrap";
const colHead = "font-mono text-[11px] uppercase tracking-[0.15em] text-muted";
const colLink =
  "text-lg text-foreground/70 transition-colors hover:text-foreground";

function FooterNavLink({ item }: { item: { label: string; href: string } }) {
  return (
    <Link href={item.href} className={navLinkCls}>
      {item.label}
      {item.label.toLowerCase() === "store" && <span aria-hidden>↗</span>}
    </Link>
  );
}

/**
 * Global footer — mirrors the header (centered-logo nav cluster from the same
 * site.nav), then Legal + Social link columns and a studio / copyright strip.
 * Rendered on every page via layout.
 */
export default function Footer() {
  const mid = Math.ceil(site.nav.length / 2);
  const left = site.nav.slice(0, mid);
  const right = site.nav.slice(mid);

  return (
    <footer className="border-t border-hairline px-5 sm:px-8">
      {/* Nav row — matches the header: [nav] ◬logo [nav] */}
      <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-b border-hairline py-10">
        <span className="flex items-center gap-6">
          {left.map((item) => (
            <FooterNavLink key={item.label} item={item} />
          ))}
        </span>
        <Link
          href="/"
          aria-label="Triptych — home"
          className="mx-2 inline-flex items-start gap-0.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/triptych-logo.png"
            alt="Triptych"
            className="h-6 w-auto [filter:brightness(0)] dark:[filter:none]"
          />
          <sup className="text-[0.5rem] leading-none text-foreground">®</sup>
        </Link>
        <span className="flex items-center gap-6">
          {right.map((item) => (
            <FooterNavLink key={item.label} item={item} />
          ))}
        </span>
      </nav>

      {/* Link columns — Legal + Social */}
      <div className="grid max-w-md grid-cols-2 gap-12 py-12">
        <div>
          <p className={colHead}>Legal</p>
          <ul className="mt-5 space-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={colLink}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={colHead}>Social</p>
          <ul className="mt-5 space-y-2">
            {socials.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={colLink}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Studio + copyright strip */}
      <div className="grid grid-cols-1 gap-10 border-t border-hairline py-8 md:grid-cols-2">
        <div>
          <p className="text-xl leading-snug text-foreground">
            <span className="text-accent">{site.name}</span> is a creative studio
            based in Chicago. {/* EDIT: city */}
          </p>
          <div className="mt-4 h-px w-8 bg-accent" />
          <p className="mt-4 text-sm text-muted">
            {/* EDIT */}
            Strategy, film, and post are handled in-house.
          </p>
        </div>
        <div className="flex items-end md:justify-end">
          <p className="text-xs text-muted">
            © 2016–2026 {site.name}. All work, all rights. {/* EDIT */}
          </p>
        </div>
      </div>
    </footer>
  );
}
