"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessageSquareText, Search, SearchX } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { search } from "@/lib/utils/search";
import { formatDate, formatTimestamp } from "@/lib/utils/format";
import { btn, inputShell, link, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/common/States";
import { MeetingRow } from "@/components/meetings/MeetingCard";
import { Highlight } from "./Highlight";

const EXAMPLES = ["security review", "Salesforce", "pricing", "Redis", "Karen Whitfield", "duplicate"];

export function SearchResults({ meetings }: { meetings: Meeting[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const deferred = useDeferredValue(query);

  // Keep ?q= in sync so results are shareable.
  useEffect(() => {
    const id = setTimeout(() => {
      const next = deferred.trim() ? `${pathname}?q=${encodeURIComponent(deferred.trim())}` : pathname;
      router.replace(next, { scroll: false });
    }, 300);
    return () => clearTimeout(id);
  }, [deferred, pathname, router]);

  const results = useMemo(() => search(meetings, deferred, 100), [meetings, deferred]);
  const q = deferred.trim();

  return (
    <div>
      <div className={cn(inputShell, "h-12 px-4")}>
        <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search meetings, people, or anything said"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-[16px] text-copy outline-none sm:text-body"
        />
      </div>

      {!q ? (
        <div className="mt-6">
          <p className="text-label text-muted">Try searching for</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((e) => (
              <button key={e} type="button" onClick={() => setQuery(e)} className={cn(btn.secondary, size.sm)}>
                {e}
              </button>
            ))}
          </div>
        </div>
      ) : results.meetings.length === 0 && results.lines.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border">
          <EmptyState
            icon={SearchX}
            title={`No results for “${q}”`}
            description="Search matches exact words in titles, companies, participants and transcripts. Ask Quorum can answer broader questions."
            action={<AskLink q={q} />}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {results.meetings.length > 0 && (
            <section>
              <h2 className="mb-4 text-h3">
                Meetings <span className="font-mono text-stamp font-normal text-muted">{results.meetings.length}</span>
              </h2>
              <div className="grid grid-cols-1 gap-4 md:gap-0 md:overflow-hidden md:rounded-lg md:border md:border-border md:shadow-card">
                {results.meetings.map(({ meeting }) => (
                  <MeetingRow key={meeting.id} meeting={meeting} />
                ))}
              </div>
            </section>
          )}

          {results.lines.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-h3">
                  Mentioned in transcripts <span className="font-mono text-stamp font-normal text-muted">{results.lines.length}</span>
                </h2>
                <Link href={`/ask?q=${encodeURIComponent(q)}`} className={cn(link, "text-body font-medium")}>
                  Ask Quorum instead
                </Link>
              </div>
              <ul className="overflow-hidden rounded-lg border border-border shadow-card">
                {results.lines.map(({ meeting, entry }) => (
                  <li key={`${meeting.id}-${entry.timestamp}`} className="border-t border-border first:border-t-0">
                    <Link
                      href={`/meetings/${meeting.id}?t=${entry.timestamp}`}
                      className="block px-4 py-3 transition-colors duration-150 hover:bg-surface-muted sm:px-6 sm:py-4"
                    >
                      <p className="flex flex-wrap items-baseline gap-x-2 text-label text-muted">
                        <span className="font-semibold text-ink">{entry.speaker}</span>
                        <span className="truncate">
                          {meeting.title} · {formatDate(meeting.date)}
                        </span>
                        <span className="font-mono text-stamp">{formatTimestamp(entry.timestamp)}</span>
                      </p>
                      <p className="mt-1 max-w-[65ch] text-body text-copy">
                        <Highlight text={entry.text} query={q} />
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function AskLink({ q }: { q: string }) {
  return (
    <Link href={`/ask?q=${encodeURIComponent(q)}`} className={cn(btn.primary, size.md)}>
      <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Ask Quorum instead
    </Link>
  );
}
