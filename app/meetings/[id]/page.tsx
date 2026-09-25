import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMeeting, meetings } from "@/lib/data/meetings";
import { MeetingDetail } from "@/components/meeting-detail/MeetingDetail";

// Unknown ids get a real 404 instead of a streamed not-found page.
export const dynamicParams = false;

export function generateStaticParams() {
  return meetings.map((m) => ({ id: m.id }));
}

export async function generateMetadata(props: PageProps<"/meetings/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const meeting = getMeeting(id);
  return meeting ? { title: meeting.title, description: meeting.summary.executive_summary } : { title: "Meeting not found" };
}

export default async function MeetingPage(props: PageProps<"/meetings/[id]">) {
  const { id } = await props.params;
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  return <MeetingDetail meeting={meeting} />;
}
