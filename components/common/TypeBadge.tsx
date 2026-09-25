import type { MeetingType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { TYPE_LABELS, TYPE_STYLES } from "@/lib/utils/format";

export function TypeBadge({ type, className }: { type: MeetingType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TYPE_STYLES[type],
        className,
      )}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}
