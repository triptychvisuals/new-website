"use client";

import { useEffect, useRef, useState } from "react";

// EDIT: drop your track in /public/audio/ and set the path + title/artist here.
const TRACK_SRC = "/audio/track.mp3";
const TRACK_TITLE = "Untitled Track"; // EDIT: song title
const TRACK_ARTIST = "Triptych"; // EDIT: artist (or leave "")

/**
 * In-hero song control. Browsers block autoplay with sound, so the track
 * starts on click. Shows play → pause and a small equalizer while playing.
 */
export default function HeroPlayButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Keep UI in sync if playback ends or is paused elsewhere.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <>
      {/* EDIT: loop the track by adding `loop` below */}
      <audio ref={audioRef} src={TRACK_SRC} preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause track" : "Play track"}
        aria-pressed={playing}
        className="inline-flex shrink-0 items-center gap-3 rounded-full border border-white/20 bg-white/5 py-2 pl-2 pr-5 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black">
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-sm font-medium">
            {playing ? "Now playing" : "Play track"}
          </span>
          <span className="text-[11px] text-white/50">
            {TRACK_TITLE}
            {TRACK_ARTIST && ` — ${TRACK_ARTIST}`}
          </span>
        </span>
        {playing && (
          <span className="ml-1 flex h-4 items-end gap-[2px]" aria-hidden>
            <span className="w-[3px] animate-eq bg-white/70" />
            <span className="w-[3px] animate-eq bg-white/70 [animation-delay:0.2s]" />
            <span className="w-[3px] animate-eq bg-white/70 [animation-delay:0.4s]" />
          </span>
        )}
      </button>
    </>
  );
}
