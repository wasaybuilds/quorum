import type { Metadata } from "next";
import { meetings } from "@/lib/data/meetings";
import { MeetingList } from "@/components/meetings/MeetingList";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Meetings" };

export default function MeetingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader title="Meetings" description="Every recorded call, with notes, action items and a searchable transcript." />
      <div className="mt-6">
        <MeetingList meetings={meetings} />
      </div>
    </div>
  );
}
