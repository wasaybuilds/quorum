import type { MeetingType } from "@/lib/types";

// All seed meetings are recorded in Pacific time. Formatting in a fixed zone keeps
// server and client renders identical (no hydration mismatch across time zones).
const TIME_ZONE = "America/Los_Angeles";

export function formatTimestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
  "bg-lime-100 text-lime-800",
  "bg-cyan-100 text-cyan-800",
  "bg-slate-200 text-slate-800",
];

function nameHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash;
}

export function avatarColor(name: string): string {
  return AVATAR_COLORS[nameHash(name) % AVATAR_COLORS.length];
}

export const TYPE_LABELS: Record<MeetingType, string> = {
  sales: "Sales",
  cs: "Customer Success",
  internal: "Internal",
  engineering: "Engineering",
};

export const TYPE_STYLES: Record<MeetingType, string> = {
  sales: "bg-blue-50 text-blue-700 ring-blue-600/15",
  cs: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  internal: "bg-amber-50 text-amber-800 ring-amber-600/20",
  engineering: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

export function pluralize(n: number, word: string, plural = `${word}s`): string {
  return `${n} ${n === 1 ? word : plural}`;
}
