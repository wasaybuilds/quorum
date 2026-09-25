import type { Meeting, TranscriptEntry } from "@/lib/types";
import { TYPE_LABELS } from "./format";

export interface MeetingMatch {
  meeting: Meeting;
  /** which field matched, for display: "Title", "Company", "Participant: Lisa Park" */
  matchedOn: string;
}

export interface LineMatch {
  meeting: Meeting;
  entry: TranscriptEntry;
  snippet: string;
}

export interface SearchResults {
  meetings: MeetingMatch[];
  lines: LineMatch[];
}

const STOPWORDS = new Set(
  "a an and are as at be but by can did do does for from had has have how i in is it its me my of on or our so that the their them there they this to up was we were what when where which who why will with you your about any all been into just more than then these those us very would could should also get got going gonna yeah okay ok right like think know".split(
    " ",
  ),
);

export function normalize(s: string): string {
  return s.toLowerCase().replace(/[’']/g, "'");
}

/** Query terms (lowercased, stopwords removed) — shared by UI highlighting. */
export function queryTerms(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9$%.'/-]+/)
    .map((t) => t.replace(/^[.'/-]+|[.'/-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function makeSnippet(text: string, terms: string[], radius = 70): string {
  const lower = normalize(text);
  let idx = -1;
  for (const t of terms) {
    idx = lower.indexOf(t);
    if (idx !== -1) break;
  }
  if (idx === -1 || text.length <= radius * 2) return text;
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/**
 * Keyword search across the library. A transcript line matches when it contains
 * every query term; meetings match on title, company, type and participants.
 */
export function search(list: Meeting[], query: string, lineLimit = 50): SearchResults {
  const q = normalize(query.trim());
  const terms = queryTerms(query);
  if (!q) return { meetings: [], lines: [] };
  // Fall back to the raw query when it was made only of stopwords (e.g. "who").
  const effective = terms.length ? terms : [q];

  const meetingMatches: MeetingMatch[] = [];
  const lines: LineMatch[] = [];

  for (const meeting of list) {
    const fields: [string, string][] = [
      ["Title", meeting.title],
      ["Company", meeting.company],
      ["Type", TYPE_LABELS[meeting.type]],
      ...meeting.participants.map((p) => [`Participant: ${p.name}`, `${p.name} ${p.role ?? ""}`] as [string, string]),
    ];
    const hit = fields.find(([, value]) => effective.every((t) => normalize(value).includes(t)));
    const allFields = normalize(fields.map(([, v]) => v).join(" "));
    if (hit) meetingMatches.push({ meeting, matchedOn: hit[0] });
    else if (effective.every((t) => allFields.includes(t))) meetingMatches.push({ meeting, matchedOn: "Details" });

    for (const entry of meeting.transcript) {
      const text = normalize(entry.text);
      if (effective.every((t) => text.includes(t))) {
        lines.push({ meeting, entry, snippet: makeSnippet(entry.text, effective) });
      }
    }
  }

  return { meetings: meetingMatches, lines: lines.slice(0, lineLimit) };
}

// ---------------------------------------------------------------------------
// Relevance scoring for the offline AI fallback.

const SYNONYMS: Record<string, string[]> = {
  concern: ["concern", "worr", "risk", "issue", "problem", "nervous", "hesitat", "tight", "blocker"],
  risk: ["risk", "concern", "worr", "danger", "downtime", "lag"],
  decision: ["decid", "agree", "go with", "approv", "let's do", "move forward", "sounds good"],
  price: ["pric", "cost", "budget", "discount", "seat", "$", "expensive"],
  security: ["security", "soc", "sso", "scim", "compliance", "pen test", "questionnaire"],
  salesforce: ["salesforce", "sync", "duplicate", "mapping", "crm"],
  timeline: ["timeline", "q4", "q1", "january", "deadline", "go live", "weeks", "date"],
  action: ["send", "schedule", "follow up", "i'll", "i will", "by friday", "next week", "owner"],
  next: ["next step", "follow up", "i'll", "schedule", "send"],
};

function expand(terms: string[]): string[] {
  const out = new Set<string>();
  for (const t of terms) {
    const stem = t.replace(/(ing|ed|es|s)$/, "");
    out.add(stem.length > 2 ? stem : t);
    for (const [key, words] of Object.entries(SYNONYMS)) {
      if (t.startsWith(key) || key.startsWith(stem)) words.forEach((w) => out.add(w));
    }
  }
  return [...out];
}

/** Returns transcript indexes sorted by relevance to the text (best first). */
export function rankLines(transcript: TranscriptEntry[], text: string, limit = 3): number[] {
  const terms = expand(queryTerms(text));
  if (!terms.length) return [];
  return transcript
    .map((entry, i) => {
      const line = normalize(entry.text);
      const score = terms.reduce((s, t) => s + (line.includes(t) ? (t.length > 5 ? 2 : 1) : 0), 0);
      return { i, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map((r) => r.i);
}
