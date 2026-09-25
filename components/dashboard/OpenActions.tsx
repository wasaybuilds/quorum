"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { isOverdue, parseDue, type OpenActionRow } from "@/lib/data/meetings";
import { cn } from "@/lib/utils/cn";
import { btn, link, size } from "@/lib/ui";
import { Checkbox } from "@/components/common/Checkbox";
import { Select } from "@/components/common/Select";

const PREVIEW = 5;
type SortKey = "due" | "owner";

/** Open action items across the library. Ticking is session-only (no persistence). */
export function OpenActions({ rows: initial }: { rows: OpenActionRow[] }) {
  const [rows, setRows] = useState(initial);
  const [sort, setSort] = useState<SortKey>("due");
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) =>
        sort === "owner"
          ? a.owner.localeCompare(b.owner)
          : (parseDue(a.dueDate)?.getTime() ?? Infinity) - (parseDue(b.dueDate)?.getTime() ?? Infinity),
      ),
    [rows, sort],
  );
  const visible = expanded ? sorted : sorted.slice(0, PREVIEW);

  const toggle = (key: string) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, status: r.status === "completed" ? "pending" : "completed" } : r)));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-label text-muted">
          {rows.filter((r) => r.status === "pending").length} open · {rows.filter(isOverdue).length} overdue
        </p>
        <Select
          label="Sort action items"
          value={sort}
          onChange={setSort}
          options={[
            { value: "due", label: "Sort by due date" },
            { value: "owner", label: "Sort by owner" },
          ]}
          className="w-44"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border shadow-card">
        <table className="w-full text-body">
          <thead className="hidden bg-surface-muted text-left text-label text-muted md:table-header-group">
            <tr>
              <th scope="col" className="py-3 pl-4 pr-4 font-medium">Task</th>
              <th scope="col" className="py-3 pr-4 font-medium">Owner</th>
              <th scope="col" className="py-3 pr-4 font-medium">Due</th>
              <th scope="col" className="w-24 py-3 pr-4 font-medium">Status</th>
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
                    "flex items-start gap-3 border-t border-border px-4 py-3 first:border-t-0 transition-colors duration-150 md:table-row md:px-0 md:py-0 md:first:border-t",
                    overdue ? "bg-highlight" : "hover:bg-surface-muted",
                  )}
                >
                  <td className="min-w-0 flex-1 md:py-3 md:pl-4 md:pr-4 md:align-top">
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
                  <td className={cn("hidden whitespace-nowrap py-3 pr-4 align-top md:table-cell", overdue ? "font-medium text-amber-800" : "text-copy")}>
                    {r.dueDate ?? "—"}
                    {overdue && <span className="block text-label">Overdue</span>}
                  </td>
                  <td className="pt-0.5 md:py-3 md:pr-4 md:align-top">
                    <span className="flex items-center gap-2">
                      <Checkbox checked={done} onToggle={() => toggle(r.key)} label={r.task} />
                      <span className="hidden text-label text-muted md:inline">{done ? "Done" : "Open"}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length > PREVIEW && (
        <button type="button" onClick={() => setExpanded((e) => !e)} className={cn(btn.tertiary, size.sm, "mt-2 -ml-3")}>
          {expanded ? "Show fewer" : `View all ${rows.length}`}
        </button>
      )}
    </div>
  );
}
