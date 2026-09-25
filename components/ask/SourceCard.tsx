import Link from "next/link";
import { Play } from "lucide-react";
import type { MeetingSource } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const CARD =
  "group flex w-full gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-border-strong hover:bg-surface-muted/60";

function Body({ source, showMeeting }: { source: MeetingSource; showMeeting: boolean }) {
  return (
    <>
      <span className="mt-px inline-flex h-5 shrink-0 items-center gap-1 rounded bg-accent-soft px-1.5 font-mono text-[11px] font-medium tabular-nums text-accent">
        <Play className="h-2.5 w-2.5 fill-current" />
        {formatTimestamp(source.timestamp)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-foreground">
          {source.speaker}
          {showMeeting && <span className="font-normal text-muted"> · {source.meetingTitle}</span>}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">“{source.text}”</span>
      </span>
    </>
  );
}

/**
 * A cited transcript line. With `onSeek` it jumps within the current meeting;
 * otherwise it links to the meeting page at that timestamp.
 */
export function SourceCard({
  source,
  onSeek,
  showMeeting = false,
  className,
}: {
  source: MeetingSource;
  onSeek?: (timestamp: number) => void;
  showMeeting?: boolean;
  className?: string;
}) {
  if (onSeek) {
    return (
      <button type="button" onClick={() => onSeek(source.timestamp)} className={cn(CARD, className)}>
        <Body source={source} showMeeting={showMeeting} />
      </button>
    );
  }
  return (
    <Link href={`/meetings/${source.meetingId}?t=${source.timestamp}`} className={cn(CARD, className)}>
      <Body source={source} showMeeting={showMeeting} />
    </Link>
  );
}
