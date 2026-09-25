"use client";

import Link from "next/link";
import { useState } from "react";
import { isOverdue, type OpenActionRow } from "@/lib/data/meetings";
import { cn } from "@/lib/utils/cn";
import { link } from "@/lib/ui";
import { Checkbox } from "@/components/common/Checkbox";
import { StatusBadge } from "@/components/common/TypeBadge";

/** Open action items across the library, soonest due first. Ticking is session-only. */
export function OpenActions({ rows: initial }: { rows: OpenActionRow[] }) {
  const [rows, setRows] = useState(initial);

  const toggle = (key: string) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, status: r.status === "completed" ? "pending" : "completed" } : r)));

  return (
    <div className="overflow-hidden rounded-lg border border-border shadow-card">
      <table className="w-full text-body">
        <thead className="hidden bg-surface-muted text-left text-label text-muted md:table-header-group">
          <tr>
            <th scope="col" className="w-12 py-3 pl-4">
              <span className="sr-only">Done</span>
            </th>
            <th scope="col" className="py-3 pr-4 font-medium">Task</th>
            <th scope="col" className="py-3 pr-4 font-medium">Owner</th>
            <th scope="col" className="py-3 pr-4 font-medium">Due</th>
            <th scope="col" className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const overdue = isOverdue(r);
            const done = r.status === "completed";
            return (
              <tr
                key={r.key}
                className={cn(
                  "flex flex-wrap items-start gap-x-3 border-t border-border px-4 py-3 first:border-t-0 transition-colors duration-150 md:table-row md:px-0 md:py-0 md:first:border-t",
                  overdue ? "bg-highlight" : "hover:bg-surface-muted",
                )}
              >
                <td className="md:py-3 md:pl-4 md:align-top">
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
                    {overdue && " · overdue"}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap py-3 pr-4 align-top text-copy md:table-cell">{r.owner}</td>
                <td className="hidden whitespace-nowrap py-3 pr-4 align-top text-copy md:table-cell">{r.dueDate ?? "—"}</td>
                <td className="hidden py-3 pr-4 align-top md:table-cell">
                  {done ? (
                    <StatusBadge tone="success">Completed</StatusBadge>
                  ) : overdue ? (
                    <StatusBadge tone="warning">Overdue</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Pending</StatusBadge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
