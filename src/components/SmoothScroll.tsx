"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Global smooth-scroll provider.
 *
 * Wires Lenis into GSAP's single RAF loop and keeps ScrollTrigger in sync with
 * Lenis' virtual scroll position. Every scroll-driven section in the site reads
 * from this same scroll, so pinning/scrubbing stays buttery.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      // EDIT: how fast the page catches up to the wheel each frame (0–1).
      // Higher = snappier, less glide; 0.1 is Lenis' floaty default. At 0.18
      // a flick settles in ~0.3s — smooth, but it never trails the hand.
      lerp: 0.18,
      smoothWheel: true,
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
