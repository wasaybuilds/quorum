"use client";

import { useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import type { ActionItem, Priority } from "@/lib/types";
import { isOverdue, parseDue } from "@/lib/data/meetings";
import { cn } from "@/lib/utils/cn";
import { btn, size } from "@/lib/ui";
import { Checkbox } from "@/components/common/Checkbox";
import { EmptyState } from "@/components/common/States";
import { Select } from "@/components/common/Select";
import { StatusBadge } from "@/components/common/TypeBadge";
import { useActionStatus } from "@/components/auth/ActionStatusProvider";

type SortKey = "due" | "owner" | "priority" | "task";
type Filter = "all" | "pending" | "completed";

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function ActionItems({
  items: initial,
  keyPrefix,
  stickyClassName,
  className,
}: {
  items: ActionItem[];
  /** status keys are `${keyPrefix}-${index}`, shared with the Home and Action items lists */
  keyPrefix: string;
  /** sticky offset for the header row, which depends on the surrounding layout */
  stickyClassName?: string;
  className?: string;
}) {
  const { statusOf, toggle: toggleStatus } = useActionStatus();
  const items = useMemo(
    () => initial.map((item, id) => ({ ...item, id, status: statusOf(`${keyPrefix}-${id}`, item.status) })),
    [initial, keyPrefix, statusOf],
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("due");

  const done = items.filter((i) => i.status === "completed").length;

  const rows = useMemo(() => {
    const list = items.filter((i) => filter === "all" || i.status === filter);
    const key = (i: (typeof items)[number]): number | string =>
      sort === "due"
        ? parseDue(i.dueDate)?.getTime() ?? Infinity
        : sort === "priority"
          ? PRIORITY_RANK[i.priority ?? "low"]
          : sort === "owner"
            ? i.owner
            : i.task;
    return [...list].sort((a, b) => {
      const av = key(a);
      const bv = key(b);
      return av < bv ? -1 : av > bv ? 1 : 0;
    });
  }, [items, filter, sort]);

  const toggle = (id: number, current: ActionItem["status"]) => toggleStatus(`${keyPrefix}-${id}`, current);

  return (
    <section aria-labelledby="actions-heading" className={className}>
      <div className={cn("sticky z-10 -mx-4 flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3 sm:-mx-6 sm:px-6", stickyClassName)}>
        <h2 id="actions-heading" className="text-h3">
          Action items <span className="font-mono text-stamp font-normal text-muted">{done}/{items.length} done</span>
        </h2>
        <div className="flex gap-2">
          <Select
            label="Show"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All items" },
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
            ]}
            className="w-32"
          />
          <Select
            label="Sort by"
            value={sort}
            onChange={setSort}
            options={[
              { value: "due", label: "Due date" },
              { value: "priority", label: "Priority" },
              { value: "owner", label: "Owner" },
              { value: "task", label: "Task" },
            ]}
            className="w-32"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={filter === "completed" ? "Nothing completed yet" : "All caught up"}
          description={filter === "completed" ? "Tick off an item to see it here." : "Every action item from this meeting is done."}
          action={
            <button type="button" onClick={() => setFilter("all")} className={cn(btn.secondary, size.md)}>
              Show all items
            </button>
          }
        />
      ) : (
        <ul className="mt-4 overflow-hidden rounded-lg border border-border">
          {rows.map((item) => {
            const overdue = isOverdue(item);
            const completed = item.status === "completed";
            return (
              <li
                key={item.id}
                className={cn(
                  "flex gap-3 border-t border-border px-4 py-3 transition-colors duration-150 first:border-t-0",
                  overdue ? "bg-highlight" : "hover:bg-surface-muted",
                )}
              >
                <div className="pt-0.5">
                  <Checkbox checked={completed} onToggle={() => toggle(item.id, item.status)} label={item.task} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-body text-copy", completed && "text-muted line-through")}>{item.task}</p>
                  <p className="mt-1 text-label text-muted">
                    {item.owner}
                    {item.dueDate && ` · due ${item.dueDate}`}
                    {item.priority && ` · ${item.priority} priority`}
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  {completed ? (
                    <StatusBadge tone="success">Completed</StatusBadge>
                  ) : overdue ? (
                    <StatusBadge tone="warning">Overdue</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Pending</StatusBadge>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
