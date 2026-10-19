// -------------------------------------------------------------------------
// Haptic feedback for phones and tablets — short taps, never a buzz.
//
// Android (Chrome, Samsung Internet, Firefox): the Vibration API. Browsers
// only allow it once the visitor has tapped the page at least once — before
// that, calls are silently ignored, so nothing here can misfire.
//
// iPhone (Safari 18+): Safari has no Vibration API, but toggling a native
// switch control plays the system "tick". A hidden one is clicked for each
// pulse. iOS only honours it during a tap, so on iPhone the taps (theme
// switch, menu, buttons) tick and scroll-driven moments stay silent.
//
// Desktop / mouse: never fires.
// -------------------------------------------------------------------------

// EDIT: pulse lengths (ms). Kept to a few milliseconds so each one lands
// as a crisp tap, not a buzz (anything past ~15ms starts to feel like a
// vibration). A list is tap, pause, tap.
const PATTERNS = {
  tick: 4, // a detent — passing a point on the timeline
  tap: 6, // pressing a button
  bump: [5, 60, 5], // a double tap — something bigger arriving
} satisfies Record<string, number | number[]>;

export type Haptic = keyof typeof PATTERNS;

// Never more often than this (ms) — fast scrolling stays a clean tick-tick.
const MIN_GAP = 45;
let last = 0;
let iosSwitch: HTMLLabelElement | null = null;

const touchDevice = () =>
  typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

function iosTick() {
  if (!iosSwitch) {
    const label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    label.appendChild(input);
    document.body.appendChild(label);
    iosSwitch = label;
  }
  iosSwitch.click();
}

export function haptic(kind: Haptic = "tick") {
  if (!touchDevice()) return;
  const now = performance.now();
  if (now - last < MIN_GAP) return;
  last = now;
  try {
    if (typeof navigator.vibrate === "function") navigator.vibrate(PATTERNS[kind]);
    else iosTick();
  } catch {
    // unsupported — no feedback, nothing breaks
  }
}
