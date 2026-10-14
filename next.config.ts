import type { NextConfig } from "next";

// ---------------------------------------------------------------------------
// Security headers.
// This is a fully static marketing site (no auth, no forms, no user input,
// no external scripts). The policy below is locked down to same-origin and
// only loosened where the app genuinely needs it:
//   • script-src 'unsafe-inline'  — the anti-flash theme <script> in layout.tsx
//     and Next's own hydration inline scripts. (A nonce would force every page
//     to render dynamically, killing static/CDN caching — not worth it here.)
//   • style-src 'unsafe-inline'   — GSAP writes inline styles; ProjectCard sets
//     an inline gradient background.
//   • img-src data: blob:         — inline SVG/data-URI + canvas-derived images.
// 'unsafe-eval' / ws: are added in dev only (React Fast Refresh + HMR socket).
// EDIT: if you ever add an external font, analytics, or embed, widen the
// matching directive here (e.g. add the host to script-src / img-src / connect-src).
// ---------------------------------------------------------------------------
const isDev = process.env.NODE_ENV === "development";

// EDIT: where the portal keeps what it publishes to this site (the frames
// and clips sent from a project's Delivery tab): the portal's Supabase
// storage, public bucket. Pictures and video from here are allowed below.
const PORTAL_ASSETS_HOST =
  process.env.PORTAL_ASSETS_HOST || "https://zrjynlpcdxnujwsvihaq.supabase.co";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Google Sans loads from Google Fonts (see layout.tsx)
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  // i.ytimg.com — YouTube thumbnails on the 500+ work grid (lib/youtube.ts)
  `img-src 'self' data: blob: ${PORTAL_ASSETS_HOST} https://i.ytimg.com`,
  `media-src 'self' ${PORTAL_ASSETS_HOST}`,
  `font-src 'self' https://fonts.gstatic.com`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  // EDIT: origins allowed to embed this site in an iframe — the Triptych
  // Portal's Live Site tab, at its own domain and at its Vercel address.
  // Everyone else stays blocked.
  `frame-ancestors 'self' https://portal.triptychstudios.co https://triptych-portal.vercel.app`,
  // Project pages embed the YouTube player (privacy-enhanced domain)
  `frame-src https://www.youtube-nocookie.com`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `manifest-src 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Force HTTPS for 2 years, subdomains included, eligible for the preload list.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // No X-Frame-Options: it can't whitelist origins (DENY would override the
  // frame-ancestors allowance above for the portal); every modern browser
  // enforces CSP frame-ancestors instead.
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Leak only the origin (not the full path) on cross-site navigation.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny powerful browser APIs the site never uses.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Neutralise the legacy reflected-XSS filter (superseded by CSP, historically buggy).
  { key: "X-XSS-Protection", value: "0" },
  // Isolate the browsing context (opener + cross-origin embeds).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Stop other origins from loading our assets (anti-hotlinking / resource theft).
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version in responses.
  poweredByHeader: false,
  // Ship the finished-frames stills inside the /work/[slug] function bundle —
  // framesFor() reads them with fs at revalidation time, and output tracing
  // can't see through its dynamic path. Keys are picomatch route globs, so
  // the [slug] brackets are escaped.
  outputFileTracingIncludes: {
    "/work/\\[slug\\]": ["./public/work/**/*"],
    // Home page: partner logos + work-grid thumbnails are read with fs too.
    "/": ["./public/partners/**/*", "./public/grid/**/*", "./public/decade/**/*"],
    "/press": ["./public/press/**/*"],
  },
  async headers() {
    return [
      {
        // Apply to every route.
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Finished frames must be embeddable on pinterest.com (pins render
        // our media cross-origin), so loosen CORP for /work stills only —
        // the site-wide same-origin rule above still covers everything else.
        source: "/work/:path*",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
