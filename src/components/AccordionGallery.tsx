"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export type AccordionItem = {
  /** The picture (any aspect: it's cropped to fill the panel). */
  image: string;
  /** Used if `image` fails (YouTube has no SD still for some uploads). */
  fallback?: string;
  label: string;
  /** Under the label, smaller (artist · year). */
  sub?: string;
  link: string;
};

/**
 * Accordion gallery: a row of picture panels; the active one opens wide,
 * the rest squeeze beside it. Hover opens a panel (tap on a phone, where a
 * second tap follows its link); the open one carries its name in a glass
 * chip, the closed ones carry theirs down the edge. Only flex-grow and
 * opacity animate. Phones stack the panels and open them tall instead.
 *
 *   items        the pictures, labels and links
 *   defaultIndex which panel starts open
 *   expandRatio  how much of the row the open panel takes (0–1)
 *   trigger      "hover" opens on hover; "click" only on click / tap
 */
export default function AccordionGallery({
  items,
  defaultIndex = 0,
  expandRatio = 0.52,
  trigger = "hover",
  className = "",
}: {
  items: AccordionItem[];
  defaultIndex?: number;
  expandRatio?: number;
  trigger?: "hover" | "click";
  className?: string;
}) {
  const [active, setActive] = useState(Math.min(defaultIndex, items.length - 1));
  const rest = items.length > 1 ? (1 - expandRatio) / (items.length - 1) : 1;
  // The panel a tap just opened: that tap must not also follow the link
  // (the next one does). Set on pointerdown, read by the click that follows.
  const justOpened = useRef<number | null>(null);

  return (
    <div
      className={`acc-gallery ${className}`}
      // EDIT: the gallery's height — row on sm+, stacked column on phones
      style={{ ["--acc-h" as string]: "clamp(420px, 62vh, 760px)" }}
      // A mouse leaving the row puts the default panel back; a finger
      // lifting (touch fires mouse events too) leaves the tapped one open.
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setActive(Math.min(defaultIndex, items.length - 1));
      }}
    >
      {items.map((it, i) => {
        const open = i === active;
        const letterboxed = it.image.includes("/sddefault.");
        return (
          <Link
            key={`${it.link}-${i}`}
            href={it.link}
            aria-label={it.label}
            aria-current={open ? "true" : undefined}
            data-open={open ? "" : undefined}
            className="acc-panel group"
            style={{ flexGrow: open ? expandRatio : rest }}
            onPointerEnter={trigger === "hover" ? (e) => { if (e.pointerType === "mouse") setActive(i); } : undefined}
            onFocus={() => setActive(i)}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse") return;
              if (!open) {
                justOpened.current = i;
                setActive(i);
              }
            }}
            onClick={(e) => {
              // A closed panel opens first; tapping the open one follows its link.
              if (justOpened.current === i) {
                e.preventDefault();
                justOpened.current = null;
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.image}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (it.fallback && e.currentTarget.src !== it.fallback) e.currentTarget.src = it.fallback;
              }}
              // a YouTube SD still is 4:3 with the 16:9 frame letterboxed; zoom crops the bars
              className={`acc-img ${letterboxed ? "scale-[1.34]" : ""}`}
            />
            <span aria-hidden className="acc-shade" />
            {/* Open: a glass chip with the name. Closed: the name down the edge. */}
            <span className="acc-label glass-dark">
              <span className="block text-[15px] font-medium leading-tight sm:text-[17px]">{it.label}</span>
              {it.sub && <span className="mt-0.5 block text-[12px] text-white/70 sm:text-[13px]">{it.sub}</span>}
            </span>
            <span className="acc-side">{it.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
