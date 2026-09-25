import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { meetings } from "@/lib/data/meetings";
import { formatDate, formatDuration, formatTime, TYPE_BORDER } from "@/lib/utils/format";
import { card, link } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { AvatarStack } from "@/components/common/Avatar";
import { TypeBadge } from "@/components/common/TypeBadge";

export function RecentMeetings({ limit = 6 }: { limit?: number }) {
  return (
    <section aria-labelledby="recent-heading" className={cn(card, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 lg:px-6">
        <h2 id="recent-heading" className="text-h3">
          Recent meetings
        </h2>
        <Link href="/meetings" className={cn(link, "inline-flex min-h-11 items-center gap-1 text-body font-medium")}>
          All meetings <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <ul>
        {meetings.slice(0, limit).map((m) => (
          <li key={m.id} className="border-t border-border first:border-t-0">
            <Link
              href={`/meetings/${m.id}`}
              className={cn("flex items-center gap-4 border-l-4 px-5 py-4 transition-colors duration-150 hover:bg-surface-muted lg:px-6", TYPE_BORDER[m.type])}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-semibold text-ink">{m.title}</p>
                <p className="mt-0.5 truncate text-label text-muted">
                  {m.company} · {formatDate(m.date)}, {formatTime(m.date)} · {formatDuration(m.duration)}
                </p>
              </div>
              <div className="hidden sm:block">
                <AvatarStack names={m.participants.map((p) => p.name)} max={3} />
              </div>
              <span className="hidden w-36 md:block">
                <TypeBadge type={m.type} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
