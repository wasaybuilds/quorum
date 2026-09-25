import { getStats } from "@/lib/data/meetings";
import { card } from "@/lib/ui";

export function Stats() {
  const s = getStats();
  const tiles = [
    { label: "Meetings this week", value: s.meetingsThisWeek, sub: `${s.totalMeetings} in the library` },
    { label: "Decisions", value: s.decisions, sub: `across ${s.totalMeetings} meetings` },
    { label: "Open action items", value: s.openActionItems, sub: s.overdue ? `${s.overdue} overdue` : "none overdue" },
    { label: "Participants", value: s.participants, sub: "people on recorded calls" },
  ];

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ label, value, sub }) => (
        <div key={label} className={`${card} p-5 lg:p-6`}>
          <dt className="text-label font-medium text-muted">{label}</dt>
          <dd className="mt-2 text-[32px] font-bold leading-none tabular-nums text-accent">{value}</dd>
          <dd className="mt-2 text-label text-muted">{sub}</dd>
        </div>
      ))}
    </dl>
  );
}
