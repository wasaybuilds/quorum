"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import { isOverdue, parseDue, type OpenActionRow } from "@/lib/data/meetings";
import { btn, card, link, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { Checkbox } from "@/components/common/Checkbox";
import { EmptyState } from "@/components/common/States";
import { Select } from "@/components/common/Select";
import { StatusBadge } from "@/components/common/TypeBadge";

type Status = "open" | "overdue" | "completed" | "all";
type Sort = "due" | "owner" | "meeting";

/** Every action item across meetings. Ticking is session-only (no persistence). */
export function ActionsTable({ rows: initial }: { rows: OpenActionRow[] }) {
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState<Status>("open");
  const [owner, setOwner] = useState("all");
  const [sort, setSort] = useState<Sort>("due");

  const owners = useMemo(() => [...new Set(initial.map((r) => r.owner))].sort(), [initial]);

  const visible = useMemo(() => {
    const list = rows.filter((r) => {
      if (owner !== "all" && r.owner !== owner) return false;
      if (status === "open") return r.status === "pending";
      if (status === "overdue") return isOverdue(r);
      if (status === "completed") return r.status === "completed";
      return true;
    });
    return [...list].sort((a, b) =>
      sort === "owner"
        ? a.owner.localeCompare(b.owner)
        : sort === "meeting"
          ? a.meeting.title.localeCompare(b.meeting.title)
          : (parseDue(a.dueDate)?.getTime() ?? Infinity) - (parseDue(b.dueDate)?.getTime() ?? Infinity),
    );
  }, [rows, status, owner, sort]);

  const toggle = (key: string) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, status: r.status === "completed" ? "pending" : "completed" } : r)));

  const counts = {
    open: rows.filter((r) => r.status === "pending").length,
    overdue: rows.filter(isOverdue).length,
    completed: rows.filter((r) => r.status === "completed").length,
  };

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label text-muted">
          {counts.open} open · {counts.overdue} overdue · {counts.completed} completed
        </p>
        <div className="flex flex-wrap gap-2">
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            className="w-36"
            options={[
              { value: "open", label: `Open (${counts.open})` },
              { value: "overdue", label: `Overdue (${counts.overdue})` },
              { value: "completed", label: `Completed (${counts.completed})` },
              { value: "all", label: "All" },
            ]}
          />
          <Select label="Owner" value={owner} onChange={setOwner} className="w-44" options={[{ value: "all", label: "All owners" }, ...owners.map((o) => ({ value: o, label: o }))]} />
          <Select
            label="Sort"
            value={sort}
            onChange={setSort}
            className="w-40"
            options={[
              { value: "due", label: "Due date" },
              { value: "owner", label: "Owner" },
              { value: "meeting", label: "Meeting" },
            ]}
          />
        </div>
      </div>

      <div className={cn(card, "mt-4 overflow-hidden")}>
        {visible.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nothing here"
            description="No action items match these filters."
            action={
              <button
                type="button"
                onClick={() => {
                  setStatus("all");
                  setOwner("all");
                }}
                className={cn(btn.secondary, size.md)}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <table className="w-full text-body">
            <thead className="hidden bg-surface-muted text-left text-label text-muted md:table-header-group">
              <tr>
                <th scope="col" className="w-12 py-3 pl-5">
                  <span className="sr-only">Done</span>
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">Task</th>
                <th scope="col" className="py-3 pr-4 font-medium">Owner</th>
                <th scope="col" className="py-3 pr-4 font-medium">Due</th>
                <th scope="col" className="py-3 pr-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const overdue = isOverdue(r);
                const done = r.status === "completed";
                return (
                  <tr
                    key={r.key}
                    className={cn(
                      "flex gap-3 border-t border-border px-5 py-3 first:border-t-0 transition-colors duration-150 md:table-row md:px-0 md:py-0 md:first:border-t",
                      overdue ? "bg-highlight" : "hover:bg-surface-muted",
                    )}
                  >
                    <td className="pt-0.5 md:py-3 md:pl-5 md:align-top">
                      <Checkbox checked={done} onToggle={() => toggle(r.key)} label={r.task} />
                    </td>
                    <td className="min-w-0 flex-1 md:py-3 md:pr-4 md:align-top">
                      <span className={cn("text-copy", done && "text-muted line-through")}>{r.task}</span>
                      <Link href={`/meetings/${r.meeting.id}`} className={cn(link, "mt-0.5 block text-label")}>
                        {r.meeting.title}
                      </Link>
                      <span className="mt-1 block text-label text-muted md:hidden">
                        {r.owner}
                        {r.dueDate && ` · due ${r.dueDate}`}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap py-3 pr-4 align-top text-copy md:table-cell">{r.owner}</td>
                    <td className="hidden whitespace-nowrap py-3 pr-4 align-top text-copy md:table-cell">{r.dueDate ?? "—"}</td>
                    <td className="hidden py-3 pr-5 align-top md:table-cell">
                      {done ? (
                        <StatusBadge tone="success">Completed</StatusBadge>
                      ) : overdue ? (
                        <StatusBadge tone="warning">Overdue</StatusBadge>
                      ) : (
                        <StatusBadge tone="neutral">Open</StatusBadge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
