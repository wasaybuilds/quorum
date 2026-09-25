"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, CloudOff, RefreshCw } from "lucide-react";
import type { MeetingSummary, TranscriptEntry } from "@/lib/types";
import { rankLines } from "@/lib/utils/search";
import { formatTimestamp } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { ErrorState, Skeleton, SkeletonLines } from "@/components/common/States";

export type SummaryOrigin = "seed" | "ai" | "fallback";

interface Props {
  summary: MeetingSummary;
  transcript: TranscriptEntry[];
  loading: boolean;
  error: boolean;
  origin: SummaryOrigin;
  onRegenerate: () => void;
  onSeek: (t: number) => void;
}

export function Summary({ summary, transcript, loading, error, origin, onRegenerate, onSeek }: Props) {
  return (
    <section aria-labelledby="summary-heading" className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <h2 id="summary-heading" className="text-sm font-semibold text-foreground">
            Summary
          </h2>
          <OriginTag origin={origin} />
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={loading}
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          {loading ? "Generating…" : "Regenerate"}
        </button>
      </div>

      <div className="px-4 py-5 sm:px-5">
        {error && (
          <ErrorState className="mb-4" message="Couldn't regenerate the summary. Showing the previous version." onRetry={onRegenerate} />
        )}
        {loading ? (
          <SummarySkeleton />
        ) : (
          <>
            <p className="text-[15px] leading-relaxed text-foreground">{summary.executive_summary}</p>

            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted">Key points</h3>
            <ul className="mt-2.5 space-y-2">
              {summary.key_points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border-strong" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ItemList
                title="Decisions"
                items={summary.decisions}
                transcript={transcript}
                onSeek={onSeek}
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                tone="bg-emerald-50/50 border-emerald-100"
                empty="No decisions were recorded."
              />
              <ItemList
                title="Concerns & risks"
                items={summary.concerns}
                transcript={transcript}
                onSeek={onSeek}
                icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
                tone="bg-amber-50/50 border-amber-100"
                empty="No concerns were raised."
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function OriginTag({ origin }: { origin: SummaryOrigin }) {
  if (origin === "ai") return <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent">Just generated</span>;
  if (origin === "fallback")
    return (
      <span
        className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600"
        title="The AI service was unavailable, so the saved notes are shown."
      >
        <CloudOff className="h-3 w-3" /> Saved notes
      </span>
    );
  return null;
}

function ItemList({
  title,
  items,
  transcript,
  onSeek,
  icon,
  tone,
  empty,
}: {
  title: string;
  items: string[];
  transcript: TranscriptEntry[];
  onSeek: (t: number) => void;
  icon: React.ReactNode;
  tone: string;
  empty: string;
}) {
  // Link each item to the transcript line that best supports it.
  const anchors = useMemo(
    () => items.map((item) => {
      const i = rankLines(transcript, item, 1)[0];
      return i === undefined ? null : transcript[i].timestamp;
    }),
    [items, transcript],
  );

  return (
    <div className={cn("rounded-lg border p-4", tone)}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
        <span className="font-normal text-muted">{items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {items.map((item, i) => (
            <li key={item} className="flex items-start justify-between gap-3 text-sm leading-relaxed text-foreground">
              <span>{item}</span>
              {anchors[i] !== null && (
                <button
                  type="button"
                  onClick={() => onSeek(anchors[i]!)}
                  className="mt-0.5 shrink-0 rounded px-1 font-mono text-xs tabular-nums text-accent hover:bg-accent-soft"
                  aria-label={`Jump to ${formatTimestamp(anchors[i]!)} in transcript`}
                >
                  {formatTimestamp(anchors[i]!)}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div role="status" aria-label="Generating summary">
      <SkeletonLines lines={3} />
      <Skeleton className="mt-7 h-3 w-24" />
      <SkeletonLines lines={4} className="mt-3" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
