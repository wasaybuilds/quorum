import type { MeetingType } from "@/lib/types";
import { meetings } from "@/lib/data/meetings";
import { formatDuration, TYPE_DOT, TYPE_LABELS } from "@/lib/utils/format";
import { card } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

/** Share of recorded time by meeting type. */
export function MeetingMix() {
  const total = meetings.reduce((s, m) => s + m.duration, 0) || 1;
  const rows = (Object.keys(TYPE_LABELS) as MeetingType[])
    .map((type) => {
      const list = meetings.filter((m) => m.type === type);
      const minutes = list.reduce((s, m) => s + m.duration, 0);
      return { type, count: list.length, minutes, pct: Math.round((minutes / total) * 100) };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.minutes - a.minutes);

  return (
    <section aria-labelledby="mix-heading" className={cn(card, "p-5 lg:p-6")}>
      <h2 id="mix-heading" className="text-h3">
        Where time goes
      </h2>
      <p className="mt-1 text-small text-muted">Recorded time by meeting type</p>

      <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {rows.map((r) => (
          <span key={r.type} className={TYPE_DOT[r.type]} style={{ flexGrow: r.minutes, flexBasis: 0 }} />
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <li key={r.type} className="flex items-center gap-3 text-body">
            <span className={cn("h-2 w-2 rounded-full", TYPE_DOT[r.type])} aria-hidden="true" />
            <span className="flex-1 text-copy">{TYPE_LABELS[r.type]}</span>
            <span className="text-label text-muted">
              {r.count} · {formatDuration(r.minutes)}
            </span>
            <span className="w-10 text-right font-mono text-stamp text-ink">{r.pct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
