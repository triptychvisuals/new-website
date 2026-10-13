import type { Shape } from "@/lib/store";

const PATHS: Record<Shape, string[]> = {
  tee: ["M22 14l10-6h-6a6 6 0 0 0 12 0h-6l10 6 6 10-8 4v26H24V28l-8-4z", "M26 34h12"],
  hoodie: ["M20 20l12-8 12 8 6 12-8 4v26H22V36l-8-4z", "M24 12a8 8 0 0 1 16 0", "M28 42v12M36 42v12", "M30 28l2 8 2-8"],
  cap: ["M14 36a18 18 0 0 1 36 0", "M12 36h40a3 3 0 0 1 0 6H12a3 3 0 0 1 0-6z", "M32 18v18", "M48 40l10 4"],
  print: ["M10 10h44v44H10z", "M16 16h32v32H16z", "M20 40l8-10 6 7 5-4 9 7", "M40 24a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  digital: ["M14 10h24l12 12v32H14z", "M38 10v12h12", "M32 28v16M24 36l8 8 8-8"],
};

/** Simple line drawing of the product over its colour. */
export default function ProductArt({ shape, className = "" }: { shape: Shape; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {PATHS[shape].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
