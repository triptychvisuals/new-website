"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, useGLTF } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Component, type ReactNode } from "react";
import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import type { Decal } from "@/lib/store";

/** If the model can't load (old browser, blocked, bad file) the photo stays. */
class Fallback extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * A store product as a 3D model (made in Higgsfield from the product
 * photos): it floats, turns slowly on its own, and spins when dragged
 * sideways, with a little momentum. Vertical swipes still scroll the page.
 *
 * Only renders while its card is on screen; the photo shows until the
 * model has loaded (and stays for anyone with WebGL off or reduced motion).
 */

// EDIT: the feel
const AUTO_SPIN = 0.25; // rad/s when nobody's dragging
const DRAG = 0.008; // rad per px dragged
const FRICTION = 0.92; // how quickly a flick slows down (per frame)

type Spin = { angle: number; velocity: number; dragging: boolean };

// The studio mark (same paths as the site's logo), in a 124 × 78.4 box.
const MARK = [
  "M4,82 L4,12 C4,6.5 5.2,5 6.8,7.8 C11,14.5 19,13.5 27.5,21 C31.5,24.6 34,29 34,35 L34,79 C34,81 33,82 31,82 Z",
  "M51,82 C48.8,82 48,81 48,79 L48,34 C48,22.5 53.5,16.5 61,10 C63.4,7.9 64.6,6.6 66,3.6 C67.4,6.6 68.6,7.9 71,10 C78.5,16.5 84,22.5 84,34 L84,79 C84,81 83.2,82 81,82 Z",
  "M128,82 L128,12 C128,6.5 126.8,5 125.2,7.8 C121,14.5 113,13.5 104.5,21 C100.5,24.6 98,29 98,35 L98,79 C98,81 99,82 101,82 Z",
];

/** Draw one detail sharp, on a canvas: its picture and width / height. */
function drawDecal(d: Decal): { canvas: HTMLCanvasElement; aspect: number } {
  const font = getComputedStyle(document.body).fontFamily || "Arial, sans-serif";
  const c = document.createElement("canvas");
  const g = c.getContext("2d")!;
  if (d.kind === "embroidery") {
    c.width = 1400;
    c.height = 410;
    const lines = d.lines ?? [];
    g.font = `700 112px ${font}`;
    g.textBaseline = "top";
    lines.forEach((l, i) => {
      // a soft shadow under the stitches, then the thread
      g.fillStyle = "rgba(0,0,0,0.25)";
      g.fillText(l, 6, 8 + i * 134 + 3, c.width - 12);
      g.fillStyle = "#121212";
      g.fillText(l, 4, 6 + i * 134, c.width - 12);
    });
  } else if (d.kind === "patch") {
    c.width = 900;
    c.height = 560;
    g.fillStyle = "#0e0e0e";
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = "rgba(255,255,255,0.85)";
    g.lineWidth = 4;
    const pad = 36;
    const rows = [118, 118, 118];
    let y = pad;
    g.fillStyle = "#f2f2f2";
    g.textAlign = "center";
    g.textBaseline = "middle";
    (d.lines ?? []).slice(0, 3).forEach((l, i) => {
      g.strokeRect(pad, y, c.width - pad * 2, rows[i]);
      g.font = `600 ${i === 1 ? 52 : 56}px ${font}`;
      g.fillText(l, c.width / 2, y + rows[i] / 2 + 2, c.width - pad * 3);
      y += rows[i] + 18;
    });
    if (d.lines?.[3]) {
      g.font = `600 34px ${font}`;
      g.fillText(d.lines[3], c.width / 2, y + 30, c.width - pad * 3);
    }
  } else {
    c.width = 512;
    c.height = 400;
    g.fillStyle = "#0e0e0e";
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "#f5f5f5";
    const k = 260 / 124;
    g.translate((c.width - 124 * k) / 2 - 4 * k, (c.height - 78.4 * k) / 2 - 3.6 * k);
    g.scale(k, k);
    MARK.forEach((m) => g.fill(new Path2D(m)));
  }
  return { canvas: c, aspect: c.width / c.height };
}

/** The triangles of a (non-indexed) geometry that face `dir`, or null if none. */
function facing(g: THREE.BufferGeometry, dir: THREE.Vector3): THREE.BufferGeometry | null {
  const pos = g.getAttribute("position");
  const nor = g.getAttribute("normal");
  const uv = g.getAttribute("uv");
  const keep: number[] = [];
  const n = new THREE.Vector3();
  for (let t = 0; t < pos.count; t += 3) {
    n.set(0, 0, 0);
    for (let k = 0; k < 3; k++) n.add(new THREE.Vector3().fromBufferAttribute(nor, t + k));
    if (n.dot(dir) > 0.15) keep.push(t, t + 1, t + 2);
  }
  g.dispose();
  if (!keep.length) return null;
  const out = new THREE.BufferGeometry();
  const pick = (a: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, size: number) => {
    const arr = new Float32Array(keep.length * size);
    keep.forEach((v, i) => {
      for (let c = 0; c < size; c++) arr[i * size + c] = a.getComponent(v, c);
    });
    return new THREE.BufferAttribute(arr, size);
  };
  out.setAttribute("position", pick(pos, 3));
  out.setAttribute("normal", pick(nor, 3));
  out.setAttribute("uv", pick(uv, 2));
  return out;
}

/**
 * Put each detail on the model: find where it sits on the front (a ray
 * straight in from the camera side) and project the sharp picture onto the
 * fabric there, so it follows the folds.
 */
function addDecals(s: THREE.Object3D, decals: Decal[]): THREE.Group {
  const out = new THREE.Group();
  s.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(s);
  const size = box.getSize(new THREE.Vector3());
  const meshes: THREE.Mesh[] = [];
  s.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  const ray = new THREE.Raycaster();
  const dir = new THREE.Vector3(0, 0, -1);
  for (const d of decals) {
    const x = box.min.x + d.u * size.x;
    const y = box.max.y - d.v * size.y;
    ray.set(new THREE.Vector3(x, y, box.max.z + 1), dir);
    const hit = ray.intersectObjects(meshes, false)[0];
    if (!hit) continue;
    const art = drawDecal(d);
    const w = d.w * size.x;
    const o = new THREE.Object3D();
    o.position.copy(hit.point);
    o.lookAt(hit.point.clone().add(new THREE.Vector3(0, 0, 1)));
    const raw = new DecalGeometry(hit.object as THREE.Mesh, hit.point, o.rotation, new THREE.Vector3(w, w / art.aspect, size.z * 0.12));
    // keep only fabric facing the way it was projected from, so a detail
    // never shows through on the far side of the shirt
    const geo = facing(raw, new THREE.Vector3(0, 0, 1));
    if (!geo) continue;
    const tex = new THREE.CanvasTexture(art.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: d.kind === "embroidery" ? 0.95 : 0.75,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      depthWrite: false,
    });
    out.add(new THREE.Mesh(geo, mat));
  }
  return out;
}

function Model({ src, decals, target, onReady }: { src: string; decals?: Decal[]; target: React.RefObject<HTMLDivElement | null>; onReady: () => void }) {
  const { scene } = useGLTF(src);
  const group = useRef<THREE.Group>(null);
  const spin = useRef<Spin>({ angle: -0.35, velocity: 0, dragging: false });

  // horizontal drag on the card spins it; the browser keeps vertical
  // panning (touch-action on the card), so pages still scroll on phones
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let last: number | null = null;
    const down = (e: PointerEvent) => {
      last = e.clientX;
      spin.current.dragging = true;
      spin.current.velocity = 0;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (last === null) return;
      const dx = e.clientX - last;
      last = e.clientX;
      spin.current.angle += dx * DRAG;
      spin.current.velocity = dx * DRAG;
    };
    const up = () => {
      last = null;
      spin.current.dragging = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [target]);

  // centre it and scale it to the same size whatever the source units
  const model = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const k = 1.8 / Math.max(size.x, size.y, size.z);
    s.position.copy(centre).multiplyScalar(-k);
    s.scale.setScalar(k);
    const all = new THREE.Group();
    all.add(s);
    if (decals?.length) all.add(addDecals(s, decals));
    return all;
  }, [scene, decals]);

  useLayoutEffect(() => onReady(), [onReady]);

  useFrame((_, dt) => {
    const s = spin.current;
    if (!s.dragging) {
      // a flick coasts to a stop, then the slow turn takes over again
      s.velocity *= FRICTION;
      s.angle += (Math.abs(s.velocity) > 0.0005 ? s.velocity : 0) + AUTO_SPIN * dt;
    }
    if (group.current) group.current.rotation.y = s.angle;
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

export default function ProductModel({ src, poster, alt, decals }: { src: string; poster: string; alt: string; decals?: Decal[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false); // mount the canvas only near the viewport
  const [ready, setReady] = useState(false);
  const [can3d, setCan3d] = useState(true);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setCan3d(false), 0);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
      role="img"
      aria-label={`${alt}, 3D: drag to turn it`}
    >
      {/* the photo until the model is in */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready && can3d ? "opacity-0" : ""}`}
      />
      {can3d && near && (
        <Fallback onError={() => setCan3d(false)}>
        <Canvas
          className={`!absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          camera={{ position: [0, 0.15, 3.6], fov: 35 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 3]} intensity={1.6} />
          {/* studio light for the reflections — built here, nothing downloaded */}
          <Environment resolution={128}>
            <Lightformer form="rect" intensity={3} position={[0, 3, 2]} scale={[6, 2, 1]} />
            <Lightformer form="rect" intensity={1.5} position={[-4, 0.5, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
            <Lightformer form="rect" intensity={1.5} position={[4, 0.5, 1]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} />
            <Lightformer form="rect" intensity={0.6} position={[0, 0, -4]} scale={[8, 4, 1]} />
          </Environment>
          <Suspense fallback={null}>
            <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.55} floatingRange={[-0.06, 0.06]}>
              <Model src={src} decals={decals} target={box} onReady={onReady} />
            </Float>
          </Suspense>
          <ContactShadows position={[0, -1.08, 0]} opacity={0.35} scale={4} blur={2.6} far={2} resolution={256} frames={Infinity} />
        </Canvas>
        </Fallback>
      )}
    </div>
  );
}
