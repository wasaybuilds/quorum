import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE, cookieOptions, ensureFresh, fetchUpcoming, isGoogleConfigured, seal, unseal } from "@/lib/calendar/google";
import { demoUpcoming } from "@/lib/calendar/demo";

/**
 * Upcoming meetings: the user's real Google Calendar when connected, otherwise
 * the demo calendar. Always 200 so the page never breaks.
 */
export async function GET() {
  const configured = isGoogleConfigured();
  const store = await cookies();
  const stored = unseal(store.get(TOKEN_COOKIE)?.value);

  if (!configured || !stored) {
    return NextResponse.json({ configured, connected: false, events: demoUpcoming });
  }

  const tokens = await ensureFresh(stored);
  if (!tokens) {
    const res = NextResponse.json({ configured, connected: false, expired: true, events: demoUpcoming });
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  try {
    const events = await fetchUpcoming(tokens);
    const res = NextResponse.json({ configured, connected: true, email: tokens.email, events });
    if (tokens !== stored) res.cookies.set(TOKEN_COOKIE, seal(tokens), cookieOptions());
    return res;
  } catch (err) {
    console.error("[calendar] events fetch failed:", err);
    return NextResponse.json({ configured, connected: true, email: tokens.email, error: true, events: [] });
  }
}
