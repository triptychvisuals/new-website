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
      duration: 1.1, // EDIT: higher = more inertia/glide
      smoothWheel: true,
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
