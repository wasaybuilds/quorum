"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ListChecks } from "lucide-react";
import type { ActionItem, Priority } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/States";

type SortKey = "task" | "owner" | "dueDate" | "status";
type Filter = "all" | "pending" | "completed";

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-800",
  low: "bg-slate-100 text-slate-600",
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Sep 28" / "Sept 28" → sortable number; undated items sort last. */
function dueValue(due?: string | null): number {
  if (!due) return Number.MAX_SAFE_INTEGER;
  const m = due.toLowerCase().match(/([a-z]{3})[a-z]*\.?\s+(\d{1,2})/);
  if (!m) return Number.MAX_SAFE_INTEGER - 1;
  const month = MONTHS.indexOf(m[1]);
  return month === -1 ? Number.MAX_SAFE_INTEGER - 1 : month * 100 + Number(m[2]);
}

export function ActionItems({ items: initial }: { items: ActionItem[] }) {
  const [items, setItems] = useState(() => initial.map((item, id) => ({ ...item, id })));
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    completed: items.filter((i) => i.status === "completed").length,
  };

  const rows = useMemo(() => {
    const list = items.filter((i) => filter === "all" || i.status === filter);
    if (!sort) return list;
    return [...list].sort((a, b) => {
      const av = sort.key === "dueDate" ? dueValue(a.dueDate) : a[sort.key];
      const bv = sort.key === "dueDate" ? dueValue(b.dueDate) : b[sort.key];
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }, [items, filter, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));
  }

  function toggleStatus(id: number) {
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, status: i.status === "completed" ? "pending" : "completed" } : i)),
    );
  }

  return (
    <section aria-labelledby="actions-heading" className="rounded-xl border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h2 id="actions-heading" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          Action items
          <span className="font-normal text-muted">
            {counts.completed}/{counts.all} done
          </span>
        </h2>
        <div className="flex rounded-lg bg-surface-muted p-0.5 text-sm" role="tablist" aria-label="Filter action items">
          {(["all", "pending", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "h-8 flex-1 rounded-md px-3 capitalize transition-colors sm:flex-none",
                filter === f ? "bg-surface font-medium text-foreground shadow-sm" : "text-muted hover:text-foreground",
              )}
            >
              {f} <span className="tabular-nums text-subtle">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={filter === "completed" ? "Nothing completed yet" : "All caught up"}
          description={filter === "completed" ? "Tick off an item to see it here." : "Every action item from this meeting is done."}
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="w-10 py-2 pl-5" scope="col">
                  <span className="sr-only">Done</span>
                </th>
                <SortHeader label="Task" k="task" sort={sort} onSort={toggleSort} />
                <SortHeader label="Owner" k="owner" sort={sort} onSort={toggleSort} />
                <SortHeader label="Due" k="dueDate" sort={sort} onSort={toggleSort} />
                <SortHeader label="Status" k="status" sort={sort} onSort={toggleSort} className="pr-5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface-muted/40">
                  <td className="py-3 pl-5 align-top">
                    <StatusCheckbox done={item.status === "completed"} onToggle={() => toggleStatus(item.id)} label={item.task} />
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <span className={cn("text-foreground", item.status === "completed" && "text-muted line-through decoration-border-strong")}>
                      {item.task}
                    </span>
                    {item.priority && (
                      <span className={cn("ml-2 inline-block rounded px-1.5 py-px text-[11px] font-medium capitalize", PRIORITY_STYLES[item.priority])}>
                        {item.priority}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 align-top">
                    <span className="inline-flex items-center gap-2">
                      <Avatar name={item.owner} size="xs" />
                      {item.owner}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 align-top text-muted">{item.dueDate ?? "—"}</td>
                  <td className="py-3 pr-5 align-top">
                    <StatusPill status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-border md:hidden">
            {rows.map((item) => (
              <li key={item.id} className="flex gap-3 px-4 py-3.5">
                <StatusCheckbox done={item.status === "completed"} onToggle={() => toggleStatus(item.id)} label={item.task} />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm text-foreground", item.status === "completed" && "text-muted line-through")}>{item.task}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar name={item.owner} size="xs" /> {item.owner}
                    </span>
                    {item.dueDate && <span>Due {item.dueDate}</span>}
                    {item.priority && (
                      <span className={cn("rounded px-1.5 py-px font-medium capitalize", PRIORITY_STYLES[item.priority])}>{item.priority}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function SortHeader({
  label,
  k,
  sort,
  onSort,
  className,
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: 1 | -1 } | null;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = sort?.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === 1 ? ArrowUp : ArrowDown;
  return (
    <th scope="col" className={cn("py-2 pr-4 font-medium", className)} aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => onSort(k)} className="-ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-surface-muted hover:text-foreground">
        {label}
        <Icon className={cn("h-3 w-3", active ? "text-foreground" : "text-subtle")} />
      </button>
    </th>
  );
}

function StatusCheckbox({ done, onToggle, label }: { done: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={`Mark "${label}" as ${done ? "pending" : "completed"}`}
      onClick={onToggle}
      className="-m-2.5 flex h-10 w-10 shrink-0 items-center justify-center"
    >
      <span
        className={cn(
          "flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors",
          done ? "border-emerald-600 bg-emerald-600 text-white" : "border-border-strong bg-surface hover:border-muted",
        )}
      >
        {done && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </button>
  );
}

function StatusPill({ status }: { status: ActionItem["status"] }) {
  return status === "completed" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Completed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Pending
    </span>
  );
}
