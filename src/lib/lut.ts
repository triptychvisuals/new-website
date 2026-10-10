// ---------------------------------------------------------------------------
// 3D .cube LUT support for the Log ↔ Graded slider on project pages.
//
// The portal's Content tab stores each project's grade as raw .cube text
// (lut.data on the feed work, ≤ ~150KB — big LUTs are resampled portal-side).
// This module parses that text and maps pixels through it with trilinear
// interpolation — a duplicate of the portal's editor-side implementation
// (triptych-portal app/(portal)/website/page.tsx) so both preview and site
// grade identically. Keep the two in step.
// ---------------------------------------------------------------------------

export type Lut3D = { size: number; data: Float32Array };

/** Parse a 3D .cube (LUT_3D_SIZE N, N ≤ 33, lines of "r g b" floats).
 *  Comments, TITLE and DOMAIN_* lines are ignored. Throws on anything else. */
export function parseCubeLut(text: string): Lut3D {
  let size = 0;
  const vals: number[] = [];
  for (const line of text.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith("#")) continue;
    const m = /^LUT_3D_SIZE\s+(\d+)/i.exec(s);
    if (m) {
      size = parseInt(m[1], 10);
      continue;
    }
    if (/^LUT_1D_SIZE/i.test(s)) throw new Error("1D LUT — a 3D .cube is required");
    if (/^[A-Za-z]/.test(s)) continue; // TITLE, DOMAIN_MIN/MAX, other keywords
    const parts = s.split(/\s+/).map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
      vals.push(parts[0], parts[1], parts[2]);
    }
  }
  if (!size || size < 2 || size > 33) throw new Error("bad or missing LUT_3D_SIZE");
  if (vals.length !== size * size * size * 3) throw new Error("cube data does not match LUT_3D_SIZE");
  return { size, data: Float32Array.from(vals) };
}

/** Trilinear sample. r/g/b in 0..1 → [r, g, b] in LUT output space. */
export function sampleLut(lut: Lut3D, r: number, g: number, b: number): [number, number, number] {
  const n = lut.size;
  const max = n - 1;
  const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const x = cl(r) * max;
  const y = cl(g) * max;
  const z = cl(b) * max;
  const x0 = Math.floor(x), y0 = Math.floor(y), z0 = Math.floor(z);
  const x1 = Math.min(x0 + 1, max), y1 = Math.min(y0 + 1, max), z1 = Math.min(z0 + 1, max);
  const fx = x - x0, fy = y - y0, fz = z - z0;
  const d = lut.data;
  // .cube order: red varies fastest, then green, then blue.
  const at = (i: number, j: number, k: number) => 3 * (i + j * n + k * n * n);
  const out: [number, number, number] = [0, 0, 0];
  for (let c = 0; c < 3; c++) {
    const c000 = d[at(x0, y0, z0) + c], c100 = d[at(x1, y0, z0) + c];
    const c010 = d[at(x0, y1, z0) + c], c110 = d[at(x1, y1, z0) + c];
    const c001 = d[at(x0, y0, z1) + c], c101 = d[at(x1, y0, z1) + c];
    const c011 = d[at(x0, y1, z1) + c], c111 = d[at(x1, y1, z1) + c];
    const c00 = c000 + (c100 - c000) * fx;
    const c10 = c010 + (c110 - c010) * fx;
    const c01 = c001 + (c101 - c001) * fx;
    const c11 = c011 + (c111 - c011) * fx;
    const c0 = c00 + (c10 - c00) * fy;
    const c1 = c01 + (c11 - c01) * fy;
    out[c] = c0 + (c1 - c0) * fz;
  }
  return out;
}

/** Map every pixel of an ImageData through the LUT, in place. */
export function applyLutToImageData(lut: Lut3D, img: ImageData): void {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const [r, g, b] = sampleLut(lut, d[i] / 255, d[i + 1] / 255, d[i + 2] / 255);
    d[i] = Math.round(Math.min(1, Math.max(0, r)) * 255);
    d[i + 1] = Math.round(Math.min(1, Math.max(0, g)) * 255);
    d[i + 2] = Math.round(Math.min(1, Math.max(0, b)) * 255);
  }
}

/**
 * Client-side: load a frame (data-URL or same-origin path), scale it to
 * ≤ maxEdge px, and return { original, graded } data-URLs — the graded one
 * mapped through the given .cube text. Throws on a bad image or LUT; callers
 * fall back to the placeholder look.
 */
export async function gradeFrame(
  src: string,
  cubeText: string,
  maxEdge = 720
): Promise<{ original: string; graded: string }> {
  const lut = parseCubeLut(cubeText);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("bad image"));
    el.src = src;
  });
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(2, Math.round(img.naturalWidth * scale));
  const h = Math.max(2, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");
  ctx.drawImage(img, 0, 0, w, h);
  const original = canvas.toDataURL("image/jpeg", 0.9);
  const pixels = ctx.getImageData(0, 0, w, h);
  applyLutToImageData(lut, pixels);
  ctx.putImageData(pixels, 0, 0);
  const graded = canvas.toDataURL("image/jpeg", 0.9);
  return { original, graded };
}
