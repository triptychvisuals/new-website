import ScrollFill from "@/components/ScrollFill";
import { recentClients, services } from "@/lib/about";

const label = "text-sm text-muted";
const listItem =
  "text-lg font-medium leading-tight tracking-tight text-foreground sm:text-xl";

/**
 * Intro: "Recent Clients" and "Services" side by side as two lists that fill
 * grey→white on scroll. The Result bento follows directly beneath.
 */
export default function AboutIntro() {
  return (
    <section id="about-intro" className="px-5 pt-10 sm:px-8 sm:pt-16">
      {/* One column on mobile; the two lists sit directly next to each other from md up */}
      <div className="flex flex-col gap-y-12 md:flex-row md:gap-x-16">
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
    </section>
  );
}
