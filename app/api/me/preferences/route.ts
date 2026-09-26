import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

const Prefs = z.object({
  external: z.boolean(),
  internal: z.boolean(),
  shareWithAttendees: z.boolean(),
  overrides: z.record(z.string().max(300), z.boolean()).refine((o) => Object.keys(o).length <= 500),
});

type Row = { record_external: boolean; record_internal: boolean; share_with_attendees: boolean; overrides: Record<string, boolean> };

const toJson = (r: Row) => ({
  external: r.record_external,
  internal: r.record_internal,
  shareWithAttendees: r.share_with_attendees,
  overrides: r.overrides ?? {},
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const sql = await db();
  const [row] = await sql<Row[]>`
    select record_external, record_internal, share_with_attendees, overrides from recording_prefs where user_id = ${user.id}
  `;
  return NextResponse.json(row ? toJson(row) : null, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = Prefs.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid preferences" }, { status: 400 });
  const p = parsed.data;
  const sql = await db();
  await sql`
    insert into recording_prefs (user_id, record_external, record_internal, share_with_attendees, overrides, updated_at)
    values (${user.id}, ${p.external}, ${p.internal}, ${p.shareWithAttendees}, ${sql.json(p.overrides)}, now())
    on conflict (user_id) do update set
      record_external = excluded.record_external,
      record_internal = excluded.record_internal,
      share_with_attendees = excluded.share_with_attendees,
      overrides = excluded.overrides,
      updated_at = now()
  `;
  return NextResponse.json({ ok: true });
}
