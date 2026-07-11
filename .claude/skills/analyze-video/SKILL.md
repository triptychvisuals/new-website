---
name: analyze-video
description: Analyze a screen recording / video of a UI or scroll animation. Extracts frames at a chosen fps with ffmpeg (and transcribes audio with Whisper when present) so the motion can be described frame-by-frame. Use whenever the user shares a video/screen recording (.mp4/.mov/.webm/.gif) of an effect to replicate or review.
---

# analyze-video

Turn a screen recording into readable frames (and a transcript) so you can
describe the motion precisely before building it.

## When to use

Any time the user shares a video of an animation/effect — especially
scroll-driven motion where fast transitions need a high sample rate.

## How to run

```bash
bash .claude/skills/analyze-video/scripts/extract.sh <video> [fps] [outdir]
```

- `fps` defaults to **6**. For fast scroll transitions sample **4–8 fps**;
  bump to 10–12 only if motion is still ambiguous between frames.
- Output lands in `.video-analysis/<basename>/` (git-ignored).

Requirements: `ffmpeg`/`ffprobe` (frames) and `whisper` (transcription, only if
the video has audio). If a tool is missing, install ffmpeg via
`apt-get install -y ffmpeg` and Whisper via
`pip install --break-system-packages openai-whisper`.

## Reading the output

The script writes, under `.video-analysis/<basename>/`:

1. `summary.txt` — duration, resolution, source fps, and a `frame -> timestamp`
   index. **Read this first.**
2. `contact_XXX.jpg` — contact-sheet grids (20 frames each). **Read these for a
   fast overview** of the whole clip.
3. `frames/frame_XXXX.jpg` — individual downscaled frames. Read the ones around
   any transition you need to pin down (use the timestamp index to navigate).
4. `transcript.txt` — present only when the video has narration.

## Describing motion back to the user

After analyzing, restate the effect in **technical terms** before building:

- What moves, in what order, and over what scroll distance / duration.
- Easing feel (linear scrub vs. eased), pinning, and any parallax/stagger.
- Which tool implements it: GSAP **ScrollTrigger** (pin/scrub/snap), **Lenis**
  (smooth scroll baseline), R3F/Three.js (3D camera or object), CSS/Tailwind.
- Call out anything ambiguous and ask before building.
