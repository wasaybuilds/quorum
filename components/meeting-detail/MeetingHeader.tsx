"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, CalendarDays, Check, ChevronLeft, Clock, Link2, Video } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { formatDate, formatDuration, formatTime } from "@/lib/utils/format";
import { Avatar } from "@/components/common/Avatar";
import { TypeBadge } from "@/components/common/TypeBadge";

export function MeetingHeader({ meeting }: { meeting: Meeting }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/meetings/${meeting.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); nothing to recover.
    }
  }

  return (
    <header>
      <Link
        href="/meetings"
        className="-ml-2 inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Meetings
      </Link>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <TypeBadge type={meeting.type} />
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Video className="h-3.5 w-3.5" /> Recorded on {meeting.platform}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px] sm:leading-tight">{meeting.title}</h1>
          <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Company</dt>
              <Building2 className="h-4 w-4 text-subtle" />
              <dd className="font-medium text-foreground">{meeting.company}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Date</dt>
              <CalendarDays className="h-4 w-4 text-subtle" />
              <dd>
                {formatDate(meeting.date)} · {formatTime(meeting.date)} PT
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Duration</dt>
              <Clock className="h-4 w-4 text-subtle" />
              <dd>{formatDuration(meeting.duration)}</dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-border bg-surface px-3.5 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted/60"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Participants">
        {meeting.participants.map((p) => (
          <li
            key={p.name}
            className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3"
            title={p.email}
          >
            <Avatar name={p.name} size="xs" />
            <span className="text-sm font-medium text-foreground">{p.name}</span>
            {p.role && <span className="hidden text-xs text-muted sm:inline">{p.role}</span>}
            {p.external && <span className="rounded bg-surface-muted px-1.5 text-[10px] font-medium uppercase tracking-wide text-muted">Guest</span>}
          </li>
        ))}
      </ul>
    </header>
  );
}
