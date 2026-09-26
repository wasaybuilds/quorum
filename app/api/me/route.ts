import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEMO_COOKIE, getCurrentUser } from "@/lib/auth/session";
import { isDbConfigured } from "@/lib/db";
import { isGoogleConfigured } from "@/lib/calendar/google";

/** Who is using the app: a signed-in user, the demo workspace, or nobody yet. */
export async function GET() {
  const user = await getCurrentUser();
  const demo = !user && (await cookies()).get(DEMO_COOKIE)?.value === "1";
  return NextResponse.json(
    { user, demo, signInAvailable: isGoogleConfigured() && isDbConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
