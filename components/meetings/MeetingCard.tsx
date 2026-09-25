import Link from "next/link";
import { CheckCircle2, Clock, ListChecks } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { formatDate, formatDuration, formatTime } from "@/lib/utils/format";
import { AvatarStack } from "@/components/common/Avatar";
import { TypeBadge } from "@/components/common/TypeBadge";

export function MeetingCard({ meeting, showSummary = true }: { meeting: Meeting; showSummary?: boolean }) {
  const open = meeting.summary.action_items.filter((a) => a.status === "pending").length;
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="group block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-muted/30 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-foreground group-hover:text-accent">{meeting.title}</h3>
            <TypeBadge type={meeting.type} />
          </div>
          <p className="mt-1 text-sm text-muted">
            <span className="font-medium text-foreground/80">{meeting.company}</span>
            <span className="mx-1.5 text-subtle">·</span>
            {formatDate(meeting.date)}, {formatTime(meeting.date)}
          </p>
        </div>
        <div className="hidden shrink-0 sm:block">
          <AvatarStack names={meeting.participants.map((p) => p.name)} />
        </div>
      </div>

      {showSummary && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{meeting.summary.executive_summary}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {formatDuration(meeting.duration)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" /> {meeting.summary.decisions.length} decisions
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5" /> {open ? `${open} open action items` : "All actions done"}
        </span>
        <span className="sm:hidden">
          <AvatarStack names={meeting.participants.map((p) => p.name)} size="xs" />
        </span>
      </div>
    </Link>
  );
}
