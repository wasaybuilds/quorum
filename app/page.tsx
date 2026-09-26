import { meetings, openActionRows } from "@/lib/data/meetings";
import { container } from "@/lib/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCards } from "@/components/dashboard/StatCards";
import { UpNext } from "@/components/dashboard/UpNext";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { DueSoon } from "@/components/dashboard/DueSoon";
import { AskCardSlot } from "@/components/dashboard/AskCardSlot";
import { MeetingMix } from "@/components/dashboard/MeetingMix";

export default function DashboardPage() {
  return (
    <div className={container}>
      <PageHeader title="Home" description="Your team's conversation archive: what was discussed, decided and committed to." />

      <div className="mt-5">
        <StatCards />
      </div>

      {/* Container queries: the layout responds to the panel width, which changes with the sidebar and Ask panel. */}
      <div className="mt-5 grid grid-cols-1 gap-5 @5xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <UpNext />
          <RecentMeetings limit={6} />
        </div>
        <div className="min-w-0 space-y-5">
          <AskCardSlot />
          <DueSoon rows={openActionRows(meetings, Infinity)} />
          <MeetingMix />
        </div>
      </div>
    </div>
  );
}
