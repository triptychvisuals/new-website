import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Password wall for the LIVE site while it's being built.
//
// This runs only on the server/edge — the password is never shipped to the
// browser or visible to visitors. It is skipped in local development, so you
// can keep editing freely at http://localhost:3000 with no prompt.
//
// EDIT the password below — or, without touching this file, set SITE_USER /
// SITE_PASSWORD in Vercel → Project → Settings → Environment Variables.
// To REMOVE the wall entirely once you're ready to launch: delete this file
// (src/proxy.ts) and redeploy.
// ---------------------------------------------------------------------------
const USER = process.env.SITE_USER || "triptych"; // EDIT: username
const PASSWORD = process.env.SITE_PASSWORD || "triptych2026"; // EDIT: shared password

export function proxy(request: NextRequest) {
  // Never gate local dev — edit the site freely on localhost.
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === USER && pass === PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Triptych private preview", charset="UTF-8"',
    },
  });
}

export const config = {
  // Gate every page; leave Next's static assets + favicon reachable so the
  // page can still style itself once you're past the wall.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
