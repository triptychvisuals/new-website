"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { decade } from "@/lib/about";

// EDIT: header copy.
const EYEBROW = "2016 — 2026 · Chicago";
const HEADLINE_TOP = "10 years";
const HEADLINE_BOTTOM = "in business";
// EDIT: how dark the rest of the page gets while the timeline is on screen.
const DIM = 0.88;
// EDIT: where on screen the "now" line sits (the spine fills to here and
// each year's node lights as it crosses it). "60%" = 60% down the viewport.
const NOW_LINE = "60%";
// EDIT: the header (and its menus) flips to dark mode between these two
// points — section top crossing HEADER_DARK_START on the way in, section
// bottom crossing HEADER_DARK_END on the way out. Matched to the dimmer's
// halfway marks so the header turns with the page.
const HEADER_DARK_START = "top 65%";
const HEADER_DARK_END = "bottom 50%";

/**
 * "10 years in business" — as it approaches, a fixed black layer fades over
 * the page (the header stays above it, usable), the headline rises in, then
 * a vertical timeline runs straight down the page — no pinning, no sideways
 * motion. A glowing spine draws itself as you scroll with a comet riding its
 * tip; each year's node ignites as the tip reaches it, its card slides in
 * from its side out of a blur, and the big year on the opposite side lights
 * up. Desktop alternates cards left/right of a centered spine; phones run
 * one column with the spine on the left.
 *
 * While it's on screen the header flips to dark mode too.
 *
 * Layering: dim layer z-38 < this section z-39 < header z-40.
 */
export default function Decade() {
  const root = useRef<HTMLElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const comet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const setHeaderDark = (on: boolean) => {
      if (on) header?.setAttribute("data-theme", "dark");
      else header?.removeAttribute("data-theme");
    };

    const ctx = gsap.context(() => {
      // Header goes dark for the timeline, back to the page's theme after.
      // (If the whole site is already dark this is a no-op visually.)
      ScrollTrigger.create({
        trigger: root.current,
        start: HEADER_DARK_START,
        end: HEADER_DARK_END,
        onToggle: (self) => setHeaderDark(self.isActive),
      });

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
      gsap.to(dim.current, {
        opacity: 0,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "bottom 80%", end: "bottom 20%", scrub: true },
      });

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

      // The spine draws itself down to the "now" line, comet riding the tip.
      const spine = {
        trigger: line.current,
        start: `top ${NOW_LINE}`,
        end: `bottom ${NOW_LINE}`,
        scrub: 0.6,
      };
      gsap.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: spine });
      gsap.fromTo(comet.current, { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: spine });

      gsap.utils.toArray<HTMLElement>("[data-dc-row]").forEach((row) => {
        // Node + big year ignite as the tip crosses this row's node.
        const node = row.querySelector<HTMLElement>("[data-dc-node]");
        gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: `center ${NOW_LINE}`,
            onEnter: () => row.toggleAttribute("data-on", true),
            onLeaveBack: () => row.toggleAttribute("data-on", false),
          },
        });

        // Card slides in from its side, out of a blur.
        const card = row.querySelector<HTMLElement>("[data-dc-card]");
        const fromLeft = row.dataset.side === "left";
        gsap.fromTo(
          card,
          { opacity: 0, x: fromLeft ? -60 : 60, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%", end: "top 55%", scrub: 0.6 },
          }
        );
      });
    }, root);
    return () => {
      ctx.revert();
      setHeaderDark(false);
    };
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
        className="relative z-[39] bg-[#0a0a0a] pb-32 text-white sm:pb-44"
      >
        {/* Header */}
        <div data-dc-head className="mx-auto max-w-[1760px] px-5 pb-16 pt-28 text-center sm:px-8 sm:pb-24 sm:pt-40">
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

        {/* Timeline */}
        <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8">
          {/* Spine: faint track, accent fill that draws down, comet at the tip.
              Left gutter on phones, centered from md. */}
          <div
            ref={line}
            aria-hidden
            className="absolute bottom-0 left-[31.5px] top-0 w-px bg-white/12 sm:left-[43.5px] md:left-1/2"
          >
            <div
              ref={fill}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[color:var(--accent)] via-[color:var(--accent)] to-white"
              style={{ transform: "scaleY(0)" }}
            />
            <div
              ref={comet}
              className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(229,54,31,0.35),0_0_24px_6px_rgba(229,54,31,0.55)]"
            />
          </div>

          <ol className="relative">
            {decade.map((d, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              // Same golden-angle hues as the 500+ grid.
              const hue = Math.round((i * 137.508) % 360);
              return (
                <li
                  key={d.year}
                  data-dc-row
                  data-side={side}
                  className="group/row relative grid grid-cols-[24px_1fr] items-center gap-x-5 py-8 sm:gap-x-8 md:grid-cols-[1fr_24px_1fr] md:gap-x-14 md:py-14"
                >
                  {/* Node on the spine */}
                  <span
                    data-dc-node
                    aria-hidden
                    className="relative z-10 col-start-1 row-start-1 mx-auto h-[14px] w-[14px] rounded-full border border-white/30 bg-[#0a0a0a] transition-all duration-500 group-data-[on]/row:scale-125 group-data-[on]/row:border-[color:var(--accent)] group-data-[on]/row:bg-[color:var(--accent)] group-data-[on]/row:shadow-[0_0_0_6px_rgba(229,54,31,0.18),0_0_22px_rgba(229,54,31,0.6)] md:col-start-2"
                  />

                  {/* Big year — the side opposite the card (desktop only) */}
                  <span
                    aria-hidden
                    className={`hidden row-start-1 select-none text-[clamp(4rem,9vw,8.5rem)] font-medium leading-none tracking-[-0.05em] text-white/[0.07] tabular-nums transition-colors duration-700 group-data-[on]/row:text-white md:block ${
                      side === "left" ? "md:col-start-3 md:text-left" : "md:col-start-1 md:text-right"
                    }`}
                  >
                    {d.year}
                  </span>

                  {/* Card */}
                  <article
                    data-dc-card
                    className={`col-start-2 row-start-1 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                      side === "left" ? "md:col-start-1" : "md:col-start-3"
                    }`}
                  >
                    <div
                      className="relative aspect-[16/8] w-full"
                      style={{
                        background: `radial-gradient(circle at 30% 25%, hsl(${hue} 92% 66%), hsl(${(hue + 38) % 360} 85% 48%) 55%, hsl(${(hue + 70) % 360} 80% 26%))`,
                      }}
                    >
                      <span className="absolute bottom-3 left-4 text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-white mix-blend-overlay">
                        {d.year}
                      </span>
                    </div>
                    <div className="p-6 sm:p-7">
                      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--accent)]">
                        {d.year}
                      </p>
                      <h3 className="mt-3 text-[clamp(1.2rem,2vw,1.55rem)] font-medium leading-tight tracking-tight">
                        {d.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/60">{d.body}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
