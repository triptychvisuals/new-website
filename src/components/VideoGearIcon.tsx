/**
 * Line illustrations of video gear — placeholder art for the timeline
 * cards until real stills arrive (drop them in /public/decade, see
 * Decade.tsx). One per year, keyed by index; stroke in currentColor.
 * EDIT: add or reorder shapes in GEAR below.
 */
const GEAR: { name: string; paths: string[] }[] = [
  // cinema camera
  { name: "camera", paths: ["M10 26h30a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V30a4 4 0 0 1 4-4z", "M44 34l12-6v24l-12-6", "M16 14a6 6 0 1 0 0 12 6 6 0 0 0 0-12z", "M32 14a6 6 0 1 0 0 12 6 6 0 0 0 0-12z", "M20 50v6M34 50v6"] },
  // clapperboard
  { name: "clapperboard", paths: ["M8 26h48v26a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V26z", "M8 26l-2-9 46-7 2 9", "M18 16l6 8M30 14l6 8M42 12l6 8", "M8 34h48"] },
  // film reel
  { name: "reel", paths: ["M32 8a24 24 0 1 0 0 48 24 24 0 0 0 0-48z", "M32 28a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M32 14a5 5 0 1 0 0 10 5 5 0 0 0 0-10z", "M32 40a5 5 0 1 0 0 10 5 5 0 0 0 0-10z", "M16 27a5 5 0 1 0 0 10 5 5 0 0 0 0-10z", "M48 27a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"] },
  // fresnel light
  { name: "light", paths: ["M22 14h20a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z", "M32 20a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M32 40v16M22 56h20", "M14 27h4M46 27h4", "M12 12l4 4M52 12l-4 4"] },
  // edit timeline
  { name: "edit", paths: ["M6 12h52v30H6z", "M6 34h52", "M10 20h18M32 20h12M48 20h6", "M10 26h8M22 26h22", "M36 14v28", "M24 50h16M32 42v8"] },
  // lens
  { name: "lens", paths: ["M32 8a24 24 0 1 0 0 48 24 24 0 0 0 0-48z", "M32 16a16 16 0 1 0 0 32 16 16 0 0 0 0-32z", "M32 24l8 4v8l-8 4-8-4v-8z", "M24 20l6 8M40 20l-6 8M40 44l-6-8M24 44l6-8"] },
  // boom mic
  { name: "boom", paths: ["M38 8h8a6 6 0 0 1 6 6v12a10 10 0 0 1-20 0V14a6 6 0 0 1 6-6z", "M28 22v4a14 14 0 0 0 28 0v-4", "M42 40v8", "M42 48L10 58", "M6 58h10"] },
  // director's chair
  { name: "chair", paths: ["M12 14h40v8H12z", "M14 30h36", "M14 30L8 56M50 30l6 26", "M14 30l36 26M50 30L14 56", "M16 22v8M48 22v8"] },
  // drone
  { name: "drone", paths: ["M26 30h12v8H26z", "M26 34L12 24M38 34l14-10M26 34L12 44M38 34l14 10", "M6 24h12M46 24h12M6 44h12M46 44h12", "M30 38l-2 6h8l-2-6"] },
  // playback monitor
  { name: "monitor", paths: ["M8 12h48a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z", "M27 21v14l12-7z", "M24 52h16M32 44v8"] },
  // laurels + star
  { name: "award", paths: ["M32 14l4.5 9 10 1.5-7.2 7 1.7 10L32 36.8l-9 4.7 1.7-10-7.2-7 10-1.5z", "M12 22c-4 10 0 24 12 30", "M52 22c4 10 0 24-12 30", "M10 30l6 2M11 40l6-1M14 48l5-3", "M54 30l-6 2M53 40l-6-1M50 48l-5-3"] },
];

export default function VideoGearIcon({ index, className = "" }: { index: number; className?: string }) {
  const g = GEAR[index % GEAR.length];
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      data-gear={g.name}
      className={className}
    >
      {g.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
