"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ChevronLeft, Link2 } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { formatDate, formatDuration, formatTime } from "@/lib/utils/format";
import { btn, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
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
      <Link href="/meetings" className="-ml-1 inline-flex min-h-11 items-center gap-1 rounded text-body text-muted transition-colors duration-150 hover:text-ink">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> All meetings
      </Link>
      <div className="mt-2 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-h2">{meeting.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-label text-muted">
            <span className="font-medium text-copy">{meeting.company}</span>
            <span aria-hidden="true">·</span>
            <span>
              {formatDate(meeting.date)}, {formatTime(meeting.date)} PT
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDuration(meeting.duration)}</span>
            <span aria-hidden="true">·</span>
            <span>{meeting.platform}</span>
            <TypeBadge type={meeting.type} className="ml-1" />
          </p>
        </div>
        <button type="button" onClick={copyLink} className={cn(btn.secondary, size.sm, "shrink-0")} aria-label="Copy link to this meeting">
          {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          <span className="hidden sm:inline">{copied ? "Link copied" : "Copy link"}</span>
        </button>
      </div>
    </header>
  );
}
