"use client";

import { useState } from "react";
import { testimonials, aboutGradient } from "@/lib/about";

/**
 * Company wordmark shown at the card's bottom-right, derived from the role's
 * "Title, Company" shape. EDIT: swap the styled text for a real logo <img>
 * when the files land (drop them in /public/about).
 */
function companyOf(role: string) {
  const ix = role.indexOf(",");
  return ix === -1 ? "" : role.slice(ix + 1).trim();
}

/** Blue verified seal beside the author's name. */
function Verified() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="#3b82f6"
        d="M12 2l2.4 1.8 2.9-.4 1.1 2.7 2.7 1.1-.4 2.9L22 12l-1.3 1.9.4 2.9-2.7 1.1-1.1 2.7-2.9-.4L12 22l-2.4-1.8-2.9.4-1.1-2.7-2.7-1.1.4-2.9L2 12l1.3-1.9-.4-2.9 2.7-1.1 1.1-2.7 2.9.4z"
      />
      <path fill="#fff" d="M10.6 15.6l-3-3 1.4-1.4 1.6 1.6 4.4-4.4 1.4 1.4z" />
    </svg>
  );
}

/** Dark testimonial card — quote, divider, avatar + name + role, brand mark. */
export default function AboutTestimonial() {
  const [i, setI] = useState(0);
  const t = testimonials[i];

  return (
    <section className="px-5 pt-32 sm:px-8 sm:pt-44">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-[#0e0e10] p-7 text-white sm:p-9">
          <blockquote className="text-[clamp(1.25rem,2.2vw,1.6rem)] font-medium leading-[1.35] tracking-tight">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
            {/* EDIT: swap the gradient square for a real headshot img */}
            <span
              className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"
              style={{ background: aboutGradient(i + 2) }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[17px] font-semibold leading-tight">
                {t.author}
                <Verified />
              </p>
              <p className="mt-0.5 truncate text-sm text-white/50">{t.role}</p>
            </div>
            {companyOf(t.role) && (
              <span className="shrink-0 font-serif text-xl font-bold lowercase italic tracking-tight text-white/90">
                {companyOf(t.role)}
              </span>
            )}
          </div>
        </div>

        {/* Dots — rotate through testimonials */}
        {testimonials.length > 1 && (
          <div className="mt-5 flex justify-center gap-2">
            {testimonials.map((_, d) => (
              <button
                key={d}
                onClick={() => setI(d)}
                aria-label={`Show testimonial ${d + 1}`}
                aria-current={d === i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  d === i ? "bg-foreground" : "bg-foreground/25 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
