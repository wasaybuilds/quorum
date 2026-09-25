"use client";

import { CloudOff, RotateCw } from "lucide-react";
import type { MeetingSummary } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { ErrorState, Loading, Spinner } from "@/components/common/States";
import { Badge } from "@/components/common/TypeBadge";

export type SummaryOrigin = "seed" | "ai" | "fallback";

interface Props {
  summary: MeetingSummary;
  decisionAnchors: (number | null)[];
  concernAnchors: (number | null)[];
  loading: boolean;
  error: boolean;
  origin: SummaryOrigin;
  onRegenerate: () => void;
  onSeek: (t: number) => void;
  /** sticky offset for the header row, which depends on the surrounding layout */
  stickyClassName?: string;
  className?: string;
}

export function Summary({ summary, decisionAnchors, concernAnchors, loading, error, origin, onRegenerate, onSeek, stickyClassName, className }: Props) {
  return (
    <section aria-labelledby="summary-heading" className={className}>
      <div className={cn("sticky z-10 -mx-4 mb-4 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:-mx-6 sm:px-6", stickyClassName)}>
        <h2 id="summary-heading" className="text-h3">
          Summary
        </h2>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={loading}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface-muted px-3 text-body font-medium text-copy transition-colors duration-150 hover:bg-border hover:text-accent-ink disabled:cursor-not-allowed disabled:text-muted"
        >
          {loading ? <Spinner className="h-4 w-4" /> : <RotateCw className="h-4 w-4" aria-hidden="true" />}
          {loading ? "Regenerating" : "Regenerate"}
        </button>
      </div>
      {origin !== "seed" && !loading && (
        <div className="mb-4">
          {origin === "ai" ? (
            <Badge>Regenerated just now</Badge>
          ) : (
            <Badge className="bg-surface-disabled text-copy">
              <CloudOff className="h-3 w-3" aria-hidden="true" /> AI unavailable, showing saved notes
            </Badge>
          )}
        </div>
      )}
      {error && <ErrorState className="mb-4" message="Couldn't regenerate the summary. The previous version is still shown." onRetry={onRegenerate} />}

      {loading ? (
        <Loading message="Regenerating summary from the transcript…" />
      ) : (
        <>
          <h3 className="text-label font-medium text-muted">Executive summary</h3>
          <p className="mt-2 max-w-[65ch] text-body text-copy">{summary.executive_summary}</p>

          <h3 className="mt-8 text-label font-medium text-muted">Key points</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-body text-copy marker:text-disabled">
            {summary.key_points.map((p) => (
              <li key={p} className="max-w-[65ch] pl-1">
                {p}
              </li>
            ))}
          </ul>

          <LinkedList title="Decisions" items={summary.decisions} anchors={decisionAnchors} onSeek={onSeek} empty="No decisions were recorded." />
          <LinkedList title="Concerns" items={summary.concerns} anchors={concernAnchors} onSeek={onSeek} empty="No concerns were raised." />
        </>
      )}

    </section>
  );
}

function LinkedList({
  title,
  items,
  anchors,
  onSeek,
  empty,
}: {
  title: string;
  items: string[];
  anchors: (number | null)[];
  onSeek: (t: number) => void;
  empty: string;
}) {
  return (
    <>
      <h3 className="mt-8 text-label font-medium text-muted">
        {title} <span className="font-mono text-stamp">{items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="mt-2 text-small text-muted">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {items.map((item, i) => {
            const ts = anchors[i];
            return (
              <li key={item}>
                {ts === null ? (
                  <p className="flex gap-3 py-1.5 text-body text-copy">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-disabled" />
                    {item}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSeek(ts)}
                    className="group -mx-2 flex w-[calc(100%+1rem)] gap-3 rounded-md px-2 py-1.5 text-left text-body text-copy transition-colors duration-150 hover:bg-surface-muted"
                    aria-label={`${item}. Jump to line at ${formatTimestamp(ts)}`}
                  >
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="flex-1 group-hover:text-accent-ink group-hover:underline group-hover:underline-offset-2">{item}</span>
                    <span className="shrink-0 pt-0.5 font-mono text-stamp text-muted group-hover:text-accent-ink">{formatTimestamp(ts)}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
