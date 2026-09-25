import Link from "next/link";
import { ArrowUpRight, CalendarClock, MessageSquareText } from "lucide-react";
import { meetings, upcomingMeetings } from "@/lib/data/meetings";
import { formatDate, formatDuration, formatTime } from "@/lib/utils/format";
import { Avatar, AvatarStack } from "@/components/common/Avatar";
import { TypeBadge } from "@/components/common/TypeBadge";

export function AskPrompt() {
  const suggestions = [
    "What issues come up repeatedly in sales calls?",
    "Which customers are worried about Salesforce sync?",
    "What did we commit to Globex?",
  ];
  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-accent" />
        <h2 className="text-sm font-semibold text-foreground">Ask Quorum</h2>
      </div>
      <p className="mt-1 text-sm text-muted">Ask across every meeting. Answers link to the moment it was said.</p>
      <div className="mt-3 flex flex-col gap-2">
        {suggestions.map((s) => (
          <Link
            key={s}
            href={`/ask?q=${encodeURIComponent(s)}`}
            className="group flex min-h-11 items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted/60"
          >
            {s}
            <ArrowUpRight className="h-4 w-4 shrink-0 text-subtle group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Upcoming() {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarClock className="h-4 w-4 text-muted" /> Upcoming
        </h2>
        <span className="text-xs text-muted">Quorum will join and take notes</span>
      </div>
      <ul className="divide-y divide-border">
        {upcomingMeetings.map((m) => (
          <li key={m.id} className="px-4 py-3 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{m.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatDate(m.date)} · {formatTime(m.date)} · {formatDuration(m.duration)} · {m.platform}
                </p>
              </div>
              <TypeBadge type={m.type} className="hidden sm:inline-flex" />
            </div>
            <div className="mt-2">
              <AvatarStack names={m.attendees} size="xs" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function OpenActions() {
  const items = meetings
    .flatMap((m) => m.summary.action_items.filter((a) => a.status === "pending").map((a) => ({ ...a, meeting: m })))
    .sort((a, b) => (a.priority === "high" ? 0 : 1) - (b.priority === "high" ? 0 : 1))
    .slice(0, 6);

  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold text-foreground">Open action items</h2>
      </div>
      <ul className="divide-y divide-border">
        {items.map((a) => (
          <li key={`${a.meeting.id}-${a.task}`}>
            <Link href={`/meetings/${a.meeting.id}`} className="flex gap-3 px-4 py-3 hover:bg-surface-muted/40 sm:px-5">
              <Avatar name={a.owner} size="xs" className="mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm leading-snug text-foreground">{a.task}</p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {a.owner}
                  {a.dueDate && ` · due ${a.dueDate}`} · {a.meeting.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
