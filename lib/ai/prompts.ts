import { z } from "zod";
import type { Meeting, TranscriptEntry } from "@/lib/types";
import { formatLongDate, formatTimestamp, TYPE_LABELS } from "@/lib/utils/format";

export const SummarySchema = z.object({
  executive_summary: z.string(),
  key_points: z.array(z.string()),
  decisions: z.array(z.string()),
  concerns: z.array(z.string()),
  action_items: z.array(
    z.object({
      task: z.string(),
      owner: z.string(),
      dueDate: z.string().nullable(),
      priority: z.enum(["high", "medium", "low"]),
    }),
  ),
});

export const AskMeetingSchema = z.object({
  answer: z.string(),
  source_lines: z.array(z.number().int()),
  confidence: z.enum(["high", "medium", "low"]),
});

export const AskMultiSchema = z.object({
  answer: z.string(),
  patterns: z.array(z.string()),
  sources: z.array(z.object({ meeting: z.number().int(), line: z.number().int() })),
});

export function transcriptBlock(transcript: TranscriptEntry[]): string {
  return transcript.map((e, i) => `[L${i}] ${formatTimestamp(e.timestamp)} ${e.speaker}: ${e.text}`).join("\n");
}

export function meetingHeader(m: Pick<Meeting, "title" | "company" | "type" | "date" | "duration" | "participants">) {
  const people = m.participants.map((p) => `${p.name}${p.role ? ` (${p.role}${p.external ? ", external" : ""})` : ""}`);
  return [
    `Title: ${m.title}`,
    `Company: ${m.company}`,
    `Type: ${TYPE_LABELS[m.type]}`,
    `Date: ${formatLongDate(m.date)}`,
    `Duration: ${m.duration} minutes`,
    `Participants: ${people.join("; ")}`,
  ].join("\n");
}

export const ANALYZE_SYSTEM = `You are the meeting analyst inside Quorum, a meeting-notes product used by revenue, customer success and engineering teams.
Given a meeting transcript, produce notes a busy teammate who missed the call can trust.

- executive_summary: 2-3 sentences. Lead with the outcome, then the most important open issue.
- key_points: 3-5 concrete points with specifics (numbers, names, dates) from the call.
- decisions: only things the group actually agreed to. Do not list proposals that were left open.
- concerns: risks, objections or blockers someone raised.
- action_items: 3-6 commitments. owner is the participant who took it on (use their name as written in the transcript). dueDate is a short date like "Sep 28" when one was stated or clearly implied, otherwise null.
Every item must be traceable to something said in the transcript. Write plainly; no filler, no marketing tone.`;

export const ASK_MEETING_SYSTEM = `You are Quorum's meeting assistant. You answer questions about one recorded meeting using only its transcript and notes below.

Rules:
- Ground every claim in the transcript. If the transcript does not cover the question, say so briefly and set confidence to "low".
- Keep answers short: one or two sentences, optionally followed by a list using "- " bullets. Use **bold** sparingly for names or key terms. No headings.
- Do not write line references like [L12] in the answer text. Put the transcript line numbers that support the answer in source_lines (2-5 lines, most relevant first; the number after "L").
- confidence: "high" when the transcript directly answers it, "medium" when it requires inference, "low" when it is not really covered.`;

export const ASK_MULTI_SYSTEM = `You are Quorum's cross-meeting analyst. You answer questions across a team's library of recorded meetings using only the transcripts below.

Rules:
- Look across meetings for patterns: what recurs, who raised it, and how often. Name the meetings or companies involved.
- Keep the answer tight: one short framing sentence, then a "- " bullet list. Use **bold** sparingly. No headings.
- patterns: 2-5 short labels for recurring themes (e.g. "Security review slows deals (3 of 4 sales calls)"). Empty if the question is not about patterns.
- sources: 3-8 supporting transcript lines, each as {meeting: <meeting number>, line: <number after "L">}, spread across meetings where possible.
- Do not write line references in the answer text. If the meetings don't cover the question, say so plainly.`;
