import type { Meeting } from "@/lib/types";
import { normalize } from "./search";

// Conversation analytics derived from the transcript alone (no model call):
// who spoke when, turns, monologues, questions, pace and topics over time.

export interface Segment {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

export interface SpeakerStats {
  name: string;
  role?: string;
  external: boolean;
  seconds: number;
  pct: number;
  turns: number;
  questions: number;
  longestTurn: number;
}

export interface TopicRow {
  label: string;
  total: number;
  /** mentions per time bucket */
  buckets: number[];
}

export interface MeetingAnalytics {
  totalSeconds: number;
  segments: Segment[];
  speakers: SpeakerStats[];
  teamPct: number;
  guestPct: number;
  questions: number;
  longest: { speaker: string; seconds: number; start: number } | null;
  switchesPerMinute: number;
  bucketSeconds: number;
  topics: TopicRow[];
}

const TOPICS: { label: string; keywords: string[] }[] = [
  { label: "Pricing & budget", keywords: ["price", "pricing", "budget", "discount", "per seat", "$", "cost", "quote"] },
  { label: "Security & compliance", keywords: ["security", "soc 2", "sso", "scim", "compliance", "questionnaire", "pen test", "gdpr", "dpa"] },
  { label: "Salesforce & sync", keywords: ["salesforce", "sync", "duplicate", "mapping", "crm"] },
  { label: "Timeline & go-live", keywords: ["timeline", "go live", "go-live", "deadline", "q4", "q1", "january", "november", "weeks"] },
  { label: "Approvals & sign-off", keywords: ["cto", "cfo", "sign off", "sign-off", "approval", "approve"] },
  { label: "Performance & scale", keywords: ["latency", "p95", "slow", "performance", "load", "cache", "redis", "timeout"] },
  { label: "Migration & infrastructure", keywords: ["migration", "postgres", "replica", "downtime", "rollback", "runbook"] },
  { label: "Roadmap & scope", keywords: ["roadmap", "scope", "prioritiz", "priorit", "defer", "capacity"] },
  { label: "Adoption & training", keywords: ["training", "adoption", "onboard", "usage", "admin", "champion"] },
  { label: "Incidents & reliability", keywords: ["incident", "outage", "retry", "alert", "postmortem", "rate limit", "429"] },
];

export function analyzeMeeting(meeting: Meeting, bucketCount = 12): MeetingAnalytics {
  const t = meeting.transcript;
  const totalSeconds = meeting.duration * 60;

  const segments: Segment[] = t.map((e, i) => ({
    speaker: e.speaker,
    start: e.timestamp,
    end: Math.max(e.timestamp + 1, i + 1 < t.length ? t[i + 1].timestamp : Math.min(totalSeconds, e.timestamp + 45)),
    text: e.text,
  }));

  // Turns = runs of consecutive lines by the same speaker.
  const turns: { speaker: string; start: number; end: number }[] = [];
  for (const s of segments) {
    const last = turns[turns.length - 1];
    if (last && last.speaker === s.speaker) last.end = s.end;
    else turns.push({ speaker: s.speaker, start: s.start, end: s.end });
  }

  const spoken = segments.reduce((sum, s) => sum + (s.end - s.start), 0) || 1;
  const speakers: SpeakerStats[] = meeting.participants.map((p) => {
    const own = segments.filter((s) => s.speaker === p.name);
    const seconds = own.reduce((sum, s) => sum + (s.end - s.start), 0);
    const ownTurns = turns.filter((x) => x.speaker === p.name);
    return {
      name: p.name,
      role: p.role,
      external: !!p.external,
      seconds,
      pct: Math.round((seconds / spoken) * 100),
      turns: ownTurns.length,
      questions: own.filter((s) => s.text.includes("?")).length,
      longestTurn: Math.max(0, ...ownTurns.map((x) => x.end - x.start)),
    };
  });

  const guestSeconds = speakers.filter((s) => s.external).reduce((sum, s) => sum + s.seconds, 0);
  const guestPct = Math.round((guestSeconds / spoken) * 100);
  const longestTurn = turns.reduce<(typeof turns)[number] | null>((best, x) => (!best || x.end - x.start > best.end - best.start ? x : best), null);

  const bucketSeconds = Math.ceil(totalSeconds / bucketCount);
  const topics = TOPICS.map(({ label, keywords }) => {
    const buckets = Array.from({ length: bucketCount }, () => 0);
    for (const s of segments) {
      const text = normalize(s.text);
      const hits = keywords.reduce((n, k) => n + (text.includes(k) ? 1 : 0), 0);
      if (hits) buckets[Math.min(bucketCount - 1, Math.floor(s.start / bucketSeconds))] += hits;
    }
    return { label, buckets, total: buckets.reduce((a, b) => a + b, 0) };
  })
    .filter((r) => r.total >= 2)
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return {
    totalSeconds,
    segments,
    speakers,
    teamPct: 100 - guestPct,
    guestPct,
    questions: segments.filter((s) => s.text.includes("?")).length,
    longest: longestTurn ? { speaker: longestTurn.speaker, seconds: longestTurn.end - longestTurn.start, start: longestTurn.start } : null,
    switchesPerMinute: Math.round(((turns.length - 1) / Math.max(1, meeting.duration)) * 10) / 10,
    bucketSeconds,
    topics,
  };
}
