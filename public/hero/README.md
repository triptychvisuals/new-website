# Hero background video

Drop your hero background clip in this folder, then tell Claude the filename
and it'll be wired in behind the "Imagination in Motion" text (muted, looping,
autoplay, with a poster frame).

## Upload

Ideal filenames: `hero.mp4` (and optionally `hero.webm` + `hero-poster.jpg`).

## Specs for high quality + fast load

- **Resolution:** 1080p (1920×1080). 4K is usually wasted on a darkened,
  cropped background and is ~4× the size. For true 4K/adaptive, use a video
  CDN (Mux / Cloudflare Stream / Bunny) instead of self-hosting.
- **Length:** short seamless loop, ~10–20s.
- **Bitrate/codec:** ~8–12 Mbps H.264 in an `.mp4`. Optionally also export a
  `.webm` (VP9/AV1) — better quality per byte; it's served first with the mp4
  as fallback.
- **Audio:** none needed — hero video autoplays muted (browsers require it).
- **Poster:** a single representative frame as `hero-poster.jpg` for instant
  first paint before the video loads.

## Limits

- GitHub rejects files over **100 MB**. A well-encoded 1080p loop is ~10–25 MB.
- Export web-ready (Claude can't run ffmpeg here to compress a raw master).
