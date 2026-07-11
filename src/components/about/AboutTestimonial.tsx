"use client";

import { useState } from "react";
import BracketBox from "@/components/BracketBox";
import { testimonials, aboutGradient } from "@/lib/about";

/** Rotating testimonial with portrait + bracket arrows. */
export default function AboutTestimonial() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (d: number) =>
    setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <section className="px-5 pt-32 sm:px-8 sm:pt-44">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        {/* Portrait + arrows */}
        <div className="flex flex-col justify-between gap-10">
          <div
            className="aspect-[3/4] w-36 overflow-hidden"
            style={{ background: aboutGradient(3) }}
            aria-hidden
          />
          <div className="flex gap-3">
            <button onClick={() => go(-1)} aria-label="Previous testimonial">
              <BracketBox className="flex h-10 w-12 items-center justify-center text-lg">
                <span aria-hidden>←</span>
              </BracketBox>
            </button>
            <button onClick={() => go(1)} aria-label="Next testimonial">
              <BracketBox className="flex h-10 w-12 items-center justify-center text-lg">
                <span aria-hidden>→</span>
              </BracketBox>
            </button>
          </div>
        </div>

        {/* Quote */}
        <div>
          <blockquote className="max-w-4xl text-[clamp(1.5rem,3.4vw,2.75rem)] font-medium leading-[1.15] tracking-tight text-foreground">
            {t.quote}
          </blockquote>
          <div className="mt-8">
            <p className="text-foreground">{t.author}</p>
            <p className="mt-1 text-sm text-muted">{t.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
