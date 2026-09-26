import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEMO_COOKIE, SESSION_COOKIE, createSession, sessionCookieOptions } from "@/lib/auth/session";
import { STATE_COOKIE, exchangeCode, hasCalendarScope, publicOrigin, safeNext, saveGrant } from "@/lib/calendar/google";

/**
 * Google OAuth callback (the redirect URI registered in Google Cloud).
 * Creates or updates the user, stores their encrypted Google tokens,
 * starts a session and returns them where they came from.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = publicOrigin(req);
  const store = await cookies();
  const [expected, nextRaw] = (store.get(STATE_COOKIE)?.value ?? "").split("|");
  const next = safeNext(nextRaw);
  const fail = (reason: string) => {
    const res = NextResponse.redirect(`${origin}/login?error=${reason}`);
    res.cookies.delete(STATE_COOKIE);
    return res;
  };

  if (url.searchParams.get("error")) return fail("denied");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || !expected || state !== expected) return fail("state");

  try {
    const grant = await exchangeCode(req, code);
    const sql = await db();
    const [user] = await sql<{ id: string }[]>`
      insert into users (google_sub, email, name, picture)
      values (${grant.identity.sub}, ${grant.identity.email}, ${grant.identity.name ?? null}, ${grant.identity.picture ?? null})
      on conflict (google_sub) do update set email = excluded.email, name = excluded.name, picture = excluded.picture
      returning id
    `;
    await saveGrant(user.id, grant);
    const token = await createSession(user.id);

    const calendar = hasCalendarScope(grant.scope) ? "connected" : "no-calendar";
    const dest = next === "/upcoming" ? `/upcoming?calendar=${calendar}` : next;
    const res = NextResponse.redirect(`${origin}${dest}`);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    res.cookies.delete(DEMO_COOKIE);
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch (err) {
    console.error("[auth] sign-in failed:", err);
    return fail("signin");
  }
}
