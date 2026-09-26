import type { Metadata } from "next";
import { Suspense } from "react";
import { container } from "@/lib/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { Loading } from "@/components/common/States";
import { UpcomingView } from "@/components/upcoming/UpcomingView";

export const metadata: Metadata = { title: "Upcoming" };

export default function UpcomingPage() {
  return (
    <div className={container}>
      <PageHeader title="Upcoming" description="Quorum joins and takes notes for the meetings you choose." />
      <div className="mt-5">
        <Suspense fallback={<Loading message="Loading your calendar…" />}>
          <UpcomingView />
        </Suspense>
      </div>
    </div>
  );
}
