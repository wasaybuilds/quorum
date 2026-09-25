import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { meetings } from "@/lib/data/meetings";
import { MeetingCard } from "@/components/meetings/MeetingCard";

export function RecentMeetings() {
  return (
    <section aria-labelledby="recent-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="recent-heading" className="text-base font-semibold text-foreground">
          Recent meetings
        </h2>
        <Link href="/meetings" className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm font-medium text-accent hover:bg-accent-soft">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid gap-3">
        {meetings.slice(0, 5).map((m) => (
          <MeetingCard key={m.id} meeting={m} />
        ))}
      </div>
    </section>
  );
}
