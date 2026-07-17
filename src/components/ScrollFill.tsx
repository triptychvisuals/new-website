"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Scroll-driven grey→white fill. Marked children ([data-fill]) start dimmed —
 * so they read as grey against the page — and brighten to full strength as the
 * block scrolls through the viewport, staggered and scrubbed to scroll
 * position. Uses opacity (not a fixed colour) so it works in light and dark.
 */
export default function ScrollFill({
  children,
  className = "",
  selector = "[data-fill]",
  from = 0.22, // EDIT: starting dimness (lower = greyer)
  stagger = 0.5, // EDIT: spread of the fill across the scroll
  start = "top 85%", // EDIT: begins filling here
  end = "bottom 60%", // EDIT: fully filled here
}: {
  children: React.ReactNode;
  className?: string;
  selector?: string;
  from?: number;
  stagger?: number;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(selector);
    if (!items.length) return;

    const anim = gsap.fromTo(
      items,
      { opacity: from },
      {
        opacity: 1,
        ease: "none",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      }
    );
    ScrollTrigger.refresh();
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [selector, from, stagger, start, end]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
