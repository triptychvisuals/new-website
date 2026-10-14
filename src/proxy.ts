import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_TOKEN } from "@/lib/siteAuth";

// EDIT: the Triptych Portal's origins. A page the portal frames on its
// Website tab (Live site) comes through the wall without the password: the
// portal is the studio's own tool, and a browser that blocks third-party
// cookies could never keep a sign-in inside that frame.
const PORTAL_ORIGINS = [
  "https://portal.triptychstudios.co",
  "https://triptych-portal.vercel.app",
];

/** A document the portal is framing: fetched for an iframe, sent from a portal page. */
function framedByPortal(request: NextRequest): boolean {
  if (request.headers.get("sec-fetch-dest") !== "iframe") return false;
  const referer = request.headers.get("referer") ?? "";
  return PORTAL_ORIGINS.some((o) => referer === o || referer.startsWith(`${o}/`));
}

/**
 * A navigation inside a frame of this site (a link clicked in the portal's
 * frame), or a same-origin asset a page already on screen is loading. The
 * site never frames anything itself (frame-src 'none'), so a same-origin
 * iframe request can only come from a frame an allowed ancestor opened.
 */
function fromAnOpenFrame(request: NextRequest): boolean {
  const dest = request.headers.get("sec-fetch-dest") ?? "";
  const site = request.headers.get("sec-fetch-site") ?? "";
  if (site !== "same-origin") return false;
  return dest === "iframe" || ["image", "media", "video", "audio", "font", "style", "script", "manifest"].includes(dest);
}

// EDIT: crawlers that may read the project pages (/work/<slug>) through the
// wall, so a pin's link resolves to the page's title and picture (Pinterest
// reads the Open Graph tags when a frame is pinned, and for Rich Pins).
// Search engines (SEARCH_BOTS) may read every page so the studio shows up
// when someone searches for it. The pages are a preview of public work, not a secret; everything else on
// the site stays behind the wall for them too.
const CRAWLERS_THROUGH_THE_WALL = [/Pinterest/i];
// EDIT: search-engine crawlers allowed on every page.
const SEARCH_BOTS = [/Googlebot/i, /Google-InspectionTool/i, /Bingbot/i, /DuckDuckBot/i, /Applebot/i, /Slurp/i];

function searchBot(request: NextRequest): boolean {
  const ua = request.headers.get("user-agent") ?? "";
  return SEARCH_BOTS.some((re) => re.test(ua));
}

/** A known crawler fetching a project page. */
function crawlerOnAProjectPage(request: NextRequest): boolean {
  if (!/^\/work\/[^/]+\/?$/.test(request.nextUrl.pathname)) return false;
  const ua = request.headers.get("user-agent") ?? "";
  return CRAWLERS_THROUGH_THE_WALL.some((re) => re.test(ua));
}

// ---------------------------------------------------------------------------
// Password wall for the LIVE site while it's being built. Unauthenticated
// visitors are redirected to an in-page /login screen (no browser popup).
// Skipped in local development so editing at localhost has no prompt.
//
// To REMOVE the wall at launch, delete these four files and redeploy:
//   src/proxy.ts · src/lib/siteAuth.ts · src/app/login · src/app/api/login
// ---------------------------------------------------------------------------
export function proxy(request: NextRequest) {
  // EDIT: retired sections of the old site. 410 Gone tells search engines
  // the pages were removed on purpose, so they drop them from the index.
  if (/^\/blog(\/|$)/.test(request.nextUrl.pathname)) {
    return new NextResponse("This page has been removed.", { status: 410 });
  }

  // Never gate local dev — edit the site freely on localhost.
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Always let the sign-in screen, its submit endpoint, the logo it shows,
  // and the /work stills through (everything else stays gated). The stills
  // stay open so Pinterest can fetch pinned frames while the wall is up —
  // the frames aren't secret, the pages are.
  if (
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname === "/triptych-logo.png" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/apple-icon.png" ||
    /^\/press\/[^/]+\.(png|jpe?g|svg|zip|pdf)$/i.test(pathname) ||
    pathname === "/sitemap.xml" ||
    (/^\/work\//.test(pathname) && /\.(jpe?g|png|webp)$/i.test(pathname))
  ) {
    return NextResponse.next();
  }

  // Signed in? (cookie is set by the /api/login route)
  if (request.cookies.get(AUTH_COOKIE)?.value === AUTH_TOKEN) {
    return NextResponse.next();
  }

  // The portal's Live site tab: through, with the cookie set for the frame
  // so the links inside it keep working where the browser keeps it.
  if (framedByPortal(request)) {
    const res = NextResponse.next();
    res.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }
  if (fromAnOpenFrame(request) || crawlerOnAProjectPage(request) || searchBot(request)) {
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
