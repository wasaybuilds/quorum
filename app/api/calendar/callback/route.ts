import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { STATE_COOKIE, TOKEN_COOKIE, cookieOptions, exchangeCode, publicOrigin, seal } from "@/lib/calendar/google";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const back = (status: string) => `${publicOrigin(req)}/upcoming?calendar=${status}`;
  const store = await cookies();
  const expected = store.get(STATE_COOKIE)?.value;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (url.searchParams.get("error")) return NextResponse.redirect(back("denied"));
  if (!code || !state || !expected || state !== expected) return NextResponse.redirect(back("error"));

  try {
    const tokens = await exchangeCode(req, code);
    const res = NextResponse.redirect(back("connected"));
    res.cookies.set(TOKEN_COOKIE, seal(tokens), cookieOptions());
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch (err) {
    console.error("[calendar] token exchange failed:", err);
    return NextResponse.redirect(back("error"));
  }
}
