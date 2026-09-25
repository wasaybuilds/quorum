"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import type { Meeting, TranscriptEntry } from "@/lib/types";
import type { AnchorKind, Anchors } from "@/lib/utils/anchors";
import { formatTimestamp } from "@/lib/utils/format";
import { normalize, queryTerms } from "@/lib/utils/search";
import { inputBare, inputShell } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { Badge, StatusBadge } from "@/components/common/TypeBadge";
import { Highlight } from "@/components/search/Highlight";
import { Kbd, useModKey } from "@/components/common/Kbd";

export interface SeekRequest {
  timestamp: number;
  /** increments on every request so re-seeking the same line still scrolls */
  nonce: number;
}

interface Props {
  meeting: Meeting;
  seek: SeekRequest | null;
  onSeek: (t: number) => void;
  anchors: Anchors;
  /** speaker whose lines are highlighted (hover or pinned in the talk-time bar) */
  speaker: string | null;
  /** called before the search box takes focus (e.g. to switch the mobile tab) */
  onReveal?: () => void;
  /** rendered above the search row inside the sticky toolbar (desktop talk-time bar) */
  toolbarHeader?: React.ReactNode;
  /** sticky offset for the toolbar, which depends on the surrounding layout */
  toolbarClassName?: string;
  className?: string;
}

export function Transcript({ meeting, seek, onSeek, anchors, speaker, onReveal, toolbarHeader, toolbarClassName, className }: Props) {
  const [query, setQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const mod = useModKey();

  const matches = useMemo(() => {
    const terms = queryTerms(query);
    const q = normalize(query.trim());
    if (!q) return [] as number[];
    return meeting.transcript
      .map((e, i) => ({ i, text: normalize(`${e.speaker} ${e.text}`) }))
      .filter(({ text }) => (terms.length ? terms.every((t) => text.includes(t)) : text.includes(q)))
      .map(({ i }) => i);
  }, [meeting.transcript, query]);

  const current = matches.length ? Math.min(matchIndex, matches.length - 1) : -1;

  useEffect(() => {
    if (seek) scrollToLine(listRef.current, seek.timestamp);
  }, [seek]);

  useEffect(() => {
    if (current >= 0) scrollToLine(listRef.current, meeting.transcript[matches[current]].timestamp);
  }, [current, matches, meeting.transcript]);

  // Ctrl/Cmd+F focuses transcript search first; pressing it again falls through to the browser.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        onReveal?.();
        requestAnimationFrame(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onReveal]);

  function step(dir: 1 | -1) {
    if (!matches.length) return;
    setMatchIndex((i) => (Math.min(i, matches.length - 1) + dir + matches.length) % matches.length);
  }

  const matchSet = useMemo(() => new Set(matches), [matches]);
  const currentLine = current >= 0 ? matches[current] : -1;

  return (
    <section aria-labelledby="transcript-heading" className={className}>
      <div className={cn("sticky z-10 -mx-4 border-b border-border bg-surface px-4 py-3 sm:-mx-6 sm:px-6", toolbarClassName)}>
        {toolbarHeader}
        <div className="mb-2 flex items-baseline justify-between">
          <h2 id="transcript-heading" className="text-h3">
            Transcript
          </h2>
          <span className="text-label text-muted">{meeting.transcript.length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(inputShell, "h-10 flex-1")}>
            <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setMatchIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  step(e.shiftKey ? -1 : 1);
                } else if (e.key === "Escape") {
                  setQuery("");
                }
              }}
              placeholder="Search transcript"
              aria-label="Search transcript"
              className={inputBare}
            />
            {query ? (
              <>
                <span className="shrink-0 font-mono text-stamp text-muted" aria-live="polite">
                  {matches.length ? `${current + 1}/${matches.length}` : "0 found"}
                </span>
                <button type="button" onClick={() => setQuery("")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted hover:text-ink" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Kbd className="hidden sm:inline-flex">{mod}F</Kbd>
            )}
          </div>
          <button type="button" onClick={() => step(-1)} disabled={!matches.length} className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted transition-colors duration-150 hover:bg-surface-muted disabled:text-disabled" aria-label="Previous match">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => step(1)} disabled={!matches.length} className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted transition-colors duration-150 hover:bg-surface-muted disabled:text-disabled" aria-label="Next match">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ol ref={listRef} className="-mx-4 py-2 sm:mx-0" aria-label="Transcript lines">
        {meeting.transcript.map((entry, i) => (
          <Line
            key={entry.timestamp}
            entry={entry}
            active={seek?.timestamp === entry.timestamp}
            isCurrentMatch={i === currentLine}
            query={matchSet.has(i) ? query : ""}
            chips={anchors.byTimestamp.get(entry.timestamp)}
            speakerFocused={speaker === entry.speaker}
            onSeek={onSeek}
          />
        ))}
      </ol>
    </section>
  );
}

function scrollToLine(list: HTMLOListElement | null, timestamp: number) {
  list?.querySelector<HTMLElement>(`[data-ts="${timestamp}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
}

const Line = memo(function Line({
  entry,
  active,
  isCurrentMatch,
  query,
  chips,
  speakerFocused,
  onSeek,
}: {
  entry: TranscriptEntry;
  active: boolean;
  isCurrentMatch: boolean;
  query: string;
  chips?: { kind: AnchorKind; label: string }[];
  speakerFocused: boolean;
  onSeek: (t: number) => void;
}) {
  return (
    <li
      data-ts={entry.timestamp}
      id={`t-${entry.timestamp}`}
      className={cn(
        "grid scroll-mt-24 scroll-mb-24 gap-1 px-4 py-3 transition-colors duration-150 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-4 sm:rounded-md",
        active ? "transcript-active" : isCurrentMatch ? "bg-highlight/60" : speakerFocused ? "bg-accent-soft/60" : "hover:bg-surface",
        speakerFocused && "shadow-[inset_3px_0_0_var(--accent)]",
      )}
    >
      <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0.5">
        <span className="truncate text-label font-semibold text-ink">{entry.speaker}</span>
        <button
          type="button"
          onClick={() => onSeek(entry.timestamp)}
          className="-mx-1 rounded px-1 font-mono text-stamp text-muted transition-colors duration-150 hover:bg-highlight hover:text-ink"
          aria-label={`Jump to line at ${formatTimestamp(entry.timestamp)}`}
        >
          {formatTimestamp(entry.timestamp)}
        </button>
      </div>
      <div className="min-w-0">
        <p className="max-w-[65ch] text-body text-copy">{query ? <Highlight text={entry.text} query={query} /> : entry.text}</p>
        {chips && chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c) =>
              c.kind === "concern" ? (
                <StatusBadge key={c.kind} tone="warning">Concern</StatusBadge>
              ) : c.kind === "decision" ? (
                <Badge key={c.kind}>Decision</Badge>
              ) : (
                <Badge key={c.kind} className="border border-border bg-surface text-copy">
                  {c.label}
                </Badge>
              ),
            )}
          </div>
        )}
      </div>
    </li>
  );
});
