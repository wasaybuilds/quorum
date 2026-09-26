import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { STATE_COOKIE, authUrl, cookieOptions, isGoogleConfigured, publicOrigin } from "@/lib/calendar/google";

/** Starts Google OAuth. A random state value in a short-lived cookie guards the callback. */
export async function GET(req: Request) {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(`${publicOrigin(req)}/upcoming?calendar=not-configured`);
  }
  const state = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(authUrl(req, state));
  res.cookies.set(STATE_COOKIE, state, { ...cookieOptions(), maxAge: 600 });
  return res;
}
