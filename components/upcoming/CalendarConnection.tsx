"use client";

import { CheckCircle2, Lock, RefreshCw, ShieldCheck, Unplug, Eye } from "lucide-react";
import { btn, card, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "@/components/common/States";
import { GoogleLogo, OutlookMark } from "./GoogleLogo";
import type { CalendarState } from "./useCalendar";

const ACCESS = [
  { icon: Eye, text: "Read-only: event titles, times, attendees and meeting links" },
  { icon: ShieldCheck, text: "Quorum never creates, edits or deletes events" },
  { icon: Lock, text: "Tokens are encrypted at rest and can be revoked any time" },
];

/** Google-style sign-in button (white, grey outline, "G" mark), per Google's branding guidance. */
function GoogleButton({ disabled, label }: { disabled?: boolean; label: string }) {
  const cls =
    "inline-flex h-11 items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-4 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-150 hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2";
  if (disabled) {
    return (
      <span className={cn(cls, "cursor-not-allowed border-border-strong text-muted opacity-60")} aria-disabled="true">
        <GoogleLogo /> {label}
      </span>
    );
  }
  return (
    <a href="/api/calendar/connect" className={cls}>
      <GoogleLogo /> {label}
    </a>
  );
}

export function CalendarConnection({
  cal,
  onRefresh,
  onDisconnect,
}: {
  cal: CalendarState;
  onRefresh: () => void;
  onDisconnect: () => void;
}) {
  return (
    <section aria-labelledby="cal-heading" className={cn(card, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 lg:px-6">
        <div>
          <h2 id="cal-heading" className="text-h3">
            Calendar connection
          </h2>
          <p className="mt-0.5 text-small text-muted">Quorum reads your calendar to know which meetings to record.</p>
        </div>
        {cal.loading ? (
          <Spinner className="h-5 w-5" />
        ) : cal.connected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-label font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" /> Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-disabled px-2.5 py-1 text-label font-medium text-copy">
            <span className="h-1.5 w-1.5 rounded-full bg-muted" aria-hidden="true" /> Demo calendar
          </span>
        )}
      </div>

      <div className="px-5 py-5 lg:px-6">
        {/* Google Calendar */}
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-white">
            <GoogleLogo className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body font-semibold text-ink">Google Calendar</p>
            {cal.connected ? (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-small text-copy">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {cal.email ?? "Your Google account"}
              </p>
            ) : (
              <p className="mt-0.5 text-small text-muted">
                {!cal.configured
                  ? "Not available on this deployment yet."
                  : cal.signedIn
                    ? "Grant read-only access to sync your next two weeks of meetings."
                    : "You're in the demo workspace. Sign in with Google to see your real meetings."}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {cal.loading ? null : cal.connected ? (
              <>
                <button type="button" onClick={onRefresh} className={cn(btn.secondary, size.md)}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" /> Sync now
                </button>
                <button type="button" onClick={onDisconnect} className={cn(btn.secondary, size.md, "hover:text-red-700")}>
                  <Unplug className="h-4 w-4" aria-hidden="true" /> Disconnect
                </button>
              </>
            ) : (
              <GoogleButton disabled={!cal.configured} label={cal.signedIn ? "Connect Google Calendar" : "Sign in with Google"} />
            )}
          </div>
        </div>

        {/* Outlook: honest placeholder */}
        <div className="mt-3 flex items-center gap-4 rounded-lg border border-dashed border-border p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
            <OutlookMark className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body font-medium text-copy">Microsoft Outlook</p>
            <p className="text-small text-muted">Coming soon</p>
          </div>
        </div>

        {!cal.connected && (
          <ul className="mt-5 space-y-2.5">
            {ACCESS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-small text-copy">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        )}
        {!cal.configured && !cal.loading && (
          <p className="mt-4 rounded-md bg-surface-muted px-3 py-2 text-label text-muted">
            Admin: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and DATABASE_URL on the server to enable sign-in. See the README.
          </p>
        )}
      </div>
    </section>
  );
}
