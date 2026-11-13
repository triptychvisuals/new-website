import Link from "next/link";
import { site } from "@/lib/site";
import { socials } from "@/lib/about";

// EDIT: the footer's columns — heading, then links. External links open in
// a new tab; a social with no address yet ("#") is left out.
const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Work",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Store", href: "/store" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "Who we are", href: "/who-we-are" },
      { label: "Services & partners", href: "/services" },
      { label: "Philosophy", href: "/philosophy" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    heading: "Press",
    links: [
      { label: "In the news", href: "/press" },
      { label: "Press kit", href: "/press/kit" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Start a project", href: site.contactUrl },
      { label: "Contact", href: "/contact" },
      { label: site.email, href: `mailto:${site.email}` },
    ],
  },
];

// EDIT: the legal links along the bottom.
const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

function FooterLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  return isExternal(href) ? (
    <a href={href} className={className} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * Global footer, flat: the mark and a line about the studio on the left,
 * short link columns to the right (small muted headings, plain links), and
 * a bottom row with the copyright, the address, the legal links and the
 * socials.
 */
export default function Footer() {
  const link = "text-[15px] text-foreground/80 transition-colors hover:text-foreground [overflow-wrap:anywhere]";
  const liveSocials = socials.filter((s) => s.href && s.href !== "#");
  return (
    <footer className="border-t border-hairline bg-background px-5 pt-16 text-foreground sm:pt-20 lg:px-10">
      <div className="mx-auto grid max-w-[1760px] grid-cols-2 gap-x-6 gap-y-10 sm:gap-12 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
        {/* The studio — full width on phones, above the columns */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" aria-label="Triptych Studios — home" className="inline-flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/triptych-logo.png" alt="" className="h-5 w-auto [filter:brightness(0)] dark:[filter:none]" />
            <span className="text-[17px] font-medium tracking-tight">Triptych Studios</span>
          </Link>
          {/* EDIT: the line under the mark */}
          <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-muted">
            A creative studio in Chicago making music videos, commercials and brand films. Imagination in Motion.
          </p>
        </div>

        {/* The columns */}
        {COLUMNS.map((c) => (
          <div key={c.heading}>
            <p className="text-[14px] text-muted">{c.heading}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} className={link}>
                    {l.label}
                    {l.href.startsWith("http") && <span aria-hidden> ↗</span>}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="mx-auto mt-16 flex max-w-[1760px] flex-col gap-4 border-t border-hairline py-8 text-[14px] text-muted lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>© 2016–{new Date().getFullYear()} Triptych Studios</span>
          <span>
            {site.street}, {site.city}, {site.region} {site.postalCode}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {LEGAL.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
          {liveSocials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              {s.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
