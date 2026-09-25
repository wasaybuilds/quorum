import { CheckCircle2, Clock, ListChecks, Video } from "lucide-react";
import { getStats } from "@/lib/data/meetings";
import { formatDuration } from "@/lib/utils/format";

export function Stats() {
  const s = getStats();
  const tiles = [
    { label: "Meetings recorded", value: s.totalMeetings, sub: `${formatDuration(s.totalMinutes)} of conversation`, icon: Video },
    { label: "Average duration", value: formatDuration(s.avgDuration), sub: "per meeting", icon: Clock },
    { label: "Decisions captured", value: s.decisions, sub: "across all meetings", icon: CheckCircle2 },
    { label: "Open action items", value: s.openActionItems, sub: `of ${s.actionItems} total`, icon: ListChecks },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ label, value, sub, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-border bg-surface p-4">
          <dt className="flex items-center gap-2 text-xs font-medium text-muted">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">{value}</dd>
          <dd className="mt-0.5 text-xs text-muted">{sub}</dd>
        </div>
      ))}
    </dl>
  );
}
