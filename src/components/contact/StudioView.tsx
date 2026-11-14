"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * The contact hero: an aerial render of the block round 211 W. Wacker
 * Drive (made in Higgsfield from aerial photos of the real street), shown
 * at the time of day it really is in Chicago right now.
 *
 * There are five renders of the same view — dawn, day, golden hour, blue
 * hour and night (/public/contact). Each visit works out today's sunrise
 * and sunset at the studio's coordinates, shows the one that fits, and
 * crossfades to the next as the light changes (checked every minute).
 * Only the render on screen is downloaded; phones get lighter copies.
 * A slow drift keeps it alive; none with reduced motion.
 */

type Look = "dawn" | "day" | "golden" | "dusk" | "night";

// EDIT: the renders' aspect (width / height) and where the studio is in
// them (% of the width / height) — the pin sits there.
const ASPECT = 2688 / 1520;
const PIN = { x: 37.4, y: 31 };
// EDIT: on narrow screens the crop centres on this point (% of the width)
// so the studio stays in frame; wide screens see the whole render.
const FOCUS_X = 46;

// EDIT: when each look starts, in minutes from today's sunrise / sunset,
// and how long the crossfade between two looks takes (minutes).
const STARTS: { look: Look; from: "sunrise" | "sunset"; min: number }[] = [
  { look: "dawn", from: "sunrise", min: -60 },
  { look: "day", from: "sunrise", min: 50 },
  { look: "golden", from: "sunset", min: -80 },
  { look: "dusk", from: "sunset", min: -5 },
  { look: "night", from: "sunset", min: 55 },
];
const FADE_MIN = 25;

// EDIT: the looks that have a circling drone video (made in Higgsfield
// from the still; it glides forward, eases to a stop, then plays back the
// same way, so the loop has no seam): files
// /public/contact/<look>.mp4 and <look>-m.mp4 for phones. Looks not listed
// show the still with a slow push-in and the pin.
const ORBITS = new Set<Look>(["dawn", "day", "golden", "dusk", "night"]);

const LABEL: Record<Look, string> = { dawn: "Dawn", day: "Day", golden: "Golden hour", dusk: "Blue hour", night: "Night" };

/** Sunrise and sunset (UTC ms) on the UTC day of `d`, at lat / lng (NOAA). */
function sunTimes(d: Date, lat: number, lng: number) {
  const day0 = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const doy = Math.floor((day0 - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5);
  const g = ((2 * Math.PI) / 365) * (doy - 1);
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const rad = (lat * Math.PI) / 180;
  const ha = (Math.acos(Math.cos((90.833 * Math.PI) / 180) / (Math.cos(rad) * Math.cos(decl)) - Math.tan(rad) * Math.tan(decl)) * 180) / Math.PI;
  return {
    sunrise: day0 + (720 - 4 * (lng + ha) - eq) * 6e4,
    sunset: day0 + (720 - 4 * (lng - ha) - eq) * 6e4,
  };
}

/** Which look(s) to show at `now`: `a` fully, `b` over it at opacity `t`. */
function lookAt(now: number): { a: Look; b: Look | null; t: number } {
  // the Chicago calendar day: UTC minus six hours is close enough for the sun
  const { sunrise, sunset } = sunTimes(new Date(now - 6 * 36e5), site.lat, site.lng);
  const marks = STARTS.map((s) => ({ look: s.look, at: (s.from === "sunrise" ? sunrise : sunset) + s.min * 6e4 }));
  const half = (FADE_MIN / 2) * 6e4;
  let a: Look = "night";
  for (const m of marks) if (now >= m.at - half) a = m.look;
  for (let i = 0; i < marks.length; i++) {
    const m = marks[i];
    if (Math.abs(now - m.at) < half) {
      const before = i === 0 ? "night" : marks[i - 1].look;
      return { a: before, b: m.look, t: (now - (m.at - half)) / (2 * half) };
    }
  }
  return { a, b: null, t: 0 };
}

const chicagoTime = (now: number) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).format(now);

function Layer({ look, opacity, still }: { look: Look; opacity: number; still: boolean }) {
  const cls = "absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-out";
  if (ORBITS.has(look) && !still) {
    return (
      <video autoPlay muted loop playsInline preload="auto" poster={`/contact/${look}.webp`} aria-hidden className={cls} style={{ opacity }}>
        <source src={`/contact/${look}-m.mp4`} type="video/mp4" media="(max-width: 899px)" />
        <source src={`/contact/${look}.mp4`} type="video/mp4" />
      </video>
    );
  }
  return (
    <picture>
      <source media="(max-width: 899px)" srcSet={`/contact/${look}-m.webp`} />
      <img src={`/contact/${look}.webp`} alt="" decoding="async" draggable={false} className={cls} style={{ opacity }} />
    </picture>
  );
}

export default function StudioView({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<number | null>(null);
  // reduced motion: the stills only
  const [still, setStill] = useState(false);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const t0 = window.setTimeout(() => setStill(m.matches), 0);
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(t0);
      window.clearInterval(id);
    };
  }, []);

  const view = now === null ? null : lookAt(now);
  // a circling video moves on its own: no push-in, and no pin (it would
  // slide off the building as the camera turns)
  const moving = !!view && !still && ORBITS.has(view.t > 0.5 && view.b ? view.b : view.a);
  const W = `max(100cqw, calc(100cqh * ${ASPECT}))`;

  return (
    <div className={`relative overflow-hidden bg-[#050505] [container-type:size] ${className}`}>
      {view && (
        // the render, sized to cover the frame whatever its shape, with the
        // pin in the render's own coordinates
        <div
          className={`absolute top-1/2 ${moving ? "" : "studio-drift"}`}
          style={{
            width: W,
            height: `max(100cqh, calc(100cqw / ${ASPECT}))`,
            // centred on FOCUS_X, but never leaving an edge uncovered
            left: `clamp(calc(100cqw - ${W}), calc(50cqw - ${W} * ${FOCUS_X / 100}), 0px)`,
            translate: "0 -50%",
          }}
        >
          <Layer key={view.a} look={view.a} opacity={1} still={still} />
          {view.b && <Layer key={view.b} look={view.b} opacity={view.t} still={still} />}

          {/* The studio */}
          {!moving && (
          <div className="absolute" style={{ left: `${PIN.x}%`, top: `${PIN.y}%` }}>
            <span className="absolute -left-[7px] -top-[7px] h-[14px] w-[14px] animate-ping rounded-full bg-[#ff3b30]/60" />
            <span className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] rounded-full border-2 border-white bg-[#ff3b30]" />
            <span className="absolute bottom-[10px] left-0 h-[56px] w-px bg-white/80" />
            <span className="absolute bottom-[66px] -left-3 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[12px] font-medium text-black shadow-lg">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#ff3b30]" />
              211 W. Wacker Dr.
            </span>
          </div>
          )}
        </div>
      )}

      {/* the light right now */}
      {view && (
        <p className="pointer-events-none absolute right-6 top-6 z-30 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 font-mono text-[11px] text-white/85 backdrop-blur-sm sm:right-10 sm:top-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34c759]" />
          Chicago · {chicagoTime(now!)} · {LABEL[view.t > 0.5 && view.b ? view.b : view.a]}
        </p>
      )}

      {/* soft shade so the overlay text reads on bright renders */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.45), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 65%, rgba(0,0,0,.55))" }}
      />
    </div>
  );
}
