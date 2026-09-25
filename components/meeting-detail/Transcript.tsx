"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Flag, Search, X } from "lucide-react";
import type { Meeting, TranscriptEntry } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/format";
import { normalize, queryTerms } from "@/lib/utils/search";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/common/Avatar";
import { Highlight } from "@/components/search/Highlight";

export interface SeekRequest {
  timestamp: number;
  /** increments on every request so re-seeking the same line still scrolls */
  nonce: number;
}

interface Props {
  meeting: Meeting;
  seek: SeekRequest | null;
  onSeek: (t: number) => void;
  /** called before the search box takes focus (e.g. to switch panel tabs) */
  onReveal?: () => void;
  className?: string;
}

export function Transcript({ meeting, seek, onSeek, onReveal, className }: Props) {
  const [query, setQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

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

  // Scroll to a requested timestamp.
  useEffect(() => {
    if (seek) scrollToLine(listRef.current, seek.timestamp);
  }, [seek]);

  // Scroll to the current search match.
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
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="sticky top-14 z-10 space-y-3 border-b border-border bg-surface px-4 py-3 lg:top-0 xl:static">
        <div className="flex items-center gap-2">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 focus-within:border-border-strong focus-within:bg-surface">
            <Search className="h-4 w-4 shrink-0 text-subtle" />
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
              className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-subtle sm:text-sm"
            />
            {query && (
              <>
                <span className="shrink-0 text-xs tabular-nums text-muted" aria-live="polite">
                  {matches.length ? `${current + 1} of ${matches.length}` : "No matches"}
                </span>
                <button type="button" onClick={() => setQuery("")} className="shrink-0 rounded p-0.5 text-subtle hover:text-foreground" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          {query && (
            <div className="flex">
              <button type="button" onClick={() => step(-1)} disabled={!matches.length} className="flex h-10 w-9 items-center justify-center rounded-l-lg border border-border text-muted hover:bg-surface-muted disabled:opacity-40" aria-label="Previous match">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => step(1)} disabled={!matches.length} className="-ml-px flex h-10 w-9 items-center justify-center rounded-r-lg border border-border text-muted hover:bg-surface-muted disabled:opacity-40" aria-label="Next match">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {meeting.highlights && meeting.highlights.length > 0 && (
          <div className="scroll-thin -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5">
            {meeting.highlights.map((h) => (
              <button
                key={h.timestamp}
                type="button"
                onClick={() => onSeek(h.timestamp)}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 text-xs text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted/60"
              >
                <Flag className="h-3 w-3 text-amber-500" />
                {h.label}
                <span className="font-mono tabular-nums text-muted">{formatTimestamp(h.timestamp)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <ol ref={listRef} className="scroll-thin relative flex-1 space-y-0.5 px-2 py-3 xl:overflow-y-auto" aria-label="Transcript">
        {meeting.transcript.map((entry, i) => (
          <Line
            key={entry.timestamp}
            entry={entry}
            active={seek?.timestamp === entry.timestamp}
            isMatch={matchSet.has(i)}
            isCurrentMatch={i === currentLine}
            query={matchSet.has(i) ? query : ""}
            onSeek={onSeek}
          />
        ))}
      </ol>
    </div>
  );
}

/**
 * Centres a line. In the desktop rail the list scrolls on its own, so only the list
 * moves (the page stays put); inline on smaller screens the page scrolls instead.
 */
function scrollToLine(list: HTMLOListElement | null, timestamp: number) {
  const el = list?.querySelector<HTMLElement>(`[data-ts="${timestamp}"]`);
  if (!list || !el) return;
  const ownScroll = getComputedStyle(list).overflowY === "auto" && list.scrollHeight > list.clientHeight;
  if (ownScroll) {
    list.scrollTo({ top: el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2, behavior: "smooth" });
  } else {
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

const Line = memo(function Line({
  entry,
  active,
  isMatch,
  isCurrentMatch,
  query,
  onSeek,
}: {
  entry: TranscriptEntry;
  active: boolean;
  isMatch: boolean;
  isCurrentMatch: boolean;
  query: string;
  onSeek: (t: number) => void;
}) {
  return (
    <li
      data-ts={entry.timestamp}
      id={`t-${entry.timestamp}`}
      className={cn(
        "flex scroll-mt-40 gap-3 rounded-lg px-2.5 py-2.5 transition-colors",
        active && "transcript-active",
        !active && isCurrentMatch && "bg-amber-50 ring-1 ring-amber-200",
        !active && !isCurrentMatch && isMatch && "bg-surface-muted/60",
      )}
    >
      <Avatar name={entry.speaker} size="sm" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-foreground">{entry.speaker}</span>
          <button
            type="button"
            onClick={() => onSeek(entry.timestamp)}
            className="shrink-0 rounded px-1 font-mono text-xs tabular-nums text-accent hover:bg-accent-soft hover:underline"
            aria-label={`Jump to ${formatTimestamp(entry.timestamp)}`}
          >
            {formatTimestamp(entry.timestamp)}
          </button>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
          {query ? <Highlight text={entry.text} query={query} /> : entry.text}
        </p>
      </div>
    </li>
  );
});
