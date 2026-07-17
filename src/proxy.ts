import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_TOKEN } from "@/lib/siteAuth";

// ---------------------------------------------------------------------------
// Password wall for the LIVE site while it's being built. Unauthenticated
// visitors are redirected to an in-page /login screen (no browser popup).
// Skipped in local development so editing at localhost has no prompt.
//
// To REMOVE the wall at launch, delete these four files and redeploy:
//   src/proxy.ts · src/lib/siteAuth.ts · src/app/login · src/app/api/login
// ---------------------------------------------------------------------------
export function proxy(request: NextRequest) {
  // Never gate local dev — edit the site freely on localhost.
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Always let the sign-in screen, its submit endpoint, and the logo it shows
  // through (everything else stays gated).
  if (
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname === "/triptych-logo.png"
  ) {
    return NextResponse.next();
  }

  // Signed in? (cookie is set by the /api/login route)
  if (request.cookies.get(AUTH_COOKIE)?.value === AUTH_TOKEN) {
    return NextResponse.next();
  }

  // Otherwise send them to the in-page sign-in, remembering where they were.
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search =
    pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on every page; leave Next's static assets + favicon reachable so the
  // login screen (and the rest of the site) can style itself.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
