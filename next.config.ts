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

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `media-src 'self'`,
  `font-src 'self'`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  `frame-ancestors 'none'`,
  `frame-src 'none'`,
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
  // Belt-and-braces clickjacking guard (CSP frame-ancestors already covers this).
  { key: "X-Frame-Options", value: "DENY" },
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
  async headers() {
    return [
      {
        // Apply to every route.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
