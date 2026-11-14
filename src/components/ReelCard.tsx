"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Reel } from "@/lib/reels";

/**
 * One reel, in the clean short-form style: a 9:16 video with rounded
 * corners and nothing round it — a caption that pops up a word at a time in
 * the middle, the views and likes (or the title, until there are numbers)
 * at the bottom-left, and a small frame from the video at the bottom-right.
 * The whole card opens the project. Plays only while it's on screen.
 */
export default function ReelCard({ reel }: { reel: Reel }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [word, setWord] = useState(0);
  const words = useMemo(() => (reel.words ?? reel.caption).split(/\s+/).filter(Boolean), [reel.words, reel.caption]);

  // Play while mostly on screen; pause otherwise.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // The caption steps through its words while the video plays.
  useEffect(() => {
    if (!playing || words.length < 2) return;
    const id = setInterval(() => setWord((w) => (w + 1) % words.length), 560); // EDIT: ms per word
    return () => clearInterval(id);
  }, [playing, words.length]);

  const stats = reel.views || reel.likes;

  return (
    <Link
      href={reel.href}
      aria-label={`${reel.title}${reel.artist ? ` — ${reel.artist}` : ""}`}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-[#111] text-white"
    >
      <video
        ref={video}
        src={reel.src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        style={reel.focus ? { objectPosition: reel.focus } : undefined}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      {/* the caption, a word at a time */}
      {words.length > 0 && (
        <span
          key={word}
          aria-hidden
          className="reel-word pointer-events-none absolute inset-x-4 top-[56%] text-center text-[clamp(20px,2.3vw,30px)] font-semibold leading-none tracking-[-0.02em] [text-shadow:0_2px_14px_rgba(0,0,0,.55)]"
        >
          {words[word]}
        </span>
      )}

      {/* bottom-left: views and likes, or the title until there are numbers */}
      <div className="absolute bottom-4 left-4 right-[30%] sm:bottom-5 sm:left-5">
        {stats ? (
          <p className="flex items-center gap-4 text-[15px] font-medium [text-shadow:0_1px_6px_rgba(0,0,0,.5)]">
            {reel.views && (
              <span className="inline-flex items-center gap-1.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="opacity-90">
                  <path d="M12 5C6.5 5 2.7 9.4 1.5 12c1.2 2.6 5 7 10.5 7s9.3-4.4 10.5-7C21.3 9.4 17.5 5 12 5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" />
                </svg>
                {reel.views}
              </span>
            )}
            {reel.likes && (
              <span className="inline-flex items-center gap-1.5">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="opacity-90">
                  <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.4 3 5 6.5 5c2 0 3.5 1.1 4.5 2.6C12 6.1 13.5 5 15.5 5 19 5 21.1 8.4 19.6 11.7 17.5 16.4 12 21 12 21Z" />
                </svg>
                {reel.likes}
              </span>
            )}
          </p>
        ) : (
          <>
            <p className="truncate text-[15px] font-medium leading-tight [text-shadow:0_1px_6px_rgba(0,0,0,.5)]">{reel.title}</p>
            {reel.artist && <p className="mt-0.5 truncate text-[13px] text-white/75">{reel.artist}</p>}
          </>
        )}
      </div>

      {/* bottom-right: a small frame from the video */}
      {reel.inset && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={reel.inset}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute bottom-3 right-3 aspect-[3/4] w-[18%] rounded-[10px] object-cover ring-[1.5px] ring-white/80 sm:bottom-4 sm:right-4"
        />
      )}
    </Link>
  );
}
