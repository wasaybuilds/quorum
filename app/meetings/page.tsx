import type { Metadata } from "next";
import { meetings } from "@/lib/data/meetings";
import { MeetingList } from "@/components/meetings/MeetingList";
import { PageHeader } from "@/components/layout/PageHeader";
import { container } from "@/lib/ui";

export const metadata: Metadata = { title: "All meetings" };

export default function MeetingsPage() {
  return (
    <div className={container}>
      <PageHeader title="All meetings" description="Every recorded call, with notes, action items and a searchable transcript." />
      <div className="mt-5">
        <MeetingList meetings={meetings} />
      </div>
    </div>
  );
}
