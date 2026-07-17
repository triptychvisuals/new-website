// ---------------------------------------------------------------------------
// Server-only constants for the preview password wall. Imported by the proxy
// (src/proxy.ts) and the login route (src/app/api/login) — never by client
// components — so the password is never shipped to the browser.
//
// EDIT the password below, or set SITE_PASSWORD in Vercel → Settings →
// Environment Variables (that overrides the file).
// ---------------------------------------------------------------------------

/** Cookie that marks a signed-in visitor. */
export const AUTH_COOKIE = "triptych_preview";

/** The shared password visitors type on the /login screen. */
export const SITE_PASSWORD = process.env.SITE_PASSWORD || "triptych2026"; // EDIT

/**
 * Opaque value stored in the cookie once signed in; the proxy checks for it.
 * Change SITE_AUTH_TOKEN in Vercel to instantly sign everyone out.
 */
export const AUTH_TOKEN = process.env.SITE_AUTH_TOKEN || "granted-9f3c1a7b";
