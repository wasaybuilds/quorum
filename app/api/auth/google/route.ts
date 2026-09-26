import { NextResponse } from "next/server";
import { randomToken } from "@/lib/auth/crypto";
import { isDbConfigured } from "@/lib/db";
import { STATE_COOKIE, authUrl, isGoogleConfigured, publicOrigin, safeNext, stateCookieOptions } from "@/lib/calendar/google";

/**
 * Starts "Sign in with Google" (which also grants read-only calendar access).
 * A random state value in a short-lived cookie guards the callback; the
 * post-login destination rides along in the same cookie.
 */
export async function GET(req: Request) {
  const origin = publicOrigin(req);
  if (!isGoogleConfigured() || !isDbConfigured()) return NextResponse.redirect(`${origin}/login?error=unavailable`);

  const next = safeNext(new URL(req.url).searchParams.get("next"));
  const state = randomToken(16);
  const res = NextResponse.redirect(authUrl(req, state));
  res.cookies.set(STATE_COOKIE, `${state}|${next}`, stateCookieOptions);
  return res;
}
