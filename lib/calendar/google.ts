import type { UpcomingMeeting } from "@/lib/types";
import { db } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/auth/crypto";

// Server-only: Google sign-in (OpenID Connect) plus read-only Calendar access.
// One consent screen both identifies the user and grants calendar.readonly.

export const STATE_COOKIE = "quorum_oauth_state";
const SCOPES = ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar.readonly"];
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export function isGoogleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/** Public origin of this request, respecting the proxy headers Railway sets. */
export function publicOrigin(req: Request) {
  const url = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export function redirectUri(req: Request) {
  return process.env.GOOGLE_REDIRECT_URI || `${publicOrigin(req)}/api/calendar/callback`;
}

export function authUrl(req: Request, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(req),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    include_granted_scopes: "true",
    // consent each time so Google always returns a refresh token
    prompt: "select_account consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export const stateCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 600,
};

/** Only same-site relative paths are allowed as post-login destinations. */
export function safeNext(next: string | null | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

// --- token exchange -----------------------------------------------------------

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      ...body,
    }),
  });
  if (!res.ok) throw new Error(`Google token endpoint returned ${res.status}`);
  return res.json();
}

export interface GoogleIdentity {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface GoogleGrant {
  identity: GoogleIdentity;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope: string;
}

/**
 * Exchanges the authorisation code. The ID token comes straight from Google's
 * token endpoint over TLS in response to our confidential client's request, so
 * its claims are trusted without a separate signature check (OIDC core §3.1.3.7).
 */
export async function exchangeCode(req: Request, code: string): Promise<GoogleGrant> {
  const t = await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: redirectUri(req) });
  const claims = JSON.parse(Buffer.from(t.id_token!.split(".")[1], "base64url").toString("utf8"));
  if (!claims.sub || !claims.email) throw new Error("ID token is missing sub or email");
  return {
    identity: { sub: claims.sub, email: claims.email, name: claims.name, picture: claims.picture },
    accessToken: t.access_token,
    refreshToken: t.refresh_token,
    expiresAt: new Date(Date.now() + (t.expires_in - 60) * 1000),
    scope: t.scope ?? "",
  };
}

export const hasCalendarScope = (scope: string) => scope.split(" ").includes(CALENDAR_SCOPE);

// --- token storage (encrypted, per user) ---------------------------------------

export async function saveGrant(userId: string, grant: GoogleGrant) {
  const sql = await db();
  const refresh = grant.refreshToken ? encrypt(grant.refreshToken) : null;
  await sql`
    insert into google_tokens (user_id, access_token, refresh_token, expires_at, scope, updated_at)
    values (${userId}, ${encrypt(grant.accessToken)}, ${refresh}, ${grant.expiresAt}, ${grant.scope}, now())
    on conflict (user_id) do update set
      access_token = excluded.access_token,
      refresh_token = coalesce(excluded.refresh_token, google_tokens.refresh_token),
      expires_at = excluded.expires_at,
      scope = excluded.scope,
      updated_at = now()
  `;
}

export async function deleteGrant(userId: string) {
  const sql = await db();
  const rows = await sql<{ refresh_token: string | null; access_token: string }[]>`
    delete from google_tokens where user_id = ${userId} returning refresh_token, access_token
  `;
  // Best effort: also revoke the grant at Google so the app disappears from the user's account.
  const sealed = rows[0]?.refresh_token ?? rows[0]?.access_token;
  const token = sealed ? decrypt(sealed) : null;
  if (token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, { method: "POST" }).catch(() => {});
  }
}

/** A valid access token for the user's calendar (refreshing it if needed), or null if not connected. */
export async function calendarAccessToken(userId: string): Promise<string | null> {
  const sql = await db();
  const [row] = await sql<{ access_token: string; refresh_token: string | null; expires_at: Date; scope: string }[]>`
    select access_token, refresh_token, expires_at, scope from google_tokens where user_id = ${userId}
  `;
  if (!row || !hasCalendarScope(row.scope)) return null;
  if (new Date(row.expires_at).getTime() > Date.now()) return decrypt(row.access_token);

  const refresh = row.refresh_token ? decrypt(row.refresh_token) : null;
  if (!refresh) return null;
  try {
    const t = await tokenRequest({ refresh_token: refresh, grant_type: "refresh_token" });
    const expiresAt = new Date(Date.now() + (t.expires_in - 60) * 1000);
    await sql`
      update google_tokens set access_token = ${encrypt(t.access_token)}, expires_at = ${expiresAt}, updated_at = now()
      where user_id = ${userId}
    `;
    return t.access_token;
  } catch (err) {
    console.error("[calendar] refresh failed:", err);
    return null;
  }
}

// --- Calendar events -----------------------------------------------------------

interface GoogleEvent {
  id: string;
  summary?: string;
  status?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  attendees?: { email?: string; displayName?: string; self?: boolean; resource?: boolean }[];
  hangoutLink?: string;
  location?: string;
  description?: string;
  conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
}

function detectPlatform(e: GoogleEvent): { platform: UpcomingMeeting["platform"]; joinUrl?: string } {
  const video = e.conferenceData?.entryPoints?.find((p) => p.entryPointType === "video")?.uri;
  const haystack = [e.hangoutLink, video, e.location, e.description].filter(Boolean).join(" ");
  const url = e.hangoutLink ?? video ?? haystack.match(/https?:\/\/\S+/)?.[0];
  if (/zoom\.us/i.test(haystack)) return { platform: "Zoom", joinUrl: url };
  if (/teams\.microsoft|teams\.live/i.test(haystack)) return { platform: "Microsoft Teams", joinUrl: url };
  if (/meet\.google/i.test(haystack)) return { platform: "Google Meet", joinUrl: url };
  return { platform: null };
}

export async function fetchUpcoming(accessToken: string, ownEmail: string, days = 14): Promise<UpcomingMeeting[]> {
  const now = new Date();
  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: new Date(now.getTime() + days * 24 * 3600 * 1000).toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "50",
  });
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Calendar API returned ${res.status}`);
  const data: { items?: GoogleEvent[] } = await res.json();

  const ownDomain = ownEmail.split("@")[1]?.toLowerCase();
  return (data.items ?? [])
    .filter((e) => e.status !== "cancelled" && e.start?.dateTime && e.end?.dateTime) // skip all-day events
    .map((e) => {
      const attendees = (e.attendees ?? []).filter((a) => a.email && !a.resource).map((a) => ({ email: a.email!, name: a.displayName }));
      const external = !!ownDomain && attendees.some((a) => a.email.split("@")[1]?.toLowerCase() !== ownDomain);
      return {
        id: `g-${e.id}`,
        title: e.summary || "(No title)",
        start: e.start!.dateTime!,
        end: e.end!.dateTime!,
        attendees,
        external,
        source: "google" as const,
        ...detectPlatform(e),
      };
    });
}
