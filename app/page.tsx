"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ assets */
const HERO_IMG = "/assets/hero.jpg";
// Hero background reel — played muted, looping, with controls/branding hidden.
// To swap the reel, replace REEL_ID with the new YouTube video id.
const REEL_ID = "cTUjW9_H-E0";
const REEL_EMBED = `https://www.youtube.com/embed/${REEL_ID}?autoplay=1&mute=1&loop=1&playlist=${REEL_ID}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`;
const LOGO = "/assets/triptych-logo.png";
const photo = (seed: string) => `url(https://picsum.photos/seed/${seed}/720/420)`;
const ytThumb = (id: string) => `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;
const ytUrl = (id: string) => `https://youtu.be/${id}`;
// A work's thumbnail + link: real YouTube thumbnail/link when we have the video
// id, otherwise a placeholder (the entries without youtubeId still need links).
const workImg = (w: Work) => (w.youtubeId ? ytThumb(w.youtubeId) : photo(w.seed));
const workHref = (w: Work) => (w.youtubeId ? ytUrl(w.youtubeId) : "#");

/* -------------------------------------------------------------------- data */
type Work = { index: string; title: string; artist: string; type: string; seed: string; youtubeId?: string };

const WORKS: Work[] = [
  { index: "01", title: "Ridin Wit It", artist: "G Herbo", type: "Music Video", youtubeId: "k5coDLFQrj0", seed: "mv-ridinwitit" },
  { index: "02", title: "Locked In", artist: "G Herbo", type: "Music Video", youtubeId: "n3JAY-3H8Ao", seed: "mv-lockedin" },
  { index: "03", title: "All That", artist: "Kodak Black & G Herbo", type: "Music Video", youtubeId: "78VDuGTZdO0", seed: "mv-allthat" },
  { index: "04", title: "Hands Up", artist: "Jay Wood", type: "Music Video", seed: "mv-handsup" },
  { index: "05", title: "Feel The Love", artist: "Jay Wood", type: "Music Video", seed: "mv-feelthelove" },
  { index: "06", title: "Dramatic", artist: "Jay Wood", type: "Music Video", seed: "mv-dramatic" },
  { index: "07", title: "Wiscansin", artist: "Jay Wood", type: "Music Video", seed: "mv-wiscansin" },
  { index: "08", title: "Good Morning America", artist: "Ausar", type: "Music Video", seed: "mv-gma" },
  { index: "09", title: "Timmy Story", artist: "Englewood Tommy", type: "Music Video", seed: "mv-timmystory" },
  { index: "10", title: "OK Cool", artist: "CEO Trayle", type: "Music Video", youtubeId: "gTlSvYgIiv8", seed: "mv-okcool" },
  { index: "11", title: "My Way", artist: "Queen Key", type: "Music Video", youtubeId: "_3WOkRKuB9c", seed: "mv-myway" },
  { index: "12", title: "Roll Up Hot", artist: "Lil Zay Osama", type: "Music Video", youtubeId: "yTyCDvyoS0A", seed: "mv-rolluphot" },
  { index: "13", title: "SBA", artist: "Lil Zay Osama", type: "Music Video", youtubeId: "jmzhlhGBDFY", seed: "mv-sba" },
];

const ACCOLADES = [
  { eyebrow: "FEATURED IN", title: "CHICAGO READER", quote: "Chicago director Law Mahone builds Triptych Visuals from teenage run-and-gun shoots into a force in hip-hop music videos, chasing the perfect frame." },
];

// Studio / Store originally pointed at separate builder pages that are not part
// of this export; left as in-page placeholders ("#") until those routes exist.
const MENU = [
  { label: "Home", href: "#" },
  { label: "Work", href: "#sec-work" },
  { label: "Studio", href: "#" },
  { label: "Store", href: "#" },
];

function fmtTime() {
  try {
    return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Chicago" });
  } catch {
    return "";
  }
}

/* -------------------------------------------------------------------- view */
export default function Home() {
  const [time, setTime] = useState("");
  const [cardIdx, setCardIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [hoverImg, setHoverImg] = useState<string | null>(null);
  const [hoverActive, setHoverActive] = useState(false);
  const [hoverY, setHoverY] = useState(420);

  // Live clock + auto-rotating accolade card. Theme preference is restored from
  // localStorage on mount (dark by default), matching the reference behaviour.
  useEffect(() => {
    let saved = "dark";
    try { saved = localStorage.getItem("tv-theme") || "dark"; } catch {}
    document.documentElement.classList.toggle("theme-light", saved === "light");

    setTime(fmtTime());
    const clock = setInterval(() => setTime(fmtTime()), 1000);
    const card = setInterval(() => setCardIdx((i) => i + 1), 3500);
    return () => {
      clearInterval(clock);
      clearInterval(card);
      document.documentElement.classList.remove("theme-light");
    };
  }, []);

  const ci = cardIdx % ACCOLADES.length;
  const ac = ACCOLADES[ci];
  const previewImg = hoverImg || workImg(WORKS[0]);
  const isList = view === "list";

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk',sans-serif", minHeight: "100vh", overflowX: "hidden", transition: "background .4s ease, color .4s ease" }}>
      {/* ============================== HERO ============================== */}
      <section className="hero" style={{ position: "relative", minHeight: 680, height: "90vh", maxHeight: 980, overflow: "hidden", padding: "22px clamp(20px,3vw,40px) 30px" }}>
        {/* full-bleed hero reel (YouTube background) over the poster image */}
        <div style={{ position: "absolute", inset: 14, borderRadius: 18, overflow: "hidden", backgroundColor: "#04060a", backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <iframe
            src={REEL_EMBED}
            title="Triptych Studios reel"
            allow="autoplay; encrypted-media; picture-in-picture"
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "100vw", height: "56.25vw", minWidth: "177.78vh", minHeight: "100vh", border: 0, pointerEvents: "none" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,6,10,0.55) 0%, rgba(4,6,10,0.15) 40%, rgba(4,6,10,0.7) 100%)" }} />
        </div>

        {/* vertical guides */}
        <div style={{ position: "absolute", inset: 14, pointerEvents: "none", display: "flex", justifyContent: "space-around" }}>
          <span style={{ width: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ width: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ width: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>
        {/* crosshair marks */}
        <div className="hero-crosshairs" style={{ position: "absolute", left: 14, right: 14, top: "57%", zIndex: 2, pointerEvents: "none", display: "flex", justifyContent: "space-around", color: "rgba(255,255,255,0.4)", fontSize: 17, fontWeight: 300 }}>
          <span>+</span><span>+</span><span>+</span>
        </div>

        {/* top bar */}
        <div className="hero-topbar" style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="nbtn" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 9px", borderRadius: 30, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(14,15,18,0.55)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)", color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: "'Hanken Grotesk',sans-serif" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 26, borderRadius: 8, background: "rgba(255,255,255,0.14)" }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </span>
              Menu
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500 }}>
              <span style={{ opacity: 0.5 }}>/</span>
              <span>CHICAGO, IL — {time}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#sec-contact" className="nbtn hero-startproject" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 7px 7px 20px", borderRadius: 30, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(14,15,18,0.6)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)", color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
              Start Project
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: "#fff", color: "#0a0a0a" }}><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </a>
            <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }} aria-label="Toggle fullscreen" className="soc hero-fullscreen" style={{ ...socStyle, width: 44, height: 44, borderRadius: 12 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M3 15v4a2 2 0 0 0 2 2h4" /></svg>
            </button>
          </div>
        </div>

        {/* centered logo tab */}
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 7, background: "var(--bg)", padding: "0 30px 9px", borderRadius: "0 0 16px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Triptych" style={{ height: 14, width: "auto", display: "block", filter: "invert(0)" }} />
        </div>

        {/* bottom-left block */}
        <div className="hero-content" style={{ position: "absolute", left: "clamp(20px,3vw,40px)", right: "clamp(20px,3vw,40px)", bottom: 38, zIndex: 5 }}>
          <div style={{ maxWidth: 330 }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.005em", color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>Award Winning Studio</div>
            <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.72)" }}>A film &amp; image studio crafting high-end cinematic stories and immersive experiences.</p>
            <h1 style={{ margin: "0 0 20px", fontSize: 24, fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 1.15, color: "rgba(255,255,255,0.5)", pointerEvents: "none" }}>Imagination in Motion</h1>
            <a href="#sec-work" className="nbtn" style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "11px 12px 11px 22px", borderRadius: 30, background: "#ffffff", color: "#0a0a0a", textDecoration: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
              Our Work
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: "#0a0a0a", color: "#fff" }}><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </a>
          </div>
        </div>

        {/* socials (bottom center) */}
        <div className="hero-socials" style={{ position: "absolute", left: "50%", bottom: 50, transform: "translateX(-50%)", zIndex: 5, display: "flex", gap: 12 }}>
          <a aria-label="Instagram" href="https://www.instagram.com/triptychstudios.co/" target="_blank" rel="noopener noreferrer" className="soc" style={socStyle}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.2" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" stroke="none" /></svg>
          </a>
          <a aria-label="LinkedIn" href="https://www.linkedin.com/company/triptych-studios/" target="_blank" rel="noopener noreferrer" className="soc" style={socStyle}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V9h3v10zM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM19 19h-3v-5.4c0-1.3-.5-2.1-1.6-2.1-.9 0-1.4.6-1.6 1.2-.1.2-.1.5-.1.8V19h-3V9h3v1.3c.4-.6 1.1-1.5 2.8-1.5 2 0 3.5 1.3 3.5 4.2V19z" /></svg>
          </a>
        </div>

        {/* award card */}
        <div className="ncard hero-card" style={{ position: "absolute", right: "clamp(20px,3vw,40px)", bottom: 38, zIndex: 5, width: "min(420px,38vw)", minWidth: 300, background: "rgba(8,9,12,0.4)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "26px 28px 22px" }}>
          <div className="nstar" style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14, color: "#fff" }}>
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <span style={{ fontSize: 30, color: "rgba(255,255,255,0.55)" }}>🌿</span>
            <div style={{ textAlign: "center", minWidth: 150 }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: ".22em", color: "rgba(255,255,255,0.65)", marginBottom: 10 }}>{ac.eyebrow}</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/chicago-reader.png" alt="Chicago Reader" style={{ width: 165, maxWidth: "100%", height: "auto", display: "block", margin: "0 auto", filter: "brightness(0) invert(1)", opacity: 0.95 }} />
            </div>
            <span style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", transform: "scaleX(-1)" }}>🌿</span>
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>&ldquo;{ac.quote}&rdquo;</p>
          </div>
        </div>
      </section>

      {/* ========================= POP-OUT MENU ========================= */}
      <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.45)", WebkitBackdropFilter: "blur(4px)", backdropFilter: "blur(4px)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity .35s ease" }} />
      <div style={{ position: "fixed", top: 74, left: "clamp(20px,3vw,40px)", zIndex: 61, width: "min(290px,90vw)", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 18, transformOrigin: "top left", transform: menuOpen ? "scale(1)" : "scale(0.94)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity .3s ease, transform .35s cubic-bezier(.2,.8,.2,1)", display: "flex", flexDirection: "column", padding: 14, boxShadow: "0 28px 70px rgba(0,0,0,0.55)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "2px 6px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Triptych" style={{ height: 13, width: "auto", display: "block", filter: "invert(var(--logo-invert))" }} />
          <button onClick={() => setMenuOpen(false)} className="nbtn" aria-label="Close menu" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, border: "1px solid var(--line)", borderRadius: 9, background: "transparent", color: "var(--text)", cursor: "pointer" }}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        </div>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {MENU.map((m) => (
            <a key={m.label} href={m.href} onClick={() => setMenuOpen(false)} className="tdrop" style={{ display: "block", padding: "11px 14px", borderRadius: 11, fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)", textDecoration: "none" }}>{m.label}</a>
          ))}
        </nav>
        <div style={{ marginTop: 8, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: ".14em", color: "var(--faint)", padding: "14px 8px 4px" }}>
          <span>CHICAGO, IL</span>
          <span>{time}</span>
        </div>
      </div>

      {/* ============================== WORKS ============================== */}
      <main>
        <section id="sec-work" className="works-section" style={{ position: "relative", padding: "80px clamp(20px,3vw,40px) 0" }}>
          <div className="works-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 46 }}>
            <h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,84px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.9 }}>Works<sup style={{ fontSize: "0.24em", fontWeight: 600, verticalAlign: "super", marginLeft: 5, color: "var(--faint)" }}>{WORKS.length}</sup></h2>
            <div style={{ display: "flex", alignItems: "center", gap: 13, paddingTop: 14 }}>
              <button onClick={() => setView("grid")} style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: view === "grid" ? "var(--text)" : "var(--faint)", transition: "color .25s ease" }}>Grid</button>
              <button onClick={() => setView((v) => (v === "list" ? "grid" : "list"))} aria-label="Toggle view" style={{ position: "relative", width: 48, height: 26, borderRadius: 30, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", padding: 0, flex: "none" }}>
                <span style={{ position: "absolute", top: "50%", left: 3, width: 18, height: 18, borderRadius: "50%", background: "var(--text)", transform: `translateY(-50%) ${isList ? "translateX(22px)" : "translateX(0)"}`, transition: "transform .3s cubic-bezier(.2,.7,.2,1)" }} />
              </button>
              <button onClick={() => setView("list")} style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: isList ? "var(--text)" : "var(--faint)", transition: "color .25s ease" }}>List</button>
            </div>
          </div>

          {isList && (
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--line)" }}>
              {WORKS.map((w) => (
                <a
                  key={w.title}
                  href={workHref(w)}
                  target={w.youtubeId ? "_blank" : undefined}
                  rel={w.youtubeId ? "noopener noreferrer" : undefined}
                  className="wrow"
                  onMouseEnter={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHoverImg(workImg(w)); setHoverActive(true); setHoverY(r.top + r.height / 2); }}
                  onMouseLeave={() => setHoverActive(false)}
                  style={{ display: "grid", gridTemplateColumns: "62px minmax(150px,max-content) 1fr max-content minmax(150px,max-content)", alignItems: "center", gap: 20, padding: "18px 4px", borderBottom: "1px solid var(--line)", textDecoration: "none" }}
                >
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{w.index}</span>
                  <span style={{ fontSize: "clamp(15px,1.3vw,18px)", fontWeight: 600, letterSpacing: "-0.01em" }}>{w.title}</span>
                  <span />
                  <span style={{ fontSize: 14 }}>{w.type}</span>
                  <span style={{ fontSize: 14, textAlign: "right" }}>{w.artist}</span>
                </a>
              ))}
            </div>
          )}

          {!isList && (
            <div className="works-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "40px 20px" }}>
              {WORKS.map((w) => (
                <a key={w.title} className="wtile" href={workHref(w)} target={w.youtubeId ? "_blank" : undefined} rel={w.youtubeId ? "noopener noreferrer" : undefined} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: ".04em", color: "var(--faint)", paddingTop: 2, whiteSpace: "nowrap" }}>{w.index}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{w.title}</div>
                      <div style={{ fontSize: 13, color: "var(--faint)", marginTop: 4 }}>{w.artist} — {w.type}</div>
                    </div>
                  </div>
                  <div style={{ aspectRatio: "16/9", width: "100%", position: "relative", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
                    <div className="wt-img" style={{ position: "absolute", inset: 0, backgroundColor: "var(--card)", backgroundImage: workImg(w), backgroundSize: "cover", backgroundPosition: "center" }} />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* hover preview */}
          <div className="hover-preview" style={{ position: "fixed", top: hoverY, left: "50%", transform: "translate(-50%,-50%)", zIndex: 40, width: "clamp(360px,32vw,520px)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", pointerEvents: "none", opacity: isList && hoverActive ? 1 : 0, transition: "opacity .3s ease, top .3s cubic-bezier(.2,.7,.2,1)", boxShadow: "0 24px 70px rgba(0,0,0,0.65)", backgroundColor: "#111", backgroundImage: previewImg, backgroundSize: "cover", backgroundPosition: "center" }} />
        </section>
      </main>

      {/* ============================== FOOTER ============================== */}
      <footer id="sec-contact" className="site-footer" style={{ marginTop: 90, padding: "0 clamp(20px,3vw,40px) 50px" }}>
        <div className="footer-top" style={{ borderTop: "1px solid var(--line)", paddingTop: 50, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(44px,9vw,150px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.82 }}>TRIPTYCH<sup style={{ fontSize: "0.2em", fontWeight: 700, verticalAlign: "top", marginLeft: "0.1em", color: "var(--muted)" }}>®</sup></h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 20, paddingBottom: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Triptych" style={{ height: 28, width: "auto", display: "block", filter: "invert(var(--logo-invert))", opacity: 0.92 }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: ".2em", color: "var(--faint)" }}>FOUNDED BY LAWRENCE MAHONE</span>
          </div>
        </div>
        <div className="footer-bottom" style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap", borderTop: "1px dashed var(--line)", paddingTop: 22, fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: ".1em", color: "var(--faint)" }}>
          <span>© 2026 TRIPTYCH STUDIOS. ALL RIGHTS RESERVED.</span>
          <span>IMAGINATION IN MOTION</span>
        </div>
      </footer>
    </div>
  );
}

const socStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer" };
