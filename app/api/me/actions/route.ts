import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

/** Per-user completion state for action items (keys are "<meetingId>-<index>"). */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const sql = await db();
  const rows = await sql<{ item_key: string; status: "pending" | "completed" }[]>`
    select item_key, status from action_item_status where user_id = ${user.id}
  `;
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.item_key, r.status])), { headers: { "Cache-Control": "no-store" } });
}

const Body = z.object({ key: z.string().min(1).max(200), status: z.enum(["pending", "completed"]) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const sql = await db();
  await sql`
    insert into action_item_status (user_id, item_key, status, updated_at)
    values (${user.id}, ${parsed.data.key}, ${parsed.data.status}, now())
    on conflict (user_id, item_key) do update set status = excluded.status, updated_at = now()
  `;
  return NextResponse.json({ ok: true });
}
