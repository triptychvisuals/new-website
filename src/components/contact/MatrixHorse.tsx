"use client";

import { useEffect, useRef } from "react";

/**
 * The first motion picture — Eadweard Muybridge's "The Horse in Motion"
 * (1878) — as Matrix code. A horse and rider gallop on the spot, drawn each
 * frame into a tiny offscreen canvas; every cell the silhouette covers
 * becomes a bright green glyph, over a rain of falling code and the
 * numbered backdrop lines of Muybridge's track at Palo Alto. Nothing is
 * downloaded. Runs only while on screen; one still frame for reduced motion.
 */

// EDIT: the look
const COLS = 64; // characters across (more = finer horse, smaller glyphs)
const ROWS = 34;
const GREEN = "#00ff41";
const BRIGHT = "#c8ffd6";
const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ012345789Z:=*+<>";
const STRIDE_S = 0.72; // seconds per stride
const FPS = 24;

const rndGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Draw the horse and rider at stride phase t (0–1) into a 160 × 90 space. */
function drawHorse(g: CanvasRenderingContext2D, t: number) {
  const TAU = Math.PI * 2;
  const s = (p: number) => Math.sin(TAU * (t + p));
  g.save();
  g.fillStyle = g.strokeStyle = "#fff";
  g.lineCap = g.lineJoin = "round";
  const bob = -2.2 * s(0.15);
  g.translate(0, bob);

  // legs: [hip x, hip y, phase, fore?]
  const legs: [number, number, number, boolean][] = [
    [58, 48, 0.0, false], // hind, far
    [60, 48, 0.08, false], // hind, near
    [100, 50, 0.38, true], // fore, far
    [102, 50, 0.46, true], // fore, near
  ];
  for (const [hx, hy, ph, fore] of legs) {
    const swing = fore ? 8 + 42 * s(ph) : -6 + 38 * s(ph);
    const lift = Math.max(0, Math.sin(TAU * (t + ph) + Math.PI / 2));
    const bend = fore ? -(6 + 70 * lift) : 18 + 34 * lift;
    const a1 = (swing * Math.PI) / 180;
    const a2 = ((swing + bend) * Math.PI) / 180;
    const kx = hx + Math.sin(a1) * 15;
    const ky = hy + Math.cos(a1) * 15;
    const fx = kx + Math.sin(a2) * 16;
    const fy = ky + Math.cos(a2) * 16;
    g.lineWidth = fore ? 5.5 : 7;
    g.beginPath();
    g.moveTo(hx, hy);
    g.lineTo(kx, ky);
    g.stroke();
    g.lineWidth = 3.2;
    g.beginPath();
    g.moveTo(kx, ky);
    g.lineTo(fx, fy);
    g.stroke();
  }

  // body, quarters, chest
  g.beginPath();
  g.ellipse(80, 42, 29, 10.5, 0, 0, TAU);
  g.fill();
  g.beginPath();
  g.arc(58, 41, 11, 0, TAU);
  g.fill();
  g.beginPath();
  g.arc(101, 43, 10, 0, TAU);
  g.fill();

  // neck and head, nodding with the stride
  const nod = (4 * s(0.3) * Math.PI) / 180;
  g.save();
  g.translate(104, 38);
  g.rotate(nod);
  g.lineWidth = 11;
  g.beginPath();
  g.moveTo(0, 2);
  g.lineTo(14, -16);
  g.stroke();
  g.lineWidth = 6.5;
  g.beginPath();
  g.moveTo(14, -16);
  g.lineTo(27, -8);
  g.stroke();
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(13, -20);
  g.lineTo(11, -25); // ear
  g.stroke();
  g.restore();

  // tail, streaming
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(48, 36);
  g.quadraticCurveTo(38, 34 + 3 * s(0.2), 30, 44 + 4 * s(0.25));
  g.stroke();

  // the rider
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(82, 31);
  g.lineTo(90, 18);
  g.stroke();
  g.beginPath();
  g.arc(92, 13, 3.6, 0, TAU);
  g.fill();
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(89, 21);
  g.lineTo(102, 27); // arms to the reins
  g.moveTo(84, 32);
  g.lineTo(90, 38);
  g.lineTo(87, 44); // leg in the stirrup
  g.stroke();
  g.restore();
}

export default function MatrixHorse({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // the silhouette is drawn at grid resolution, then read back per cell
    const mask = document.createElement("canvas");
    mask.width = COLS;
    mask.height = ROWS;
    const mg = mask.getContext("2d", { willReadFrequently: true })!;

    // code rain: a head per column, a trail behind it, glyphs that change
    const drops = Array.from({ length: COLS }, () => ({ y: Math.random() * ROWS * 2 - ROWS, v: 0.25 + Math.random() * 0.5, len: 6 + Math.floor(Math.random() * 14) }));
    const glyphs = Array.from({ length: COLS * ROWS }, rndGlyph);

    let cw = 0;
    let ch = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      cw = canvas.width / COLS;
      ch = canvas.height / ROWS;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (time: number) => {
      const t = ((time / 1000) % STRIDE_S) / STRIDE_S;
      mg.clearRect(0, 0, COLS, ROWS);
      mg.save();
      mg.scale(COLS / 160, ROWS / 90);
      drawHorse(mg, t);
      mg.restore();
      const px = mg.getImageData(0, 0, COLS, ROWS).data;

      ctx.fillStyle = "#020403";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${Math.floor(ch * 0.92)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Muybridge's backdrop: numbered vertical lines, and the track
      ctx.strokeStyle = "rgba(0,255,65,.10)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 12; i++) {
        const x = Math.round((canvas.width / 12) * i) + 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height * 0.86);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(0,255,65,.10)";
      ctx.fillRect(0, canvas.height * 0.9, canvas.width, Math.max(1, ch * 0.12));

      for (let c = 0; c < COLS; c++) {
        const d = drops[c];
        for (let r = 0; r < ROWS; r++) {
          const i = r * COLS + c;
          const a = px[i * 4 + 3] / 255;
          const x = c * cw + cw / 2;
          const y = r * ch + ch / 2;
          if (a > 0.3) {
            // the horse: bright, flickering glyphs
            if (Math.random() < 0.08) glyphs[i] = rndGlyph();
            ctx.globalAlpha = 0.55 + a * 0.45;
            ctx.fillStyle = Math.random() < 0.06 ? "#ffffff" : BRIGHT;
            ctx.shadowColor = GREEN;
            ctx.shadowBlur = cw * 0.9; // the glow
            ctx.fillText(glyphs[i], x, y);
            ctx.shadowBlur = 0;
            continue;
          }
          const behind = d.y - r;
          if (behind >= 0 && behind < d.len) {
            // the rain: brightest at the head, fading up the trail
            ctx.globalAlpha = behind < 1 ? 0.9 : 0.42 * (1 - behind / d.len);
            ctx.fillStyle = behind < 1 ? BRIGHT : GREEN;
            if (behind < 1 && Math.random() < 0.3) glyphs[i] = rndGlyph();
            ctx.fillText(glyphs[i], x, y);
          }
        }
        d.y += d.v;
        if (d.y - d.len > ROWS) {
          d.y = -Math.random() * 10;
          d.v = 0.25 + Math.random() * 0.5;
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = 0;
    let running = false;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (time - last < 1000 / FPS) return;
      last = time;
      frame(time);
    };
    const io = new IntersectionObserver(([e]) => {
      if (reduced) {
        frame(STRIDE_S * 1000 * 0.4); // one still frame: legs gathered under the body
        return;
      }
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="A horse and rider galloping, drawn in falling green code — after Eadweard Muybridge's The Horse in Motion, 1878"
      className={`block w-full ${className}`}
    />
  );
}
