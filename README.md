# Triptych Studios — Next.js

Cinematic studio homepage, rebuilt 1:1 from the design export as a pure Next.js
app (App Router + TypeScript). No HTML files — the whole site is React/TSX with
inline styles and one global stylesheet. Zero UI dependencies. Ready for Vercel.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # optimized production build
```

## Structure

```
app/
  layout.tsx     root layout + page metadata
  page.tsx       the homepage (single client component)
  globals.css    fonts, theme CSS variables (dark + light), hover styles
public/
  assets/
    triptych-logo.png   logo mark
    hero.jpg            hero poster (extracted from the export)
    avatar-1..3.jpg     "120+ projects" avatars
```

## What's on the page

- **Hero** — full-bleed looping rain video (`https://www.w3schools.com/howto/rain.mp4`)
  over the `hero.jpg` poster, live Chicago clock, social icons, centered logo tab
  with a drop-down menu, "120+ projects" block, and an auto-rotating accolades card.
- **Works** — 15 projects with a **List ⇄ Grid** toggle. List rows show a floating
  hover preview; grid tiles zoom on hover.
- **Side drawer + theme** — a left nav drawer and a dark/light theme system
  (`html.theme-light`, persisted in `localStorage` as `tv-theme`) are wired in,
  matching the export. Dark is the default.
- **Footer** — giant TRIPTYCH® wordmark, logo, and studio credit.

## Customize

- **Hero video** — swap the `HERO_VIDEO` URL in `app/page.tsx` (e.g. point it at a
  local `/public/hero.mp4`). The `hero.jpg` poster shows until the video plays.
- **Work items** — edit the `WORKS` array in `app/page.tsx`. Thumbnails currently
  load from `picsum.photos` via the `photo()` helper; point it at your own assets
  before launch.
- **Accolades** — edit the `ACCOLADES` array (auto-rotates every 3.5s).
- **Menu** — edit `MENU`. `Studio` and `Store` are placeholders (`#`) until those
  pages/routes exist.
- **Clock timezone** — `fmtTime()` uses `America/Chicago`.

## Notes

- `page.tsx` is a Client Component (`"use client"`) for the live clock, list/grid
  toggle, accolades carousel, hover preview, and drop-down menu.
- Placeholder Works imagery loads from `picsum.photos` over https; swap for owned
  assets before launch.
