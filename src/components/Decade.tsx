"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { decade } from "@/lib/about";

// EDIT: header copy.
const HEADLINE_TOP = "10 years";
const HEADLINE_BOTTOM = "strong";
// EDIT: how dark the rest of the page gets while the timeline is on screen.
const DIM = 0.88;
// EDIT: how lit a card is when it's furthest from "now" (0–1). The current
// card is fully lit; the rest fade toward this, never too dim to read.
const CARD_MIN_LIGHT = 0.4;
// EDIT: the header (and its menus) flips to dark mode between these two
// points — section top crossing HEADER_DARK_START on the way in, section
// bottom crossing HEADER_DARK_END on the way out.
const HEADER_DARK_START = "top 65%";
const HEADER_DARK_END = "bottom 50%";

// EDIT: spiral shape (iPad / desktop).
const STEP_DEG = 45; // turn between one year's card and the next
const SCROLL_PER_YEAR = 420; // px of scrolling to bring the next year round
const TILT_DEG = 7; // camera looks slightly down onto the spiral
const GAP = 0.32; // empty space between one card and the next, × card height
const NODE_ABOVE = 22; // px the line + year dots run above each card's top
// EDIT: how strongly the current card's colours wash over the whole stage
// behind the spiral (0–1). Fades to the next year's as each comes round
// (fade time: .dc-wash in globals.css).
const WASH = 0.55;
// Each line segment is its own 3D layer, so keep the count modest.
const SEGS_PER_YEAR = 6;

// EDIT: phone timeline — where on screen the "now" line sits (the spine
// fills to here and each year's node lights as it crosses it).
const NOW_LINE = "60%";

/**
 * "10 years strong" — as it approaches, a fixed black layer fades over the
 * page (the header stays above it, switched to dark), the headline rises in,
 * then the timeline:
 *
 *  • iPad / desktop — a 3D spiral. One card per year, spaced well apart,
 *    wound round a helix with a line running round it through a dot above
 *    every card. The stage pins and scrolling turns + lifts the helix so
 *    each year swings round to the front in turn; the line lights up behind
 *    you and each year's dot ignites as you reach it. CSS 3D throughout —
 *    the browser moves one GPU layer per frame.
 *  • Phones — a straight vertical timeline: a spine on the left draws
 *    itself down with a comet at its tip, nodes ignite as it reaches them,
 *    cards slide in and brighten as they rise toward "now".
 *  • Reduced motion — the phone layout, static, at every size.
 *
 * Layering: dim layer z-38 < this section z-39 < header z-40.
 */
export default function Decade() {
  const root = useRef<HTMLElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  // spiral
  const stage = useRef<HTMLDivElement>(null);
  const helix = useRef<HTMLDivElement>(null);
  const bigYear = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  // phone list
  const line = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const comet = useRef<HTMLDivElement>(null);

  const last = decade.length - 1;
  const segs = Array.from({ length: last * SEGS_PER_YEAR }, (_, k) => k);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const setHeaderDark = (on: boolean) => {
      if (on) header?.setAttribute("data-theme", "dark");
      else header?.removeAttribute("data-theme");
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── iPad / desktop: the 3D spiral ────────────────────────────────
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const st = stage.current!;
        const hx = helix.current!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-dc-card]", st);
        const segEls = gsap.utils.toArray<HTMLElement>("[data-dc-seg]", st);
        const nodes = gsap.utils.toArray<HTMLElement>("[data-dc-node]", st);
        const shades = cards.map((c) => c.querySelector<HTMLElement>("[data-dc-shade]")!);
        // The wash lives in two places: the stage's own background (painted
        // with everything else — no extra layer while you scroll) and one
        // fade layer that carries the outgoing year's colours away.
        const washBase = st.querySelector<HTMLElement>("[data-dc-wash-base]")!;
        const washFade = st.querySelector<HTMLElement>("[data-dc-wash-fade]")!;
        const hideFade = () => {
          if (washFade.style.opacity === "0") washFade.style.display = "none";
        };
        washFade.addEventListener("transitionend", hideFade);
        st.setAttribute("data-3d", "");

        const geo = { radius: 0, rise: 0, lift: 0 };
        // Read right-to-left: centre on the anchor, push out to the radius,
        // turn round the axis, drop to its height.
        const at = (t: number) =>
          `translateY(${t * geo.rise - geo.lift}px) rotateY(${t * STEP_DEG}deg) translateZ(${geo.radius}px) translate(-50%, -50%)`;

        const layout = () => {
          const w = cards[0]?.offsetWidth || 400;
          const h = Math.max(...cards.map((c) => c.offsetHeight)) || 360;
          geo.radius = w * 1.2;
          geo.rise = h * (1 + GAP); // a card height plus the gap — never touching
          geo.lift = 0;
          st.style.perspective = `${Math.max(1200, w * 3.6)}px`;
          cards.forEach((c, i) => (c.style.transform = at(i)));

          // The line + dots ride NODE_ABOVE px over the cards' top edges.
          geo.lift = h / 2 + NODE_ABOVE;
          nodes.forEach((n, i) => (n.style.transform = at(i)));
          // Each segment is the straight chord between two points on the
          // helix: centred between them (just inside the radius), turned to
          // face out, tilted down the slope, and as long as the chord.
          const dA = (STEP_DEG / SEGS_PER_YEAR) * (Math.PI / 180);
          const across = 2 * geo.radius * Math.sin(dA / 2);
          const down = geo.rise / SEGS_PER_YEAR;
          const len = Math.hypot(across, down);
          const slope = (Math.atan2(down, across) * 180) / Math.PI;
          const inset = geo.radius * (1 - Math.cos(dA / 2));
          segEls.forEach((s, k) => {
            const t = (k + 0.5) / SEGS_PER_YEAR;
            s.style.width = `${len + 1}px`;
            s.style.transform = `translateY(${t * geo.rise - geo.lift}px) rotateY(${t * STEP_DEG}deg) translateZ(${geo.radius - inset}px) rotateZ(${slope}deg) translate(-50%, -50%)`;
          });
        };
        layout();

        let shownYear = -1;
        let litSegs = -1;
        let litNodes = -1;
        const render = (p: number) => {

          // Turn + lift the helix so year p faces the camera, front and centre.
          hx.style.transform = `rotateX(${-TILT_DEG}deg) translateZ(${-geo.radius}px) translateY(${-p * geo.rise}px) rotateY(${-p * STEP_DEG}deg)`;
          // Cards dim with a dark layer inside them (not opacity), so they
          // stay solid and the line behind never shows through.
          shades.forEach((s, i) => {
            s.style.opacity = String(1 - Math.max(CARD_MIN_LIGHT, 1 - Math.abs(i - p) * 0.35));
          });
          // Light the line up to where we are, and every dot we've reached
          // (only touching the ones that change).
          const segsOn = Math.floor(p * SEGS_PER_YEAR + 1e-4);
          if (segsOn !== litSegs) {
            segEls.forEach((s, k) => s.toggleAttribute("data-lit", k < segsOn));
            litSegs = segsOn;
          }
          const nodesOn = Math.floor(p + 0.02);
          if (nodesOn !== litNodes) {
            nodes.forEach((n, i) => n.toggleAttribute("data-lit", i <= nodesOn));
            litNodes = nodesOn;
          }
          const year = Math.round(p);
          if (year !== shownYear) {
            // New year's colours go straight onto the stage; the old year's
            // sit on the fade layer and the browser fades them out (CSS
            // transition) — nothing per frame, no layer at all once faded.
            washBase.style.background = washFor(year);
            if (shownYear >= 0) {
              washFade.style.transition = "none";
              washFade.style.display = "";
              washFade.style.background = washFor(shownYear);
              washFade.style.opacity = String(WASH);
              void washFade.offsetWidth; // commit the start state
              washFade.style.transition = "";
              washFade.style.opacity = "0";
            }
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
            // EDIT: catch-up time (s). Tiny — just enough to round off a
            // mouse wheel's notches — so the spiral never lags the scroll.
            scrub: 0.15,
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
          washFade.removeEventListener("transitionend", hideFade);
          [washBase, washFade].forEach((el) => {
            el.style.background = "";
            el.style.opacity = "";
            el.style.display = "";
            el.style.transition = "";
          });
          [...cards, ...segEls, ...nodes, ...shades].forEach((el) => {
            el.style.transform = "";
            el.style.opacity = "";
            el.style.width = "";
            el.removeAttribute("data-lit");
          });
        };
      });

      // ── Phones: the straight timeline ────────────────────────────────
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        // The spine draws itself down to the "now" line, comet riding the tip.
        const spine = { trigger: line.current, start: `top ${NOW_LINE}`, end: `bottom ${NOW_LINE}`, scrub: true };
        gsap.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: spine });
        // Transform, not `top`, so the comet never triggers a layout pass.
        gsap.fromTo(
          comet.current,
          { y: 0 },
          { y: () => line.current?.offsetHeight ?? 0, ease: "none", scrollTrigger: { ...spine, invalidateOnRefresh: true } }
        );

        gsap.utils.toArray<HTMLElement>("[data-dc-row]").forEach((row) => {
          // Node ignites as the tip crosses it.
          ScrollTrigger.create({
            trigger: row.querySelector("[data-dc-dot]"),
            start: `center ${NOW_LINE}`,
            onEnter: () => row.toggleAttribute("data-on", true),
            onLeaveBack: () => row.toggleAttribute("data-on", false),
          });
          // Card slides in, and brightens from CARD_MIN_LIGHT as it rises
          // to "now" (opacity + transform only — no repaints).
          const card = row.querySelector<HTMLElement>("[data-dc-card]");
          gsap.fromTo(
            card,
            { x: 40, y: 24 },
            { x: 0, y: 0, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 95%", end: "top 60%", scrub: true } }
          );
          gsap.fromTo(
            card,
            { opacity: CARD_MIN_LIGHT },
            { opacity: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: `center ${NOW_LINE}`, scrub: true } }
          );
        });
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

        {/* ── iPad / desktop: the spiral stage — pinned while the helix
            turns (.dc-stage in globals.css; hidden on phones) ── */}
        <div ref={stage} className="dc-stage">
          {/* The wash: the current card's colours blown up soft across the
              whole stage (base), and the previous year's fading out (fade).
              Both set from JS. */}
          <span data-dc-wash-base aria-hidden className="dc-wash-base pointer-events-none absolute inset-0" style={{ opacity: WASH }} />
          <span data-dc-wash-fade aria-hidden className="dc-wash pointer-events-none absolute opacity-0" style={{ display: "none" }} />

          {/* Current year, huge and faint, behind the spiral */}
          <span
            ref={bigYear}
            aria-hidden
            className="dc-3d-only pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(9rem,30vw,30rem)] font-medium leading-none tracking-[-0.06em] text-white/[0.045] tabular-nums"
          >
            {decade[0].year}
          </span>

          <div ref={helix} className="dc-helix">
            {/* The line round the spiral, and a dot above every year */}
            {segs.map((k) => (
              <span key={`s${k}`} data-dc-seg aria-hidden className="dc-seg" />
            ))}
            {decade.map((d) => (
              <span key={`n${d.year}`} data-dc-node aria-hidden className="dc-node" />
            ))}

            {decade.map((d, i) => (
              <Card key={d.year} d={d} i={i} className="dc-card" shade />
            ))}
          </div>

          {/* Progress — which year of how many */}
          <span
            ref={counter}
            aria-hidden
            className="dc-3d-only absolute bottom-8 left-5 text-[13px] font-medium tabular-nums tracking-[0.2em] text-white/50 sm:left-8"
          >
            01 / {String(decade.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Phones (and reduced motion): the straight timeline ── */}
        <div className="dc-list relative mx-auto max-w-[640px] px-5 sm:px-8">
          {/* Spine: faint track, accent fill that draws down, comet at the tip */}
          <div ref={line} aria-hidden className="absolute bottom-0 left-[31.5px] top-0 w-px bg-white/12 sm:left-[43.5px]">
            <div
              ref={fill}
              className="dc-fill absolute inset-0 origin-top bg-gradient-to-b from-[color:var(--accent)] via-[color:var(--accent)] to-white"
              style={{ transform: "scaleY(0)" }}
            />
            <div
              ref={comet}
              className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(229,54,31,0.35),0_0_24px_6px_rgba(229,54,31,0.55)] will-change-transform"
            />
          </div>

          <ol className="relative">
            {decade.map((d, i) => (
              <li
                key={d.year}
                data-dc-row
                className="group/row relative grid grid-cols-[24px_1fr] items-center gap-x-5 py-8 sm:gap-x-8"
              >
                {/* Node on the spine */}
                <span
                  data-dc-dot
                  aria-hidden
                  className="relative z-10 col-start-1 row-start-1 mx-auto h-[14px] w-[14px] rounded-full border border-white/30 bg-[#0a0a0a] transition-all duration-500 group-data-[on]/row:scale-125 group-data-[on]/row:border-[color:var(--accent)] group-data-[on]/row:bg-[color:var(--accent)] group-data-[on]/row:shadow-[0_0_0_6px_rgba(229,54,31,0.18),0_0_22px_rgba(229,54,31,0.6)]"
                />
                <Card d={d} i={i} className="col-start-2 row-start-1 will-change-[opacity,transform]" />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

/** Same golden-angle hues as the 500+ grid. */
const hueFor = (i: number) => Math.round((i * 137.508) % 360);

/** The card's art: a vivid radial gradient. */
const artFor = (i: number) => {
  const h = hueFor(i);
  return `radial-gradient(circle at 30% 25%, hsl(${h} 92% 66%), hsl(${(h + 38) % 360} 85% 48%) 55%, hsl(${(h + 70) % 360} 80% 26%))`;
};

/**
 * The same art as a wash for the whole stage — the card's colours blown up
 * huge with long soft falloffs, which reads as a blurred copy of the card
 * without needing a blur filter (those cost every frame; this is one
 * static paint, then only its opacity moves).
 */
const washFor = (i: number) => {
  const h = hueFor(i);
  return [
    `radial-gradient(ellipse 70% 75% at 32% 30%, hsl(${h} 92% 62%) 0%, hsl(${h} 92% 62% / 0) 70%)`,
    `radial-gradient(ellipse 80% 80% at 78% 72%, hsl(${(h + 38) % 360} 85% 46%) 0%, hsl(${(h + 38) % 360} 85% 46% / 0) 72%)`,
    `radial-gradient(ellipse 120% 100% at 50% 50%, hsl(${(h + 70) % 360} 80% 28%) 0%, #0a0a0a 100%)`,
  ].join(", ");
};

/** One year's card — same in the spiral and the phone list. */
function Card({
  d,
  i,
  className = "",
  shade = false,
}: {
  d: (typeof decade)[number];
  i: number;
  className?: string;
  /** Spiral cards dim via this dark layer (set from JS) instead of opacity. */
  shade?: boolean;
}) {
  // (No drop shadow: on 11 moving 3D layers it doubled each frame's cost.)
  return (
    <article
      data-dc-card
      className={`relative overflow-hidden rounded-[22px] border border-white/10 bg-[#141414] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${className}`}
    >
      <div
        className="relative aspect-[16/8] w-full"
        style={{ background: artFor(i) }}
      >
        <span className="absolute bottom-3 left-4 text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-white/60">
          {d.year}
        </span>
      </div>
      <div className="p-6 sm:p-7">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--accent)]">{d.year}</p>
        <h3 className="mt-3 text-[clamp(1.2rem,2vw,1.55rem)] font-medium leading-tight tracking-tight">{d.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/60">{d.body}</p>
      </div>
      {shade && (
        <span data-dc-shade aria-hidden className="pointer-events-none absolute inset-0 bg-[#050505] opacity-0 will-change-[opacity]" />
      )}
    </article>
  );
}
