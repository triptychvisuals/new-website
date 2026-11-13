"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { REEL_HANDLE, type Reel } from "@/lib/reels";
import { haptic } from "@/lib/haptics";

/**
 * One reel: a 9:16 video in a phone-style frame with a mock social overlay
 * — progress bar, the studio's handle and a Follow pill, a sound toggle,
 * the like / comment / share / save rail, the title, caption and audio
 * line. Purely decorative apart from: tap the picture to pause, the sound
 * button to unmute (the others go quiet), the heart to like (this visit
 * only), and the title to open the project. Plays only while on screen.
 */
export default function ReelCard({ reel, index }: { reel: Reel; index: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Play while mostly on screen; pause otherwise.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !paused) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.55 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [paused]);

  // Only one reel speaks at a time.
  useEffect(() => {
    const quiet = (e: Event) => {
      if ((e as CustomEvent<number>).detail !== index) setMuted(true);
    };
    window.addEventListener("reel:unmute", quiet);
    return () => window.removeEventListener("reel:unmute", quiet);
  }, [index]);

  // The progress bar follows the clip (a transform, written directly).
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const tick = () => {
      if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    };
    v.addEventListener("timeupdate", tick);
    return () => v.removeEventListener("timeupdate", tick);
  }, []);

  const toggleSound = () => {
    haptic("tap");
    const next = !muted;
    setMuted(next);
    if (!next) window.dispatchEvent(new CustomEvent("reel:unmute", { detail: index }));
  };

  return (
    <article className="relative aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-[#111] text-white">
      <video
        ref={video}
        src={reel.src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={`${reel.title} — reel`}
        className="absolute inset-0 h-full w-full object-cover"
        style={reel.focus ? { objectPosition: reel.focus } : undefined}
        onClick={() => {
          const v = video.current;
          if (!v) return;
          if (v.paused) {
            setPaused(false);
            v.play().catch(() => {});
          } else {
            setPaused(true);
            v.pause();
          }
        }}
      />
      {/* shades for the overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {paused && (
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/50">
          <svg width="22" height="24" viewBox="0 0 22 24" fill="#fff"><path d="M3 1.5v21L21 12z" /></svg>
        </span>
      )}

      {/* Top: progress, handle, follow, sound */}
      <div className="absolute inset-x-0 top-0 p-3">
        <span className="block h-[2px] overflow-hidden rounded-full bg-white/25">
          <span ref={bar} className="block h-full origin-left scale-x-0 rounded-full bg-white" />
        </span>
        <div className="mt-3 flex items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black ring-1 ring-white/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/triptych-logo.png" alt="" className="h-2.5 w-auto" />
          </span>
          <span className="truncate text-[13px] font-semibold">{REEL_HANDLE}</span>
          <span className="shrink-0 rounded-md border border-white/70 px-2 py-0.5 text-[12px] font-semibold">Follow</span>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/40"
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Right rail */}
      <div className="absolute bottom-24 right-2.5 flex flex-col items-center gap-4">
        <RailButton
          label={liked ? "Unlike" : "Like"}
          count={reel.likes}
          onClick={() => {
            haptic("tap");
            setLiked((l) => !l);
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill={liked ? "#ff3040" : "none"} stroke={liked ? "#ff3040" : "#fff"} strokeWidth="1.8" strokeLinejoin="round" className={liked ? "reel-pop" : undefined}>
            <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8.2 3.3 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.7 0 5.5 3.7 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
          </svg>
        </RailButton>
        <RailButton label="Comment" count={reel.comments}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.1A8.5 8.5 0 1 1 20.5 11.5z" /></svg>
        </RailButton>
        <RailButton label="Share">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"><path d="M21.5 3 10.2 14.3M21.5 3l-7 18.5-4.3-7.2L3 10z" /></svg>
        </RailButton>
        <RailButton
          label={saved ? "Unsave" : "Save"}
          onClick={() => {
            haptic("tap");
            setSaved((v) => !v);
          }}
        >
          <svg width="22" height="24" viewBox="0 0 22 24" fill={saved ? "#fff" : "none"} stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 2.5h14v19l-7-5.2-7 5.2z" /></svg>
        </RailButton>
      </div>

      {/* Bottom: title, caption, audio */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 pr-14">
        <Link href={reel.href} className="block text-[15px] font-semibold leading-tight hover:underline">
          {reel.title}
          {reel.artist && <span className="font-normal text-white/75"> · {reel.artist}</span>}
        </Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-white/85">{reel.caption}</p>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-white/80">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M9 18V5l12-2v13" stroke="#fff" strokeWidth="2" fill="none" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          <span className="truncate">{reel.audio ?? "Original audio"}</span>
        </p>
      </div>
      {/* the spinning record */}
      <span aria-hidden className="reel-disc absolute bottom-3.5 right-3 h-7 w-7 rounded-md border-2 border-white/80 bg-[radial-gradient(circle,#fff_0_18%,#222_20%)]" />
    </article>
  );
}

function RailButton({ label, count, onClick, children }: { label: string; count?: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex flex-col items-center gap-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
      {children}
      {count && <span className="text-[11px] font-semibold">{count}</span>}
    </button>
  );
}
