"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import type { Meeting, MeetingType } from "@/lib/types";
import { normalize, queryTerms } from "@/lib/utils/search";
import { TYPE_LABELS } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/common/States";
import { MeetingCard } from "./MeetingCard";

type SortKey = "newest" | "oldest" | "longest";
const TYPES: (MeetingType | "all")[] = ["all", "sales", "cs", "internal", "engineering"];

export function MeetingList({ meetings }: { meetings: Meeting[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<MeetingType | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: meetings.length };
    for (const m of meetings) c[m.type] = (c[m.type] ?? 0) + 1;
    return c;
  }, [meetings]);

  const filtered = useMemo(() => {
    const terms = queryTerms(query);
    const raw = normalize(query.trim());
    const list = meetings.filter((m) => {
      if (type !== "all" && m.type !== type) return false;
      if (!raw) return true;
      const hay = normalize([m.title, m.company, ...m.participants.map((p) => `${p.name} ${p.role ?? ""}`)].join(" "));
      return terms.length ? terms.every((t) => hay.includes(t)) : hay.includes(raw);
    });
    return [...list].sort((a, b) =>
      sort === "longest" ? b.duration - a.duration : sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date),
    );
  }, [meetings, query, type, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 focus-within:border-border-strong">
          <Search className="h-4 w-4 shrink-0 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, company or participant"
            aria-label="Filter meetings"
            className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-subtle sm:text-sm"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="rounded p-1 text-subtle hover:text-foreground" aria-label="Clear filter">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <label className="flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-full flex-1 bg-transparent font-medium text-foreground outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="longest">Longest first</option>
          </select>
        </label>
      </div>

      <div className="scroll-thin -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Meeting type">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={type === t}
            onClick={() => setType(t)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors",
              type === t
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
            )}
          >
            {t === "all" ? "All meetings" : TYPE_LABELS[t]}
            <span className={cn("tabular-nums", type === t ? "text-white/70" : "text-subtle")}>{counts[t] ?? 0}</span>
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "meeting" : "meetings"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-4 rounded-xl border border-dashed border-border bg-surface"
          icon={SearchX}
          title="No meetings match"
          description="Try a different name or company, or clear the filters."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setType("all");
              }}
              className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:bg-surface-muted"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="mt-2 grid gap-3">
          {filtered.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}
    </div>
  );
}
