"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { decade } from "@/lib/about";

// EDIT: header copy.
const HEADLINE_TOP = "10 years";
const HEADLINE_BOTTOM = "strong";
// EDIT: how dark the rest of the page gets while the timeline is on screen.
const DIM = 0.88;
// EDIT: how lit a card is when it's furthest round the spiral (0–1). The
// card at the front is fully lit; the rest fade toward this as they turn
// away, so the spiral reads in depth but nothing is ever too dim to read.
const CARD_MIN_LIGHT = 0.4;
// EDIT: the header (and its menus) flips to dark mode between these two
// points — section top crossing HEADER_DARK_START on the way in, section
// bottom crossing HEADER_DARK_END on the way out.
const HEADER_DARK_START = "top 65%";
const HEADER_DARK_END = "bottom 50%";

// EDIT: spiral shape.
const STEP_DEG = 45; // turn between one year's card and the next
const SCROLL_PER_YEAR = 420; // px of scrolling to bring the next year round
const TILT_DEG = 7; // camera looks slightly down onto the spiral
// Each bead is its own 3D layer, so keep the count modest.
const DOTS_PER_YEAR = 4; // beads on the spiral thread between two cards
/**
 * Radius / rise / perspective scale with the card width (phones → tighter).
 * The radius keeps neighbouring cards from slicing through each other: the
 * gap between two cards (2·r·sin(STEP/2)) must stay wider than a card.
 */
const shape = (cardW: number) => ({
  radius: cardW * 1.45,
  rise: cardW * 0.4,
  perspective: Math.max(900, cardW * 3.6),
});

/**
 * "10 years strong" — as it approaches, a fixed black layer fades over the
 * page (the header stays above it, usable and switched to dark), the
 * headline rises in, then the timeline pins and becomes a 3D spiral: one
 * card per year wound round a helix, threaded on a dotted spiral. Scrolling
 * turns and lifts the helix so each year swings round to the front in turn,
 * the thread lighting up behind you. Cards light by how close to the front
 * they are. All CSS 3D — the browser moves one GPU layer per frame.
 *
 * Reduced motion: no pin, no 3D — the cards sit in a plain column.
 *
 * Layering: dim layer z-38 < this section z-39 < header z-40.
 */
export default function Decade() {
  const root = useRef<HTMLElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const helix = useRef<HTMLDivElement>(null);
  const bigYear = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  const last = decade.length - 1;
  const dots = Array.from({ length: last * DOTS_PER_YEAR + 1 }, (_, k) => k / DOTS_PER_YEAR);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const setHeaderDark = (on: boolean) => {
      if (on) header?.setAttribute("data-theme", "dark");
      else header?.removeAttribute("data-theme");
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = stage.current!;
        const hx = helix.current!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-dc-card]", st);
        const beads = gsap.utils.toArray<HTMLElement>("[data-dc-dot]", st);
        st.setAttribute("data-3d", "");

        let geo = shape(cards[0]?.offsetWidth || 400);
        // Wind every card and bead round the helix: rise, turn, push out to
        // the radius, then centre on its anchor (read right-to-left).
        const place = (el: HTMLElement, t: number) => {
          el.style.transform = `translateY(${t * geo.rise}px) rotateY(${t * STEP_DEG}deg) translateZ(${geo.radius}px) translate(-50%, -50%)`;
        };
        const layout = () => {
          geo = shape(cards[0]?.offsetWidth || 400);
          st.style.perspective = `${geo.perspective}px`;
          cards.forEach((c, i) => place(c, i));
          beads.forEach((b) => place(b, +b.dataset.t!));
        };
        layout();

        let shownYear = -1;
        let litBeads = -1;
        const render = (p: number) => {
          // Turn + lift the helix so year p faces the camera, front and centre.
          hx.style.transform = `rotateX(${-TILT_DEG}deg) translateZ(${-geo.radius}px) translateY(${-p * geo.rise}px) rotateY(${-p * STEP_DEG}deg)`;
          cards.forEach((c, i) => {
            c.style.opacity = String(Math.max(CARD_MIN_LIGHT, 1 - Math.abs(i - p) * 0.3));
          });
          // Light the thread up to where we are (only touch beads that change).
          const lit = Math.floor(p * DOTS_PER_YEAR + 1e-6);
          if (lit !== litBeads) {
            beads.forEach((b, k) => b.toggleAttribute("data-lit", k <= lit));
            litBeads = lit;
          }
          const year = Math.round(p);
          if (year !== shownYear) {
            shownYear = year;
            if (bigYear.current) bigYear.current.textContent = decade[year].year;
            if (counter.current)
              counter.current.textContent = `${String(year + 1).padStart(2, "0")} / ${String(decade.length).padStart(2, "0")}`;
          }
        };

        const state = { p: 0 };
        render(0);
        gsap.to(state, {
          p: last,
          ease: "none",
          onUpdate: () => render(state.p),
          scrollTrigger: {
            trigger: st,
            start: "top top",
            end: () => `+=${last * SCROLL_PER_YEAR}`,
            pin: true,
            scrub: 0.6,
            // Refresh before the dim / header triggers below so their
            // positions include the pin's extra scroll length.
            refreshPriority: 1,
            invalidateOnRefresh: true,
            onRefreshInit: layout,
          },
        });

        return () => {
          st.removeAttribute("data-3d");
          st.style.perspective = "";
          hx.style.transform = "";
          [...cards, ...beads].forEach((el) => {
            el.style.transform = "";
            el.style.opacity = "";
            el.removeAttribute("data-lit");
          });
        };
      });

      // Header goes dark for the timeline, back to the page's theme after.
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
        // Finishes while the section's bottom is still mid-screen, so the
        // footer is never left dimmed at the very end of the page.
        scrollTrigger: { trigger: root.current, start: "bottom 95%", end: "bottom 55%", scrub: true },
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

      ScrollTrigger.sort();
    }, root);

    return () => {
      ctx.revert();
      setHeaderDark(false);
    };
  }, [last]);

  return (
    <>
      {/* The dimmer — fixed, under this section and the header */}
      <div
        ref={dim}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[38] bg-black opacity-0 will-change-[opacity]"
      />

      <section
        ref={root}
        aria-label="Ten years strong, 2016 to 2026"
        className="relative z-[39] bg-[#0a0a0a] pb-24 text-white sm:pb-32"
      >
        {/* Headline */}
        <div data-dc-head className="mx-auto max-w-[1760px] px-5 pb-10 pt-28 text-center sm:px-8 sm:pt-40">
          {/* pb on each line leaves room for descenders (the g in "strong") */}
          <h2 className="text-[clamp(3.5rem,13vw,13rem)] font-medium leading-[0.88] tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-dc-word className="inline-block">
                {HEADLINE_TOP}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.16em] text-white/45">
              <span data-dc-word className="inline-block">
                {HEADLINE_BOTTOM}
              </span>
            </span>
          </h2>
        </div>

        {/* The spiral stage — pinned while the helix turns (see .dc-stage in
            globals.css for the 3D layout; without data-3d it's a column). */}
        <div ref={stage} className="dc-stage">
          {/* Current year, huge and faint, behind the spiral */}
          <span
            ref={bigYear}
            aria-hidden
            className="dc-3d-only pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(9rem,30vw,30rem)] font-medium leading-none tracking-[-0.06em] text-white/[0.045] tabular-nums"
          >
            {decade[0].year}
          </span>

          <div ref={helix} className="dc-helix">
            {/* The spiral thread */}
            {dots.map((t) => (
              <span key={t} data-dc-dot data-t={t} aria-hidden className="dc-dot" />
            ))}

            {decade.map((d, i) => {
              // Same golden-angle hues as the 500+ grid. (No drop shadow on
              // the cards: on 11 moving 3D layers it doubled each frame's cost.)
              const hue = Math.round((i * 137.508) % 360);
              return (
                <article
                  key={d.year}
                  data-dc-card
                  className="dc-card overflow-hidden rounded-[22px] border border-white/10 bg-[#141414] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <div
                    className="relative aspect-[16/8] w-full"
                    style={{
                      background: `radial-gradient(circle at 30% 25%, hsl(${hue} 92% 66%), hsl(${(hue + 38) % 360} 85% 48%) 55%, hsl(${(hue + 70) % 360} 80% 26%))`,
                    }}
                  >
                    <span className="absolute bottom-3 left-4 text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-white/60">
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
              );
            })}
          </div>

          {/* Progress — which year of how many */}
          <span
            ref={counter}
            aria-hidden
            className="dc-3d-only absolute bottom-8 left-5 text-[13px] sm:left-8 font-medium tabular-nums tracking-[0.2em] text-white/50"
          >
            01 / {String(decade.length).padStart(2, "0")}
          </span>
        </div>
      </section>
    </>
  );
}
