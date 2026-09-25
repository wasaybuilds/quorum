import Link from "next/link";
import type { Meeting } from "@/lib/types";
import { formatDate, formatDuration, formatTime, TYPE_BORDER } from "@/lib/utils/format";
import { cardInteractive } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { AvatarStack } from "@/components/common/Avatar";
import { TypeBadge } from "@/components/common/TypeBadge";

function participantNames(m: Meeting, max = 3) {
  const names = m.participants.map((p) => p.name);
  return names.length > max ? `${names.slice(0, max).join(", ")} +${names.length - max}` : names.join(", ");
}

/** Full card: dashboard and mobile list. */
export function MeetingCard({ meeting, className }: { meeting: Meeting; className?: string }) {
  const open = meeting.summary.action_items.filter((a) => a.status === "pending").length;
  return (
    <Link href={`/meetings/${meeting.id}`} className={cn(cardInteractive, "block border-l-4 p-5 lg:p-6", TYPE_BORDER[meeting.type], className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-h3">{meeting.title}</h3>
          <p className="mt-1 text-label text-muted">
            {meeting.company} · {formatDate(meeting.date)}, {formatTime(meeting.date)} · {formatDuration(meeting.duration)}
          </p>
        </div>
        <TypeBadge type={meeting.type} className="shrink-0" />
      </div>
      <p className="mt-3 line-clamp-2 max-w-[65ch] text-body text-copy">{meeting.summary.executive_summary}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-label text-muted">{participantNames(meeting)}</p>
        <p className="text-label text-muted">
          {meeting.summary.decisions.length} decisions · {open} open actions
        </p>
      </div>
    </Link>
  );
}

/** Compact 56px row for the desktop list; falls back to the full card below md. */
export function MeetingRow({ meeting }: { meeting: Meeting }) {
  return (
    <>
      <MeetingCard meeting={meeting} className="md:hidden" />
      <Link
        href={`/meetings/${meeting.id}`}
        className={cn(
          "hidden min-h-14 items-center gap-4 border-b border-l-4 border-b-border bg-surface px-4 py-2 transition-colors duration-150 last:border-b-0 hover:bg-surface-muted md:flex",
          TYPE_BORDER[meeting.type],
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-semibold text-ink">{meeting.title}</p>
          <p className="truncate text-label text-muted">
            {meeting.company} · {formatDate(meeting.date)}, {formatTime(meeting.date)}
          </p>
        </div>
        <div className="hidden w-44 items-center gap-2 lg:flex">
          <AvatarStack names={meeting.participants.map((p) => p.name)} />
          <span className="text-label text-muted">{meeting.participants.length} people</span>
        </div>
        <span className="w-16 text-right text-label text-muted">{formatDuration(meeting.duration)}</span>
        <span className="w-36">
          <TypeBadge type={meeting.type} />
        </span>
      </Link>
    </>
  );
}
