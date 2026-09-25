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


export const TYPE_LABELS: Record<MeetingType, string> = {
  sales: "Sales",
  cs: "Customer Success",
  internal: "Internal",
  engineering: "Engineering",
};

/** Type colour: used only for the badge dot and the list row's left border. */
export const TYPE_DOT: Record<MeetingType, string> = {
  sales: "bg-accent",
  cs: "bg-success",
  internal: "bg-warning",
  engineering: "bg-info",
};

export const TYPE_BORDER: Record<MeetingType, string> = {
  sales: "border-l-accent",
  cs: "border-l-success",
  internal: "border-l-warning",
  engineering: "border-l-info",
};

export function pluralize(n: number, word: string, plural = `${word}s`): string {
  return `${n} ${n === 1 ? word : plural}`;
}
