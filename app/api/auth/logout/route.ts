import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEMO_COOKIE, SESSION_COOKIE, destroySession } from "@/lib/auth/session";

export async function POST() {
  const store = await cookies();
  await destroySession(store.get(SESSION_COOKIE)?.value).catch(() => {});
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(DEMO_COOKIE);
  return res;
}
