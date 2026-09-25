"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import type { Meeting, MeetingType } from "@/lib/types";
import { normalize, queryTerms } from "@/lib/utils/search";
import { TYPE_LABELS } from "@/lib/utils/format";
import { btn, inputBare, inputShell, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/common/States";
import { Select } from "@/components/common/Select";
import { MeetingRow } from "./MeetingCard";

type SortKey = "newest" | "oldest" | "longest";
type TypeFilter = MeetingType | "all";

export function MeetingList({ meetings }: { meetings: Meeting[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const typeOptions = useMemo(() => {
    const count = (t: MeetingType) => meetings.filter((m) => m.type === t).length;
    return [
      { value: "all" as TypeFilter, label: `All types (${meetings.length})` },
      ...(Object.keys(TYPE_LABELS) as MeetingType[]).map((t) => ({ value: t as TypeFilter, label: `${TYPE_LABELS[t]} (${count(t)})` })),
    ];
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
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className={cn(inputShell, "h-10 flex-1")}>
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, company or participant"
            aria-label="Search meetings"
            className={inputBare}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="-mr-1 flex h-8 w-8 items-center justify-center rounded text-muted hover:text-ink" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Select label="Meeting type" value={type} onChange={setType} options={typeOptions} className="flex-1 sm:w-52 sm:flex-none" />
          <Select
            label="Sort"
            value={sort}
            onChange={setSort}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "longest", label: "Longest first" },
            ]}
            className="flex-1 sm:w-40 sm:flex-none"
          />
        </div>
      </div>

      <p className="mb-4 mt-6 text-label text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "meeting" : "meetings"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border">
          <EmptyState
            icon={SearchX}
            title="No meetings found"
            description="Try a different name or company, or clear the filters."
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setType("all");
                }}
                className={cn(btn.secondary, size.md)}
              >
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-0 md:overflow-hidden md:rounded-lg md:border md:border-border md:shadow-card">
          {filtered.map((m) => (
            <MeetingRow key={m.id} meeting={m} />
          ))}
        </div>
      )}
    </div>
  );
}
