"use client";

import { useMemo } from "react";
import type { Meeting } from "@/lib/types";
import { initials } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { speakerColors } from "@/lib/utils/speakers";

// Light hues (aqua, yellow, pink) need dark text for contrast; the rest take white.
const DARK_TEXT = new Set(["#1baf7a", "#eda100", "#e87ba4"]);

export function speakerShare(meeting: Meeting) {
  const t = meeting.transcript;
  const total = meeting.duration * 60;
  const bySpeaker = new Map<string, number>();
  t.forEach((e, i) => {
    const end = i + 1 < t.length ? t[i + 1].timestamp : Math.min(total, e.timestamp + 45);
    bySpeaker.set(e.speaker, (bySpeaker.get(e.speaker) ?? 0) + Math.max(1, end - e.timestamp));
  });
  const sum = [...bySpeaker.values()].reduce((a, b) => a + b, 0) || 1;
  return meeting.participants
    .map((p) => ({ name: p.name, role: p.role, pct: Math.round(((bySpeaker.get(p.name) ?? 0) / sum) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

/**
 * Talk-time distribution: one box per speaker sized by share of the call.
 * Hovering (or focusing) a speaker highlights their lines in the transcript;
 * clicking pins the highlight.
 */
export function SpeakerTimeline({
  meeting,
  focused,
  onFocus,
  pinned,
  onPin,
}: {
  meeting: Meeting;
  focused: string | null;
  onFocus: (name: string | null) => void;
  pinned: string | null;
  onPin: (name: string | null) => void;
}) {
  const share = useMemo(() => speakerShare(meeting), [meeting]);
  const colors = useMemo(() => speakerColors(meeting.participants), [meeting.participants]);

  return (
    <section aria-labelledby="talk-heading">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 id="talk-heading" className="text-label font-medium text-muted">
          Talk time
        </h2>
        {pinned && (
          <button type="button" onClick={() => onPin(null)} className="text-label text-accent-ink hover:underline">
            Clear highlight
          </button>
        )}
      </div>
      <div className="flex h-10 gap-0.5 overflow-hidden rounded-md" onMouseLeave={() => onFocus(null)}>
        {share.map((s) => {
          const active = (focused ?? pinned) === s.name;
          const dim = (focused ?? pinned) && !active;
          return (
            <button
              key={s.name}
              type="button"
              title={`${s.name} · ${s.pct}% of talk time`}
              aria-label={`${s.name}, ${s.pct}% of talk time. Highlight their lines`}
              aria-pressed={pinned === s.name}
              onMouseEnter={() => onFocus(s.name)}
              onFocus={() => onFocus(s.name)}
              onBlur={() => onFocus(null)}
              onClick={() => onPin(pinned === s.name ? null : s.name)}
              style={{ flexGrow: Math.max(s.pct, 1), flexBasis: 0, background: colors.get(s.name) }}
              className={cn(
                "flex min-w-0 items-center justify-center gap-1.5 overflow-hidden px-1.5 text-label font-semibold transition-opacity duration-150",
                DARK_TEXT.has(colors.get(s.name) ?? "") ? "text-ink" : "text-white",
                dim && "opacity-40",
              )}
            >
              {s.pct >= 8 && <span className="truncate">{initials(s.name)}</span>}
              {s.pct >= 14 && <span className="font-mono text-stamp font-medium opacity-80">{s.pct}%</span>}
            </button>
          );
        })}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {share.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5 text-label text-muted">
            <span className="h-2 w-2 rounded-sm" style={{ background: colors.get(s.name) }} aria-hidden="true" />
            <span className="text-copy">{s.name}</span>
            <span className="font-mono text-stamp">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
