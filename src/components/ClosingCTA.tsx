import Link from "next/link";
import { site } from "@/lib/site";

// EDIT: the closing section's copy and the three ways onward.
const HEADING = "Let's make the next one.";
const LINE = "Tell us what you're making. We reply within a day with first thoughts and a way forward.";
const NEXT = [
  { title: "Services & partners", line: "Music video, commercial and brand film.", href: "/services" },
  { title: "Who we are", line: "The studio, the people and the process.", href: "/who-we-are" },
  { title: "Press kit", line: "Bios, logos, stills and credits.", href: "/press/kit" },
];

/**
 * After the timeline: a big centred invitation with the two buttons, and
 * three flat cards onward into the site.
 */
export default function ClosingCTA() {
  return (
    <section aria-label="Start a project" className="bg-background px-5 pb-24 pt-8 text-foreground sm:pb-32 lg:px-10">
      <div className="mx-auto max-w-[1760px]">
        <div className="flex flex-col items-center rounded-[28px] bg-surface px-6 py-20 text-center sm:py-28">
          <h2 className="max-w-[16ch] text-[clamp(2.5rem,6.5vw,5.5rem)] font-medium leading-[1.0] tracking-[-0.035em]">{HEADING}</h2>
          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted sm:text-[18px]">{LINE}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={site.contactUrl} className="inline-flex h-12 items-center gap-1.5 rounded-full bg-foreground px-7 text-[16px] font-medium text-background transition-colors hover:bg-foreground/85">
              Start a project <span aria-hidden>↗</span>
            </a>
            <Link href="/contact" className="inline-flex h-12 items-center rounded-full bg-foreground/[0.09] px-7 text-[16px] font-medium transition-colors hover:bg-foreground/[0.16]">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {NEXT.map((n) => (
            <Link key={n.href} href={n.href} className="group flex items-end justify-between gap-6 rounded-[22px] bg-surface p-6 transition-colors hover:bg-foreground/[0.09] sm:p-8">
              <span>
                <span className="block text-[20px] font-medium tracking-[-0.01em]">{n.title}</span>
                <span className="mt-1.5 block text-[15px] text-muted">{n.line}</span>
              </span>
              <span aria-hidden className="text-[22px] text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
