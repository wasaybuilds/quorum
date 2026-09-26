import { cookies } from "next/headers";
import { db, isDbConfigured } from "@/lib/db";
import { randomToken, sha256 } from "./crypto";

// Server-only. Opaque session tokens: the browser holds the token in an httpOnly
// cookie; the database holds only its SHA-256 hash.

export const SESSION_COOKIE = "quorum_session";
export const DEMO_COOKIE = "quorum_demo";
const SESSION_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 3600,
};

export async function createSession(userId: string): Promise<string> {
  const sql = await db();
  const token = randomToken();
  await sql`
    insert into sessions (id_hash, user_id, expires_at)
    values (${sha256(token)}, ${userId}, now() + ${`${SESSION_DAYS} days`}::interval)
  `;
  return token;
}

export async function destroySession(token: string | undefined) {
  if (!token || !isDbConfigured()) return;
  const sql = await db();
  await sql`delete from sessions where id_hash = ${sha256(token)}`;
}

/** The signed-in user for this request, or null (no cookie, expired, or no database). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!isDbConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const sql = await db();
    const rows = await sql<SessionUser[]>`
      select u.id, u.email, u.name, u.picture
      from sessions s join users u on u.id = s.user_id
      where s.id_hash = ${sha256(token)} and s.expires_at > now()
    `;
    return rows[0] ?? null;
  } catch (err) {
    console.error("[auth] session lookup failed:", err);
    return null;
  }
}
