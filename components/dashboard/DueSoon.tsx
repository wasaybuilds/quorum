"use client";

import Link from "next/link";
import { useState } from "react";
import { isOverdue, type OpenActionRow } from "@/lib/data/meetings";
import { card, link } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { Checkbox } from "@/components/common/Checkbox";
import { useActionStatus } from "@/components/auth/ActionStatusProvider";

const PREVIEW = 5;

/** Open action items, soonest due first. Ticks are saved to the account when signed in. */
export function DueSoon({ rows: initial }: { rows: OpenActionRow[] }) {
  const { statusOf, toggle: toggleStatus } = useActionStatus();
  const rows = initial.map((r) => ({ ...r, status: statusOf(r.key, r.status) }));
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rows : rows.slice(0, PREVIEW);
  const open = rows.filter((r) => r.status === "pending").length;

  return (
    <section aria-labelledby="due-heading" className={cn(card, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <h2 id="due-heading" className="text-h3">
          Due soon
        </h2>
        <span className="rounded bg-surface-disabled px-2 py-0.5 text-label font-medium text-copy">{open} open</span>
      </div>
      <ul>
        {visible.map((r) => {
          const overdue = isOverdue(r);
          const done = r.status === "completed";
          return (
            <li
              key={r.key}
              className={cn(
                "flex gap-3 border-t border-border px-5 py-3 first:border-t-0 transition-colors duration-150",
                overdue ? "bg-highlight" : "hover:bg-surface-muted",
              )}
            >
              <div className="pt-0.5">
                <Checkbox checked={done} onToggle={() => toggleStatus(r.key, r.status)} label={r.task} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("line-clamp-2 text-body text-copy", done && "text-muted line-through")}>{r.task}</p>
                <p className="mt-1 text-label text-muted">
                  <span className={cn(overdue && "font-medium text-amber-800")}>
                    {overdue ? `Overdue · ${r.dueDate}` : r.dueDate ? `Due ${r.dueDate}` : "No due date"}
                  </span>
                  {" · "}
                  {r.owner}
                </p>
                <Link href={`/meetings/${r.meeting.id}`} className={cn(link, "mt-0.5 inline-block text-label")}>
                  {r.meeting.title}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      {rows.length > PREVIEW && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex min-h-11 w-full items-center justify-center border-t border-border text-body font-medium text-accent-ink transition-colors duration-150 hover:bg-surface-muted hover:text-accent-hover"
        >
          {expanded ? "Show fewer" : `View all ${rows.length}`}
        </button>
      )}
    </section>
  );
}
