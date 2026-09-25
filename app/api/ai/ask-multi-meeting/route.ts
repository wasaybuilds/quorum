import { z } from "zod";
import { meetings as library } from "@/lib/data/meetings";
import { generateStructured } from "@/lib/ai/client";
import { ASK_MULTI_SYSTEM, AskMultiSchema, meetingHeader, transcriptBlock } from "@/lib/ai/prompts";
import { askMultiFallback, toSource } from "@/lib/ai/fallback";
import type { AskResponse, MeetingSource } from "@/lib/types";

const Body = z.object({
  question: z.string().trim().min(1).max(1000),
  /** Limit the question to these meetings; defaults to the whole library. */
  meetingIds: z.array(z.string()).max(50).optional(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(6000) }))
    .max(20)
    .optional(),
});

// Built once: the full library is the stable, cacheable prefix of every request.
const LIBRARY_CONTEXT = library
  .map(
    (m, i) =>
      `<meeting number="${i + 1}">\n${meetingHeader(m)}\nSummary: ${m.summary.executive_summary}\n\n${transcriptBlock(m.transcript)}\n</meeting>`,
  )
  .join("\n\n");

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 });
  const { question, meetingIds, history = [] } = parsed.data;

  const selected = meetingIds?.length ? library.filter((m) => meetingIds.includes(m.id)) : library;
  if (!selected.length) return Response.json({ error: "No matching meetings" }, { status: 404 });

  const scopeNote = meetingIds?.length
    ? `\n\nOnly consider meetings numbered ${selected.map((m) => library.indexOf(m) + 1).join(", ")}.`
    : "";

  const result = await generateStructured({
    system: `${ASK_MULTI_SYSTEM}\n\n<library>\n${LIBRARY_CONTEXT}\n</library>`,
    schema: AskMultiSchema,
    messages: [...history.slice(-8), { role: "user", content: question + scopeNote }],
  });

  if (!result) return Response.json(askMultiFallback(selected, question));

  const seen = new Set<string>();
  const sources: MeetingSource[] = [];
  for (const s of result.sources) {
    const m = library[s.meeting - 1];
    if (!m || s.line < 0 || s.line >= m.transcript.length) continue;
    const key = `${m.id}:${s.line}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push(toSource(m, s.line));
  }

  const response: AskResponse = {
    answer: result.answer,
    patterns: result.patterns,
    sources: sources.slice(0, 8),
    fallback: false,
  };
  return Response.json(response);
}
