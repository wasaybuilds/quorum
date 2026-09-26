import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/calendar/google";

/** Connecting the calendar is the same Google sign-in, returning to Upcoming. */
export async function GET(req: Request) {
  return NextResponse.redirect(`${publicOrigin(req)}/api/auth/google?next=/upcoming`);
}
