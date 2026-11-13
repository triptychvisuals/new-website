"use client";

import Link from "next/link";
import { youtubeEmbed } from "@/lib/youtube";
import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import type { PortalWork } from "@/lib/siteContent";
import { site } from "@/lib/site";

/**
 * Project page, in the flat house style: a back link, the category and
 * year over the title, the artist and a line about it; the film full width
 * in a rounded frame; the details as flat cells; the Finished Frames
 * gallery; then three more projects.
 *
 * Frames: drop stills into /public/work/<slug>/ (jpg / png / webp — any name,
 * `camera.png` excluded) and they appear here automatically, as do the
 * frames published from the portal's Delivery tab (public addresses on
 * the portal's bucket, through the feed). Each has a Pin-it button so
 * visitors save them to Pinterest. The pin's media is the frame; its link
 * is this project's page — pins carry people back to the video. The same
 * frame and link ride on data-pin-* attributes, so the Pinterest browser
 * button picks the right picture and link too.
 */

// EDIT: placeholder tiles shown until a project has real frames uploaded.
const PLACEHOLDER_COUNT = 6;

/** A frame's absolute address: on this site, or already on the portal's bucket. */
function absolute(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${site.url}${src}`;
}

/** The words Pinterest pre-fills on a pin of a frame. */
function pinDescription(title: string): string {
  // EDIT: the description Pinterest pre-fills on the pin
  return `${title} — ${site.name} ${site.suffix} · ${site.url}`;
}

/** Pinterest save URL for one frame. */
function pinUrl(slug: string, frameSrc: string, title: string): string {
  const params = new URLSearchParams({
    url: `${site.url}/work/${slug}`,
    media: absolute(frameSrc),
    description: pinDescription(title),
  });
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
}

function PinButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Save this frame to Pinterest"
      className="pd-pin"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 13px",
        borderRadius: 999,
        background: "#e60023",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".01em",
      }}
    >
      {/* Pinterest "P" mark */}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.17-.11-.95-.2-2.4.04-3.44.22-.93 1.4-5.94 1.4-5.94s-.36-.71-.36-1.76c0-1.65.96-2.88 2.15-2.88 1.01 0 1.5.76 1.5 1.67 0 1.02-.65 2.54-.98 3.95-.28 1.18.59 2.14 1.75 2.14 2.11 0 3.72-2.22 3.72-5.43 0-2.84-2.04-4.82-4.96-4.82-3.38 0-5.36 2.53-5.36 5.15 0 1.02.39 2.11.88 2.71.1.12.11.22.08.34l-.33 1.34c-.05.22-.17.26-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.77 2.74-7.24 7.9-7.24 4.15 0 7.38 2.96 7.38 6.91 0 4.13-2.6 7.45-6.21 7.45-1.21 0-2.35-.63-2.74-1.37l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14 1.12.35 2.31.54 3.54.54 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
      </svg>
      Pin it
    </a>
  );
}

/** A neighbouring project for the "More projects" row. */
export type MoreProject = { href: string; title: string; sub: string; media?: string; gradient: string };

export default function ProjectDetail({
  project,
  work,
  gradient,
  media,
  frames = [],
  more = [],
}: {
  project: Project;
  /** Portal detail fields (synopsis, client, runtime…) when the feed has them. */
  work?: PortalWork;
  gradient: string;
  media?: string;
  /** /work/<slug>/… stills found on disk (absolute public paths). */
  frames?: string[];
  /** EDIT: how many show is set in app/work/[slug]/page.tsx. */
  more?: MoreProject[];
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reel = project.video;
  // GIF (or any non-mp4/webm) reels render as a plain looping <img> — no player.
  // A clip from the portal keeps its extension on a bucket address (…/clip.mp4).
  const reelIsVideo = !!reel && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(reel);
  const poster = media && /\.(png|jpe?g|webp|svg)(\?.*)?$/i.test(media) ? media : undefined;
  // The clip's own poster frame shows in the player before play.
  const videoPoster = work?.clipPoster && reel === work?.clip ? work.clipPoster : undefined;

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  // Details that have values (the portal fills them in; authored
  // category/artist/year always exist).
  const synopsis = work?.synopsis;
  const meta: [string, string][] = (
    [
      ["Client", work?.clientCompany],
      ["Artist", project.artist],
      ["Category", project.category],
      ["Year", project.year],
      ["Runtime", work?.runtime],
      ["Location", work?.location],
      ["Format", work?.format],
      ["Released", work?.dateReleased],
    ] as [string, string | undefined][]
  ).filter((row): row is [string, string] => !!row[1]);

  const fill = "absolute inset-0 h-full w-full object-cover";

  return (
    <main className="pd mx-auto w-full max-w-[1760px] px-5 pb-24 lg:px-10">
      <style>{CSS}</style>

      {/* Title block */}
      <section className="pt-8 sm:pt-12">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-foreground">
          <span aria-hidden>←</span> All projects
        </Link>
        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="text-[15px] text-muted">
              {[project.category, project.year].filter(Boolean).join(" · ")}
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,7.5vw,7rem)] font-medium leading-[0.96] tracking-[-0.04em] [text-wrap:balance]">
              {project.title}
            </h1>
            {project.artist && <p className="mt-4 text-[20px] tracking-[-0.01em] sm:text-[24px]">{project.artist}</p>}
          </div>
          {synopsis && <p className="max-w-[48ch] text-[17px] leading-relaxed text-muted sm:text-[18px]">{synopsis}</p>}
        </div>
      </section>

      {/* The film */}
      <section className="pt-10 sm:pt-14">
        <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-black sm:rounded-[24px]">
          {project.youtube ? (
            // The video itself, in YouTube's player (privacy-enhanced domain)
            <iframe
              src={youtubeEmbed(project.youtube)}
              title={project.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : reel && reelIsVideo ? (
            <video
              ref={videoRef}
              src={reel}
              poster={videoPoster}
              loop
              muted
              playsInline
              preload="metadata"
              className={fill}
              style={{ objectPosition: project.objectPosition }}
            />
          ) : reel ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={reel} alt="" className={fill} style={{ objectPosition: project.objectPosition }} />
          ) : (
            <div className="absolute inset-0" style={{ background: gradient }} />
          )}
          {poster && !reel && !project.youtube && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className={fill} />
          )}

          {(!reel || reelIsVideo) && !project.youtube && (
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              {playing ? (
                <span className="flex gap-[5px]">
                  <span className="h-5 w-[5px] rounded-sm bg-black" />
                  <span className="h-5 w-[5px] rounded-sm bg-black" />
                </span>
              ) : (
                <span className="ml-1 h-0 w-0 border-y-[12px] border-l-[19px] border-y-transparent border-l-black" />
              )}
            </button>
          )}
        </div>
      </section>

      {/* Details */}
      {meta.length > 0 && (
        <section aria-label="Details" className="pt-6">
          <dl
            className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] bg-hairline sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
            style={{ "--n": Math.min(meta.length, 4) } as React.CSSProperties}
          >
            {meta.map(([k, v]) => (
              <div key={k} className="bg-surface px-5 py-5">
                <dt className="text-[14px] text-muted">{k}</dt>
                <dd className="mt-1.5 text-[17px] font-medium tracking-[-0.01em]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Finished frames — pinnable */}
      <section className="pt-20 sm:pt-28">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-[1.04] tracking-[-0.03em]">Finished frames</h2>
          {frames.length > 0 && <p className="hidden text-[15px] text-muted sm:block">Save any frame to Pinterest</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {frames.length > 0
            ? frames.map((src) => (
                <div key={src} className="pd-frame relative aspect-video overflow-hidden rounded-[16px] bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${project.title} — finished frame`}
                    loading="lazy"
                    decoding="async"
                    data-pin-media={absolute(src)}
                    data-pin-url={`${site.url}/work/${project.slug}`}
                    data-pin-description={pinDescription(project.title)}
                    className={fill}
                  />
                  <PinButton href={pinUrl(project.slug, src, project.title)} />
                </div>
              ))
            : // Placeholders until stills are uploaded for this project
              Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden
                  className="relative aspect-video overflow-hidden rounded-[16px] opacity-50"
                  style={{ background: gradient }}
                >
                  <span className="absolute bottom-3 left-4 text-[12px] text-white/60">Frame {String(i + 1).padStart(2, "0")}</span>
                </div>
              ))}
        </div>
      </section>

      {/* More projects */}
      {more.length > 0 && (
        <section aria-label="More projects" className="pt-20 sm:pt-28">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-[1.04] tracking-[-0.03em]">More projects</h2>
            <Link
              href="/projects"
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-foreground/[0.09] px-5 text-[15px] font-medium transition-colors hover:bg-foreground/[0.16]"
            >
              See all <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
            {more.map((m) => (
              <Link key={m.href} href={m.href} className="group block">
                <div className="relative aspect-video overflow-hidden rounded-[18px] bg-surface">
                  <div className="absolute inset-0" style={{ background: m.gradient }} />
                  {m.media && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.media}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <h3 className="mt-4 text-[18px] font-medium leading-snug tracking-[-0.01em]">{m.title}</h3>
                <p className="mt-1 text-[14px] text-muted">{m.sub}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/* Pin button appears on frame hover (always visible on touch devices,
   which never hover). */
const CSS = `
.pd-pin { opacity: 1; transition: opacity .2s ease, transform .2s ease; }
@media (hover: hover) {
  .pd-frame .pd-pin { opacity: 0; transform: translateY(-4px); }
  .pd-frame:hover .pd-pin { opacity: 1; transform: translateY(0); }
}
.pd-pin:hover { background: #c8001f !important; }
`;
