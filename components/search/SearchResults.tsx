"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessageSquareText, Quote, Search, SearchX } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { search } from "@/lib/utils/search";
import { formatDate, formatTimestamp } from "@/lib/utils/format";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/States";
import { MeetingCard } from "@/components/meetings/MeetingCard";
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
      <div className="flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 focus-within:border-border-strong">
        <Search className="h-5 w-5 shrink-0 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search meetings, people, or anything said…"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-subtle"
        />
      </div>

      {!q ? (
        <div className="mt-6">
          <p className="text-sm text-muted">Try searching for</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setQuery(e)}
                className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-3.5 text-sm text-foreground hover:border-border-strong"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ) : results.meetings.length === 0 && results.lines.length === 0 ? (
        <EmptyState
          className="mt-6 rounded-xl border border-dashed border-border bg-surface"
          icon={SearchX}
          title={`No results for “${q}”`}
          description="Search looks for exact words in titles, companies, participants and transcripts. Ask Quorum can answer broader questions."
          action={<AskLink q={q} />}
        />
      ) : (
        <div className="mt-6 space-y-8">
          {results.meetings.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Meetings <span className="font-normal text-muted">{results.meetings.length}</span>
              </h2>
              <div className="grid gap-3">
                {results.meetings.map(({ meeting }) => (
                  <MeetingCard key={meeting.id} meeting={meeting} showSummary={false} />
                ))}
              </div>
            </section>
          )}

          {results.lines.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Mentioned in transcripts <span className="font-normal text-muted">{results.lines.length}</span>
                </h2>
                <AskLink q={q} subtle />
              </div>
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                {results.lines.map(({ meeting, entry }) => (
                  <li key={`${meeting.id}-${entry.timestamp}`}>
                    <Link
                      href={`/meetings/${meeting.id}?t=${entry.timestamp}`}
                      className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-surface-muted/40 sm:px-5"
                    >
                      <Avatar name={entry.speaker} size="sm" className="mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted">
                          <span className="font-medium text-foreground">{entry.speaker}</span>
                          <span className="truncate">
                            {meeting.title} · {formatDate(meeting.date)}
                          </span>
                          <span className="font-mono tabular-nums text-accent">{formatTimestamp(entry.timestamp)}</span>
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">
                          <Quote className="mr-1 inline h-3 w-3 -translate-y-0.5 text-subtle" />
                          <Highlight text={entry.text} query={q} />
                        </p>
                      </div>
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

function AskLink({ q, subtle = false }: { q: string; subtle?: boolean }) {
  return (
    <Link
      href={`/ask?q=${encodeURIComponent(q)}`}
      className={
        subtle
          ? "inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-accent hover:bg-accent-soft"
          : "inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-white hover:bg-slate-800"
      }
    >
      <MessageSquareText className="h-4 w-4" /> Ask Quorum instead
    </Link>
  );
}
