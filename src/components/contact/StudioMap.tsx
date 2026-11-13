"use client";

/**
 * A 3D model of the stretch of Chicago round 211 W. Wacker Drive, drawn in
 * Three.js (React Three Fiber) from the real layout: the main branch of the
 * river and its bend at Wolf Point, Wacker Drive along the south bank and
 * turning south, the Wells, Franklin and LaSalle bridges, the L over Wells
 * and Lake, the Merchandise Mart across the water, 333 W. Wacker's curved
 * green glass on the bend, 225 W. Wacker's barrel roof and four turrets, and
 * 222 N. LaSalle. Everything else is filled in from the street grid with
 * seeded towers. Facades are drawn on canvases (stone with punched windows,
 * glass curtain wall, brick), so nothing is downloaded. The camera turns
 * slowly round the address; rendering stops while the map is off screen.
 *
 * Units are metres. x runs east, z runs south, y is up. Wells St's
 * centreline is x = 0 and the south building line of Wacker is z = 0.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

// ── palette ──────────────────────────────────────────────────────────────
// EDIT: colours of the model
const BG = "#050505"; // page behind the map; the fog fades into it
const ASPHALT = "#2b2c2f";
const CONCRETE = "#8c8a84"; // sidewalks / block pads
const WALK = "#a6a298"; // riverwalk
const ROOF = "#6b6c6e";
const WATER = "#2f4f58";
const STEEL = "#3a3e43"; // the L structure
const RUST = "#8a4a30"; // bridge trusses
const TREE = "#4d6b3d";
const ACCENT = "#e5361f";

// ── the address ──────────────────────────────────────────────────────────
// EDIT: 211 W. Wacker's footprint and height (metres). It sits between
// 205 W. Wacker (Wells corner) and 225 W. Wacker (Franklin corner).
const TARGET = { x0: -72, x1: -48, z0: 0, z1: 50, h: 70 };
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
  | "granite"
  | "glass"
  | "dark"
  | "brick"
  | "mart"
  | "mech"
  | "pad"
  | "walk"
  | "deck"
  | "steel";
type Box = { x0: number; x1: number; z0: number; z1: number; y0?: number; y1: number; m: Mat };
type Rect = { x0: number; x1: number; z0: number; z1: number };

const overlaps = (a: Rect, b: Rect) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;

// ── facades ──────────────────────────────────────────────────────────────
type Draw = (g: CanvasRenderingContext2D, s: number, rnd: () => number) => void;

const pick = <T,>(arr: T[], rnd: () => number) => arr[Math.floor(rnd() * arr.length)];

/** Stone or brick wall with punched windows. */
function punched(base: string, glass: string[], bays: number, floors: number, wf: number, hf: number): Draw {
  return (g, s, rnd) => {
    g.fillStyle = base;
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 500; i++) {
      g.fillStyle = `rgba(0,0,0,${rnd() * 0.06})`;
      g.fillRect(rnd() * s, rnd() * s, 2 + rnd() * 8, 2 + rnd() * 8);
    }
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

/** Glass curtain wall: panels in a few tints, mullions, spandrel bands. */
function curtain(panels: string[], mullion: string, cols: number, floors: number, band: number, bandColor: string): Draw {
  return (g, s, rnd) => {
    const cw = s / cols;
    const fh = s / floors;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < floors; j++) {
        g.fillStyle = pick(panels, rnd);
        g.fillRect(i * cw, j * fh, cw, fh);
      }
    }
    // a soft sky reflection down the tile
    const grad = g.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, "rgba(255,255,255,.10)");
    grad.addColorStop(0.5, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(255,255,255,.06)");
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
  granite: { draw: punched("#8e8d89", ["#272c32", "#323a42", "#3f4953"], 4, 3, 0.32, 0.7), w: 8, h: 12 },
  glass: { draw: curtain(["#4b6274", "#557083", "#5f7b8e", "#6a8798", "#455b6c"], "#26313a", 4, 3, 0.18, "rgba(25,33,40,.55)"), w: 12, h: 12 },
  dark: { draw: curtain(["#2a3138", "#323a43", "#39434d", "#2f363e"], "#1b1f24", 4, 3, 0.3, "rgba(15,18,22,.7)"), w: 12, h: 12 },
  brick: { draw: punched("#8a6b58", ["#25292e", "#2f353b", "#3c444c"], 3, 3, 0.5, 0.6), w: 9, h: 12 },
  mart: { draw: punched("#b4a88f", ["#2f363e", "#3a434d", "#4a5560"], 5, 3, 0.55, 0.62), w: 12, h: 12 },
  green: { draw: curtain(["#5e8d7d", "#679686", "#6f9f8f", "#5a8676"], "#3f6458", 2, 3, 0.26, "rgba(40,70,60,.75)"), w: 10, h: 12 },
};

function facadeTexture(key: string, aniso: number): THREE.CanvasTexture {
  const f = FACADES[key];
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  f.draw(c.getContext("2d")!, 256, seeded(key.length * 97 + key.charCodeAt(0)));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / f.w, 1 / f.h);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
}

/** Open steel truss for the bridges: a transparent canvas, drawn in rust. */
function trussTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const g = c.getContext("2d")!;
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
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
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
    // +x
    quad(side, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], [-z1, y0], [-z0, y0], [-z0, y1], [-z1, y1]);
    // -x
    quad(side, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], [z0, y0], [z1, y0], [z1, y1], [z0, y1]);
    // +z
    quad(side, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], [x0, y0], [x1, y0], [x1, y1], [x0, y1]);
    // -z
    quad(side, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], [-x1, y0], [-x0, y0], [-x0, y1], [-x1, y1]);
    // roof
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

// ── the city ─────────────────────────────────────────────────────────────
// EDIT: the river (outline in x, z). Main branch north of Wacker, the bend
// round 333 W. Wacker, the south branch heading south, the north branch
// heading north past Wolf Point.
function riverShape(): THREE.Shape {
  const s = new THREE.Shape();
  const P = (x: number, z: number) => [x, -z] as const;
  s.moveTo(...P(2000, -40));
  s.lineTo(...P(-145, -40));
  s.quadraticCurveTo(...P(-284, -40), ...P(-284, 115));
  s.lineTo(...P(-284, 2000));
  s.lineTo(...P(-344, 2000));
  s.lineTo(...P(-344, -75));
  s.lineTo(...P(-352, -220));
  s.lineTo(...P(-372, -2000));
  s.lineTo(...P(-306, -2000));
  s.lineTo(...P(-292, -220));
  s.quadraticCurveTo(...P(-292, -110), ...P(-220, -110));
  s.lineTo(...P(2000, -110));
  s.closePath();
  return s;
}

// 333 W. Wacker: Franklin on the east, Lake on the south, the river curve.
function shape333(): THREE.Shape {
  const s = new THREE.Shape();
  const P = (x: number, z: number) => [x, -z] as const;
  s.moveTo(...P(-145, 2));
  s.quadraticCurveTo(...P(-244, 2), ...P(-244, 112));
  s.lineTo(...P(-150, 112));
  s.lineTo(...P(-150, 70));
  s.lineTo(...P(-145, 70));
  s.closePath();
  return s;
}

/** Fill a block with seeded lots: towers, some with a setback crown. */
function fillBlock(out: Box[], r: Rect, lo: number, hi: number, rnd: () => number, avoid: Rect[] = []) {
  const cols = Math.max(1, Math.round((r.x1 - r.x0) / 50));
  const rows = Math.max(1, Math.round((r.z1 - r.z0) / 56));
  const lw = (r.x1 - r.x0) / cols;
  const ld = (r.z1 - r.z0) / rows;
  const mats: Mat[] = ["glass", "glass", "glass", "stone", "stone", "dark", "dark", "brick", "granite"];
  for (let a = 0; a < cols; a++) {
    for (let b = 0; b < rows; b++) {
      if (rnd() < 0.07) continue; // the odd plaza
      const ix = 2 + rnd() * 5;
      const iz = 2 + rnd() * 5;
      const lot = { x0: r.x0 + a * lw + ix, x1: r.x0 + (a + 1) * lw - ix, z0: r.z0 + b * ld + iz, z1: r.z0 + (b + 1) * ld - iz };
      if (avoid.some((v) => overlaps(v, lot))) continue;
      const h = Math.round((lo + Math.pow(rnd(), 1.7) * (hi - lo)) / 4) * 4;
      const m = pick(mats, rnd);
      out.push({ ...lot, y1: h, m });
      let top = h;
      if (h > 70 && rnd() < 0.5) {
        const sx = (lot.x1 - lot.x0) * (0.12 + rnd() * 0.16);
        const sz = (lot.z1 - lot.z0) * (0.12 + rnd() * 0.16);
        top = h + Math.round((h * (0.12 + rnd() * 0.3)) / 4) * 4;
        out.push({ x0: lot.x0 + sx, x1: lot.x1 - sx, z0: lot.z0 + sz, z1: lot.z1 - sz, y0: h, y1: top, m });
      }
      if (rnd() < 0.6) {
        const cx = (lot.x0 + lot.x1) / 2;
        const cz = (lot.z0 + lot.z1) / 2;
        const w = (lot.x1 - lot.x0) * 0.18;
        const d = (lot.z1 - lot.z0) * 0.18;
        out.push({ x0: cx - w, x1: cx + w, z0: cz - d, z1: cz + d, y0: top, y1: top + 4 + rnd() * 3, m: "mech" });
      }
    }
  }
}

type City = { boxes: Box[]; trees: [number, number][]; trusses: { x: number; z: number; len: number; rotY: number }[] };

function buildCity(): City {
  const rnd = seeded(211);
  const boxes: Box[] = [];
  const pad = (x0: number, x1: number, z0: number, z1: number, m: Mat = "pad") =>
    boxes.push({ x0, x1, z0, z1, y1: m === "walk" ? 0.2 : 0.3, m });

  // Street grid. EDIT: x of the north–south building lines, z of the
  // east–west ones (each street 20–24 m curb to curb).
  const COLS: [number, number][] = [[-244, -145], [-125, -12], [12, 113], [137, 248], [272, 420], [444, 560]];
  const ROWS: [number, number][] = [[0, 115], [135, 280], [300, 445], [465, 610], [630, 760]];
  const NORTH_ROWS: [number, number][] = [[-232, -118], [-400, -252], [-560, -420]];

  // ── the address's block: Wells → Franklin, Wacker → Lake ──
  pad(-125, -12, 0, 115);
  boxes.push({ x0: -48, x1: -12, z0: 0, z1: 60, y1: 86, m: "stone" }); // 205 W. Wacker
  boxes.push({ x0: -44, x1: -16, z0: 6, z1: 44, y0: 86, y1: 94, m: "mech" });
  boxes.push({ x0: -125, x1: -72, z0: 0, z1: 42, y1: 104, m: "granite" }); // 225 W. Wacker (roof below)
  boxes.push({ x0: -125, x1: -72, z0: 48, z1: 113, y1: 76, m: "glass" });
  boxes.push({ x0: -72, x1: -48, z0: 56, z1: 113, y1: 36, m: "brick" });
  boxes.push({ x0: -48, x1: -14, z0: 66, z1: 113, y1: 52, m: "stone" });

  // ── Wells → LaSalle: 222 N. LaSalle on the LaSalle corner ──
  pad(12, 113, 0, 115);
  boxes.push({ x0: 50, x1: 113, z0: 0, z1: 90, y1: 80, m: "stone" }); // 222 N. LaSalle
  boxes.push({ x0: 62, x1: 113, z0: 0, z1: 66, y0: 80, y1: 96, m: "stone" });
  boxes.push({ x0: 78, x1: 100, z0: 14, z1: 46, y0: 96, y1: 102, m: "mech" });
  boxes.push({ x0: 14, x1: 46, z0: 2, z1: 54, y1: 64, m: "glass" });
  boxes.push({ x0: 14, x1: 46, z0: 62, z1: 113, y1: 40, m: "brick" });
  boxes.push({ x0: 52, x1: 113, z0: 96, z1: 113, y1: 28, m: "brick" });

  // ── 333 W. Wacker's block: pad only (the building is its own mesh) ──
  // ── south of Lake, and east of LaSalle: the Loop, seeded ──
  for (const [x0, x1] of COLS) {
    for (const [z0, z1] of ROWS) {
      if (z0 === 0 && x0 <= 12) continue; // the blocks above
      pad(x0, x1, z0, z1);
      const near = Math.hypot((x0 + x1) / 2 - TX, (z0 + z1) / 2 - TZ);
      // EDIT: tallest seeded tower — kept lower right by the address so it stays in view
      fillBlock(boxes, { x0, x1, z0, z1 }, 30, near < 260 ? 105 : near < 420 ? 170 : 140, rnd);
    }
  }

  // ── west of the south branch: Riverside Plaza ──
  const riverPoint = { x0: -440, x1: -374, z0: 30, z1: 112 };
  const riverside150 = { x0: -414, x1: -376, z0: 300, z1: 372 };
  boxes.push({ ...riverPoint, y1: 222, m: "glass" }); // River Point
  boxes.push({ x0: riverPoint.x0 + 10, x1: riverPoint.x1 - 10, z0: riverPoint.z0 + 12, z1: riverPoint.z1 - 12, y0: 222, y1: 230, m: "mech" });
  boxes.push({ ...riverside150, y1: 229, m: "glass" }); // 150 N. Riverside
  for (const [z0, z1] of [[-60, 115], ...ROWS.slice(1)] as [number, number][]) {
    pad(-600, -350, z0, z1);
    fillBlock(boxes, { x0: -600, x1: -376, z0, z1 }, 30, 160, rnd, [riverPoint, riverside150]);
  }

  // ── Wolf Point: three glass towers on the point ──
  pad(-760, -350, -760, -80);
  boxes.push({ x0: -424, x1: -376, z0: -150, z1: -100, y1: 250, m: "glass" }); // Wolf Point South
  boxes.push({ x0: -418, x1: -378, z0: -262, z1: -214, y1: 205, m: "dark" }); // Wolf Point East
  boxes.push({ x0: -486, x1: -446, z0: -236, z1: -190, y1: 150, m: "glass" }); // Wolf Point West
  fillBlock(boxes, { x0: -640, x1: -500, z0: -420, z1: -100 }, 20, 90, rnd);

  // ── north of the main branch: the Merchandise Mart, then River North ──
  pad(-280, -12, -232, -118);
  boxes.push({ x0: -235, x1: -15, z0: -228, z1: -124, y1: 74, m: "mart" }); // The Mart
  boxes.push({ x0: -150, x1: -100, z0: -205, z1: -147, y0: 74, y1: 104, m: "mart" });
  boxes.push({ x0: -138, x1: -112, z0: -190, z1: -162, y0: 104, y1: 110, m: "mech" });
  const lasalle300 = { x0: 142, x1: 200, z0: -214, z1: -130 };
  boxes.push({ ...lasalle300, y1: 239, m: "glass" }); // 300 N. LaSalle
  for (const [x0, x1] of [[12, 113], [137, 248], [272, 420], [444, 560]] as [number, number][]) {
    pad(x0, x1, -232, -118);
    fillBlock(boxes, { x0, x1, z0: -232, z1: -118 }, 24, 130, rnd, [lasalle300]);
  }
  for (const [z0, z1] of NORTH_ROWS.slice(1)) {
    for (const [x0, x1] of [[-280, -150], [-130, -12], [12, 113], [137, 248], [272, 420]] as [number, number][]) {
      pad(x0, x1, z0, z1);
      fillBlock(boxes, { x0, x1, z0, z1 }, 20, 110, rnd);
    }
  }

  // ── riverwalks ──
  pad(-150, 2000, -40, -32, "walk");
  pad(-220, 2000, -118, -110, "walk");

  // ── bridges (decks + railings + bridgehouses) ──
  const trusses: City["trusses"] = [];
  for (const x of [0, -135, 125, 260]) {
    const w = x === 0 ? 11 : 10;
    boxes.push({ x0: x - w, x1: x + w, z0: -116, z1: -34, y0: 0.2, y1: 1.4, m: "deck" });
    boxes.push({ x0: x - w, x1: x - w + 0.6, z0: -116, z1: -34, y0: 1.4, y1: 2.6, m: "deck" });
    boxes.push({ x0: x + w - 0.6, x1: x + w, z0: -116, z1: -34, y0: 1.4, y1: 2.6, m: "deck" });
    for (const sx of [-1, 1]) {
      boxes.push({ x0: x + sx * (w + 2) - 3, x1: x + sx * (w + 2) + 3, z0: -39, z1: -33, y1: 8, m: "stone" });
      boxes.push({ x0: x + sx * (w + 2) - 3, x1: x + sx * (w + 2) + 3, z0: -117, z1: -111, y1: 8, m: "stone" });
    }
  }
  trusses.push({ x: -11, z: -75, len: 78, rotY: Math.PI / 2 }, { x: 11, z: -75, len: 78, rotY: Math.PI / 2 });
  for (const z of [125, 290, 455]) {
    boxes.push({ x0: -350, x1: -278, z0: z - 10, z1: z + 10, y0: 0.2, y1: 1.4, m: "deck" });
  }
  trusses.push({ x: -314, z: 115, len: 70, rotY: 0 }, { x: -314, z: 135, len: 70, rotY: 0 });
  boxes.push({ x0: -360, x1: -284, z0: -252, z1: -232, y0: 0.2, y1: 1.4, m: "deck" }); // Kinzie

  // ── the L: Wells (north across the bridge) and Lake ──
  boxes.push({ x0: -5, x1: 5, z0: -760, z1: 760, y0: 9, y1: 10.4, m: "steel" });
  boxes.push({ x0: -760, x1: 760, z0: 120, z1: 130, y0: 9, y1: 10.4, m: "steel" });
  for (let z = -748; z <= 748; z += 24) {
    if (z > -118 && z < -32) continue;
    for (const x of [-4, 4]) boxes.push({ x0: x - 0.5, x1: x + 0.5, z0: z - 0.5, z1: z + 0.5, y1: 9, m: "steel" });
  }
  for (let x = -748; x <= 748; x += 24) {
    if (x > -352 && x < -276) continue;
    if (Math.abs(x) < 8) continue;
    for (const z of [121, 129]) boxes.push({ x0: x - 0.5, x1: x + 0.5, z0: z - 0.5, z1: z + 0.5, y1: 9, m: "steel" });
  }

  // ── trees on the riverwalk ──
  const trees: [number, number][] = [];
  for (let x = -140; x < 700; x += 13) if (Math.abs(x) > 16 && Math.abs(x + 135) > 16 && Math.abs(x - 125) > 16) trees.push([x, -36]);
  for (let z = -40; z < 700; z += 15) trees.push([-358, z]);

  return { boxes, trees, trusses };
}

// ── scene pieces ─────────────────────────────────────────────────────────
function useMaterials() {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    const roof = new THREE.MeshStandardMaterial({ color: ROOF, roughness: 0.95 });
    const tex = (k: string) => facadeTexture(k, aniso);
    const wall = (k: string, rough = 0.85, metal = 0) =>
      new THREE.MeshStandardMaterial({ map: tex(k), roughness: rough, metalness: metal });
    const flat = (c: string, rough = 0.95) => {
      const m = new THREE.MeshStandardMaterial({ color: c, roughness: rough });
      return [m, m];
    };
    const mats: Record<Mat, THREE.Material[]> = {
      stone: [wall("stone"), roof],
      granite: [wall("granite"), roof],
      glass: [wall("glass", 0.35, 0.25), roof],
      dark: [wall("dark", 0.35, 0.25), roof],
      brick: [wall("brick"), roof],
      mart: [wall("mart"), roof],
      mech: flat("#7a7b7d"),
      pad: flat(CONCRETE),
      walk: flat(WALK),
      deck: flat("#4b4d51", 0.8),
      steel: flat(STEEL, 0.7),
    };
    const green = wall("green", 0.3, 0.2);
    const granitePlain = new THREE.MeshStandardMaterial({ color: "#8a8985", roughness: 0.8 });
    const target = new THREE.MeshStandardMaterial({
      map: tex("stone"),
      color: "#ff7b66",
      emissive: ACCENT,
      emissiveIntensity: 0.18,
      roughness: 0.8,
    });
    return { mats, roof, green, granitePlain, target };
  }, [gl]);
}

function City({ shadows }: { shadows: boolean }) {
  const city = useMemo(() => buildCity(), []);
  const { mats, roof, green, granitePlain } = useMaterials();
  const groups = useMemo(() => {
    const by = new Map<Mat, Box[]>();
    for (const b of city.boxes) by.set(b.m, [...(by.get(b.m) ?? []), b]);
    return [...by.entries()].map(([m, list]) => ({ m, geo: boxesGeometry(list) }));
  }, [city]);
  const river = useMemo(() => {
    const g = new THREE.ShapeGeometry(riverShape(), 24);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const b333 = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape333(), { depth: 149, bevelEnabled: false, curveSegments: 28 });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const pad333 = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape333(), { depth: 0.3, bevelEnabled: false, curveSegments: 28 });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const truss = useMemo(() => trussTexture(), []);
  const trees = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = trees.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const r = seeded(7);
    city.trees.forEach(([x, z], i) => {
      const s = 0.8 + r() * 0.5;
      o.position.set(x, 4.5 * s, z);
      o.scale.set(s, s * 1.1, s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [city]);

  return (
    <group>
      {/* asphalt — everything off a block reads as street */}
      <mesh rotation-x={-Math.PI / 2} position={[TX, 0, TZ]} receiveShadow={shadows}>
        <circleGeometry args={[3000, 48]} />
        <meshStandardMaterial color={ASPHALT} roughness={1} />
      </mesh>
      <mesh geometry={river} position-y={0.34} receiveShadow={shadows}>
        <meshStandardMaterial color={WATER} roughness={0.28} metalness={0.15} />
      </mesh>

      {groups.map(({ m, geo }) => (
        <mesh key={m} geometry={geo} material={mats[m]} castShadow={shadows && m !== "pad" && m !== "walk"} receiveShadow={shadows} />
      ))}

      {/* 333 W. Wacker — the curved green glass on the bend */}
      <mesh geometry={pad333} material={mats.pad} receiveShadow={shadows} />
      <mesh geometry={b333} material={[roof, green]} castShadow={shadows} receiveShadow={shadows} />

      {/* 225 W. Wacker — barrel-vaulted roof and four domed turrets */}
      <mesh position={[-98.5, 104, 21]} rotation-z={Math.PI / 2} castShadow={shadows}>
        <cylinderGeometry args={[17, 17, 44, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#7d7f80" roughness={0.6} metalness={0.2} />
      </mesh>
      {[-121, -76].flatMap((x) =>
        [4, 38].map((z) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <mesh position-y={110} material={granitePlain} castShadow={shadows}>
              <cylinderGeometry args={[4.4, 4.4, 14, 16]} />
            </mesh>
            <mesh position-y={117} material={granitePlain} castShadow={shadows}>
              <sphereGeometry args={[4.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            <mesh position-y={125}>
              <coneGeometry args={[0.7, 9, 8]} />
              <meshStandardMaterial color="#9a9a96" roughness={0.6} />
            </mesh>
          </group>
        ))
      )}

      {/* bridge trusses (Wells, Lake) */}
      {city.trusses.map((t, i) => (
        <mesh key={i} position={[t.x, 6, t.z]} rotation-y={t.rotY}>
          <planeGeometry args={[t.len, 9.5]} />
          <meshStandardMaterial
            map={truss}
            map-repeat={[Math.round(t.len / 13), 1]}
            color={RUST}
            alphaTest={0.5}
            transparent={false}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
      ))}

      <instancedMesh ref={trees} args={[undefined, undefined, city.trees.length]} castShadow={shadows}>
        <icosahedronGeometry args={[3.4, 0]} />
        <meshStandardMaterial color={TREE} roughness={1} flatShading />
      </instancedMesh>
    </group>
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
          <mesh>
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
      <group ref={lake} position={[0, 0, 127]}>{train("x")}</group>
    </>
  );
}

/** The address: 211 W. Wacker in the accent, outlined, with a beam and a ring. */
function Target() {
  const { target } = useMaterials();
  const ring = useRef<THREE.Mesh>(null);
  const { x0, x1, z0, z1, h } = TARGET;
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(x1 - x0, h, z1 - z0)), [x0, x1, z0, z1, h]);
  const geo = useMemo(() => boxesGeometry([{ x0, x1, z0, z1, y1: h, m: "stone" }]), [x0, x1, z0, z1, h]);
  useFrame(({ clock }) => {
    const r = ring.current;
    if (!r) return;
    const t = (clock.getElapsedTime() % 2.6) / 2.6;
    r.scale.setScalar(1 + t * 2.4);
    (r.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - t);
  });
  return (
    <group>
      <mesh geometry={geo} material={[target, target]} castShadow receiveShadow />
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
        <div className="pointer-events-none flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white py-1 pl-2 pr-2.5 text-[11px] font-medium leading-none text-black shadow-[0_2px_10px_rgba(0,0,0,.5)]">
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
        className={`pointer-events-none whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,0,0,.9)] ${
          kind === "street"
            ? "text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70"
            : kind === "water"
              ? "text-[10px] italic tracking-[0.06em] text-[#9cc3cf]"
              : "text-[11px] font-medium text-white/90"
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
      {tag("N Franklin St", [-135, 1, 215], "street")}
      {tag("N LaSalle St", [125, 1, 210], "street")}
      {tag("W Lake St", [200, 1, 125], "street")}
      {tag("Chicago River", [70, 1, -75], "water")}
      {tag("The Mart", [-125, 122, -176])}
      {tag("333 W Wacker", [-205, 162, 40])}
      {tag("225 W Wacker", [-104, 134, 21])}
      {tag("222 N LaSalle", [88, 112, 34])}
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
  const R = 620 * pull;
  const H = 520 * pull;
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const SPEED = reduced ? 0 : 0.035;
  // Start north-east of the address, looking south-west across the river.
  const START = -Math.PI / 2 + 0.35;
  useFrame(({ clock }) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    const a = START + clock.getElapsedTime() * SPEED + p.x * 0.2;
    camera.position.set(look.x + Math.cos(a) * R, H + p.y * 40, look.z + Math.sin(a) * R);
    camera.lookAt(look);
  });
  // EDIT: fog — the city fades to black from just past the address out to
  // about twice the camera's distance.
  const d = Math.hypot(R, H);
  return <fog attach="fog" args={[BG, d * 1.05, d * 2.1]} />;
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
      intensity={2.4}
      color="#fff4e6"
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
        shadows={hq ? "percentage" : false}
        camera={{ fov: 30, near: 5, far: 4000, position: [0, 500, -600] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="3D map: 211 W. Wacker Drive, Chicago, on the river between Wells and Franklin"
      >
        <color attach="background" args={[BG]} />
        <hemisphereLight args={["#dfe9f2", "#3a3836", 1.5]} />
        <Sun shadows={hq} />
        <City shadows={hq} />
        <Trains />
        <Target />
        <Labels />
        <Rig pointer={pointer} />
      </Canvas>
    </div>
  );
}
