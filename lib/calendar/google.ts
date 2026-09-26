import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { UpcomingMeeting } from "@/lib/types";

// Server-only: Google OAuth + Calendar API for read-only access to the user's
// primary calendar. There is no database, so tokens live in an encrypted,
// httpOnly cookie on the user's browser.

export const TOKEN_COOKIE = "quorum_gcal";
export const STATE_COOKIE = "quorum_gcal_state";
const SCOPES = ["openid", "email", "https://www.googleapis.com/auth/calendar.readonly"];

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  /** epoch ms */
  expires_at: number;
  email?: string;
}

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
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// --- token cookie encryption (AES-256-GCM) ---------------------------------

function key() {
  const secret = process.env.CALENDAR_COOKIE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";
  return createHash("sha256").update(`quorum-calendar:${secret}`).digest();
}

export function seal(tokens: GoogleTokens): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(tokens), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function unseal(value: string | undefined): GoogleTokens | null {
  if (!value) return null;
  try {
    const raw = Buffer.from(value, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    return JSON.parse(json) as GoogleTokens;
  } catch {
    return null;
  }
}

export const cookieOptions = (maxAgeDays = 30) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeDays * 24 * 3600,
});

// --- OAuth token exchange ----------------------------------------------------

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
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

/** Email claim from the ID token Google just returned to us over TLS (not verified further). */
function emailFromIdToken(idToken?: string) {
  try {
    const payload = JSON.parse(Buffer.from(idToken!.split(".")[1], "base64url").toString("utf8"));
    return typeof payload.email === "string" ? payload.email : undefined;
  } catch {
    return undefined;
  }
}

export async function exchangeCode(req: Request, code: string): Promise<GoogleTokens> {
  const t = await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: redirectUri(req) });
  return {
    access_token: t.access_token,
    refresh_token: t.refresh_token,
    expires_at: Date.now() + (t.expires_in - 60) * 1000,
    email: emailFromIdToken(t.id_token),
  };
}

/** Returns fresh tokens (refreshing if expired) or null if access can't be restored. */
export async function ensureFresh(tokens: GoogleTokens): Promise<GoogleTokens | null> {
  if (tokens.expires_at > Date.now()) return tokens;
  if (!tokens.refresh_token) return null;
  try {
    const t = await tokenRequest({ refresh_token: tokens.refresh_token, grant_type: "refresh_token" });
    return { ...tokens, access_token: t.access_token, expires_at: Date.now() + (t.expires_in - 60) * 1000 };
  } catch {
    return null;
  }
}

// --- Calendar events ---------------------------------------------------------

interface GoogleEvent {
  id: string;
  summary?: string;
  status?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  attendees?: { email?: string; displayName?: string; self?: boolean; resource?: boolean }[];
  organizer?: { email?: string };
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

export async function fetchUpcoming(tokens: GoogleTokens, days = 14): Promise<UpcomingMeeting[]> {
  const now = new Date();
  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: new Date(now.getTime() + days * 24 * 3600 * 1000).toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "50",
  });
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Calendar API returned ${res.status}`);
  const data: { items?: GoogleEvent[] } = await res.json();

  const ownDomain = tokens.email?.split("@")[1]?.toLowerCase();
  return (data.items ?? [])
    .filter((e) => e.status !== "cancelled" && e.start?.dateTime && e.end?.dateTime) // skip all-day events
    .map((e) => {
      const attendees = (e.attendees ?? [])
        .filter((a) => a.email && !a.resource)
        .map((a) => ({ email: a.email!, name: a.displayName }));
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
