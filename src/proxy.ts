import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The site is public: no password wall. The proxy's one remaining job is
// telling search engines the old site's blog is gone for good.
export function proxy(request: NextRequest) {
  // EDIT: retired sections of the old site. 410 Gone tells search engines
  // the pages were removed on purpose, so they drop them from the index.
  if (/^\/blog(\/|$)/.test(request.nextUrl.pathname)) {
    return new NextResponse("This page has been removed.", { status: 410 });
  }
  return NextResponse.next();
}

export const config = {
  // Only the retired paths need the proxy; everything else is served directly.
  matcher: ["/blog", "/blog/:path*"],
};
