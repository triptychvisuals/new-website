import ScrollFill from "@/components/ScrollFill";
import { intro } from "@/lib/about";

/** Mission statement + body copy that fills grey→white on scroll. */
export default function AboutStatement() {
  return (
    <section className="px-5 pt-24 sm:px-8 sm:pt-32">
      <ScrollFill className="max-w-4xl" stagger={1}>
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
