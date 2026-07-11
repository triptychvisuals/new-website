---
name: screenshot
description: Capture screenshots of the running site in specific states (top of page, scrolled, hovering a nav item / element) using headless Chromium via Playwright. Use to visually verify a UI/animation change against a reference without a manual browser — e.g. navbar collapse, hover dropdowns, scroll states.
---

# screenshot

Take screenshots of the locally running app in chosen states so a change can be
compared against a reference recording.

## Prerequisites

- Dev server running: `npm run dev` (defaults to http://localhost:3000).
- Playwright + Chromium installed:
  ```bash
  npm i -D playwright
  npx playwright install chromium          # browser binary
  npx playwright install-deps chromium     # OS libs (run as root)
  ```
  If `install-deps` fails on broken third-party apt PPAs, disable them first:
  `mv /etc/apt/sources.list.d/*deadsnakes* *.disabled` then `apt-get update`.

## How to run

```bash
node .claude/skills/screenshot/scripts/shoot.mjs --url <url> --out <file.png> [options]
```

Key options (see the script header for the full list):

- `--wheel <px>` — scroll down by N px via the **mouse wheel** (goes through
  Lenis/ScrollTrigger, unlike `window.scrollTo`). Use this to trigger
  scroll-driven states like a collapsing navbar.
- `--hoverText "<label>"` — hover the first element with that text (e.g. a nav
  item) to open hover menus.
- `--hover "<css>"` / `--click "<css>"` — hover/click a selector.
- `--full` — full-page capture. `--dark` — emulate dark color scheme.
- `--width/--height`, `--wait <ms>` (settle time).

## Typical recipe (navbar verification)

```bash
node .../shoot.mjs --out top.png                         # expanded state
node .../shoot.mjs --wheel 600 --out collapsed.png       # collapsed pill
node .../shoot.mjs --hoverText "Work" --out megamenu.png # hover dropdown
```

Then **Read** the PNGs to compare against the reference frames in
`.video-analysis/`. Output PNGs are git-ignored.
