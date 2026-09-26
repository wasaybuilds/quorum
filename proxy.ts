import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Optimistic gate: visitors without a session or demo cookie go to /login.
 * This only checks that a cookie exists; the session itself is verified
 * server-side by the API routes (see lib/auth/session.ts).
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname === "/login") return NextResponse.next();

  const hasAccess = req.cookies.has("quorum_session") || req.cookies.get("quorum_demo")?.value === "1";
  if (hasAccess) return NextResponse.next();

  const login = new URL("/login", req.url);
  if (pathname !== "/") login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  // Pages only: skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
