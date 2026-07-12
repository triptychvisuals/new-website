import Link from "next/link";
import { site } from "@/lib/site";
import { socials, phone } from "@/lib/about";

/* EDIT: footer link groups */
const navigation = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Journal", href: "#" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/about#contact" },
];
const legal = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Disclaimer", href: "#" },
  { label: "404", href: "/404" },
];

const colHead = "font-mono text-[11px] uppercase tracking-[0.15em] text-muted";
const colLink =
  "text-lg text-foreground/70 transition-colors hover:text-foreground";

/**
 * Global footer (Spector-style): oversized wordmark + tagline, newsletter,
 * link columns, and a studio/contact strip. Rendered on every page via layout.
 */
export default function Footer() {
  return (
    <footer className="px-5 pt-16 sm:px-8">
      {/* Oversized wordmark + tagline */}
      <div>
        <h2 className="text-[clamp(3rem,17vw,15rem)] font-bold uppercase leading-[0.8] tracking-[-0.03em] text-foreground">
          {site.name}
        </h2>
        <div className="mt-2 flex justify-end border-t border-foreground/80 pt-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">
            {/* EDIT: tagline */}
            We leave{" "}
            <span className="text-accent">the story better</span> than the brief
          </p>
        </div>
      </div>

      {/* Newsletter + link columns */}
      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* Newsletter */}
        <div>
          <div className="flex items-start gap-4">
            <h3 className="text-3xl font-normal tracking-tight text-foreground">
              Newsletter
            </h3>
            <p className="max-w-[18ch] border-l border-hairline pl-4 text-sm text-muted">
              Stay informed about our latest news and updates.
            </p>
          </div>
          {/* EDIT: wire inputs to your email provider */}
          <div className="mt-8 max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border-b border-hairline bg-transparent pb-2 text-sm outline-none placeholder:text-muted focus:border-foreground"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border-b border-hairline bg-transparent pb-2 text-sm outline-none placeholder:text-muted focus:border-foreground"
            />
            <div className="flex items-start gap-4 pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-lg text-foreground"
              >
                Subscribe <span className="text-accent">→</span>
              </button>
              <p className="max-w-[22ch] font-mono text-[10px] uppercase leading-relaxed text-muted">
                One email when it&apos;s worth your time. That&apos;s the deal.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className={colHead}>Navigation</p>
          <ul className="mt-5 space-y-2">
            {navigation.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={colLink}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
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

        {/* Social */}
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

      {/* Studio + contact strip */}
      <div className="mt-16 grid grid-cols-1 gap-10 border-t border-hairline py-10 md:grid-cols-3">
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

        <div>
          <a
            href={`mailto:${site.email}`}
            className="text-2xl text-foreground transition-colors hover:text-foreground/60"
          >
            {site.email.split("@")[0]}
            <span className="text-muted">@{site.email.split("@")[1]}</span>
          </a>
          <p className="mt-1 text-2xl text-foreground">{phone}</p>
          <p className="mt-6 text-xs text-muted">
            © 2016–2026 {site.name}. All work, all rights. {/* EDIT */}
          </p>
        </div>

        <div className="flex items-start md:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/triptych-logo.png"
            alt="Triptych"
            className="h-9 w-auto [filter:brightness(0)]"
          />
        </div>
      </div>
    </footer>
  );
}
