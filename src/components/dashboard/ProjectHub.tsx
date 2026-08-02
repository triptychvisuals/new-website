"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";

// EDIT: the production tabs shown in the sub sidebar for every project
const TABS = [
  "Treatment",
  "Storyboard",
  "Shot List",
  "Call Sheet",
  "Equipment",
  "Schedule",
  "Contracts",
  "Invoices",
  "Budget",
  "Messaging",
] as const;

type Tab = (typeof TABS)[number];

// EDIT: how many projects appear in the dashboard sidebar (the first N cards,
// i.e. the ones with real titles). Raise it as more real projects are named.
const PROJECT_COUNT = 12;

/**
 * Production dashboard — a main sidebar with the project list; clicking a
 * project slides a sub sidebar out from it with per-project production tabs
 * (treatment, storyboard, shot list, …). Content panes are placeholders until
 * real documents/data are wired in.
 */
export default function ProjectHub() {
  const list = projects.slice(0, PROJECT_COUNT);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Treatment");

  const open = openSlug !== null;
  const current = list.find((p) => p.slug === openSlug);

  function pickProject(slug: string) {
    if (openSlug === slug) {
      setOpenSlug(null); // clicking the active project closes the sub sidebar
    } else {
      setOpenSlug(slug);
      setTab("Treatment");
    }
  }

  const subSidebarInner = current && (
    <div className="flex h-full w-56 flex-col border-r border-hairline bg-background">
      <div className="flex items-start justify-between gap-2 px-5 pb-4 pt-6">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Project
          </div>
          <div className="mt-1 truncate text-[15px] font-medium tracking-[-0.01em]">
            {current.title}
          </div>
        </div>
        <button
          onClick={() => setOpenSlug(null)}
          aria-label="Close project menu"
          className="mt-0.5 shrink-0 rounded-full border border-hairline px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        {TABS.map((t, i) => {
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`group flex w-full items-baseline gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "text-foreground/80 hover:bg-foreground/[0.06] hover:text-foreground"
              }`}
            >
              <span
                className={`text-[10px] tabular-nums ${
                  active ? "text-background/60" : "text-muted"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <main className="fixed inset-0 z-40 flex bg-background text-foreground">
      {/* MAIN sidebar — project list */}
      <aside className="relative z-30 flex w-44 shrink-0 flex-col border-r border-hairline bg-background md:w-64">
        <div className="px-5 pb-4 pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/triptych-logo.png"
            alt="Triptych"
            className="h-5 w-auto [filter:brightness(0)] dark:[filter:none]"
          />
          <div className="mt-4 text-[10px] uppercase tracking-[0.14em] text-muted">
            Projects
          </div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {list.map((p) => {
            const active = p.slug === openSlug;
            return (
              <button
                key={p.slug}
                onClick={() => pickProject(p.slug)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors ${
                  active
                    ? "bg-foreground/[0.08] text-foreground"
                    : "text-foreground/75 hover:bg-foreground/[0.05] hover:text-foreground"
                }`}
              >
                <span className="truncate">{p.title}</span>
                <span
                  className={`text-[11px] transition-transform duration-300 ${
                    active ? "translate-x-0 text-[color:var(--accent)]" : "text-muted"
                  }`}
                >
                  ›
                </span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-hairline px-5 py-4">
          <a
            href="/"
            className="text-[12px] text-muted transition-colors hover:text-foreground"
          >
            ← Back to site
          </a>
        </div>
      </aside>

      {/* SUB sidebar — slides out from the main sidebar. In-flow on md+ (the
          content shifts over); an overlay that slides from under the main
          sidebar on phones. */}
      <div
        className={`relative z-20 hidden shrink-0 overflow-hidden transition-[width] duration-500 ease-out md:block ${
          open ? "w-56" : "w-0"
        }`}
      >
        <div
          className={`absolute inset-y-0 left-0 w-56 transition-transform duration-500 ease-out ${
            open ? "translate-x-0" : "-translate-x-6"
          }`}
        >
          {subSidebarInner}
        </div>
      </div>
      <div
        className={`fixed inset-y-0 left-44 z-20 w-56 transition-transform duration-500 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {subSidebarInner}
      </div>

      {/* CONTENT */}
      <section className="min-w-0 flex-1 overflow-y-auto">
        {current ? (
          <div className="px-6 py-8 md:px-10">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted">
              {current.title}
            </div>
            <h1 className="mt-1 text-[28px] font-medium tracking-[-0.02em] md:text-[36px]">
              {tab}
            </h1>
            {/* EDIT: real per-project content for each tab goes here */}
            <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-hairline p-10 text-center">
              <div>
                <div className="text-[15px] text-foreground/80">
                  No {tab.toLowerCase()} yet
                </div>
                <div className="mt-1 text-[13px] text-muted">
                  Content for “{current.title}” will live here.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-10 text-center">
            <div>
              <div className="text-[15px] text-foreground/80">
                Select a project
              </div>
              <div className="mt-1 text-[13px] text-muted">
                Pick a project from the sidebar to open its production hub.
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
