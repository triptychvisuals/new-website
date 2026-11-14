"use client";

import { useEffect, useRef } from "react";

// One observer for every preview on the page: each loop plays only while
// its card is on screen, so a grid of them costs no more than the few you
// can see.
let io: IntersectionObserver | null = null;
const observe = (el: HTMLVideoElement) => {
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }
    },
    { rootMargin: "120px 0px" }
  );
  io.observe(el);
  return () => io?.unobserve(el);
};

/**
 * A project card's animated preview: a few silent seconds of the video,
 * looping while the card is on screen (lib/previews). Its poster frame
 * shows until it plays; with reduced motion only the poster shows.
 */
export default function PreviewLoop({ src, poster, className = "", style }: { src: string; poster: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return observe(v);
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={className}
      style={style}
    />
  );
}
