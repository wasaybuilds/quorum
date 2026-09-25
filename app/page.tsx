import { PageHeader } from "@/components/layout/PageHeader";
import { Stats } from "@/components/dashboard/Stats";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { AskPrompt, OpenActions, Upcoming } from "@/components/dashboard/SidePanels";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader
        title="Welcome back, Abdul"
        description="Here's what your team discussed, decided and committed to."
        actions={<QuickActions />}
      />
      <div className="mt-6">
        <Stats />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <RecentMeetings />
        <div className="space-y-4 lg:pt-12">
          <AskPrompt />
          <Upcoming />
          <OpenActions />
        </div>
      </div>
    </div>
  );
}
