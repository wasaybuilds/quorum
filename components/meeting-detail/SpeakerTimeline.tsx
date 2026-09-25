"use client";

import { useMemo } from "react";
import type { Meeting } from "@/lib/types";
import { formatTimestamp, speakerBarColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * Who spoke when, across the whole call. Each segment runs from a transcript
 * entry to the next one; clicking a segment jumps the transcript there.
 */
export function SpeakerTimeline({
  meeting,
  activeTimestamp,
  onSeek,
}: {
  meeting: Meeting;
  activeTimestamp: number | null;
  onSeek: (t: number) => void;
}) {
  const total = meeting.duration * 60;

  const { segments, talk } = useMemo(() => {
    const t = meeting.transcript;
    const segs = t.map((e, i) => {
      const end = i + 1 < t.length ? t[i + 1].timestamp : Math.min(total, e.timestamp + 45);
      return { ...e, start: e.timestamp, end: Math.max(end, e.timestamp + 1) };
    });
    const bySpeaker = new Map<string, number>();
    for (const s of segs) bySpeaker.set(s.speaker, (bySpeaker.get(s.speaker) ?? 0) + (s.end - s.start));
    const sum = [...bySpeaker.values()].reduce((a, b) => a + b, 0) || 1;
    const talkTime = meeting.participants
      .map((p) => ({ name: p.name, pct: Math.round(((bySpeaker.get(p.name) ?? 0) / sum) * 100) }))
      .sort((a, b) => b.pct - a.pct);
    return { segments: segs, talk: talkTime };
  }, [meeting, total]);

  return (
    <section aria-label="Conversation timeline" className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-foreground">Conversation timeline</h2>
        <span className="font-mono text-xs tabular-nums text-muted">{formatTimestamp(total)}</span>
      </div>
      <div className="relative flex h-8 overflow-hidden rounded-md bg-surface-muted">
        {segments.map((s) => {
          const active = activeTimestamp === s.start;
          return (
            <button
              key={s.start}
              type="button"
              onClick={() => onSeek(s.start)}
              title={`${formatTimestamp(s.start)} · ${s.speaker}`}
              aria-label={`Jump to ${formatTimestamp(s.start)}, ${s.speaker}`}
              style={{ width: `${((s.end - s.start) / total) * 100}%` }}
              className={cn(
                "h-full border-r border-white/70 opacity-80 transition-opacity last:border-r-0 hover:opacity-100",
                speakerBarColor(s.speaker),
                active && "opacity-100 ring-2 ring-inset ring-foreground",
              )}
            />
          );
        })}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {talk.map((p) => (
          <li key={p.name} className="flex items-center gap-1.5 text-xs text-muted">
            <span className={cn("h-2 w-2 rounded-full", speakerBarColor(p.name))} />
            <span className="text-foreground">{p.name}</span>
            <span className="tabular-nums">{p.pct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
