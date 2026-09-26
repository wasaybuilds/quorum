import { CheckCircle2, Clock, ListChecks, Video } from "lucide-react";
import { getStats } from "@/lib/data/meetings";
import { formatDuration } from "@/lib/utils/format";
import { card } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

export function StatCards() {
  const s = getStats();
  const tiles = [
    { label: "Meetings this week", value: String(s.meetingsThisWeek), sub: `of ${s.totalMeetings} recorded`, icon: Video, tone: "bg-[#0d9488]" },
    { label: "Time recorded", value: formatDuration(s.totalMinutes), sub: `${s.participants} people`, icon: Clock, tone: "bg-[#3b82f6]" },
    { label: "Decisions captured", value: String(s.decisions), sub: `across ${s.totalMeetings} meetings`, icon: CheckCircle2, tone: "bg-[#10b981]" },
    { label: "Open action items", value: String(s.openActionItems), sub: s.overdue ? `${s.overdue} overdue` : "none overdue", icon: ListChecks, tone: "bg-[#f59e0b]", warn: s.overdue > 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4">
      {tiles.map(({ label, value, sub, icon: Icon, tone, warn }) => (
        <div key={label} className={cn(card, "flex items-center gap-4 p-4")}>
          <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white", tone)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-small text-muted">{label}</p>
            <p className="text-[22px] font-bold leading-tight tabular-nums text-ink">{value}</p>
            <p className={cn("truncate text-label", warn ? "font-medium text-amber-700" : "text-muted")}>{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
