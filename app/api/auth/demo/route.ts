import { NextResponse } from "next/server";
import { DEMO_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { publicOrigin } from "@/lib/calendar/google";

/** "Continue with demo workspace": no account, sample data only. */
export async function GET(req: Request) {
  const res = NextResponse.redirect(`${publicOrigin(req)}/`);
  res.cookies.set(DEMO_COOKIE, "1", sessionCookieOptions);
  return res;
}
