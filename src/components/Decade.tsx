"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { decade } from "@/lib/about";

// EDIT: header copy.
const EYEBROW = "2016 — 2026 · Chicago";
const HEADLINE_TOP = "10 years";
const HEADLINE_BOTTOM = "in business";
// EDIT: how dark the rest of the page gets while the timeline is on screen.
const DIM = 0.88;

/**
 * "10 years in business" — as it approaches, a fixed black layer fades over
 * the page (the header stays above it, usable), then the headline rises in
 * and a pinned timeline takes over: vertical scroll drives a horizontal
 * track of year cards, 2016 → 2026. The active card sits dead center; each
 * card sharpens and lifts into focus as it arrives, a giant year counter
 * ticks behind them, and a progress rail fills along the bottom.
 *
 * Layering: dim layer z-38 < this section z-39 < header z-40.
 */
export default function Decade() {
  const root = useRef<HTMLElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(-1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dim the page in as the section arrives, back out as it leaves.
      gsap.fromTo(
        dim.current,
        { opacity: 0 },
        {
          opacity: DIM,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 35%", scrub: true },
        }
      );

      // Headline: words rise in.
      gsap.from("[data-dc-word]", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-dc-head]", start: "top 75%" },
      });
      gsap.from("[data-dc-eyebrow]", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-dc-head]", start: "top 75%" },
      });

      // Pinned horizontal timeline.
      const t = track.current!;
      const distance = () => t.scrollWidth - window.innerWidth;
      const steps = decade.length - 1;

      const slide = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.round(self.progress * steps);
            if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
            if (i === lastIndex.current) return;
            lastIndex.current = i;
            if (year.current) year.current.textContent = decade[i].year;
            root.current
              ?.querySelectorAll<HTMLElement>("[data-dc-tick]")
              .forEach((el, k) => el.toggleAttribute("data-on", k <= i));
          },
        },
      });

      // Dim back out as the section leaves. Created AFTER the pin so its
      // positions include the pinned scroll distance (ScrollTrigger measures
      // in creation order; made earlier, it fires ~a track-length too soon).
      gsap.to(dim.current, {
        opacity: 0,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "bottom 80%", end: "bottom 20%", scrub: true },
      });

      // Each card sharpens into focus as it reaches the center…
      gsap.utils.toArray<HTMLElement>("[data-dc-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.18, scale: 0.9, y: 40, filter: "blur(6px)" },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: slide,
              start: "left 85%",
              end: "center 50%",
              scrub: true,
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* The dimmer — fixed, under this section and the header */}
      <div
        ref={dim}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[38] bg-black opacity-0"
      />

      <section
        ref={root}
        aria-label="Ten years in business, 2016 to 2026"
        className="relative z-[39] bg-[#0a0a0a] text-white"
      >
        {/* Header */}
        <div data-dc-head className="mx-auto max-w-[1760px] px-5 pb-10 pt-28 text-center sm:px-8 sm:pt-40">
          <p
            data-dc-eyebrow
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 sm:text-[12px]"
          >
            {EYEBROW}
          </p>
          <h2 className="mt-6 text-[clamp(3.5rem,13vw,13rem)] font-medium leading-[0.88] tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-dc-word className="inline-block">
                {HEADLINE_TOP}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] text-white/45">
              <span data-dc-word className="inline-block">
                {HEADLINE_BOTTOM}
              </span>
            </span>
          </h2>
        </div>

        {/* Pinned timeline */}
        <div ref={pin} className="relative h-screen overflow-hidden">
          {/* Giant year counter, behind the cards */}
          <span
            ref={year}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(8rem,34vw,30rem)] font-medium leading-none tracking-[-0.06em] text-white/[0.05] tabular-nums"
          >
            {decade[0].year}
          </span>

          {/* Track — padded so the first and last cards can sit dead center */}
          <div
            ref={track}
            className="absolute inset-y-0 left-0 flex w-max items-center gap-6 sm:gap-10"
            style={{ paddingInline: "calc(50vw - min(39vw, 210px))" }}
          >
            {decade.map((d, i) => {
              // Same golden-angle hues as the 500+ grid.
              const hue = Math.round((i * 137.508) % 360);
              return (
                <article
                  key={d.year}
                  data-dc-card
                  className="w-[min(78vw,420px)] shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <div
                    className="relative aspect-[16/10] w-full"
                    style={{
                      background: `radial-gradient(circle at 30% 25%, hsl(${hue} 92% 66%), hsl(${(hue + 38) % 360} 85% 48%) 55%, hsl(${(hue + 70) % 360} 80% 26%))`,
                    }}
                  >
                    <span className="absolute bottom-3 left-4 text-[clamp(2.5rem,6vw,3.75rem)] font-medium leading-none tracking-[-0.04em] text-white mix-blend-overlay">
                      {d.year}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--accent)]">
                      {d.year}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-tight tracking-tight">
                      {d.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/60">{d.body}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Progress rail + year ticks */}
          <div className="absolute inset-x-5 bottom-8 mx-auto max-w-[1100px] sm:inset-x-8 sm:bottom-10">
            <div className="relative h-px w-full bg-white/15">
              <div
                ref={fill}
                className="absolute inset-0 origin-left bg-[color:var(--accent)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <div className="mt-3 flex justify-between">
              {decade.map((d, i) => (
                <span
                  key={d.year}
                  data-dc-tick
                  data-on={i === 0 ? "" : undefined}
                  className="text-[10px] font-medium tabular-nums text-white/30 transition-colors duration-300 data-[on]:text-white sm:text-[12px]"
                >
                  {/* Phones: show every other year so labels never collide */}
                  <span className={i % 2 ? "hidden sm:inline" : ""}>{d.year}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
