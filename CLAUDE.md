@AGENTS.md

# Project: scroll-driven animated single-page site

Awwwards-caliber, motion-first single page. Built incrementally from reference
screen recordings — one section/effect at a time.

## Stack

- Next.js (App Router) + TypeScript + Tailwind v4 (CSS-config in `globals.css`)
- Three.js via React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- GSAP + ScrollTrigger (scroll-driven animation / pinning)
- Lenis (smooth scroll)
- glTF/GLB for 3D models (supplied later)
- Deploy: Vercel

Do **not** add dependencies beyond this list without asking.

## Layout of the code

- `src/lib/gsap.ts` — single GSAP/ScrollTrigger registration point. Import
  `{ gsap, ScrollTrigger }` from here everywhere.
- `src/components/SmoothScroll.tsx` — global Lenis provider; drives Lenis from
  GSAP's ticker and calls `ScrollTrigger.update` on scroll. Wraps the app.
- `src/components/three/Scene.tsx` — persistent full-viewport R3F `<Canvas>`,
  fixed behind the DOM. Per-section 3D camera/object moves hook in here.
- `src/components/three/PlaceholderObject.tsx` — Drei primitive standing in
  until real GLB assets arrive.
- `src/app/page.tsx` — section scaffold; each `<section>` becomes a real effect.

## Conventions

- Mark every customizable value with a `// EDIT:` comment.
- New scroll effects: drive from Lenis + ScrollTrigger; keep 3D in `Scene.tsx`.
- Placeholder content + Drei primitives until real assets are provided.

## Workflow for reference recordings

When the user shares a video of an effect:
1. Run the **analyze-video** skill (`.claude/skills/analyze-video/`) to extract
   frames (4–8 fps) and any transcript.
2. Restate the motion in technical terms (which tool/technique) and confirm
   before building.
3. Build that one section, then pause for comparison against the reference.
