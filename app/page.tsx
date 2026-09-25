import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getStats, meetings, openActionRows } from "@/lib/data/meetings";
import { formatDate, formatTime } from "@/lib/utils/format";
import { container, link } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { PageHeader, SectionHeading } from "@/components/layout/PageHeader";
import { OpenActions } from "@/components/dashboard/OpenActions";
import { QuickAsk } from "@/components/dashboard/QuickAsk";

export default function DashboardPage() {
  const stats = getStats();
  const open = openActionRows(meetings, Infinity);

  return (
    <div className={container}>
      <PageHeader title="Meetings" description="Your team's conversation archive" />

      <div className="mt-8 grid grid-cols-1 gap-8 border-y border-border py-8 sm:grid-cols-2">
        <div>
          <p className="text-[48px] font-bold leading-none tabular-nums text-accent">{stats.meetingsThisWeek}</p>
          <p className="mt-2 text-label font-medium text-muted">Meetings this week</p>
        </div>
        <div>
          <p className="text-[48px] font-bold leading-none tabular-nums text-accent">{stats.decisions}</p>
          <p className="mt-2 text-label font-medium text-muted">Decisions captured</p>
        </div>
      </div>

      <section className="mt-12" aria-labelledby="recent-heading">
        <SectionHeading
          action={
            <Link href="/meetings" className={cn(link, "inline-flex min-h-11 items-center gap-1 text-body font-medium")}>
              All meetings <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        >
          <span id="recent-heading">Recent meetings</span>
        </SectionHeading>
        <ul className="grid grid-cols-1 gap-2">
          {meetings.slice(0, 8).map((m) => (
            <li key={m.id}>
              <Link
                href={`/meetings/${m.id}`}
                className="block rounded-lg border border-border bg-surface-muted px-5 py-4 transition-colors duration-150 hover:border-border-strong hover:bg-surface lg:px-6"
              >
                <p className="text-h3 font-semibold text-ink">{m.title}</p>
                <p className="mt-1 text-label text-muted">
                  {m.company} · {formatDate(m.date)}, {formatTime(m.date)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {open.length > 0 && (
        <section className="mt-12" aria-labelledby="actions-heading">
          <SectionHeading>
            <span id="actions-heading">Open action items</span>
          </SectionHeading>
          <OpenActions rows={open} />
        </section>
      )}

      <section className="mt-12" aria-labelledby="ask-heading">
        <SectionHeading>
          <span id="ask-heading">Quick search across meetings</span>
        </SectionHeading>
        <QuickAsk />
      </section>
    </div>
  );
}
