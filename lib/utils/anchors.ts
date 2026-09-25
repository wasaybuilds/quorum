import type { Meeting, MeetingSummary } from "@/lib/types";
import { rankLines } from "./search";

export type AnchorKind = "decision" | "concern" | "highlight";

export interface Anchors {
  decisions: (number | null)[];
  concerns: (number | null)[];
  /** transcript timestamp → chips to show on that line */
  byTimestamp: Map<number, { kind: AnchorKind; label: string }[]>;
}

/** Links each decision and concern to the transcript line that best supports it. */
export function buildAnchors(meeting: Meeting, summary: MeetingSummary): Anchors {
  const byTimestamp: Anchors["byTimestamp"] = new Map();
  const add = (ts: number, kind: AnchorKind, label: string) => {
    const list = byTimestamp.get(ts) ?? [];
    if (!list.some((c) => c.kind === kind)) list.push({ kind, label });
    byTimestamp.set(ts, list);
  };

  const anchor = (items: string[], kind: AnchorKind) =>
    items.map((item) => {
      const i = rankLines(meeting.transcript, item, 1)[0];
      if (i === undefined) return null;
      const ts = meeting.transcript[i].timestamp;
      add(ts, kind, item);
      return ts;
    });

  const decisions = anchor(summary.decisions, "decision");
  const concerns = anchor(summary.concerns, "concern");
  for (const h of meeting.highlights ?? []) add(h.timestamp, "highlight", h.label);

  return { decisions, concerns, byTimestamp };
}
