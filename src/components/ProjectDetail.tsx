"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/projects";

/* Reference palette (Video Project.dc.html) */
const ACCENT = "#d5602c";
const HAIR = "rgba(244,242,239,0.11)";
const MUTED = "#86837e";
const FAINT = "#56534e";

/* Keyframes + hover states that inline styles can't express */
const CSS = `
.pd{--accent:${ACCENT};--hair:${HAIR};--muted:${MUTED};--faint:${FAINT};
  background:#0b0a0a;color:#f4f2ef;-webkit-font-smoothing:antialiased;
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;min-height:100vh;
  padding:0 clamp(20px,4.5vw,72px) 96px}
.pd a{color:inherit;text-decoration:none}
.pd ::selection{background:${ACCENT};color:#0b0a0a}
.pd-back:hover{border-color:${ACCENT} !important;color:${ACCENT} !important}
.pd-arrow:hover{border-color:${ACCENT} !important;color:${ACCENT} !important}
.pd-doc:hover{opacity:.85}
.pd-foot a:hover{color:${ACCENT}}
.pd-play{transition:transform .25s ease,background .25s ease,border-color .25s ease}
.pd-play:hover{transform:translate(-50%,-50%) scale(1.08) !important;background:${ACCENT} !important;border-color:${ACCENT} !important}
@keyframes pdMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pdMarquee2{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.pd-marquee{animation:pdMarquee 48s linear infinite}
.pd-marquee-2{animation:pdMarquee2 40s linear infinite}
.pd-marquee-wrap:hover .pd-marquee,.pd-marquee-wrap:hover .pd-marquee-2{animation-play-state:paused}
@media(max-width:760px){.pd-hero-grid{grid-template-columns:1fr !important;gap:clamp(24px,6vw,40px) !important;align-items:start !important}}
`;

const metaLabel: CSSProperties = {
  fontSize: 10.5,
  letterSpacing: 0,
  color: "var(--muted)",
  marginBottom: 7,
};
const metaCell: CSSProperties = {
  padding: "16px 0 15px",
  borderBottom: "1px solid var(--hair)",
};
const specRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
};
const specKey: CSSProperties = { fontSize: 11, letterSpacing: 0, color: "var(--muted)" };
const specVal: CSSProperties = { fontSize: 13.5 };
const secLabel: CSSProperties = { fontSize: 12, letterSpacing: 0, color: "var(--muted)" };
const sectionPad: CSSProperties = { padding: "clamp(34px,4.5vw,62px) 0 0" };

/** Placeholder that fills its (bordered) parent — stands in for an image-slot. */
function Slot({ label }: { label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0e0e",
        color: "var(--faint)",
        fontSize: 11,
        textAlign: "center",
        padding: 8,
      }}
    >
      {label}
    </div>
  );
}

const BTS_TOP = [
  { w: 420, label: "BTS still" },
  { w: 264, label: "BTS" },
  { w: 340, label: "On set" },
  { w: 200, label: "BTS" },
  { w: 380, label: "BTS" },
  { w: 300, label: "BTS" },
];
const BTS_BOTTOM = [
  { w: 300, label: "BTS" },
  { w: 188, label: "BTS" },
  { w: 360, label: "On set" },
  { w: 260, label: "BTS" },
  { w: 320, label: "BTS" },
  { w: 220, label: "BTS" },
];

const DOCS = [
  { name: "Call Sheet — Day 01", type: "PDF" },
  { name: "Shot List", type: "PDF" },
  { name: "Storyboards", type: "PDF" },
  { name: "Color Report", type: "PDF" },
  { name: "Frame Grabs", type: "ZIP" },
];

/* 3 grade looks for the Log↔Graded slider (placeholder gradients). */
const SHOTS = [
  "linear-gradient(135deg,#d5602c 0%,#2a1206 55%,#0d0805 100%)",
  "linear-gradient(135deg,#2f6d8a 0%,#152230 60%,#080c10 100%)",
  "linear-gradient(135deg,#7a4bb0 0%,#301a44 55%,#0c0810 100%)",
];

export default function ProjectDetail({
  project,
  gradient,
  media,
}: {
  project: Project;
  gradient: string;
  media?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [format, setFormat] = useState<"16:9" | "9:16">("16:9");
  const [shot, setShot] = useState(0);
  const [lutPos, setLutPos] = useState(55);
  const draggingRef = useRef(false);
  const lutRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reel = project.video;
  const poster = media && /\.(png|jpe?g|webp|svg)$/i.test(media) ? media : undefined;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !lutRef.current) return;
      const r = lutRef.current.getBoundingClientRect();
      let p = ((e.clientX - r.left) / r.width) * 100;
      p = Math.max(0, Math.min(100, p));
      setLutPos(p);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (v) {
      if (v.paused) {
        v.play().catch(() => {});
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    } else {
      setPlaying((p) => !p);
    }
  }

  const is169 = format === "16:9";
  const ratio = is169 ? "16 / 9" : "9 / 16";
  const frameMax = is169 ? "100%" : "420px";

  const tab = (on: boolean): CSSProperties => ({
    fontSize: 12,
    letterSpacing: 0,
    padding: "7px 15px",
    borderRadius: 999,
    cursor: "pointer",
    border: `1px solid ${on ? "var(--accent)" : "var(--hair)"}`,
    background: on ? "var(--accent)" : "transparent",
    color: on ? "#0b0a0a" : "#cdcac5",
  });

  return (
    <main className="pd">
      <style>{CSS}</style>

      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          height: 72,
          borderBottom: "1px solid var(--hair)",
          margin: "0 clamp(-20px,-4.5vw,-72px)",
          padding: "0 clamp(20px,4.5vw,72px)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 120,
            height: 40,
            border: "1px solid var(--hair)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Slot label="Client logo" />
        </div>
        <a
          href="/#work"
          className="pd-back"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "#e7e4df",
            border: "1px solid var(--hair)",
            borderRadius: 999,
            padding: "9px 16px",
            transition: "border-color .2s, color .2s",
          }}
        >
          ← Back to Projects
        </a>
      </div>

      {/* 001 — PROJECT */}
      <section style={{ padding: "clamp(26px,3.5vw,44px) 0 0" }}>
        <div
          className="pd-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) clamp(240px,24vw,320px)",
            gap: "clamp(48px,8vw,130px)",
            alignItems: "end",
          }}
        >
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
            <p
              style={{
                maxWidth: "44ch",
                marginTop: "clamp(20px,2.6vw,34px)",
                fontSize: "clamp(16px,1.35vw,20px)",
                lineHeight: 1.5,
                color: "#b9b6b1",
              }}
            >
              {/* EDIT: per-project synopsis */}
              A neon-soaked descent through a city that never sleeps — one long
              night, one broken promise, and the search for a way back home.
            </p>
          </div>

          {/* Metadata grid */}
          <div
            style={{
              alignSelf: "end",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "clamp(20px,2.4vw,40px)",
              borderTop: "1px solid var(--hair)",
            }}
          >
            {(
              [
                ["Client", "Atlantic Records"],
                ["Artist", project.artist ?? "Sable Wynn"],
                ["Date Shot", "Mar 2025"],
                ["Date Released", project.year ?? "Jun 2025"],
                ["Runtime", "03:42"],
                ["Location", "Chicago, IL"],
                ["Category", project.category],
                ["Format", "6K ProRes"],
              ] as const
            ).map(([k, v]) => (
              <div key={k} style={metaCell}>
                <div style={metaLabel}>{k}</div>
                <div style={{ fontSize: 16, letterSpacing: "-.01em" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VIDEO header */}
        <div
          style={{
            marginTop: "clamp(34px,4.5vw,60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Released On</span>
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    width: 64,
                    height: 30,
                    border: "1px solid var(--hair)",
                    borderRadius: 7,
                    overflow: "hidden",
                  }}
                >
                  <Slot label="Logo" />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setFormat("16:9")} style={tab(is169)}>
              16:9
            </button>
            <button onClick={() => setFormat("9:16")} style={tab(!is169)}>
              9:16
            </button>
          </div>
        </div>

        {/* VIDEO frame */}
        <div
          style={{
            position: "relative",
            margin: "0 auto",
            aspectRatio: ratio,
            maxWidth: frameMax,
            width: "100%",
            border: "1px solid var(--hair)",
            borderRadius: 16,
            overflow: "hidden",
            background: "#000",
          }}
        >
          {reel ? (
            <video
              ref={videoRef}
              src={reel}
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

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(180deg,rgba(0,0,0,.32) 0%,transparent 26%,transparent 60%,rgba(0,0,0,.55) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 20,
              pointerEvents: "none",
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontSize: 11,
              color: "#e7e4df",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
            Self-hosted · MP4 / H.264
          </div>
          <div
            style={{
              position: "absolute",
              top: 18,
              right: 20,
              pointerEvents: "none",
              fontSize: 11,
              color: "#e7e4df",
              border: "1px solid rgba(255,255,255,.35)",
              padding: "5px 9px",
              borderRadius: 6,
            }}
          >
            {format} · 03:42
          </div>
          <button
            onClick={togglePlay}
            aria-label="Play"
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
          <div
            style={{
              position: "absolute",
              left: 20,
              bottom: 16,
              pointerEvents: "none",
              fontSize: 12,
              color: "#e7e4df",
            }}
          >
            Dir. Cut — Final Master
          </div>
        </div>
      </section>

      {/* 002 — TECHNICAL */}
      <section style={sectionPad}>
        <div style={{ marginBottom: "clamp(16px,2vw,26px)" }}>
          <span style={secLabel}>002 &nbsp;/&nbsp; Technical Breakdown</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "clamp(30px,4vw,60px)",
          }}
        >
          {/* CAMERA */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={specKey}>Camera Body</span>
              <span style={{ fontSize: 11, color: "var(--faint)" }}>Fig. A</span>
            </div>
            <div
              style={{
                position: "relative",
                padding: "14px 0 8px",
                height: 196,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 340 200"
                style={{ position: "relative", width: "100%", maxWidth: 300, color: "#d9d6d1" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <rect x="46" y="70" width="196" height="104" rx="7" />
                <rect x="78" y="48" width="96" height="24" rx="4" />
                <rect x="14" y="92" width="30" height="46" rx="3" />
                <path d="M44 108h4M44 122h4" />
                <line x1="46" y1="96" x2="242" y2="96" />
                <circle cx="242" cy="122" r="44" />
                <circle cx="242" cy="122" r="31" />
                <circle cx="242" cy="122" r="17" />
                <circle cx="90" cy="118" r="7" stroke="var(--accent)" />
                <circle cx="196" cy="60" r="9" />
                <path d="M196 51v-4M205 60h4" />
                <path d="M66 150h30M66 158h30M66 166h20" />
                <path d="M46 40h196" stroke="var(--accent)" strokeWidth={1} />
                <path d="M46 36v8M242 36v8" stroke="var(--accent)" strokeWidth={1} />
                <circle cx="150" cy="120" r="2.4" fill="var(--accent)" stroke="none" />
              </svg>
            </div>
            <div style={{ marginTop: "auto", padding: "0 0 6px" }}>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.01em" }}>
                RED V-RAPTOR 8K VV
              </div>
            </div>
            <div style={{ padding: "6px 0 0" }}>
              {[
                ["Sensor", "8K VV · Full Frame"],
                ["Codec", "REDCODE RAW HQ"],
                ["Frame Rate / Res", "23.98 fps · 6K"],
              ].map(([k, v]) => (
                <div key={k} style={specRow}>
                  <span style={specKey}>{k}</span>
                  <span style={specVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LENS */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={specKey}>Lens Kit</span>
              <span style={{ fontSize: 11, color: "var(--faint)" }}>Fig. B</span>
            </div>
            <div
              style={{
                position: "relative",
                padding: "14px 0 8px",
                height: 196,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 340 180"
                style={{ position: "relative", width: "100%", maxWidth: 300, color: "#d9d6d1" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <rect x="44" y="60" width="14" height="60" rx="2" />
                <rect x="58" y="66" width="180" height="48" rx="6" />
                <line x1="96" y1="66" x2="96" y2="114" />
                <line x1="140" y1="66" x2="140" y2="114" />
                <line x1="184" y1="66" x2="184" y2="114" />
                <path d="M238 70c22 4 22 40 0 40" />
                <ellipse cx="256" cy="90" rx="16" ry="30" />
                <ellipse cx="262" cy="90" rx="9" ry="22" stroke="var(--accent)" />
                <path d="M58 52h180" stroke="var(--accent)" strokeWidth={1} />
                <path d="M58 48v8M238 48v8" stroke="var(--accent)" strokeWidth={1} />
                <path d="M108 60v-6M118 60v-4M128 60v-6" stroke="var(--accent)" />
                <circle cx="118" cy="90" r="2.2" fill="var(--accent)" stroke="none" />
              </svg>
            </div>
            <div style={{ marginTop: "auto", padding: "0 0 6px" }}>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.01em" }}>
                Cooke S4/i Primes
              </div>
            </div>
            <div style={{ padding: "6px 0 0" }}>
              {[
                ["Focal Set", "32 · 50 · 75 mm"],
                ["Aperture", "T2.0"],
                ["Mount", "PL"],
              ].map(([k, v]) => (
                <div key={k} style={specRow}>
                  <span style={specKey}>{k}</span>
                  <span style={specVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLOR / LUT */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={specKey}>Color / LUT</span>
              <span style={{ fontSize: 11, color: "var(--faint)" }}>Drag →</span>
            </div>
            <div style={{ padding: "14px 0 8px" }}>
              <div
                ref={lutRef}
                style={{
                  position: "relative",
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  border: "1px solid var(--hair)",
                  borderRadius: 12,
                  background: "#000",
                  userSelect: "none",
                  touchAction: "none",
                }}
              >
                {/* graded (full) */}
                <div style={{ position: "absolute", inset: 0, background: SHOTS[shot] }} />
                {/* log (clipped) */}
                <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: `${lutPos}%` }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: SHOTS[shot],
                      filter: "saturate(.28) contrast(.85) brightness(1.02)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 10,
                    fontSize: 10,
                    color: "#e7e4df",
                    background: "rgba(0,0,0,.4)",
                    padding: "3px 6px",
                    borderRadius: 5,
                  }}
                >
                  Log
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    fontSize: 10,
                    color: "#0b0a0a",
                    background: "var(--accent)",
                    padding: "3px 6px",
                    borderRadius: 5,
                  }}
                >
                  Graded
                </div>
                <div
                  onPointerDown={(e) => {
                    e.preventDefault();
                    draggingRef.current = true;
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${lutPos}%`,
                    width: 2,
                    background: "var(--accent)",
                    cursor: "ew-resize",
                    transform: "translateX(-1px)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0b0a0a",
                      fontSize: 13,
                    }}
                  >
                    ⇔
                  </div>
                </div>
              </div>
              {/* arrows — outside the picture, inside the card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                <button
                  onClick={() => setShot((s) => (s + 2) % 3)}
                  aria-label="Previous shot"
                  className="pd-arrow"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: "1px solid var(--hair)",
                    background: "transparent",
                    color: "#e7e4df",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    transition: "border-color .2s, color .2s",
                  }}
                >
                  ‹
                </button>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  Shot {String(shot + 1).padStart(2, "0")} / 03
                </span>
                <button
                  onClick={() => setShot((s) => (s + 1) % 3)}
                  aria-label="Next shot"
                  className="pd-arrow"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: "1px solid var(--hair)",
                    background: "transparent",
                    color: "#e7e4df",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    transition: "border-color .2s, color .2s",
                  }}
                >
                  ›
                </button>
              </div>
            </div>
            <div style={{ marginTop: "auto", padding: "0 0 6px" }}>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.01em" }}>
                Kodak 2383 Emulation
              </div>
            </div>
            <div style={{ padding: "6px 0 0" }}>
              {[
                ["Graded In", "DaVinci Resolve"],
                ["Color Space", "ACEScct"],
                ["Delivery", "Rec.709"],
              ].map(([k, v]) => (
                <div key={k} style={specRow}>
                  <span style={specKey}>{k}</span>
                  <span style={specVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 003 — CREW */}
      <section style={sectionPad}>
        <div style={{ marginBottom: "clamp(16px,2vw,26px)" }}>
          <span style={secLabel}>003 &nbsp;/&nbsp; Crew</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "clamp(28px,4vw,64px)",
          }}
        >
          <CrewColumn
            title="Production"
            rows={[
              { name: "Elena Voss", role: "Director", icon: "circle" },
              { name: "Marcus Reyes", role: "DP", icon: "diamond" },
              { name: "Priya Anand", role: "Producer", icon: "squares" },
            ]}
          />
          <CrewColumn
            title="Post"
            rows={[
              { name: "Jonah Kim", role: "Editor", icon: "bars" },
              { name: "Sofia Marchetti", role: "Colorist", icon: "target" },
              { name: "Full Crew & Grips", role: "", icon: "diamond-faint" },
            ]}
          />
        </div>
      </section>

      {/* 004 — BTS & ARCHIVES */}
      <section style={sectionPad}>
        <div style={{ marginBottom: "clamp(16px,2vw,26px)" }}>
          <span style={secLabel}>004 &nbsp;/&nbsp; BTS &amp; Archives</span>
        </div>

        <div
          className="pd-marquee-wrap"
          style={{
            margin: "0 clamp(-20px,-4.5vw,-72px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            WebkitMaskImage:
              "linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)",
            maskImage: "linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)",
          }}
        >
          <div className="pd-marquee" style={{ display: "flex", gap: 12, width: "max-content" }}>
            {[...BTS_TOP, ...BTS_TOP].map((b, i) => (
              <div
                key={`t-${i}`}
                style={{
                  position: "relative",
                  width: b.w,
                  height: 264,
                  flex: "none",
                  border: "1px solid var(--hair)",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <Slot label={b.label} />
              </div>
            ))}
          </div>
          <div className="pd-marquee-2" style={{ display: "flex", gap: 12, width: "max-content" }}>
            {[...BTS_BOTTOM, ...BTS_BOTTOM].map((b, i) => (
              <div
                key={`b-${i}`}
                style={{
                  position: "relative",
                  width: b.w,
                  height: 188,
                  flex: "none",
                  border: "1px solid var(--hair)",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <Slot label={b.label} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "clamp(34px,4vw,56px)" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 18 }}>
            Project Archive
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 18,
            }}
          >
            {DOCS.map((d) => (
              <a key={d.name} href="#" className="pd-doc" style={{ display: "block" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3 / 4",
                    border: "1px solid var(--hair)",
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "#0f0e0e",
                  }}
                >
                  <Slot label="Cover" />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: 12,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{d.type}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="pd-foot"
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
        <span>PRJ-2025-041 · {project.title}</span>
        <a href="/#work" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          ← Back to Projects
        </a>
        <span>© 2026 Triptych Studios</span>
      </footer>
    </main>
  );
}

function CrewIcon({ type }: { type: string }) {
  const base: CSSProperties = { flex: "none" };
  switch (type) {
    case "circle":
      return <span style={{ ...base, width: 16, height: 16, border: "1.6px solid #e7e4df", borderRadius: "50%" }} />;
    case "diamond":
      return <span style={{ ...base, width: 14, height: 14, border: "1.6px solid #e7e4df", transform: "rotate(45deg)" }} />;
    case "diamond-faint":
      return <span style={{ ...base, width: 14, height: 14, border: "1.6px solid var(--faint)", transform: "rotate(45deg)" }} />;
    case "squares":
      return (
        <span style={{ display: "inline-flex", gap: 3, flex: "none" }}>
          <span style={{ width: 6, height: 6, background: "#e7e4df" }} />
          <span style={{ width: 6, height: 6, background: "#e7e4df" }} />
        </span>
      );
    case "bars":
      return (
        <span style={{ display: "inline-flex", gap: 2, alignItems: "center", flex: "none" }}>
          <span style={{ width: 3, height: 8, background: "#e7e4df" }} />
          <span style={{ width: 3, height: 14, background: "#e7e4df" }} />
          <span style={{ width: 3, height: 8, background: "#e7e4df" }} />
        </span>
      );
    case "target":
      return (
        <span style={{ ...base, width: 16, height: 16, border: "1.6px solid #e7e4df", borderRadius: "50%", position: "relative" }}>
          <span style={{ position: "absolute", inset: 4, borderRadius: "50%", background: "#e7e4df" }} />
        </span>
      );
    default:
      return null;
  }
}

function CrewColumn({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; role: string; icon: string }[];
}) {
  return (
    <div>
      <div style={{ fontSize: 15, color: "var(--muted)", marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {rows.map((r) => (
          <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <CrewIcon type={r.icon} />
            <span
              style={{
                fontSize: "clamp(18px,1.7vw,22px)",
                fontWeight: 500,
                letterSpacing: "-.02em",
                color: r.icon === "diamond-faint" ? "var(--faint)" : undefined,
              }}
            >
              {r.name}
            </span>
            {r.role && (
              <span style={{ fontSize: 12, color: "var(--faint)" }}>{r.role}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
