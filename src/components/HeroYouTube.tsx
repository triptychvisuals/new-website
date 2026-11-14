"use client";

import { useEffect, useRef, useState } from "react";

const ORIGIN = "https://www.youtube-nocookie.com";

/**
 * The lead video behind the hero: a YouTube video playing muted, looped and
 * full-bleed, with no player controls on top (privacy-enhanced domain, so
 * no cookies). It covers the hero the way object-cover would, using
 * container units so the 16:9 frame always fills the box, and is scaled up
 * a little so YouTube's title strip sits outside the frame.
 *
 * It only fades in once the player itself reports that the video is
 * playing (YouTube's postMessage API), so a slow, blocked or failed player
 * never shows; the local clips underneath carry the hero until then, or
 * for good. While the hero is off screen the video is paused, so nothing
 * decodes while you scroll the rest of the page.
 */
export default function HeroYouTube({
  id,
  onReady,
}: {
  id: string;
  /** Called once the video has faded in (the local reel can rest then). */
  onReady?: () => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // EDIT: how long the video plays hidden before it fades in (ms), so
  // YouTube's own title card has gone by.
  const FADE_IN_AFTER = 1500;
  // EDIT: how much larger than the hero the player is drawn, to crop
  // YouTube's title strip off the top.
  const OVERSCAN = 1.2;

  const src =
    `${ORIGIN}/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1` +
    `&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1`;

  // Listen to the player; show the video once it is really playing.
  useEffect(() => {
    let timer: number | undefined;
    let hello: number | undefined;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGIN || e.source !== frame.current?.contentWindow) return;
      let data: { event?: string; info?: { playerState?: number } } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data) return;
      if (hello !== undefined) {
        window.clearInterval(hello);
        hello = undefined;
      }
      // playerState 1 = playing
      if (data.info?.playerState === 1 && timer === undefined) {
        timer = window.setTimeout(() => setShown(true), FADE_IN_AFTER);
      }
    };
    window.addEventListener("message", onMessage);
    // Ask the player to start reporting (repeat until it answers).
    const greet = () =>
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "hero", channel: "widget" }), ORIGIN);
    hello = window.setInterval(greet, 500);
    return () => {
      window.removeEventListener("message", onMessage);
      if (hello !== undefined) window.clearInterval(hello);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  // Pause off screen, play on screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const send = (func: "playVideo" | "pauseVideo") =>
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), ORIGIN);
    const io = new IntersectionObserver(([e]) => send(e.isIntersecting ? "playVideo" : "pauseVideo"));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (shown) onReady?.();
  }, [shown, onReady]);

  return (
    <div
      ref={box}
      aria-hidden
      data-lead-video={shown ? "playing" : "waiting"}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-1000 ease-out"
      style={{ containerType: "size", opacity: shown ? 1 : 0 }}
    >
      <iframe
        ref={frame}
        src={src}
        title="Triptych Studios showreel"
        tabIndex={-1}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute left-1/2 top-1/2 border-0"
        style={{
          // cover: the larger of "fill the width" and "fill the height"
          width: "max(100cqw, 177.78cqh)",
          height: "max(100cqh, 56.25cqw)",
          transform: `translate(-50%, -50%) scale(${OVERSCAN})`,
        }}
      />
    </div>
  );
}
