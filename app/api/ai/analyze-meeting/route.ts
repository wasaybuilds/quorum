import { z } from "zod";
import { getMeeting } from "@/lib/data/meetings";
import { generateStructured } from "@/lib/ai/client";
import { ANALYZE_SYSTEM, SummarySchema, meetingHeader, transcriptBlock } from "@/lib/ai/prompts";
import { GENERIC_SUMMARY } from "@/lib/ai/fallback";
import type { MeetingSummary } from "@/lib/types";

const Body = z.object({
  meetingId: z.string().optional(),
  title: z.string().max(200).optional(),
  participants: z.array(z.string().max(120)).max(50).optional(),
  transcript: z
    .array(z.object({ speaker: z.string().max(120), timestamp: z.number(), text: z.string().max(4000) }))
    .max(2000)
    .optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 });
  const body = parsed.data;

  const meeting = body.meetingId ? getMeeting(body.meetingId) : undefined;
  if (body.meetingId && !meeting) return Response.json({ error: "Meeting not found" }, { status: 404 });

  const transcript = meeting?.transcript ?? body.transcript;
  if (!transcript?.length) return Response.json({ error: "A meetingId or transcript is required" }, { status: 400 });

  const header = meeting
    ? meetingHeader(meeting)
    : `Title: ${body.title ?? "Untitled meeting"}\nParticipants: ${(body.participants ?? []).join("; ")}`;

  const result = await generateStructured({
    system: ANALYZE_SYSTEM,
    schema: SummarySchema,
    effort: "medium",
    messages: [
      {
        role: "user",
        content: `<meeting>\n${header}\n</meeting>\n\n<transcript>\n${transcriptBlock(transcript)}\n</transcript>\n\nWrite the meeting notes.`,
      },
    ],
  });

  if (result) {
    const summary: MeetingSummary = {
      ...result,
      action_items: result.action_items.map((a) => ({ ...a, status: "pending" as const })),
    };
    return Response.json({ ...summary, fallback: false });
  }

  // Offline: the seed library already carries grounded notes for each meeting.
  return Response.json({ ...(meeting?.summary ?? GENERIC_SUMMARY), fallback: true });
}
