import { meetings, openActionRows } from "@/lib/data/meetings";
import { container } from "@/lib/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { HeaderActions } from "@/components/dashboard/HeaderActions";
import { StatCards } from "@/components/dashboard/StatCards";
import { UpNext } from "@/components/dashboard/UpNext";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { DueSoon } from "@/components/dashboard/DueSoon";
import { AskCard } from "@/components/dashboard/AskCard";
import { MeetingMix } from "@/components/dashboard/MeetingMix";

export default function DashboardPage() {
  return (
    <div className={container}>
      <PageHeader title="Your meetings" description="Your team's conversation archive" actions={<HeaderActions />} />

      <div className="mt-8">
        <StatCards />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <UpNext />
          <RecentMeetings limit={6} />
        </div>
        <div className="min-w-0 space-y-6">
          {/* The persistent Ask panel covers this on xl */}
          <div className="xl:hidden">
            <AskCard />
          </div>
          <DueSoon rows={openActionRows(meetings, Infinity)} />
          <MeetingMix />
        </div>
      </div>
    </div>
  );
}
