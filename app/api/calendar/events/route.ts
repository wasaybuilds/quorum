import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isDbConfigured } from "@/lib/db";
import { calendarAccessToken, fetchUpcoming, isGoogleConfigured } from "@/lib/calendar/google";
import { demoUpcoming } from "@/lib/calendar/demo";

/**
 * Upcoming meetings: the signed-in user's Google Calendar when connected,
 * otherwise the demo calendar. Always 200 so the page never breaks.
 */
export async function GET() {
  const configured = isGoogleConfigured() && isDbConfigured();
  const user = await getCurrentUser();
  const demo = { configured, signedIn: !!user, connected: false, events: demoUpcoming };
  if (!user) return NextResponse.json(demo);

  const token = await calendarAccessToken(user.id);
  if (!token) return NextResponse.json(demo);

  try {
    const events = await fetchUpcoming(token, user.email);
    return NextResponse.json({ configured, signedIn: true, connected: true, email: user.email, events });
  } catch (err) {
    console.error("[calendar] events fetch failed:", err);
    return NextResponse.json({ configured, signedIn: true, connected: true, email: user.email, error: true, events: [] });
  }
}
