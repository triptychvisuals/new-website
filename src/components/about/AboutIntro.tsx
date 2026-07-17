import ScrollFill from "@/components/ScrollFill";
import { recentClients, services, intro } from "@/lib/about";

const label = "text-sm text-muted";
const listItem =
  "text-lg font-medium leading-tight tracking-tight text-foreground sm:text-xl";

/**
 * Intro: "Recent Clients" and "Services" side by side as two lists that fill
 * grey→white on scroll, then a scroll-in statement block (where Contact used
 * to be), with the rounded image cards brought up directly beneath it.
 */
export default function AboutIntro() {
  return (
    <section id="about-intro" className="px-5 pt-10 sm:px-8 sm:pt-16">
      {/* Two dropdown-style lists, each filling grey→white as it scrolls in */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-12">
        <ScrollFill>
          <p className={label} data-fill>
            Recent Clients
          </p>
          <ul className="mt-6 space-y-2">
            {recentClients.map((c) => (
              <li key={c} data-fill className={listItem}>
                {c}
              </li>
            ))}
          </ul>
        </ScrollFill>

        <ScrollFill>
          <p className={label} data-fill>
            Services
          </p>
          <ul className="mt-6 space-y-2">
            {services.map((s) => (
              <li key={s} data-fill className={listItem}>
                {s}
              </li>
            ))}
          </ul>
        </ScrollFill>
      </div>

      {/* New scroll-in statement — replaces where Contact was */}
      <ScrollFill className="mt-24 max-w-4xl sm:mt-32" stagger={1}>
        <h2
          data-fill
          className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-snug tracking-tight text-foreground"
        >
          {intro.statement}
        </h2>
        <div className="mt-8 space-y-6">
          {intro.paragraphs.map((p, i) => (
            <p key={i} data-fill className="text-[15px] leading-relaxed text-foreground/80">
              {p}
            </p>
          ))}
        </div>
      </ScrollFill>
    </section>
  );
}
