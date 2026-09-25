import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { meetings, openActionRows } from "@/lib/data/meetings";
import { cardInteractive, container, link } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { PageHeader, SectionHeading } from "@/components/layout/PageHeader";
import { Stats } from "@/components/dashboard/Stats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { OpenActions } from "@/components/dashboard/OpenActions";
import { MeetingCard } from "@/components/meetings/MeetingCard";

const QUESTIONS = [
  "What issues come up most in sales calls",
  "Which customers are worried about Salesforce sync",
  "What did we commit to Globex",
];

export default function DashboardPage() {
  return (
    <div className={container}>
      <PageHeader title="Meetings" description="Your team's conversation archive" actions={<QuickActions />} />

      <div className="mt-8">
        <Stats />
      </div>

      <section className="mt-12" aria-labelledby="recent-heading">
        <SectionHeading
          action={
            <Link href="/meetings" className={cn(link, "inline-flex min-h-11 items-center gap-1 text-body font-medium")}>
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <span id="recent-heading">Recent meetings</span>
        </SectionHeading>
        <div className="grid grid-cols-1 gap-4">
          {meetings.slice(0, 5).map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="actions-heading">
        <SectionHeading>
          <span id="actions-heading">Open action items</span>
        </SectionHeading>
        <OpenActions rows={openActionRows(meetings)} />
      </section>

      <section className="mt-12" aria-labelledby="questions-heading">
        <SectionHeading>
          <span id="questions-heading">Try these questions</span>
        </SectionHeading>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {QUESTIONS.map((q) => (
            <Link key={q} href={`/ask?q=${encodeURIComponent(q)}`} className={cn(cardInteractive, "group flex items-start justify-between gap-3 p-5 lg:p-6")}>
              <span className="text-body font-medium text-ink">{q}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent-ink" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
