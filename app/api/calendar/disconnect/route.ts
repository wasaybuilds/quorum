import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/calendar/google";

/** Forgets the connection by clearing the token cookie (nothing is stored server-side). */
export async function POST() {
  const res = NextResponse.json({ connected: false });
  res.cookies.delete(TOKEN_COOKIE);
  return res;
}
