#!/usr/bin/env node
// Screenshot a running page in specific states (scroll position, hover, etc.)
// so a change can be eyeballed without a manual browser.
//
// Usage:
//   node shoot.mjs --url <url> --out <file.png> [options]
//
// Options:
//   --url <url>        page to capture (default: http://localhost:3000)
//   --out <file>       output PNG path (default: shot.png)
//   --width <px>       viewport width (default: 1440)
//   --height <px>      viewport height (default: 900)
//   --wheel <px>       scroll down by N px via mouse wheel (drives Lenis/ScrollTrigger)
//   --hoverText <str>  hover the first element containing this text
//   --hover <sel>      hover this CSS selector
//   --click <sel>      click this CSS selector
//   --wait <ms>        extra settle time before the shot (default: 700)
//   --full             capture full scrollable page instead of viewport
//   --dark             emulate prefers-color-scheme: dark
//
// Requires Playwright + Chromium (npm i -D playwright && npx playwright install chromium).
import { chromium } from "playwright";

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = argv[i + 1];
  return next && !next.startsWith("--") ? next : true; // boolean flag
};

const url = arg("url", "http://localhost:3000");
const out = arg("out", "shot.png");
const width = parseInt(arg("width", "1440"), 10);
const height = parseInt(arg("height", "900"), 10);
const wheel = parseInt(arg("wheel", "0"), 10);
const hoverText = arg("hoverText", null);
const hoverSel = arg("hover", null);
const clickSel = arg("click", null);
const settle = parseInt(arg("wait", "700"), 10);
const full = arg("full", false) === true;
const dark = arg("dark", false) === true;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
  colorScheme: dark ? "dark" : "light",
});

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(400);

if (wheel) {
  await page.mouse.move(width / 2, height / 2);
  await page.mouse.wheel(0, wheel);
  await page.waitForTimeout(600); // let Lenis ease + ScrollTrigger settle
}
if (clickSel) await page.click(clickSel);
if (hoverSel) await page.hover(hoverSel);
if (hoverText) await page.getByText(hoverText, { exact: true }).first().hover();

await page.waitForTimeout(settle);
await page.screenshot({ path: out, fullPage: full });
await browser.close();
console.log(`saved ${out}`);
