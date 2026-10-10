"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import type { PortalWork } from "@/lib/siteContent";
import { site } from "@/lib/site";

/**
 * Project page, stripped to the finished work: the title, the film, and the
 * Finished Frames gallery. Every production detail (synopsis, metadata,
 * technical breakdown, crew, BTS) is removed for now — git history has it all
 * if it ever comes back.
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

export default function ProjectDetail({
  project,
  work,
  gradient,
  media,
  frames = [],
}: {
  project: Project;
  /** Portal detail fields (synopsis, client, runtime…) when the feed has them. */
  work?: PortalWork;
  gradient: string;
  media?: string;
  /** /work/<slug>/… stills found on disk (absolute public paths). */
  frames?: string[];
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

  // A little context, not the old full breakdown: synopsis + compact
  // metadata, shown only for fields that actually have values (the portal
  // fills them in; authored category/artist/year always exist).
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

  return (
    <main
      className="pd"
      style={{
        maxWidth: 1760,
        margin: "0 auto",
        padding: "0 clamp(20px,4.5vw,72px) 60px",
      }}
    >
      <style>{CSS}</style>

      {/* Title + a little information */}
      <section style={{ padding: "clamp(30px,4vw,52px) 0 0" }}>
        <div className="pd-head">
          <div>
            <h1
              style={{
                fontWeight: 400,
                letterSpacing: "-.035em",
                lineHeight: 0.9,
                fontSize: "clamp(52px,9vw,132px)",
                textWrap: "balance",
              }}
            >
              {project.title}
            </h1>
            {synopsis && (
              <p
                style={{
                  maxWidth: "44ch",
                  marginTop: "clamp(18px,2.2vw,28px)",
                  fontSize: "clamp(15px,1.3vw,19px)",
                  lineHeight: 1.5,
                  color: "var(--muted)",
                }}
              >
                {synopsis}
              </p>
            )}
          </div>

          {meta.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "clamp(20px,2.4vw,40px)",
                borderTop: "1px solid var(--hair)",
                alignSelf: "end",
              }}
            >
              {meta.map(([k, v]) => (
                <div
                  key={k}
                  style={{ padding: "12px 0", borderBottom: "1px solid var(--hair)" }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: 5,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 15, letterSpacing: "-.01em" }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* The film */}
      <section style={{ padding: "clamp(26px,3.5vw,44px) 0 0" }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 9",
            width: "100%",
            border: "1px solid var(--hair)",
            borderRadius: 16,
            overflow: "hidden",
            background: "#000",
          }}
        >
          {reel && reelIsVideo ? (
            <video
              ref={videoRef}
              src={reel}
              poster={videoPoster}
              loop
              muted
              playsInline
              preload="metadata"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: project.objectPosition,
              }}
            />
          ) : reel ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: project.objectPosition,
              }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: gradient }} />
          )}
          {poster && !reel && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {(!reel || reelIsVideo) && (
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="pd-play"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: 88,
                height: 88,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,.5)",
                background: "rgba(11,10,10,.4)",
                backdropFilter: "blur(6px)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {playing ? (
                <span style={{ display: "flex", gap: 5 }}>
                  <span style={{ width: 5, height: 22, background: "#fff" }} />
                  <span style={{ width: 5, height: 22, background: "#fff" }} />
                </span>
              ) : (
                <span
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "22px solid #fff",
                    borderTop: "14px solid transparent",
                    borderBottom: "14px solid transparent",
                    marginLeft: 6,
                  }}
                />
              )}
            </button>
          )}
        </div>
      </section>

      {/* Finished frames — pinnable */}
      <section style={{ padding: "clamp(44px,6vw,80px) 0 0" }}>
        <div style={{ marginBottom: "clamp(16px,2vw,26px)" }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Finished Frames
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,340px),1fr))",
            gap: 12,
          }}
        >
          {frames.length > 0
            ? frames.map((src) => (
                <div
                  key={src}
                  className="pd-frame"
                  style={{
                    position: "relative",
                    aspectRatio: "16 / 9",
                    border: "1px solid var(--hair)",
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "var(--hairline)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${project.title} — finished frame`}
                    loading="lazy"
                    decoding="async"
                    data-pin-media={absolute(src)}
                    data-pin-url={`${site.url}/work/${project.slug}`}
                    data-pin-description={pinDescription(project.title)}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <PinButton href={pinUrl(project.slug, src, project.title)} />
                </div>
              ))
            : // Placeholders until stills are uploaded for this project
              Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden
                  style={{
                    position: "relative",
                    aspectRatio: "16 / 9",
                    border: "1px solid var(--hair)",
                    borderRadius: 14,
                    overflow: "hidden",
                    background: gradient,
                    opacity: 0.55,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      bottom: 10,
                      fontSize: 11,
                      color: "rgba(255,255,255,.55)",
                    }}
                  >
                    Frame {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "clamp(70px,9vw,120px)",
          paddingTop: 30,
          borderTop: "1px solid var(--hair)",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "var(--muted)",
        }}
      >
        <span>{project.title}</span>
        <span>© 2026 Triptych Studios</span>
      </footer>
    </main>
  );
}

/* Hover affordances: play button scales, Pin button appears on frame hover
   (always visible on touch devices, which never hover). */
const CSS = `
.pd { --hair: var(--hairline); }
.pd-head { display: grid; gap: clamp(28px,4vw,56px); }
@media (min-width: 900px) {
  .pd-head { grid-template-columns: minmax(0,1fr) clamp(280px,26vw,360px); align-items: end; }
}
.pd-play { transition: transform .25s ease, background .25s ease; }
.pd-play:hover { transform: translate(-50%,-50%) scale(1.06); background: rgba(11,10,10,.6); }
.pd-pin { opacity: 1; transition: opacity .2s ease, transform .2s ease; }
@media (hover: hover) {
  .pd-frame .pd-pin { opacity: 0; transform: translateY(-4px); }
  .pd-frame:hover .pd-pin { opacity: 1; transform: translateY(0); }
}
.pd-pin:hover { background: #c8001f !important; }
`;
