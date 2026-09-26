import Link from "next/link";
import type { MeetingSource } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/format";
import { link } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

/** "[speaker @ m:ss]" — jumps within the current meeting, or opens the meeting at that line. */
export function SourceLink({
  source,
  onSeek,
  showMeeting = false,
  className,
}: {
  source: MeetingSource;
  onSeek?: (timestamp: number) => void;
  /** prefix the meeting title (cross-meeting answers) */
  showMeeting?: boolean;
  className?: string;
}) {
  const label = `[${showMeeting ? `${source.meetingTitle} · ` : ""}${source.speaker} @ ${formatTimestamp(source.timestamp)}]`;
  const cls = cn(link, "text-body", className);
  const title = `“${source.text}”`;
  return onSeek ? (
    <button type="button" data-source onClick={() => onSeek(source.timestamp)} className={cls} title={title}>
      {label}
    </button>
  ) : (
    <Link data-source href={`/meetings/${source.meetingId}?t=${source.timestamp}`} className={cls} title={title}>
      {label}
    </Link>
  );
}

/** Result card for cross-meeting answers: meeting, source link and a short excerpt. */
export function SourceCard({ source }: { source: MeetingSource }) {
  return (
    <Link
      href={`/meetings/${source.meetingId}?t=${source.timestamp}`}
      data-source
      className="group block rounded-lg border border-border bg-surface p-5 shadow-card transition-colors duration-150 hover:border-border-strong hover:bg-surface-muted"
    >
      <p className="text-body font-semibold text-ink">{source.meetingTitle}</p>
      <p className="mt-1 text-body text-accent-ink group-hover:text-accent-hover group-hover:underline group-hover:underline-offset-2">
        [{source.speaker} @ {formatTimestamp(source.timestamp)}]
      </p>
      <p className="mt-2 line-clamp-3 max-w-[65ch] text-body text-copy">“{source.text}”</p>
    </Link>
  );
}
