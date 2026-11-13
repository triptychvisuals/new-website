"use client";

/**
 * A raw 3D map of the Chicago Loop round 211 W. Wacker Drive (Three.js
 * via React Three Fiber). Nothing is fetched: the streets, the river and
 * the blocks are drawn from a simplified street grid (Chicago's address
 * grid: 800 numbers to the mile), the towers in each block get seeded
 * heights, and the address's building stands in the accent red with a
 * beam and a pulsing ring. The camera turns slowly round it. Rendering
 * stops while the map is off screen.
 *
 * Units: 10 scene units = 100 address numbers (about 200 m). x runs east,
 * z runs south (so a street at "N" address n sits at z = -n / 10 * 10).
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// ── the grid ─────────────────────────────────────────────────────────────
// EDIT: streets — x of north-south streets (east +), and north address of
// east-west streets (in hundreds, × 10). Names label the map.
const NS_STREETS: [number, string][] = [
  [-36, "Wacker Dr"],
  [-30, "Franklin St"],
  [-20, "Wells St"],
  [-14, "LaSalle St"],
  [-10, "Clark St"],
  [-3.6, "Dearborn St"],
  [0, "State St"],
  [6, "Wabash Ave"],
];
const EW_STREETS: [number, string][] = [
  [31, "Wacker Dr"],
  [20, "Lake St"],
  [15, "Randolph St"],
  [10, "Washington St"],
  [0, "Madison St"],
  [-10, "Monroe St"],
  [-20, "Adams St"],
  [-30, "Jackson Blvd"],
];
// Block edges (the streets above plus the map's outer edges and the river).
const XS = [-66, -56, -48, -42, -36, -30, -20, -14, -10, -3.6, 0, 6, 12, 20];
const NS = [-40, -30, -20, -10, 0, 10, 15, 20, 31, 33, 37, 44, 52, 62];
// The river: the main branch runs east–west north of Wacker, the south
// branch north–south west of it.
const RIVER_MAIN = { x0: -48, x1: 22, n0: 33, n1: 37 };
const RIVER_SOUTH = { x0: -42, x1: -38, n0: -42, n1: 37 };

// EDIT: the address's building — x (east), n (north), footprint, height.
const TARGET = { x: -24.5, n: 26.5, w: 6.5, d: 6, h: 34 };

// EDIT: colours
const GROUND = "#050505";
const BUILDING = "#141414";
const RIVER = "#0c1620";
const ACCENT = "#e5361f";

/** Seeded random, so the skyline is the same on every visit. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Box = { x: number; z: number; w: number; d: number; h: number };

/** Every building but the target: each block split into a few lots. */
function buildCity(): Box[] {
  const rnd = seeded(211);
  const out: Box[] = [];
  const street = 1.8; // half a street's width, block edge to centreline
  const inRiver = (x: number, n: number) =>
    (x > RIVER_MAIN.x0 && x < RIVER_MAIN.x1 && n > RIVER_MAIN.n0 - 2 && n < RIVER_MAIN.n1) ||
    (x > RIVER_SOUTH.x0 - 0 && x < RIVER_SOUTH.x1 + 2 && n > RIVER_SOUTH.n0 && n < RIVER_SOUTH.n1);
  for (let i = 0; i < XS.length - 1; i++) {
    for (let j = 0; j < NS.length - 1; j++) {
      const x0 = XS[i] + street;
      const x1 = XS[i + 1] - street;
      const n0 = NS[j] + street;
      const n1 = NS[j + 1] - street;
      if (x1 - x0 < 1.5 || n1 - n0 < 1.5) continue;
      const cx = (x0 + x1) / 2;
      const cn = (n0 + n1) / 2;
      if (inRiver(cx, cn) || (cn > 31 && cn < 33)) continue;
      // The Loop (inside the river) runs tall; the rest lower.
      const loop = cx > -36 && cx < 12 && cn > -40 && cn < 31;
      const cols = x1 - x0 > 7 ? 2 : 1;
      const rows = n1 - n0 > 7 ? 2 : 1;
      const lw = (x1 - x0) / cols;
      const ld = (n1 - n0) / rows;
      for (let a = 0; a < cols; a++) {
        for (let b = 0; b < rows; b++) {
          if (rnd() < 0.12) continue; // the odd empty lot
          const inset = 0.35 + rnd() * 0.5;
          const w = lw - inset * 2;
          const d = ld - inset * 2;
          const x = x0 + lw * a + lw / 2;
          const n = n0 + ld * b + ld / 2;
          const tall = loop ? 8 + Math.pow(rnd(), 1.6) * 38 : 2 + rnd() * 10;
          // keep clear of the target's lot
          if (Math.abs(x - TARGET.x) < (w + TARGET.w) / 2 + 0.6 && Math.abs(n - TARGET.n) < (d + TARGET.d) / 2 + 0.6) continue;
          out.push({ x, z: -n, w, d, h: tall });
        }
      }
    }
  }
  return out;
}

/** The 12 edges of every box as one set of line segments (one draw call). */
function edgesOf(boxes: Box[]): Float32Array {
  const pos = new Float32Array(boxes.length * 24 * 3);
  let k = 0;
  const v = (x: number, y: number, z: number) => {
    pos[k++] = x;
    pos[k++] = y;
    pos[k++] = z;
  };
  for (const b of boxes) {
    const xa = b.x - b.w / 2, xb = b.x + b.w / 2, za = b.z - b.d / 2, zb = b.z + b.d / 2;
    const corners: [number, number][] = [[xa, za], [xb, za], [xb, zb], [xa, zb]];
    for (let c = 0; c < 4; c++) {
      const [p, q] = corners[c];
      const [r, s] = corners[(c + 1) % 4];
      v(p, 0, q); v(r, 0, s); // base
      v(p, b.h, q); v(r, b.h, s); // roof
      v(p, 0, q); v(p, b.h, q); // upright
    }
  }
  return pos;
}

function City() {
  const boxes = useMemo(() => buildCity(), []);
  const inst = useRef<THREE.InstancedMesh>(null);
  const edges = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(edgesOf(boxes), 3));
    return g;
  }, [boxes]);

  useEffect(() => {
    const m = inst.current;
    if (!m) return;
    const o = new THREE.Object3D();
    boxes.forEach((b, i) => {
      o.position.set(b.x, b.h / 2, b.z);
      o.scale.set(b.w, b.h, b.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [boxes]);

  return (
    <group>
      <instancedMesh ref={inst} args={[undefined, undefined, boxes.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={BUILDING} roughness={0.9} metalness={0} />
      </instancedMesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

/** Ground, river, and the street centrelines. */
function Ground() {
  const streets = useMemo(() => {
    const pts: number[] = [];
    for (const [x] of NS_STREETS) pts.push(x, 0.02, 42, x, 0.02, x === -36 ? 31 : -31);
    for (const [n] of EW_STREETS) pts.push(n === 31 ? -36 : -66, 0.02, -n, 20, 0.02, -n);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  const river = (r: typeof RIVER_MAIN, key: string) => (
    <mesh key={key} rotation-x={-Math.PI / 2} position={[(r.x0 + r.x1) / 2, 0.01, -(r.n0 + r.n1) / 2]}>
      <planeGeometry args={[r.x1 - r.x0, r.n1 - r.n0]} />
      <meshBasicMaterial color={RIVER} />
    </mesh>
  );
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[-20, 0, -10]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color={GROUND} />
      </mesh>
      {river(RIVER_MAIN, "main")}
      {river(RIVER_SOUTH, "south")}
      <lineSegments geometry={streets}>
        <lineDashedMaterial color="#ffffff" transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

/** The address: the building in red, a beam, and a ring that pulses. */
function Target() {
  const ring = useRef<THREE.Mesh>(null);
  const edges = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(edgesOf([{ x: TARGET.x, z: -TARGET.n, w: TARGET.w, d: TARGET.d, h: TARGET.h }]), 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    const r = ring.current;
    if (!r) return;
    const t = (clock.getElapsedTime() % 2.4) / 2.4;
    r.scale.setScalar(1 + t * 5);
    (r.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - t);
  });
  return (
    <group>
      <mesh position={[TARGET.x, TARGET.h / 2, -TARGET.n]}>
        <boxGeometry args={[TARGET.w, TARGET.h, TARGET.d]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} roughness={0.6} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </lineSegments>
      {/* beam */}
      <mesh position={[TARGET.x, TARGET.h + 14, -TARGET.n]}>
        <cylinderGeometry args={[0.12, 0.12, 28, 6]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      <mesh position={[TARGET.x, TARGET.h + 28.5, -TARGET.n]}>
        <sphereGeometry args={[0.9, 16, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* ring on the street */}
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[TARGET.x, 0.05, -TARGET.n]}>
        <ringGeometry args={[4.2, 4.6, 48]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[TARGET.x, TARGET.h + 31, -TARGET.n]} center zIndexRange={[10, 0]}>
        <div className="pointer-events-none whitespace-nowrap border border-white/70 bg-black px-2 py-1 font-mono text-[11px] leading-tight text-white">
          211 W. Wacker Dr.
        </div>
      </Html>
    </group>
  );
}

/** Street names on the ground plan. */
function Labels() {
  const label = (text: string, pos: [number, number, number], key: string) => (
    <Html key={key} position={pos} center zIndexRange={[5, 0]}>
      <span className="pointer-events-none whitespace-nowrap font-mono text-[10px] text-white/55">{text}</span>
    </Html>
  );
  return (
    <group>
      {label("W Wacker Dr", [-6, 0.1, -31.8], "wacker")}
      {label("N Wells St", [-20, 0.1, -12], "wells")}
      {label("N Franklin St", [-30, 0.1, 2], "franklin")}
      {label("W Lake St", [2, 0.1, -20], "lake")}
      {label("Chicago River", [8, 0.1, -35], "river")}
      {label("S Branch", [-40, 0.1, 10], "branch")}
    </group>
  );
}

/** Slowly round the address, leaning a little toward the pointer. */
function Rig({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(TARGET.x, TARGET.h * 0.45, -TARGET.n), []);
  // EDIT: the orbit — radius, height, speed (radians per second)
  const narrow = size.width < 640;
  const R = narrow ? 120 : 98;
  const H = narrow ? 96 : 72;
  const SPEED = 0.05;
  useFrame(({ clock }) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    const a = 0.8 + clock.getElapsedTime() * SPEED + p.x * 0.25;
    camera.position.set(look.x + Math.cos(a) * R, H + p.y * 10, look.z + Math.sin(a) * R);
    camera.lookAt(look);
  });
  return null;
}

export default function StudioMap({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

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
        dpr={[1, 1.75]}
        camera={{ fov: 32, near: 1, far: 600, position: [0, 80, 100] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="Map: 211 W. Wacker Drive, Chicago"
      >
        <color attach="background" args={[GROUND]} />
        <fog attach="fog" args={[GROUND, 120, 260]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-60, 120, 40]} intensity={1.4} />
        <Ground />
        <City />
        <Target />
        <Labels />
        <Rig pointer={pointer} />
      </Canvas>
    </div>
  );
}
