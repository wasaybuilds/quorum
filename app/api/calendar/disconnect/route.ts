import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteGrant } from "@/lib/calendar/google";

/** Removes the stored Google tokens (and revokes them at Google). The user stays signed in. */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  await deleteGrant(user.id);
  return NextResponse.json({ connected: false });
}
