"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { projects } from "@/lib/projects";

/**
 * "Looking for something?" — type and the project list filters as you go
 * (title or artist), with a random pick for the undecided. All local: the
 * 30 projects are already in the bundle, so nothing is fetched.
 */
export default function ProjectFinder() {
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return projects.filter((p) => p.title.toLowerCase().includes(s) || p.artist?.toLowerCase().includes(s)).slice(0, 6);
  }, [q]);
  const router = useRouter();
  // Picked when clicked, not while rendering.
  const surprise = () => router.push(`/work/${projects[Math.floor(Math.random() * projects.length)].slug}`);

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="nf-q" className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        Looking for a project?
      </label>
      <div className="mt-3 flex items-center gap-3 border-b border-foreground/30 focus-within:border-foreground">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden className="shrink-0 text-muted">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          id="nf-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Artist or title…"
          autoComplete="off"
          className="w-full bg-transparent py-3 text-lg outline-none placeholder:text-muted"
        />
      </div>

      {q.trim() && (
        <ul className="mt-2 divide-y divide-hairline" aria-live="polite">
          {hits.length === 0 && <li className="py-3 text-sm text-muted">Nothing by that name — try the artist.</li>}
          {hits.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent">
                <span>
                  <span className="text-[15px] font-medium">{p.title}</span>
                  {p.artist && <span className="ml-2 text-[13px] text-muted">{p.artist}</span>}
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{p.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="/" className="rounded-full bg-foreground px-5 py-2 text-[14px] font-medium text-background transition-opacity hover:opacity-85">
          Back home
        </Link>
        <Link href="/projects" className="rounded-full border border-hairline px-5 py-2 text-[14px] text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground">
          All projects
        </Link>
        <button type="button" onClick={surprise} className="rounded-full border border-hairline px-5 py-2 text-[14px] text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground">
          Surprise me <span aria-hidden>↗</span>
        </button>
      </div>
    </div>
  );
}
