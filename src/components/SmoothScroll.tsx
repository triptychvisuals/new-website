"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// EDIT: false = the browser's own native scrolling (fastest possible: zero
// added latency, and it runs off the main thread so it never hitches).
// true = Lenis glides the wheel/trackpad (smoother on notchy mouse wheels,
// but it trails the hand slightly and runs on the main thread).
const SMOOTH_WHEEL = false;

/**
 * Global scroll provider.
 *
 * Wires Lenis into GSAP's single RAF loop and keeps ScrollTrigger in sync.
 * With SMOOTH_WHEEL off, wheel/touch scrolling is fully native and Lenis
 * only smooths in-page #hash links (mobile menu → About section).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      // EDIT: only used when SMOOTH_WHEEL is on — how fast the page catches
      // up to the wheel each frame (0–1). Higher = snappier, less glide.
      lerp: 0.18,
      smoothWheel: SMOOTH_WHEEL,
      // Smoothly scroll in-page #hash links (mobile menu → About section)
      // instead of letting the browser jump.
      anchors: true,
    });

    // Keep ScrollTrigger updated on every Lenis frame.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so there's one RAF loop for the whole app.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
