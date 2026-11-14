"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";
import CopyButton from "@/components/press/CopyButton";

// EDIT: the choices.
const TYPES = ["Music video", "Commercial", "Brand film", "Live / event", "Something else"];
const TIMELINES = ["ASAP", "2–4 weeks", "1–3 months", "Flexible"];
const DELIVERABLES = ["Main cut", "Teasers", "Vertical cuts", "Behind the scenes", "Stills"];
const BUDGET_MIN = 2500;
const BUDGET_MAX = 60000;
const BUDGET_STEP = 500;

type Brief = { type: string; budget: number; timeline: string; deliverables: string[]; name: string; email: string; artist: string; links: string; notes: string };
const EMPTY: Brief = { type: TYPES[0], budget: 12000, timeline: TIMELINES[1], deliverables: [DELIVERABLES[0]], name: "", email: "", artist: "", links: "", notes: "" };
const KEY = "triptych-brief";

const money = (n: number) => (n >= BUDGET_MAX ? `$${(BUDGET_MAX / 1000).toFixed(0)}k+` : `$${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k`);

/**
 * Start-a-project brief builder: pick the type, slide the budget, pick a
 * timeline and deliverables, add your details — and the brief writes itself
 * on the right (a call-sheet style summary). Send it by email, copy it, or
 * carry it into the portal. Drafts save in the browser so a reload keeps
 * your place.
 */
export default function BriefBuilder() {
  const [b, setB] = useState<Brief>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(KEY);
        if (saved) setB({ ...EMPTY, ...JSON.parse(saved) });
      } catch {}
      setLoaded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(b));
    } catch {}
  }, [b, loaded]);

  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setB((x) => ({ ...x, [k]: v }));
  const toggle = (d: string) => set("deliverables", b.deliverables.includes(d) ? b.deliverables.filter((x) => x !== d) : [...b.deliverables, d]);

  const text = useMemo(
    () =>
      [
        `PROJECT BRIEF — ${site.name} ${site.suffix}`,
        "",
        `Type         ${b.type}`,
        `Budget       ${money(b.budget)}`,
        `Timeline     ${b.timeline}`,
        `Deliverables ${b.deliverables.length ? b.deliverables.join(", ") : "—"}`,
        "",
        `From         ${b.name || "—"}${b.artist ? ` · ${b.artist}` : ""}`,
        `Email        ${b.email || "—"}`,
        b.links ? `Links        ${b.links}` : "",
        b.notes ? `\n${b.notes}` : "",
      ]
        .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
        .join("\n"),
    [b]
  );
  const ready = b.name.trim() && /\S+@\S+\.\S+/.test(b.email);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Project brief — ${b.type}${b.artist ? ` · ${b.artist}` : ""}`)}&body=${encodeURIComponent(text)}`;
  const portal = `${site.contactUrl}?${new URLSearchParams({ type: b.type, budget: String(b.budget), timeline: b.timeline }).toString()}`;

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${on ? "border-foreground bg-foreground text-background" : "border-hairline text-foreground/70 hover:border-foreground/40 hover:text-foreground"}`;
  const field = "w-full border-b border-hairline bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted focus:border-foreground";
  const label = "font-mono text-[11px] uppercase tracking-[0.15em] text-muted";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      {/* The form */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
        <fieldset>
          <legend className={label}>01 · What are we making?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t} type="button" onClick={() => set("type", t)} aria-pressed={b.type === t} className={chip(b.type === t)}>{t}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <div className="flex items-baseline justify-between">
            <legend className={label}>02 · Budget</legend>
            <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-medium tabular-nums tracking-tight">{money(b.budget)}</span>
          </div>
          <input
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            value={b.budget}
            onChange={(e) => set("budget", Number(e.target.value))}
            aria-label="Budget"
            className="mt-3 w-full accent-[var(--accent)]"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <span>{money(BUDGET_MIN)}</span>
            <span>{money(BUDGET_MAX)}</span>
          </div>
        </fieldset>

        <fieldset>
          <legend className={label}>03 · When</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {TIMELINES.map((t) => (
              <button key={t} type="button" onClick={() => set("timeline", t)} aria-pressed={b.timeline === t} className={chip(b.timeline === t)}>{t}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={label}>04 · Deliverables</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {DELIVERABLES.map((d) => {
              const on = b.deliverables.includes(d);
              return (
                <button key={d} type="button" onClick={() => toggle(d)} aria-pressed={on} className={chip(on)}>
                  {on ? "✓ " : ""}{d}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <legend className={`${label} col-span-full`}>05 · You</legend>
          <input value={b.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" autoComplete="name" className={field} />
          <input value={b.email} onChange={(e) => set("email", e.target.value)} placeholder="Email" type="email" autoComplete="email" className={field} />
          <input value={b.artist} onChange={(e) => set("artist", e.target.value)} placeholder="Artist, label or brand" className={`${field} sm:col-span-2`} />
          <input value={b.links} onChange={(e) => set("links", e.target.value)} placeholder="Links — the track, references, a deck" className={`${field} sm:col-span-2`} />
          <textarea value={b.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything else — the idea, the vibe, the deadline that matters" rows={3} className={`${field} resize-none sm:col-span-2`} />
        </fieldset>
      </form>

      {/* The brief, written as you go */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-foreground p-6 text-background sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] opacity-60">Your brief</p>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] opacity-60">{ready ? "Ready" : "Add name + email"}</span>
          </div>
          <pre className="mt-5 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed opacity-90">{text}</pre>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={ready ? mailto : undefined}
              aria-disabled={!ready}
              className={`inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-[14px] font-medium text-foreground transition-opacity ${ready ? "hover:opacity-85" : "pointer-events-none opacity-40"}`}
            >
              Send brief <span aria-hidden>→</span>
            </a>
            <a href={portal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-background/40 px-5 py-2.5 text-[14px] text-background transition-colors hover:border-background">
              Continue in the portal <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="mt-3 [&_button]:border-background/30 [&_button]:text-background/80 [&_button:hover]:border-background [&_button:hover]:text-background">
            <CopyButton text={text} label="Copy brief" />
          </div>
        </div>
        <p className="mt-4 text-[13px] text-muted">Drafts save in this browser. Nothing is sent until you press Send.</p>
      </aside>
    </div>
  );
}
