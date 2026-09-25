import { z } from "zod";
import { getMeeting } from "@/lib/data/meetings";
import { generateStructured } from "@/lib/ai/client";
import { ASK_MEETING_SYSTEM, AskMeetingSchema, meetingHeader, transcriptBlock } from "@/lib/ai/prompts";
import { askMeetingFallback, toSource } from "@/lib/ai/fallback";
import type { AskResponse } from "@/lib/types";

const Body = z.object({
  meetingId: z.string(),
  question: z.string().trim().min(1).max(1000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(6000) }))
    .max(20)
    .optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 });
  const { meetingId, question, history = [] } = parsed.data;

  const meeting = getMeeting(meetingId);
  if (!meeting) return Response.json({ error: "Meeting not found" }, { status: 404 });

  const { summary } = meeting;
  const context = [
    `<meeting>\n${meetingHeader(meeting)}\n</meeting>`,
    `<notes>\nSummary: ${summary.executive_summary}\nDecisions: ${summary.decisions.join(" | ")}\nConcerns: ${summary.concerns.join(" | ")}\nAction items: ${summary.action_items
      .map((a) => `${a.task} (owner ${a.owner}${a.dueDate ? `, due ${a.dueDate}` : ""}, ${a.status})`)
      .join(" | ")}\n</notes>`,
    `<transcript>\n${transcriptBlock(meeting.transcript)}\n</transcript>`,
  ].join("\n\n");

  // The meeting context is the stable prefix; earlier turns follow as plain text.
  const result = await generateStructured({
    system: `${ASK_MEETING_SYSTEM}\n\n${context}`,
    schema: AskMeetingSchema,
    messages: [...history.slice(-8), { role: "user", content: question }],
  });

  if (!result) return Response.json(askMeetingFallback(meeting, question));

  const lines = [...new Set(result.source_lines)].filter((i) => i >= 0 && i < meeting.transcript.length).slice(0, 5);
  const response: AskResponse = {
    answer: result.answer,
    confidence: result.confidence,
    sources: lines.sort((a, b) => a - b).map((i) => toSource(meeting, i)),
    fallback: false,
  };
  return Response.json(response);
}
