import type { MeetingType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { TYPE_DOT, TYPE_LABELS } from "@/lib/utils/format";

export function TypeBadge({ type, className }: { type: MeetingType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-border bg-surface px-2 py-0.5 text-label font-medium text-copy",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", TYPE_DOT[type])} aria-hidden="true" />
      {TYPE_LABELS[type]}
    </span>
  );
}

/** Teal badge for highlights and generic tags. */
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded bg-accent-soft px-2 py-0.5 text-label font-medium text-accent-hover", className)}>
      {children}
    </span>
  );
}

const STATUS = {
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-red-50 text-red-700",
  neutral: "bg-surface-disabled text-copy",
};

export function StatusBadge({ tone, children }: { tone: keyof typeof STATUS; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-label font-medium", STATUS[tone])}>{children}</span>;
}
