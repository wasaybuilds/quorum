"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, CalendarX, Check, ExternalLink, Info, Video } from "lucide-react";
import type { UpcomingMeeting } from "@/lib/types";
import { card, link } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { AvatarStack } from "@/components/common/Avatar";
import { EmptyState, Loading } from "@/components/common/States";
import { StatusBadge } from "@/components/common/TypeBadge";
import { Toggle } from "@/components/common/Toggle";
import { useCalendar, useRecordingPrefs } from "./useCalendar";
import { CalendarConnection } from "./CalendarConnection";

// Demo events are Pacific-time fixtures; real events show in the viewer's own time zone.
const zoneFor = (m: UpcomingMeeting) => (m.source === "demo" ? "America/Los_Angeles" : undefined);

function dayLabel(m: UpcomingMeeting) {
  return new Intl.DateTimeFormat("en-US", { timeZone: zoneFor(m), weekday: "long", month: "long", day: "numeric" }).format(new Date(m.start));
}

function timeRange(m: UpcomingMeeting) {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: zoneFor(m), hour: "numeric", minute: "2-digit" });
  return `${f.format(new Date(m.start))} – ${f.format(new Date(m.end))}`;
}

const STATUS_MESSAGES: Record<string, { tone: "success" | "warning" | "danger"; text: string }> = {
  connected: { tone: "success", text: "Google Calendar connected. Your next two weeks of meetings are below." },
  denied: { tone: "warning", text: "Calendar access wasn't granted, so the demo calendar is still shown." },
  error: { tone: "danger", text: "Couldn't connect to Google Calendar. Please try again." },
  "not-configured": { tone: "warning", text: "Google sign-in isn't configured on this deployment yet, so the demo calendar is shown." },
};

export function UpcomingView() {
  const params = useSearchParams();
  const cal = useCalendar();
  const { prefs, update, willRecord, setRecord } = useRecordingPrefs();
  const status = STATUS_MESSAGES[params.get("calendar") ?? ""];

  const days = useMemo(() => {
    const groups: { label: string; items: UpcomingMeeting[] }[] = [];
    for (const m of cal.events) {
      const label = dayLabel(m);
      const g = groups[groups.length - 1];
      if (g && g.label === label) g.items.push(m);
      else groups.push({ label, items: [m] });
    }
    return groups;
  }, [cal.events]);

  const recordCount = cal.events.filter(willRecord).length;

  return (
    <div className="space-y-6">
      {status && (
        <div
          role="status"
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3 text-body",
            status.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
            status.tone === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
            status.tone === "danger" && "border-red-200 bg-red-50 text-red-900",
          )}
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <CalendarConnection cal={cal} onRefresh={cal.reload} onDisconnect={cal.disconnect} />

        {/* Meeting preferences */}
        <section aria-labelledby="prefs-heading" className={cn(card, "p-5 lg:p-6")}>
          <h2 id="prefs-heading" className="text-h3">
            Meeting preferences
          </h2>
          <p className="mt-1 text-small text-muted">Applies to meetings you haven&apos;t set individually.</p>
          <ul className="mt-4 space-y-3">
            <PrefRow label="Auto-record external meetings" hint="Calls with anyone outside your company" checked={prefs.external} onChange={(v) => update({ external: v })} />
            <PrefRow label="Auto-record internal meetings" hint="Calls with only your teammates" checked={prefs.internal} onChange={(v) => update({ internal: v })} />
            <PrefRow
              label="Share notes with attendees"
              hint="Send the summary to everyone on the invite after the call"
              checked={prefs.shareWithAttendees}
              onChange={(v) => update({ shareWithAttendees: v })}
            />
          </ul>
        </section>
      </div>

      {/* Upcoming list */}
      <section aria-labelledby="list-heading" className={cn(card, "overflow-hidden")}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4 lg:px-6">
          <h2 id="list-heading" className="text-h3">
            Next two weeks
          </h2>
          {!cal.loading && (
            <p className="text-label text-muted">
              Quorum will record <span className="font-semibold text-ink">{recordCount}</span> of {cal.events.length} meetings
            </p>
          )}
        </div>

        {cal.loading ? (
          <Loading message="Loading your calendar…" className="px-6" />
        ) : cal.error && !cal.events.length ? (
          <EmptyState icon={CalendarX} title="Couldn't load your calendar" description="Try refreshing, or reconnect Google Calendar." />
        ) : cal.events.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No meetings in the next two weeks" description="New invites will show up here automatically." />
        ) : (
          days.map((day) => (
            <div key={day.label}>
              <p className="border-b border-border bg-surface-muted px-5 py-2 text-label font-medium text-muted lg:px-6">{day.label}</p>
              <ul>
                {day.items.map((m) => {
                  const on = willRecord(m);
                  return (
                    <li key={m.id} className="flex flex-col gap-3 border-b border-border px-5 py-4 last:border-b-0 sm:flex-row sm:items-center lg:px-6">
                      <div className="w-36 shrink-0 font-mono text-stamp text-copy">{timeRange(m)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body font-semibold text-ink">{m.title}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-label text-muted">
                          {m.platform && (
                            <span className="inline-flex items-center gap-1">
                              <Video className="h-3.5 w-3.5" aria-hidden="true" /> {m.platform}
                            </span>
                          )}
                          <span>{m.attendees.length} attendees</span>
                          <StatusBadge tone={m.external ? "warning" : "neutral"}>{m.external ? "External" : "Internal"}</StatusBadge>
                          {m.joinUrl && (
                            <a href={m.joinUrl} target="_blank" rel="noreferrer" className={cn(link, "inline-flex items-center gap-1")}>
                              Join <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          )}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <AvatarStack names={m.attendees.map((a) => a.name ?? a.email)} max={3} />
                      </div>
                      <div className="flex items-center gap-3 sm:w-40 sm:justify-end">
                        <span className={cn("inline-flex items-center gap-1 text-label font-medium", on ? "text-accent-ink" : "text-muted")}>
                          {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                          {on ? "Will record" : "Won't record"}
                        </span>
                        <Toggle checked={on} onChange={(v) => setRecord(m, v)} label={`Record ${m.title}`} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function PrefRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-body font-medium text-ink">{label}</p>
        <p className="text-label text-muted">{hint}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </li>
  );
}
