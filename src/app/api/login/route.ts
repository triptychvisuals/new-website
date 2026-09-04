import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_TOKEN, SITE_PASSWORD } from "@/lib/siteAuth";

/** Checks the submitted password and, on success, sets the preview cookie. */
export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    password = "";
  }

  if (password !== SITE_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";
  // SameSite=None (HTTPS only) so the cookie also works when the site runs
  // inside the Triptych Portal's iframe — Lax cookies are never sent in a
  // cross-site frame, which would make the login loop forever there.
  res.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
    httpOnly: true,
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
