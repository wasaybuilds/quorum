import { CheckCircle2, Clock, ListChecks, Video } from "lucide-react";
import { getStats } from "@/lib/data/meetings";
import { formatDuration } from "@/lib/utils/format";
import { card } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

export function StatCards() {
  const s = getStats();
  const tiles = [
    { label: "Meetings this week", value: String(s.meetingsThisWeek), sub: `${s.totalMeetings} recorded in total`, icon: Video },
    { label: "Time recorded", value: formatDuration(s.totalMinutes), sub: `${s.participants} people on calls`, icon: Clock },
    { label: "Decisions captured", value: String(s.decisions), sub: `across ${s.totalMeetings} meetings`, icon: CheckCircle2 },
    {
      label: "Open action items",
      value: String(s.openActionItems),
      sub: s.overdue ? `${s.overdue} overdue` : "nothing overdue",
      warn: s.overdue > 0,
      icon: ListChecks,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {tiles.map(({ label, value, sub, icon: Icon, warn }) => (
        <div key={label} className={cn(card, "p-4 sm:p-5 lg:p-6")}>
          <div className="flex items-center justify-between">
            <p className="text-label font-medium text-muted">{label}</p>
            <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-ink sm:flex">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-[26px] font-bold sm:text-[32px] leading-none tabular-nums text-ink">{value}</p>
          <p className={cn("mt-2 text-label", warn ? "font-medium text-amber-700" : "text-muted")}>{sub}</p>
        </div>
      ))}
    </div>
  );
}
