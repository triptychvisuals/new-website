"use client";

/**
 * A detailed 3D model of the stretch of Chicago round 211 W. Wacker Drive,
 * in Three.js (React Three Fiber), built from aerial views of the area:
 *
 * - the river sunk below the street behind seawalls, with the Riverwalk at
 *   water level, the Jetty's floating gardens, tour boats and water taxis
 *   moving on it and a barge moored at the bend
 * - Wacker Drive along the south bank turning south at the bend, with lane
 *   lines, crosswalks and traffic; Wells, Franklin, LaSalle and Lake too
 * - the bascule bridges with their stone bridgehouses; Wells St's double
 *   deck with the L on top; the L along Wells and Lake with trains running
 * - 333 W. Wacker's curved green glass on the bend; 225 W. Wacker's
 *   north–south barrel roof, four domed turrets and roof garden; 205 and
 *   211 W. Wacker; 222 N. LaSalle; the Merchandise Mart with its copper
 *   roofs; River Point, 150 N. Riverside, the Wolf Point towers, 300 N.
 *   LaSalle, and the dark glass towers with green roofs south of Lake
 * - everything else filled in from the street grid with seeded towers:
 *   setback crowns, rooftop plant, water tanks on the brick ones
 *
 * Facades are drawn on canvases, so nothing is downloaded. The camera turns
 * slowly round the address; rendering stops while the map is off screen;
 * phones skip shadows.
 *
 * Units are metres. x runs east, z runs south, y is up. Wells St's
 * centreline is x = 0 and the south building line of Wacker is z = 0.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// ── look ─────────────────────────────────────────────────────────────────
// EDIT: true = a white clay architectural model (the Blender look): every
// surface white in soft tones, windows as faint shading, soft sun shadows,
// the camera holding still while the traffic, boats and trains move.
// false = the full-colour night-and-day map below, slowly circling.
export const CLAY = true;
// EDIT: the clay tones
const CLAY_BG = "#f2f2f0"; // the sky / fog behind the model
const CLAY_WATER = "#d5dde0"; // the river
const CLAY_CARS = ["#f6f6f4", "#ecebe8", "#e0dfdc"];

// ── palette ──────────────────────────────────────────────────────────────
// EDIT: colours of the model
const BG = CLAY ? CLAY_BG : "#050505"; // page behind the map; the fog fades into it
const ASPHALT = "#2b2c2f";
const CONCRETE = "#8c8a84"; // sidewalks / block pads
const WALK = "#a59f93"; // riverwalk
const SEAWALL = "#6e6a62";
const ROOF = "#6b6c6e";
const WATER = "#24434b";
const STEEL = "#3a3e43"; // the L structure
const RUST = "#8a4a30"; // bridge trusses
const TREE = "#4d6b3d";
const LAWN = "#5d7f45";
const COPPER = "#5f9c8a"; // the Mart's verdigris roofs
const ACCENT = "#e5361f";

// ── the street grid (x of building lines / centrelines) ─────────────────
// EDIT: where the streets run. Wells = 0; Franklin to the west; the west
// leg of Wacker runs south along the river from the bend.
const FRANKLIN = -170;
const LASALLE = 125;
const CLARK = 260;
const WEST_LINE = -280; // building line of Wacker's west leg
const LAKE = 125; // Lake St centreline (z)
const RIVER_DROP = 5; // how far the water sits below the street

// ── the address ──────────────────────────────────────────────────────────
// EDIT: 211 W. Wacker's footprint and height (metres). It sits between
// 205 W. Wacker (Wells corner) and 225 W. Wacker (Franklin corner).
const TARGET = { x0: -110, x1: -62, z0: 0, z1: 56, h: 78 };
const TX = (TARGET.x0 + TARGET.x1) / 2;
const TZ = (TARGET.z0 + TARGET.z1) / 2;

/** Seeded random, so the city is the same on every visit. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Mat =
  | "stone"
  | "deco"
  | "granite"
  | "glass"
  | "glassDark"
  | "dark"
  | "white"
  | "brick"
  | "redbrick"
  | "mart"
  | "mech"
  | "greenroof"
  | "pad"
  | "walk"
  | "deck"
  | "steel";
type Box = { x0: number; x1: number; z0: number; z1: number; y0?: number; y1: number; m: Mat };
type Rect = { x0: number; x1: number; z0: number; z1: number };

const overlaps = (a: Rect, b: Rect) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;
const pick = <T,>(arr: T[], rnd: () => number) => arr[Math.floor(rnd() * arr.length)];

// ── facades ──────────────────────────────────────────────────────────────
type Draw = (g: CanvasRenderingContext2D, s: number, rnd: () => number) => void;

function grain(g: CanvasRenderingContext2D, s: number, rnd: () => number, n = 600, a = 0.06) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = `rgba(0,0,0,${rnd() * a})`;
    g.fillRect(rnd() * s, rnd() * s, 2 + rnd() * 8, 2 + rnd() * 8);
  }
}

/** Stone or brick wall with punched windows. */
function punched(base: string, glass: string[], bays: number, floors: number, wf: number, hf: number): Draw {
  return (g, s, rnd) => {
    g.fillStyle = base;
    g.fillRect(0, 0, s, s);
    grain(g, s, rnd);
    const bw = s / bays;
    const fh = s / floors;
    for (let i = 0; i < bays; i++) {
      for (let j = 0; j < floors; j++) {
        const w = bw * wf;
        const h = fh * hf;
        const x = i * bw + (bw - w) / 2;
        const y = j * fh + (fh - h) * 0.45;
        g.fillStyle = pick(glass, rnd);
        g.fillRect(x, y, w, h);
        g.fillStyle = "rgba(255,255,255,.08)";
        g.fillRect(x, y + h * 0.5, w, h * 0.5);
        g.fillStyle = "rgba(0,0,0,.3)";
        g.fillRect(x, y, w, Math.max(1, h * 0.1));
      }
    }
  };
}

/** 1920s limestone: tall piers between recessed window columns with dark spandrels. */
function piers(base: string, spandrel: string, glass: string[], bays: number, floors: number): Draw {
  return (g, s, rnd) => {
    g.fillStyle = base;
    g.fillRect(0, 0, s, s);
    grain(g, s, rnd, 500, 0.05);
    const bw = s / bays;
    const fh = s / floors;
    for (let i = 0; i < bays; i++) {
      const x = i * bw + bw * 0.24;
      const w = bw * 0.52;
      g.fillStyle = spandrel;
      g.fillRect(x, 0, w, s);
      for (let j = 0; j < floors; j++) {
        g.fillStyle = pick(glass, rnd);
        g.fillRect(x + 1, j * fh + fh * 0.12, w - 2, fh * 0.66);
      }
      // pier shading
      g.fillStyle = "rgba(0,0,0,.12)";
      g.fillRect(x - 3, 0, 3, s);
    }
  };
}

/** Glass curtain wall: panels in a few tints, mullions, spandrel bands. */
function curtain(panels: string[], mullion: string, cols: number, floors: number, band: number, bandColor: string, sheen = 0.1): Draw {
  return (g, s, rnd) => {
    const cw = s / cols;
    const fh = s / floors;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < floors; j++) {
        g.fillStyle = pick(panels, rnd);
        g.fillRect(i * cw, j * fh, cw, fh);
      }
    }
    const grad = g.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, `rgba(255,255,255,${sheen})`);
    grad.addColorStop(0.5, "rgba(255,255,255,0)");
    grad.addColorStop(1, `rgba(255,255,255,${sheen * 0.6})`);
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    g.fillStyle = bandColor;
    for (let j = 0; j < floors; j++) g.fillRect(0, j * fh, s, fh * band);
    g.fillStyle = mullion;
    for (let i = 0; i < cols; i++) g.fillRect(i * cw, 0, 2, s);
  };
}

// EDIT: each facade, and the size in metres of one repeat of it (w × h).
const FACADES: Record<string, { draw: Draw; w: number; h: number }> = {
  stone: { draw: punched("#c8bb9f", ["#2c333b", "#38414b", "#46525d", "#5a6875"], 4, 3, 0.48, 0.58), w: 12, h: 12 },
  deco: { draw: piers("#cfc2a4", "#5d574c", ["#2b3138", "#353d46", "#46515c"], 4, 3), w: 10, h: 12 },
  // 225 W. Wacker: grey granite with tall recessed bays of green-tinted glass
  granite: { draw: piers("#8f8e8a", "#3a4744", ["#2a3d3a", "#30443f", "#38504a"], 3, 3), w: 9, h: 12 },
  glass: { draw: curtain(["#4b6274", "#557083", "#5f7b8e", "#6a8798", "#455b6c"], "#26313a", 4, 3, 0.18, "rgba(25,33,40,.55)"), w: 12, h: 12 },
  glassDark: { draw: curtain(["#1f262c", "#242c33", "#2a333b", "#20282f"], "#121619", 4, 3, 0.12, "rgba(10,12,14,.6)", 0.14), w: 12, h: 12 },
  dark: { draw: curtain(["#2a3138", "#323a43", "#39434d", "#2f363e"], "#1b1f24", 4, 3, 0.3, "rgba(15,18,22,.7)"), w: 12, h: 12 },
  white: { draw: punched("#d6d5cf", ["#323a42", "#3b444d", "#2c333a"], 4, 3, 0.62, 0.5), w: 12, h: 12 },
  brick: { draw: punched("#8a6b58", ["#25292e", "#2f353b", "#3c444c"], 3, 3, 0.5, 0.6), w: 9, h: 12 },
  redbrick: { draw: punched("#7a4636", ["#22262b", "#2c3137", "#373e45"], 3, 3, 0.42, 0.6), w: 9, h: 12 },
  mart: { draw: piers("#bdb197", "#6a6252", ["#2f363e", "#3a434d", "#4a5560"], 5, 3), w: 12, h: 12 },
  green: { draw: curtain(["#3f5f58", "#46685f", "#4f7369", "#3b5952"], "#2b443e", 2, 3, 0.3, "rgba(32,52,46,.85)", 0.16), w: 10, h: 12 },
};

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function facadeTexture(key: string, aniso: number): THREE.CanvasTexture {
  const f = FACADES[key];
  const t = canvasTexture(256, 256, (g) => f.draw(g, 256, seeded(key.length * 97 + key.charCodeAt(0))));
  t.repeat.set(1 / f.w, 1 / f.h);
  t.anisotropy = aniso;
  return t;
}

/** Open steel truss for the bridges: a transparent canvas, drawn in rust. */
function trussTexture(): THREE.CanvasTexture {
  return canvasTexture(128, 64, (g) => {
    g.strokeStyle = "#fff";
    g.lineWidth = 6;
    g.strokeRect(3, 3, 122, 58);
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(0, 64);
    g.lineTo(64, 0);
    g.lineTo(128, 64);
    g.moveTo(64, 0);
    g.lineTo(64, 64);
    g.stroke();
  });
}

/** Soft ripples for the river's surface (a bump map that drifts). */
function rippleTexture(): THREE.CanvasTexture {
  const t = canvasTexture(256, 256, (g) => {
    const r = seeded(5);
    g.fillStyle = "#808080";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) {
      const v = 100 + Math.floor(r() * 80);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.beginPath();
      g.ellipse(r() * 256, r() * 256, 3 + r() * 14, 1 + r() * 2.5, 0, 0, Math.PI * 2);
      g.fill();
    }
  });
  t.colorSpace = THREE.NoColorSpace;
  t.repeat.set(1 / 60, 1 / 60);
  return t;
}

// ── geometry ─────────────────────────────────────────────────────────────
/**
 * Every box of one material as a single geometry: walls first (group 0),
 * then roofs (group 1). UVs are in metres, so the window grid lines up
 * across buildings and floors stay level on setbacks.
 */
function boxesGeometry(boxes: Box[]): THREE.BufferGeometry {
  const side: number[][] = [[], [], []]; // pos, normal, uv
  const top: number[][] = [[], [], []];
  const quad = (
    t: number[][],
    a: number[],
    b: number[],
    c: number[],
    d: number[],
    n: number[],
    ua: number[],
    ub: number[],
    uc: number[],
    ud: number[]
  ) => {
    for (const [p, u] of [[a, ua], [b, ub], [c, uc], [a, ua], [c, uc], [d, ud]]) {
      t[0].push(...p);
      t[1].push(...n);
      t[2].push(...u);
    }
  };
  for (const { x0, x1, z0, z1, y0 = 0, y1 } of boxes) {
    quad(side, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], [-z1, y0], [-z0, y0], [-z0, y1], [-z1, y1]);
    quad(side, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], [z0, y0], [z1, y0], [z1, y1], [z0, y1]);
    quad(side, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], [x0, y0], [x1, y0], [x1, y1], [x0, y1]);
    quad(side, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], [-x1, y0], [-x0, y0], [-x0, y1], [-x1, y1]);
    quad(top, [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0], [x0, -z1], [x1, -z1], [x1, -z0], [x0, -z0]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([...side[0], ...top[0]], 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute([...side[1], ...top[1]], 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute([...side[2], ...top[2]], 2));
  const n = side[0].length / 3;
  g.addGroup(0, n, 0);
  g.addGroup(n, top[0].length / 3, 1);
  return g;
}

// ── the river ────────────────────────────────────────────────────────────
// Shapes are drawn in (x, -z) and laid flat with rotateX(-π/2).
const P = (x: number, z: number) => [x, -z] as const;

/**
 * The water. EDIT: the outline — main branch north of Wacker, the bend
 * round 333 W. Wacker, the south branch heading south, the north branch
 * heading north past Wolf Point.
 */
function riverOutline(s: THREE.Path, southBank: number) {
  s.moveTo(...P(2000, southBank));
  if (southBank !== -40) {
    s.lineTo(...P(-180, southBank));
    s.lineTo(...P(-180, -40));
  } else s.lineTo(...P(-180, -40));
  s.quadraticCurveTo(...P(-320, -40), ...P(-320, 115));
  s.lineTo(...P(-320, 2000));
  s.lineTo(...P(-380, 2000));
  s.lineTo(...P(-380, -75));
  s.lineTo(...P(-388, -220));
  s.lineTo(...P(-408, -2000));
  s.lineTo(...P(-342, -2000));
  s.lineTo(...P(-328, -220));
  s.quadraticCurveTo(...P(-328, -110), ...P(-256, -110));
  s.lineTo(...P(2000, -110));
  s.closePath();
}
const waterShape = () => {
  const s = new THREE.Shape();
  riverOutline(s, -40);
  return s;
};
/** The cut in the street: the water plus the Riverwalk shelf along the south bank. */
const cutShape = () => {
  const s = new THREE.Shape();
  riverOutline(s, -32);
  return s;
};

// 333 W. Wacker: Franklin on the east, Lake on the south, the river curve.
function shape333(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(...P(FRANKLIN - 10, 2));
  s.quadraticCurveTo(...P(WEST_LINE, 2), ...P(WEST_LINE, 112));
  s.lineTo(...P(FRANKLIN - 16, 112));
  s.lineTo(...P(FRANKLIN - 16, 76));
  s.lineTo(...P(FRANKLIN - 22, 76));
  s.lineTo(...P(FRANKLIN - 22, 58));
  s.lineTo(...P(FRANKLIN - 10, 58));
  s.closePath();
  return s;
}

// ── the city ─────────────────────────────────────────────────────────────
type Extras = { tanks: [number, number, number][]; trees: [number, number, number][] };

/** Fill a block with seeded lots: towers, some with a setback crown, roof plant and tanks. */
function fillBlock(out: Box[], ex: Extras, r: Rect, lo: number, hi: number, rnd: () => number, avoid: Rect[] = []) {
  const cols = Math.max(1, Math.round((r.x1 - r.x0) / 46));
  const rows = Math.max(1, Math.round((r.z1 - r.z0) / 52));
  const lw = (r.x1 - r.x0) / cols;
  const ld = (r.z1 - r.z0) / rows;
  const mats: Mat[] = ["glass", "glass", "glassDark", "glassDark", "stone", "deco", "dark", "white", "brick", "redbrick", "granite"];
  for (let a = 0; a < cols; a++) {
    for (let b = 0; b < rows; b++) {
      if (rnd() < 0.06) continue; // the odd plaza
      const ix = 1.5 + rnd() * 4;
      const iz = 1.5 + rnd() * 4;
      const lot = { x0: r.x0 + a * lw + ix, x1: r.x0 + (a + 1) * lw - ix, z0: r.z0 + b * ld + iz, z1: r.z0 + (b + 1) * ld - iz };
      if (avoid.some((v) => overlaps(v, lot))) continue;
      const m = pick(mats, rnd);
      const old = m === "brick" || m === "redbrick" || m === "deco" || m === "stone";
      const cap = old ? Math.min(hi, 120) : hi;
      const h = Math.round((lo + Math.pow(rnd(), 1.7) * (cap - lo)) / 4) * 4;
      // podium + tower for the bigger modern lots
      if (!old && h > 90 && rnd() < 0.5) {
        out.push({ ...lot, y1: 18, m: "glassDark" });
        const t = { x0: lot.x0 + 4, x1: lot.x1 - 4, z0: lot.z0 + 4, z1: lot.z1 - 4 };
        out.push({ ...t, y0: 18, y1: h, m });
      } else out.push({ ...lot, y1: h, m });
      let top = h;
      if (h > 70 && rnd() < 0.5) {
        const sx = (lot.x1 - lot.x0) * (0.12 + rnd() * 0.16);
        const sz = (lot.z1 - lot.z0) * (0.12 + rnd() * 0.16);
        top = h + Math.round((h * (0.1 + rnd() * 0.25)) / 4) * 4;
        out.push({ x0: lot.x0 + sx, x1: lot.x1 - sx, z0: lot.z0 + sz, z1: lot.z1 - sz, y0: h, y1: top, m });
      }
      const cx = (lot.x0 + lot.x1) / 2;
      const cz = (lot.z0 + lot.z1) / 2;
      const w = lot.x1 - lot.x0;
      const d = lot.z1 - lot.z0;
      // roof plant: one or two boxes
      for (let k = 0; k < 1 + Math.floor(rnd() * 2); k++) {
        const ox = (rnd() - 0.5) * w * 0.4;
        const oz = (rnd() - 0.5) * d * 0.4;
        out.push({ x0: cx + ox - w * 0.12, x1: cx + ox + w * 0.12, z0: cz + oz - d * 0.1, z1: cz + oz + d * 0.1, y0: top, y1: top + 3 + rnd() * 4, m: "mech" });
      }
      if (old && top < 110 && rnd() < 0.6) ex.tanks.push([lot.x0 + 5 + rnd() * (w - 10), top, lot.z0 + 5 + rnd() * (d - 10)]);
      if (!old && rnd() < 0.25) out.push({ x0: lot.x0 + 3, x1: lot.x1 - 3, z0: lot.z0 + 3, z1: lot.z1 - 3, y0: h, y1: h + 0.4, m: "greenroof" });
    }
  }
}

type City = Extras & {
  boxes: Box[];
  trusses: { x: number; z: number; len: number; rotY: number }[];
  copper: { x: number; y: number; z: number; r: number; h: number }[];
};

function buildCity(): City {
  const rnd = seeded(211);
  const boxes: Box[] = [];
  const ex: Extras = { tanks: [], trees: [] };
  const copper: City["copper"] = [];
  const pad = (x0: number, x1: number, z0: number, z1: number, m: Mat = "pad") => boxes.push({ x0, x1, z0, z1, y1: 0.3, m });
  const add = (x0: number, x1: number, z0: number, z1: number, y1: number, m: Mat, y0 = 0) => boxes.push({ x0, x1, z0, z1, y0, y1, m });

  // EDIT: blocks — x and z of the building lines.
  const COLS: [number, number][] = [[WEST_LINE, FRANKLIN - 10], [FRANKLIN + 10, -12], [12, LASALLE - 12], [LASALLE + 12, CLARK - 12], [CLARK + 12, 420], [444, 560]];
  const ROWS: [number, number][] = [[0, LAKE - 10], [LAKE + 10, 280], [300, 445], [465, 610], [630, 760]];

  // ── the address's block: Wells → Franklin, Wacker → Lake ──
  pad(FRANKLIN + 10, -12, 0, LAKE - 10);
  add(-62, -12, 0, 64, 84, "deco"); // 205 W. Wacker (Wells corner)
  add(-56, -18, 6, 54, 90, "mech", 84);
  add(-44, -30, 14, 30, 95, "mech", 90);
  add(-160, -110, 0, 82, 106, "granite"); // 225 W. Wacker (roof, turrets below)
  add(-160, -110, 86, 113, 16, "redbrick"); // low buildings behind
  add(-110, -62, 60, 113, 24, "brick");
  add(-104, -76, 66, 96, 30, "mech", 24);
  add(-58, -14, 68, 113, 128, "glassDark"); // tower behind 205
  add(-52, -20, 74, 107, 128.4, "greenroof", 128);
  ex.tanks.push([-80, 24, 104], [-140, 16, 100]);

  // ── Wells → LaSalle: 222 N. LaSalle across the Wacker frontage ──
  pad(12, LASALLE - 12, 0, LAKE - 10);
  add(14, 113, 0, 74, 88, "deco"); // 222 N. LaSalle
  add(22, 105, 8, 66, 98, "deco", 88);
  add(44, 84, 22, 52, 104, "mech", 98);
  add(14, 34, 80, 113, 72, "redbrick");
  add(38, 76, 80, 113, 140, "glassDark");
  add(44, 70, 86, 107, 146, "mech", 140);
  add(80, 113, 80, 113, 112, "deco");
  add(86, 107, 86, 107, 120, "deco", 112);
  ex.tanks.push([24, 72, 96]);

  // ── south of Lake: the dark glass towers with green roofs, Randolph Tower ──
  const ey = { x0: WEST_LINE + 4, x1: FRANKLIN - 16, z0: LAKE + 14, z1: 228 };
  const franklin151 = { x0: FRANKLIN + 14, x1: -96, z0: LAKE + 14, z1: 222 };
  const randolphTower = { x0: -50, x1: -14, z0: 302, z1: 346 };
  add(ey.x0, ey.x1, ey.z0, ey.z1, 160, "glassDark");
  add(ey.x0 + 4, ey.x1 - 4, ey.z0 + 4, ey.z1 - 4, 160.5, "greenroof", 160);
  add(ey.x0 + 20, ey.x1 - 30, ey.z0 + 20, ey.z0 + 50, 168, "glassDark", 160);
  add(franklin151.x0, franklin151.x1, franklin151.z0, franklin151.z1, 150, "glassDark");
  add(franklin151.x0 + 3, franklin151.x1 - 3, franklin151.z0 + 3, franklin151.z1 - 3, 150.5, "greenroof", 150);
  add(franklin151.x0 + 16, franklin151.x0 + 40, franklin151.z0 + 20, franklin151.z0 + 50, 158, "mech", 150);
  add(randolphTower.x0, randolphTower.x1, randolphTower.z0, randolphTower.z1, 112, "deco");
  add(-44, -20, 308, 340, 135, "deco", 112);
  add(-38, -26, 316, 332, 146, "deco", 135);

  // ── the rest of the Loop, seeded ──
  for (const [x0, x1] of COLS) {
    for (const [z0, z1] of ROWS) {
      if (z0 === 0 && x0 < LASALLE) continue; // the blocks above, and 333 W. Wacker's (its own pad)
      pad(x0, x1, z0, z1);
      const near = Math.hypot((x0 + x1) / 2 - TX, (z0 + z1) / 2 - TZ);
      // EDIT: tallest seeded tower — kept lower right by the address so it stays in view
      fillBlock(boxes, ex, { x0, x1, z0, z1 }, 30, near < 260 ? 105 : near < 420 ? 170 : 140, rnd, [ey, franklin151, randolphTower]);
    }
  }

  // ── west of the south branch: River Point, its park, 150 N. Riverside ──
  const riverPoint = { x0: -476, x1: -410, z0: 30, z1: 112 };
  const riverside150 = { x0: -450, x1: -412, z0: 300, z1: 372 };
  const park = { x0: -476, x1: -386, z0: -60, z1: 26 };
  add(riverPoint.x0, riverPoint.x1, riverPoint.z0, riverPoint.z1, 222, "glass");
  add(riverPoint.x0 + 10, riverPoint.x1 - 10, riverPoint.z0 + 12, riverPoint.z1 - 12, 230, "mech", 222);
  add(riverside150.x0, riverside150.x1, riverside150.z0, riverside150.z1, 229, "glass");
  add(riverside150.x0 + 6, riverside150.x1 - 6, riverside150.z0 + 8, riverside150.z1 - 8, 236, "mech", 229);
  for (const [z0, z1] of [[-60, LAKE - 10], ...ROWS.slice(1)] as [number, number][]) {
    pad(-660, -386, z0, z1);
    fillBlock(boxes, ex, { x0: -660, x1: -412, z0, z1 }, 30, 160, rnd, [riverPoint, riverside150, park]);
  }
  for (let z = -40; z < 700; z += 14) ex.trees.push([-394, 0.3, z]);
  for (let i = 0; i < 26; i++) ex.trees.push([park.x0 + 6 + rnd() * (park.x1 - park.x0 - 12), 0.3, park.z0 + 6 + rnd() * (park.z1 - park.z0 - 12)]);

  // ── Wolf Point: three towers on the point ──
  pad(-800, -412, -800, -80);
  add(-460, -414, -150, -100, 250, "glass"); // Wolf Point South
  add(-452, -422, -144, -106, 258, "mech", 250);
  add(-455, -416, -262, -214, 205, "dark"); // Wolf Point East
  add(-520, -480, -236, -190, 150, "glass"); // Wolf Point West
  for (let i = 0; i < 20; i++) ex.trees.push([-412 - rnd() * 60, 0.3, -90 - rnd() * 200]);
  fillBlock(boxes, ex, { x0: -700, x1: -540, z0: -440, z1: -100 }, 20, 90, rnd);

  // ── north of the main branch: the Merchandise Mart, then River North ──
  pad(-316, FRANKLIN - 12, -232, -118);
  pad(FRANKLIN + 12, -12, -232, -118);
  add(-158, -15, -228, -124, 72, "mart"); // The Mart
  add(-153, -20, -222, -130, 78, "mart", 72);
  for (const x of [-158, -33]) {
    add(x, x + 18, -142, -124, 86, "mart"); // corner towers on the river front
    copper.push({ x: x + 9, y: 86, z: -133, r: 12.7, h: 9 });
  }
  add(-115, -65, -205, -147, 104, "mart"); // central tower
  copper.push({ x: -90, y: 104, z: -176, r: 35, h: 13 });
  fillBlock(boxes, ex, { x0: -316, x1: FRANKLIN - 14, z0: -232, z1: -124 }, 20, 70, rnd);
  const lasalle300 = { x0: 142, x1: 200, z0: -214, z1: -130 };
  add(lasalle300.x0, lasalle300.x1, lasalle300.z0, lasalle300.z1, 228, "glass"); // 300 N. LaSalle
  add(lasalle300.x0 + 6, lasalle300.x1 - 6, lasalle300.z0 + 8, lasalle300.z1 - 8, 239, "glass", 228);
  for (const [x0, x1] of [[12, LASALLE - 12], [LASALLE + 12, CLARK - 12], [CLARK + 12, 420], [444, 560]] as [number, number][]) {
    pad(x0, x1, -232, -118);
    fillBlock(boxes, ex, { x0, x1, z0: -232, z1: -118 }, 24, 130, rnd, [lasalle300]);
  }
  for (const [z0, z1] of [[-400, -252], [-560, -420]] as [number, number][]) {
    for (const [x0, x1] of [[-316, FRANKLIN - 12], [FRANKLIN + 10, -12], [12, LASALLE - 12], [LASALLE + 12, CLARK - 12], [CLARK + 12, 420]] as [number, number][]) {
      pad(x0, x1, z0, z1);
      fillBlock(boxes, ex, { x0, x1, z0, z1 }, 20, 110, rnd);
    }
  }

  // ── riverwalks: the south one down at the water, the north at the street ──
  add(-176, 2000, -40, -32, -RIVER_DROP + 1.8, "walk", -RIVER_DROP - 1);
  pad(-256, 2000, -118, -110, "walk");
  for (let x = -170; x < 700; x += 12) {
    if ([0, FRANKLIN, LASALLE, CLARK].some((b) => Math.abs(x - b) < 16)) continue;
    ex.trees.push([x, -RIVER_DROP + 1.8, -35]);
  }
  for (let x = -240; x < 700; x += 16) {
    if ([0, FRANKLIN, LASALLE, CLARK].some((b) => Math.abs(x - b) < 16)) continue;
    ex.trees.push([x, 0.3, -114]);
  }
  // trees on Wacker's south sidewalk and the west leg's median
  for (let x = -170; x < 600; x += 18) if (![0, FRANKLIN, LASALLE, CLARK].some((b) => Math.abs(x - b) < 20)) ex.trees.push([x, 0, -3]);
  for (let z = 130; z < 760; z += 16) ex.trees.push([WEST_LINE - 16, 0, z]);

  // ── bridges: decks, railings, bridgehouses ──
  const trusses: City["trusses"] = [];
  for (const x of [0, FRANKLIN, LASALLE, CLARK]) {
    const w = x === 0 ? 11 : 10;
    add(x - w, x + w, -114, -30, 0.3, "deck", -1.8);
    add(x - w, x - w + 0.6, -114, -30, 1.5, "deck", 0.3);
    add(x + w - 0.6, x + w, -114, -30, 1.5, "deck", 0.3);
    for (const sx of [-1, 1]) {
      const bx = x + sx * (w + 4);
      add(bx - 3.5, bx + 3.5, -40, -33, 9, "stone", -RIVER_DROP - 1); // bridgehouses, up from the water
      add(bx - 2.5, bx + 2.5, -39, -34, 11, "mech", 9);
      add(bx - 3.5, bx + 3.5, -117, -110, 9, "stone");
      add(bx - 2.5, bx + 2.5, -116, -111, 11, "mech", 9);
    }
  }
  trusses.push({ x: -11, z: -72, len: 80, rotY: Math.PI / 2 }, { x: 11, z: -72, len: 80, rotY: Math.PI / 2 });
  for (const z of [LAKE, 290, 455]) add(-390, -314, z - 10, z + 10, 0.3, "deck", -1.8);
  trusses.push({ x: -352, z: LAKE - 10, len: 72, rotY: 0 }, { x: -352, z: LAKE + 10, len: 72, rotY: 0 });
  add(-396, -322, -252, -232, 0.3, "deck", -1.8); // Kinzie

  // ── the L: Wells (north across the bridge) and Lake ──
  add(-5, 5, -760, 760, 10.4, "steel", 9);
  add(-760, 760, LAKE - 5, LAKE + 5, 10.4, "steel", 9);
  for (let z = -748; z <= 748; z += 24) {
    if (z > -118 && z < -28) continue;
    for (const x of [-4, 4]) add(x - 0.5, x + 0.5, z - 0.5, z + 0.5, 9, "steel");
  }
  for (let x = -748; x <= 748; x += 24) {
    if (x > -392 && x < -312) continue;
    if (Math.abs(x) < 8) continue;
    for (const z of [LAKE - 4, LAKE + 4]) add(x - 0.5, x + 0.5, z - 0.5, z + 0.5, 9, "steel");
  }

  return { boxes, trusses, copper, ...ex };
}

// ── materials ────────────────────────────────────────────────────────────
// Built once per renderer and shared by every piece of the scene.
const MATERIALS = new WeakMap<THREE.WebGLRenderer, ReturnType<typeof makeMaterials>>();
function useMaterials() {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    let m = MATERIALS.get(gl);
    if (!m) MATERIALS.set(gl, (m = makeMaterials(gl)));
    return m;
  }, [gl]);
}

function makeMaterials(gl: THREE.WebGLRenderer) {
  {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    const roof = new THREE.MeshStandardMaterial({ color: ROOF, roughness: 0.95 });
    const wall = (k: string, rough = 0.85, metal = 0) =>
      new THREE.MeshStandardMaterial({ map: facadeTexture(k, aniso), roughness: rough, metalness: metal });
    const flat = (c: string, rough = 0.95) => {
      const m = new THREE.MeshStandardMaterial({ color: c, roughness: rough });
      return [m, m];
    };
    const mats: Record<Mat, THREE.Material[]> = {
      stone: [wall("stone"), roof],
      deco: [wall("deco"), roof],
      granite: [wall("granite"), roof],
      glass: [wall("glass", 0.3, 0.3), roof],
      glassDark: [wall("glassDark", 0.25, 0.35), roof],
      dark: [wall("dark", 0.35, 0.25), roof],
      white: [wall("white"), roof],
      brick: [wall("brick"), roof],
      redbrick: [wall("redbrick"), roof],
      mart: [wall("mart"), roof],
      mech: flat("#7a7b7d"),
      greenroof: flat(LAWN),
      pad: flat(CONCRETE),
      walk: flat(WALK),
      deck: flat("#4b4d51", 0.8),
      steel: flat(STEEL, 0.7),
    };
    const green = wall("green", 0.25, 0.3);
    const granitePlain = new THREE.MeshStandardMaterial({ color: "#8a8985", roughness: 0.8 });
    const target = new THREE.MeshStandardMaterial({
      map: facadeTexture("deco", aniso),
      color: "#ff7b66",
      emissive: ACCENT,
      emissiveIntensity: 0.18,
      roughness: 0.8,
    });
    return { mats, roof, green, granitePlain, target };
  }
}

// ── scene pieces ─────────────────────────────────────────────────────────
/** The street (with the river cut out), the seawalls, and the water. */
function Ground({ shadows }: { shadows: boolean }) {
  const ripple = useMemo(() => rippleTexture(), []);
  const { street, wall, water } = useMemo(() => {
    const outer = new THREE.Shape();
    const S = 3200;
    outer.moveTo(TX - S, -(TZ - S));
    outer.lineTo(TX + S, -(TZ - S));
    outer.lineTo(TX + S, -(TZ + S));
    outer.lineTo(TX - S, -(TZ + S));
    outer.closePath();
    const cut = cutShape();
    outer.holes.push(cut);
    const street = new THREE.ShapeGeometry(outer, 24);
    street.rotateX(-Math.PI / 2);
    // seawall: a vertical strip down the cut's edge
    const pts = cut.getPoints(24);
    const pos: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const [ax, az, bx, bz] = [a.x, -a.y, b.x, -b.y];
      const lo = -RIVER_DROP - 1;
      pos.push(ax, 0, az, bx, 0, bz, bx, lo, bz, ax, 0, az, bx, lo, bz, ax, lo, az);
    }
    const wall = new THREE.BufferGeometry();
    wall.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    wall.computeVertexNormals();
    const water = new THREE.ShapeGeometry(waterShape(), 24);
    water.rotateX(-Math.PI / 2);
    // world-metre UVs so the ripples tile evenly
    const p = water.getAttribute("position");
    const uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) {
      uv[i * 2] = p.getX(i);
      uv[i * 2 + 1] = p.getZ(i);
    }
    water.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return { street, wall, water };
  }, []);
  useFrame(({ clock }) => {
    ripple.offset.set(clock.getElapsedTime() * 0.004, clock.getElapsedTime() * 0.0015);
  });
  return (
    <group>
      <mesh geometry={street} receiveShadow={shadows}>
        <meshStandardMaterial color={ASPHALT} roughness={1} />
      </mesh>
      <mesh geometry={wall} receiveShadow={shadows}>
        <meshStandardMaterial color={SEAWALL} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={water} position-y={-RIVER_DROP} receiveShadow={shadows}>
        <meshStandardMaterial color={WATER} roughness={0.22} metalness={0.2} bumpMap={ripple} bumpScale={0.6} />
      </mesh>
      {/* the Jetty's floating gardens along the Riverwalk */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-140 + i * 19, -RIVER_DROP + 0.3, -43]} receiveShadow={shadows}>
          <boxGeometry args={[15, 0.7, 4]} />
          <meshStandardMaterial color={LAWN} roughness={1} />
        </mesh>
      ))}
      {/* River Point's round lawn on the west bank */}
      <mesh rotation-x={-Math.PI / 2} position={[-432, 0.35, -18]} receiveShadow={shadows}>
        <circleGeometry args={[24, 40]} />
        <meshStandardMaterial color={LAWN} roughness={1} />
      </mesh>
    </group>
  );
}

function City({ shadows }: { shadows: boolean }) {
  const city = useMemo(() => buildCity(), []);
  const { mats, roof, green, granitePlain } = useMaterials();
  const groups = useMemo(() => {
    const by = new Map<Mat, Box[]>();
    for (const b of city.boxes) by.set(b.m, [...(by.get(b.m) ?? []), b]);
    return [...by.entries()].map(([m, list]) => ({ m, geo: boxesGeometry(list) }));
  }, [city]);
  const b333 = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape333(), { depth: 149, bevelEnabled: false, curveSegments: 32 });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const pad333 = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape333(), { depth: 0.3, bevelEnabled: false, curveSegments: 32 });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const crown333 = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape333(), { depth: 1.5, bevelEnabled: false, curveSegments: 32 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 149, 0);
    return g;
  }, []);
  const truss = useMemo(() => trussTexture(), []);
  const trees = useRef<THREE.InstancedMesh>(null);
  const tanks = useRef<THREE.InstancedMesh>(null);
  const tankRoofs = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const o = new THREE.Object3D();
    const r = seeded(7);
    const t = trees.current;
    if (t) {
      city.trees.forEach(([x, y, z], i) => {
        const s = 0.75 + r() * 0.5;
        o.position.set(x, y + 4.2 * s, z);
        o.scale.set(s, s * 1.1, s);
        o.rotation.set(0, r() * Math.PI, 0);
        o.updateMatrix();
        t.setMatrixAt(i, o.matrix);
      });
      t.instanceMatrix.needsUpdate = true;
    }
    o.rotation.set(0, 0, 0);
    o.scale.set(1, 1, 1);
    for (const [ref, dy] of [[tanks, 3.5], [tankRoofs, 6.2]] as const) {
      const m = ref.current;
      if (!m) continue;
      city.tanks.forEach(([x, y, z], i) => {
        o.position.set(x, y + dy, z);
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    }
  }, [city]);

  return (
    <group>
      {groups.map(({ m, geo }) => (
        <mesh key={m} geometry={geo} material={mats[m]} castShadow={shadows && m !== "pad" && m !== "walk" && m !== "greenroof"} receiveShadow={shadows} />
      ))}

      {/* 333 W. Wacker — the curved green glass on the bend */}
      <mesh geometry={pad333} material={mats.pad} receiveShadow={shadows} />
      <mesh geometry={b333} material={[roof, green]} castShadow={shadows} receiveShadow={shadows} />
      <mesh geometry={crown333} material={[roof, granitePlain]} />
      <mesh position={[FRANKLIN - 40, 152, 86]} castShadow={shadows}>
        <boxGeometry args={[26, 6, 22]} />
        <meshStandardMaterial color="#7a7b7d" roughness={0.9} />
      </mesh>

      {/* 225 W. Wacker — a north–south barrel vault, a roof garden, four domed turrets */}
      <mesh position={[-135, 106, 41]} rotation-x={Math.PI / 2} castShadow={shadows}>
        <cylinderGeometry args={[15, 15, 64, 28, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#77797b" roughness={0.55} metalness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-115, 106.3, 41]}>
        <boxGeometry args={[6, 0.6, 60]} />
        <meshStandardMaterial color={LAWN} roughness={1} />
      </mesh>
      {[-156, -114].flatMap((x) =>
        [4, 78].map((z) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <mesh position-y={113} material={granitePlain} castShadow={shadows}>
              <cylinderGeometry args={[4.6, 4.6, 14, 16]} />
            </mesh>
            <mesh position-y={120} material={granitePlain} castShadow={shadows}>
              <sphereGeometry args={[4.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            <mesh position-y={128}>
              <coneGeometry args={[0.7, 9, 8]} />
              <meshStandardMaterial color="#9a9a96" roughness={0.6} />
            </mesh>
          </group>
        ))
      )}

      {/* the Mart's copper roofs */}
      {city.copper.map((c, i) => (
        <mesh key={i} position={[c.x, c.y + c.h / 2, c.z]} rotation-y={Math.PI / 4} castShadow={shadows}>
          <coneGeometry args={[c.r, c.h, 4]} />
          <meshStandardMaterial color={COPPER} roughness={0.7} flatShading />
        </mesh>
      ))}

      {/* bridge trusses (Wells, Lake) */}
      {city.trusses.map((t, i) => (
        <mesh key={i} position={[t.x, 5.2, t.z]} rotation-y={t.rotY}>
          <planeGeometry args={[t.len, 9.5]} />
          <meshStandardMaterial map={truss} map-repeat={[Math.round(t.len / 13), 1]} color={RUST} alphaTest={0.5} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
      ))}

      <instancedMesh ref={trees} args={[undefined, undefined, city.trees.length]} castShadow={shadows}>
        <icosahedronGeometry args={[3.2, 0]} />
        <meshStandardMaterial color={TREE} roughness={1} flatShading />
      </instancedMesh>
      {/* water tanks on the old brick roofs */}
      <instancedMesh ref={tanks} args={[undefined, undefined, city.tanks.length]} castShadow={shadows}>
        <cylinderGeometry args={[2.6, 2.6, 4.2, 12]} />
        <meshStandardMaterial color="#6a5446" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={tankRoofs} args={[undefined, undefined, city.tanks.length]}>
        <coneGeometry args={[2.9, 1.8, 12]} />
        <meshStandardMaterial color="#4a4038" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

// ── street markings ──────────────────────────────────────────────────────
type Mark = { x: number; z: number; w: number; d: number; c: 0 | 1 }; // c: 0 white, 1 yellow

function buildMarkings(): Mark[] {
  const m: Mark[] = [];
  const dashesX = (z: number, xa: number, xb: number) => {
    for (let x = xa; x < xb; x += 9) m.push({ x, z, w: 3.5, d: 0.25, c: 0 });
  };
  const dashesZ = (x: number, za: number, zb: number) => {
    for (let z = za; z < zb; z += 9) m.push({ x, z, w: 0.25, d: 3.5, c: 0 });
  };
  const gaps = (v: number, list: number[], r = 18) => list.some((b) => Math.abs(v - b) < r);
  // Wacker, east of the bend: lane lines and the yellow centre line
  for (const z of [-8, -24]) {
    for (let x = FRANKLIN; x < 760; x += 9) if (!gaps(x, [0, FRANKLIN, LASALLE, CLARK])) m.push({ x, z, w: 3.5, d: 0.25, c: 0 });
  }
  for (let x = FRANKLIN + 14; x < 760; x += 40) if (!gaps(x, [0, LASALLE, CLARK], 30)) m.push({ x, z: -16, w: 36, d: 0.5, c: 1 });
  // Wacker's west leg
  dashesZ(WEST_LINE - 8, 130, 760);
  dashesZ(WEST_LINE - 24, 130, 760);
  // the cross streets
  for (const x of [0, FRANKLIN, LASALLE]) {
    dashesZ(x - 4, 10, 112);
    dashesZ(x + 4, 10, 112);
    dashesZ(x - 4, 140, 760);
    dashesZ(x + 4, 140, 760);
  }
  dashesX(LAKE, -300, 760);
  dashesX(290, -300, 760);
  // crosswalks: zebra stripes across each street at the corners
  const zebraAcrossX = (cx: number, z: number, half: number) => {
    for (let x = cx - half + 1; x < cx + half; x += 1.6) m.push({ x, z, w: 0.8, d: 4, c: 0 });
  };
  const zebraAcrossZ = (x: number, cz: number, half: number) => {
    for (let z = cz - half + 1; z < cz + half; z += 1.6) m.push({ x, z, w: 4, d: 0.8, c: 0 });
  };
  for (const x of [0, FRANKLIN, LASALLE]) {
    zebraAcrossX(x, 4, 10); // across the street at Wacker's south side
    zebraAcrossZ(x - 15, -16, 15); // across Wacker
    zebraAcrossZ(x + 15, -16, 15);
    zebraAcrossX(x, LAKE - 13, 10);
    zebraAcrossX(x, LAKE + 13, 10);
  }
  return m;
}

function Markings() {
  const marks = useMemo(() => buildMarkings(), []);
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const white = new THREE.Color("#d9d9d4");
    const yellow = new THREE.Color("#d8b13a");
    marks.forEach((k, i) => {
      o.position.set(k.x, 0.06, k.z);
      o.rotation.set(-Math.PI / 2, 0, 0);
      o.scale.set(k.w, k.d, 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, k.c ? yellow : white);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [marks]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, marks.length]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.75} />
    </instancedMesh>
  );
}

// ── traffic ──────────────────────────────────────────────────────────────
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** A Wacker lane `d` metres off the building line: east of the bend, round it, then south. */
function wackerLane(d: number) {
  const p = new THREE.CurvePath<THREE.Vector3>();
  p.add(new THREE.LineCurve3(V(900, 0, -d), V(FRANKLIN - 10, 0, -d)));
  p.add(new THREE.QuadraticBezierCurve3(V(FRANKLIN - 10, 0, -d), V(WEST_LINE - d, 0, -d), V(WEST_LINE - d, 0, 112)));
  p.add(new THREE.LineCurve3(V(WEST_LINE - d, 0, 112), V(WEST_LINE - d, 0, 900)));
  return p;
}
const straight = (a: THREE.Vector3, b: THREE.Vector3) => {
  const p = new THREE.CurvePath<THREE.Vector3>();
  p.add(new THREE.LineCurve3(a, b));
  return p;
};

type Lane = { path: THREE.CurvePath<THREE.Vector3>; dir: 1 | -1; n: number; speed: number };

function Traffic() {
  // EDIT: lanes — which way they run, how many cars, how fast (m/s)
  const lanes = useMemo<Lane[]>(
    () => [
      { path: wackerLane(5), dir: 1, n: 14, speed: 11 },
      { path: wackerLane(11), dir: 1, n: 12, speed: 13 },
      { path: wackerLane(21), dir: -1, n: 12, speed: 12 },
      { path: wackerLane(27), dir: -1, n: 14, speed: 10 },
      { path: straight(V(-8, 0, -900), V(-8, 0, 900)), dir: 1, n: 10, speed: 10 }, // Wells, southbound
      { path: straight(V(8, 0, -900), V(8, 0, 900)), dir: 1, n: 10, speed: 9 },
      { path: straight(V(FRANKLIN - 5, 0, -900), V(FRANKLIN - 5, 0, 900)), dir: -1, n: 9, speed: 10 }, // Franklin, northbound
      { path: straight(V(FRANKLIN + 5, 0, -900), V(FRANKLIN + 5, 0, 900)), dir: -1, n: 9, speed: 11 },
      { path: straight(V(LASALLE - 5, 0, -900), V(LASALLE - 5, 0, 900)), dir: 1, n: 9, speed: 10 },
      { path: straight(V(LASALLE + 5, 0, -900), V(LASALLE + 5, 0, 900)), dir: -1, n: 9, speed: 10 },
      { path: straight(V(-900, 0, LAKE - 7), V(900, 0, LAKE - 7)), dir: -1, n: 10, speed: 9 },
      { path: straight(V(-900, 0, LAKE + 7), V(900, 0, LAKE + 7)), dir: 1, n: 10, speed: 9 },
      { path: straight(V(-900, 0, 286), V(900, 0, 286)), dir: 1, n: 8, speed: 10 },
      { path: straight(V(-900, 0, 294), V(900, 0, 294)), dir: -1, n: 8, speed: 10 },
    ],
    []
  );
  const cars = useMemo(() => {
    const r = seeded(33);
    return lanes.flatMap((lane) => {
      const len = lane.path.getLength();
      return Array.from({ length: lane.n }, (_, i) => ({ lane, len, u0: (i + r() * 0.6) / lane.n, v: lane.speed * (0.85 + r() * 0.3) }));
    });
  }, [lanes]);
  const geo = useMemo(() => {
    const body = new THREE.BoxGeometry(4.5, 0.95, 1.9);
    body.translate(0, 0.75, 0);
    const cabin = new THREE.BoxGeometry(2.5, 0.7, 1.7);
    cabin.translate(-0.3, 1.55, 0);
    return mergeGeometries([body, cabin])!;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => ({ o: new THREE.Object3D(), p: new THREE.Vector3(), t: new THREE.Vector3() }), []);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const r = seeded(9);
    // EDIT: car colours
    const palette = (CLAY ? CLAY_CARS : ["#e9e9e6", "#e9e9e6", "#1c1d20", "#1c1d20", "#5c6066", "#8d9196", "#7d1f1f", "#1f3a66", "#b9b2a4"]).map((c) => new THREE.Color(c));
    cars.forEach((_, i) => m.setColorAt(i, pick(palette, r)));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [cars]);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const time = clock.getElapsedTime();
    const { o, p, t } = tmp;
    cars.forEach((c, i) => {
      let u = (c.u0 + (time * c.v) / c.len) % 1;
      if (c.lane.dir < 0) u = 1 - u;
      c.lane.path.getPointAt(u, p);
      c.lane.path.getTangentAt(u, t);
      if (c.lane.dir < 0) t.negate();
      o.position.copy(p);
      o.rotation.set(0, Math.atan2(-t.z, t.x), 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, undefined, cars.length]} castShadow>
      <meshStandardMaterial roughness={0.35} metalness={0.4} />
    </instancedMesh>
  );
}

// ── boats ────────────────────────────────────────────────────────────────
/** Down the main branch, round the bend and south — the tour boats' route. */
function riverRoute() {
  const y = -RIVER_DROP;
  const p = new THREE.CurvePath<THREE.Vector3>();
  p.add(new THREE.LineCurve3(V(900, y, -72), V(-250, y, -72)));
  p.add(new THREE.QuadraticBezierCurve3(V(-250, y, -72), V(-352, y, -72), V(-352, y, 40)));
  p.add(new THREE.LineCurve3(V(-352, y, 40), V(-352, y, 900)));
  return p;
}

function Boat({ color, stripe, length, speed, offset, reverse, lane }: { color: string; stripe: string; length: number; speed: number; offset: number; reverse?: boolean; lane: number }) {
  const ref = useRef<THREE.Group>(null);
  const route = useMemo(() => riverRoute(), []);
  const len = useMemo(() => route.getLength(), [route]);
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), t: new THREE.Vector3() }), []);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    let u = (offset + (clock.getElapsedTime() * speed) / len) % 1;
    if (reverse) u = 1 - u;
    route.getPointAt(u, tmp.p);
    route.getTangentAt(u, tmp.t);
    if (reverse) tmp.t.negate();
    // keep to its side of the channel
    g.position.set(tmp.p.x - tmp.t.z * lane, tmp.p.y, tmp.p.z + tmp.t.x * lane);
    g.rotation.y = Math.atan2(-tmp.t.z, tmp.t.x);
  });
  return (
    <group ref={ref}>
      <mesh position-y={0.6} castShadow>
        <boxGeometry args={[length, 1.6, length * 0.24]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[-length * 0.05, 1.8, 0]}>
        <boxGeometry args={[length * 0.62, 1.1, length * 0.2]} />
        <meshStandardMaterial color={stripe} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Boats() {
  // EDIT: the boats — colour, length (m), speed (m/s)
  return (
    <>
      <Boat color="#f2c230" stripe="#1d1d1d" length={16} speed={7} offset={0} lane={8} />
      <Boat color="#eef1f3" stripe="#24476b" length={30} speed={5} offset={0.45} reverse lane={9} />
      <Boat color="#eef1f3" stripe="#6b2424" length={26} speed={5.5} offset={0.8} lane={8} />
      {/* a barge moored at the bend */}
      <mesh position={[-372, -RIVER_DROP + 0.8, 70]} castShadow>
        <boxGeometry args={[11, 2, 44]} />
        <meshStandardMaterial color="#3b3530" roughness={0.9} />
      </mesh>
    </>
  );
}

/** Two L trains: one down Wells, one along Lake. */
function Trains() {
  const wells = useRef<THREE.Group>(null);
  const lake = useRef<THREE.Group>(null);
  // EDIT: train speeds (m/s)
  const WELLS_SPEED = 16;
  const LAKE_SPEED = 13;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wells.current) wells.current.position.z = ((t * WELLS_SPEED) % 1500) - 750;
    if (lake.current) lake.current.position.x = 750 - ((t * LAKE_SPEED + 600) % 1500);
  });
  const train = (axis: "z" | "x") =>
    Array.from({ length: 6 }, (_, i) => {
      const off = i * 15.5;
      const long: [number, number, number] = axis === "z" ? [3, 3.6, 14.5] : [14.5, 3.6, 3];
      const pos: [number, number, number] = axis === "z" ? [0, 12.2, -off] : [off, 12.2, 0];
      return (
        <group key={i} position={pos}>
          <mesh castShadow>
            <boxGeometry args={long} />
            <meshStandardMaterial color="#c4c8cc" roughness={0.35} metalness={0.5} />
          </mesh>
          <mesh position-y={0.5}>
            <boxGeometry args={[long[0] + 0.05, 0.9, long[2] + 0.05]} />
            <meshStandardMaterial color="#20262c" roughness={0.3} />
          </mesh>
        </group>
      );
    });
  return (
    <>
      <group ref={wells} position={[-2, 0, 0]}>{train("z")}</group>
      <group ref={lake} position={[0, 0, LAKE + 2]}>{train("x")}</group>
    </>
  );
}

/** The address: 211 W. Wacker in the accent, outlined, with a beam and a ring. */
function Target() {
  const { target, roof } = useMaterials();
  const ring = useRef<THREE.Mesh>(null);
  const { x0, x1, z0, z1, h } = TARGET;
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(x1 - x0, h, z1 - z0)), [x0, x1, z0, z1, h]);
  const geo = useMemo(() => boxesGeometry([{ x0, x1, z0, z1, y1: h, m: "deco" }]), [x0, x1, z0, z1, h]);
  useFrame(({ clock }) => {
    const r = ring.current;
    if (!r) return;
    const t = (clock.getElapsedTime() % 2.6) / 2.6;
    r.scale.setScalar(1 + t * 2.4);
    (r.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - t);
  });
  return (
    <group>
      <mesh geometry={geo} material={[target, roof]} castShadow receiveShadow />
      <mesh position={[TX + 4, h + 3, TZ - 4]} castShadow>
        <boxGeometry args={[18, 6, 22]} />
        <meshStandardMaterial color="#7a7b7d" roughness={0.9} />
      </mesh>
      <lineSegments geometry={edges} position={[TX, h / 2, TZ]}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </lineSegments>
      <mesh position={[TX, h + 55, TZ]}>
        <cylinderGeometry args={[0.35, 0.35, 110, 6]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      <mesh position={[TX, h + 111, TZ]}>
        <sphereGeometry args={[2.2, 16, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[TX, 0.6, TZ]}>
        <ringGeometry args={[30, 32.5, 64]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.75} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Html position={[TX, h + 124, TZ]} center zIndexRange={[20, 0]}>
        <div className={`pointer-events-none flex items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-2 pr-2.5 text-[11px] font-medium leading-none ${CLAY ? "bg-black text-white shadow-[0_2px_10px_rgba(0,0,0,.2)]" : "bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,.5)]"}`}>
          <span className="h-2 w-2 rounded-full bg-[#e5361f]" />
          211 W. Wacker Dr.
        </div>
      </Html>
    </group>
  );
}

/** Map labels: street names on the ground, landmarks above their roofs. */
function Labels() {
  const tag = (text: string, pos: [number, number, number], kind: "street" | "place" | "water" = "place"): ReactNode => (
    <Html key={text} position={pos} center zIndexRange={[10, 0]}>
      <span
        className={`pointer-events-none whitespace-nowrap ${CLAY ? "" : "[text-shadow:0_1px_3px_rgba(0,0,0,.9)]"} ${
          kind === "street"
            ? `text-[9px] font-semibold uppercase tracking-[0.14em] ${CLAY ? "text-black/45" : "text-white/70"}`
            : kind === "water"
              ? `text-[10px] italic tracking-[0.06em] ${CLAY ? "text-[#6f858c]" : "text-[#9cc3cf]"}`
              : `text-[11px] font-medium ${CLAY ? "text-black/75" : "text-white/90"}`
        }`}
      >
        {text}
      </span>
    </Html>
  );
  // EDIT: labels and where they sit (x, y, z in metres)
  return (
    <group>
      {tag("W Wacker Dr", [190, 1, -16], "street")}
      {tag("N Wells St", [0, 1, 220], "street")}
      {tag("N Franklin St", [FRANKLIN, 1, 215], "street")}
      {tag("N LaSalle St", [LASALLE, 1, 210], "street")}
      {tag("W Lake St", [200, 1, LAKE], "street")}
      {tag("Chicago River", [70, -RIVER_DROP, -75], "water")}
      {tag("Riverwalk", [-40, -RIVER_DROP + 2, -36], "water")}
      {tag("The Mart", [-90, 128, -176])}
      {tag("333 W Wacker", [-240, 162, 40])}
      {tag("225 W Wacker", [-135, 138, 41])}
      {tag("222 N LaSalle", [64, 110, 36])}
      {tag("Wolf Point", [-437, 262, -125])}
    </group>
  );
}

/** Slowly round the address, leaning a little toward the pointer. */
function Rig({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(TX - 20, 30, TZ - 30), []);
  // EDIT: the orbit — distance and height on a wide screen (metres), and
  // speed (radians per second). Narrow (portrait) screens pull further
  // back so the same stretch of the city fits across.
  const aspect = size.width / Math.max(1, size.height);
  const pull = Math.pow(Math.max(1, 1.6 / aspect), 0.75);
  // EDIT: in clay the camera holds one view — how far round to the east it
  // sits (radians) and how much higher than the circling camera
  const CLAY_TURN = 1.1;
  const CLAY_LIFT = 1.15;
  const R = 600 * pull;
  const H = 500 * pull * (CLAY ? CLAY_LIFT : 1);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const SPEED = reduced || CLAY ? 0 : 0.035;
  // Start north-east of the address, looking south-west across the river.
  const START = -Math.PI / 2 + 0.35 + (CLAY ? CLAY_TURN : 0);
  useFrame(({ clock }) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    // the pointer leans the view a little (less when the model holds still)
    const lean = CLAY ? 0.07 : 0.2;
    const a = START + clock.getElapsedTime() * SPEED + p.x * lean;
    camera.position.set(look.x + Math.cos(a) * R, H + p.y * (CLAY ? 18 : 40), look.z + Math.sin(a) * R);
    camera.lookAt(look);
  });
  // EDIT: fog — the city fades to black from just past the address out to
  // about twice the camera's distance.
  const d = Math.hypot(R, H);
  return <fog attach="fog" args={[BG, d * 1.05, d * 2.1]} />;
}

/**
 * The clay pass: once everything is built, turns every surface into white
 * clay. Light originals become the brightest whites and dark ones (asphalt,
 * steel) a soft grey, so streets, walks and buildings still read apart; the
 * facade drawings stay on as faint shading (the windows); the river keeps a
 * pale blue-grey and the address pin its red.
 */
function ClayPass() {
  const { scene } = useThree();
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    const seen = new WeakSet<THREE.Material>();
    const water = new THREE.Color(WATER).getHexString();
    const convert = (m: THREE.Material) => {
      if (seen.has(m)) return;
      seen.add(m);
      if (m instanceof THREE.LineBasicMaterial) {
        m.color.set("#a9a8a4");
        return;
      }
      if (!(m instanceof THREE.MeshStandardMaterial)) return; // the pin keeps its red
      if (m.color.getHexString() === water) {
        m.color.set(CLAY_WATER);
        m.metalness = 0;
        m.roughness = 0.4;
        m.needsUpdate = true;
        return;
      }
      const walls = !!m.map && !(m.alphaTest > 0);
      const glassy = m.metalness > 0.2;
      // EDIT: how bright each kind of surface goes (0–1)
      const v = walls ? 0.965 : 0.86 + 0.13 * Math.sqrt(m.map ? 1 : m.color.r * 0.3 + m.color.g * 0.59 + m.color.b * 0.11);
      if (glassy) m.color.setRGB(v * 0.975, v * 0.99, v);
      else m.color.setRGB(v, v * 0.997, v * 0.99);
      if (walls) {
        m.aoMap = m.map;
        m.aoMapIntensity = 0.35; // EDIT: how strongly the windows show
        m.map = null;
      }
      m.metalness = 0;
      m.roughness = 0.92;
      m.emissive.set(0x000000);
      m.bumpMap = null;
      m.needsUpdate = true;
    };
    const cars = CLAY_CARS.map((c) => new THREE.Color(c));
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(convert);
      const inst = o as THREE.InstancedMesh;
      if (inst.isInstancedMesh && inst.instanceColor) {
        for (let i = 0; i < inst.count; i++) inst.setColorAt(i, cars[i % cars.length]);
        inst.instanceColor.needsUpdate = true;
      }
    });
  });
  return null;
}

/** The sun: from the south-west, casting the city's shadows on desktop. */
function Sun({ shadows }: { shadows: boolean }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    const l = light.current;
    if (!l) return;
    l.target.position.set(TX, 0, TZ);
    l.target.updateMatrixWorld();
    const c = l.shadow.camera;
    c.left = c.bottom = -760;
    c.right = c.top = 760;
    c.near = 10;
    c.far = 2600;
    c.updateProjectionMatrix();
  }, []);
  return (
    <directionalLight
      ref={light}
      // EDIT: sun position (relative to the address) and strength
      position={[TX - 560, 760, TZ + 260]}
      intensity={CLAY ? 1.9 : 2.4}
      color={CLAY ? "#ffffff" : "#fff4e6"}
      castShadow={shadows}
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.6}
    />
  );
}

export default function StudioMap({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  // Shadows on larger screens with a mouse; phones skip them for speed.
  const [hq] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768 && !window.matchMedia("(pointer: coarse)").matches
  );

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      }}
      onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, hq ? 1.75 : 1.5]}
        shadows={CLAY ? "soft" : hq ? "percentage" : false}
        camera={{ fov: 30, near: 5, far: 4000, position: [0, 500, -600] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // neutral tone mapping keeps the clay's whites white
          if (CLAY) {
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.toneMappingExposure = 1.12; // EDIT: overall brightness of the clay
          }
        }}
        aria-label="3D map: 211 W. Wacker Drive, Chicago, on the river between Wells and Franklin"
      >
        <color attach="background" args={[BG]} />
        {/* EDIT: sky light — white from above, warm grey bounce from below in clay */}
        <hemisphereLight args={CLAY ? ["#ffffff", "#d9d6d0", 2.3] : ["#dfe9f2", "#3a3836", 1.5]} />
        <Sun shadows={hq || CLAY} />
        <Ground shadows={hq || CLAY} />
        <City shadows={hq || CLAY} />
        <Markings />
        <Traffic />
        <Boats />
        <Trains />
        <Target />
        <Labels />
        <Rig pointer={pointer} />
        {CLAY && <ClayPass />}
      </Canvas>
    </div>
  );
}
