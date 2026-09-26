"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Video } from "lucide-react";
import type { UpcomingMeeting } from "@/lib/types";
import { card, link } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { Loading } from "@/components/common/States";
import { Toggle } from "@/components/common/Toggle";
import { useCalendar, useRecordingPrefs } from "@/components/upcoming/useCalendar";

const when = (m: UpcomingMeeting) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: m.source === "demo" ? "America/Los_Angeles" : undefined,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(m.start));

/** Next few calendar meetings with a record toggle each (Fathom's auto-record). */
export function UpNext({ limit = 3 }: { limit?: number }) {
  const cal = useCalendar();
  const { willRecord, setRecord } = useRecordingPrefs();
  const next = cal.events.slice(0, limit);
  const firstExternal = cal.events.find((m) => m.external && willRecord(m));

  return (
    <section aria-labelledby="upnext-heading" className={cn(card, "overflow-hidden")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 lg:px-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
          <h2 id="upnext-heading" className="text-h3">
            Up next
          </h2>
          <span className="rounded bg-surface-disabled px-2 py-0.5 text-label text-copy">
            {cal.connected ? "Google Calendar" : "Demo calendar"}
          </span>
        </div>
        <Link href="/upcoming" className={cn(link, "inline-flex min-h-11 items-center gap-1 text-body font-medium")}>
          Calendar <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {cal.loading ? (
        <Loading message="Loading your calendar…" className="px-6" />
      ) : next.length === 0 ? (
        <p className="px-6 py-6 text-body text-muted">No meetings coming up.</p>
      ) : (
        <>
          {firstExternal && (
            <p className="border-b border-border bg-accent-soft/50 px-5 py-2.5 text-small text-accent-hover lg:px-6">
              Quorum will auto-record starting with <span className="font-semibold">{firstExternal.title}</span>.
            </p>
          )}
          <ul>
            {next.map((m) => {
              const on = willRecord(m);
              return (
                <li key={m.id} className="flex items-center gap-4 border-b border-border px-5 py-3 last:border-b-0 lg:px-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-semibold text-ink">{m.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-label text-muted">
                      {when(m)}
                      {m.platform && (
                        <span className="inline-flex items-center gap-1">
                          · <Video className="h-3 w-3" aria-hidden="true" /> {m.platform}
                        </span>
                      )}
                      <span>· {m.external ? "External" : "Internal"}</span>
                    </p>
                  </div>
                  <span className={cn("hidden text-label font-medium sm:inline", on ? "text-accent-ink" : "text-muted")}>{on ? "Recording" : "Off"}</span>
                  <Toggle checked={on} onChange={(v) => setRecord(m, v)} label={`Record ${m.title}`} />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
