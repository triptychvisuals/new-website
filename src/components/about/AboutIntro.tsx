import Reveal from "@/components/Reveal";
import {
  recentClients,
  services,
  socials,
  phone,
  intro,
} from "@/lib/about";

const grayLabel = "font-sans text-sm text-muted";

/** Three-column intro: Recent Clients · Services + Contact · Statement + copy. */
export default function AboutIntro() {
  return (
    <section
      id="contact"
      className="px-5 pt-10 sm:px-8 sm:pt-16"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-[0.8fr_1.1fr_1.4fr]">
        {/* Recent Clients */}
        <Reveal>
          <p className={grayLabel}>Recent Clients</p>
          <ul className="mt-6 space-y-1.5">
            {recentClients.map((c) => (
              <li key={c} className="text-sm text-foreground/60">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Services + Contact */}
        <Reveal delay={0.05}>
          <p className={grayLabel}>Services</p>
          <ul className="mt-6 space-y-1">
            {services.map((s) => (
              <li
                key={s}
                className="text-2xl font-medium leading-tight tracking-tight text-foreground"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-14">
            <p className={grayLabel}>Contact</p>
            <ul className="mt-6 space-y-1.5 text-sm text-foreground/60">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">{phone}</li>
            </ul>
          </div>
        </Reveal>

        {/* Statement + body copy */}
        <Reveal delay={0.1}>
          <h2 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-snug tracking-tight text-foreground">
            {intro.statement}
          </h2>
          <div className="mt-8 space-y-6">
            {intro.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-mono text-[13px] uppercase leading-relaxed tracking-wide text-foreground/70"
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
