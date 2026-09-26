"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, BarChart3, Flag, Table2, X } from "lucide-react";
import type { Meeting, MeetingSummary } from "@/lib/types";
import type { Anchors } from "@/lib/utils/anchors";
import { analyzeMeeting, type Segment } from "@/lib/utils/analytics";
import { speakerColors } from "@/lib/utils/speakers";
import { formatDuration, formatTimestamp } from "@/lib/utils/format";
import { btn, card, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

// Sequential teal ramp for topic intensity (light → dark), neutral for zero.
const HEAT = ["#f3f4f6", "#d1e0ff", "#84adff", "#528bff", "#155eef"];
const heat = (n: number, max: number) => (n === 0 ? HEAT[0] : HEAT[Math.min(4, Math.max(1, Math.ceil((n / max) * 4)))]);

type Moment = { t: number; kind: "decision" | "concern" | "highlight"; label: string };

interface Tip {
  x: number;
  y: number;
  value: string;
  label: string;
  detail?: string;
}

const fmtLen = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, "0")}s` : `${Math.round(s)}s`);

export function MeetingInsights({
  meeting,
  summary,
  anchors,
  onSeek,
  onClose,
}: {
  meeting: Meeting;
  summary: MeetingSummary;
  anchors: Anchors;
  onSeek: (t: number) => void;
  onClose: () => void;
}) {
  const a = useMemo(() => analyzeMeeting(meeting), [meeting]);
  const colors = useMemo(() => speakerColors(meeting.participants), [meeting.participants]);
  const [table, setTable] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const moments = useMemo<Moment[]>(() => {
    const list: Moment[] = [];
    summary.decisions.forEach((d, i) => anchors.decisions[i] != null && list.push({ t: anchors.decisions[i]!, kind: "decision", label: d }));
    summary.concerns.forEach((c, i) => anchors.concerns[i] != null && list.push({ t: anchors.concerns[i]!, kind: "concern", label: c }));
    (meeting.highlights ?? []).forEach((h) => list.push({ t: h.timestamp, kind: "highlight", label: h.label }));
    return list.sort((x, y) => x.t - y.t);
  }, [summary, anchors, meeting.highlights]);

  // Moments within ~3.5% of the timeline share one marker so none are hidden under another.
  const clusters = useMemo(() => {
    const out: { t: number; items: Moment[] }[] = [];
    const gap = meeting.duration * 60 * 0.035;
    for (const m of moments) {
      const last = out[out.length - 1];
      if (last && m.t - last.t <= gap) last.items.push(m);
      else out.push({ t: m.t, items: [m] });
    }
    return out;
  }, [moments, meeting.duration]);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const jump = (t: number) => {
    onClose();
    onSeek(t);
  };

  const showTip = (e: React.PointerEvent | React.FocusEvent, t: Omit<Tip, "x" | "y">) => {
    const target = e.currentTarget as HTMLElement;
    const r = target.getBoundingClientRect();
    const x = "clientX" in e ? e.clientX : r.left + r.width / 2;
    setTip({ ...t, x, y: r.top });
  };

  const hasGuests = a.speakers.some((s) => s.external);
  const tickStep = a.totalSeconds > 50 * 60 ? 600 : 300;
  const ticks = Array.from({ length: Math.floor(a.totalSeconds / tickStep) + 1 }, (_, i) => i * tickStep);
  const pct = (s: number) => `${(s / a.totalSeconds) * 100}%`;
  const maxHeat = Math.max(1, ...a.topics.flatMap((r) => r.buckets));

  return (
    <div className="fixed inset-0 z-50">
      <motion.div className="absolute inset-0 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="insights-title"
        className="absolute inset-0 flex flex-col overflow-hidden bg-page sm:inset-6 sm:rounded-xl lg:inset-x-[max(1.5rem,calc((100vw-72rem)/2))]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="insights-title" className="text-h3">
              Meeting insights
            </h2>
            <p className="truncate text-label text-muted">
              {meeting.title} · {formatDuration(meeting.duration)} · {meeting.participants.length} people
            </p>
          </div>
          <button type="button" onClick={() => setTable((v) => !v)} className={cn(btn.secondary, size.sm)} aria-pressed={table}>
            {table ? <BarChart3 className="h-4 w-4" aria-hidden="true" /> : <Table2 className="h-4 w-4" aria-hidden="true" />}
            <span className="hidden sm:inline">{table ? "Charts" : "Table view"}</span>
          </button>
          <button ref={closeRef} type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-surface-muted hover:text-ink" aria-label="Close insights">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {/* Headline numbers */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Tile label={hasGuests ? "Guests' share of talk" : "Speakers"} value={hasGuests ? `${a.guestPct}%` : String(a.speakers.length)} sub={hasGuests ? `your team ${a.teamPct}%` : "internal meeting"} />
            <Tile label="Questions asked" value={String(a.questions)} sub={`${(a.questions / meeting.duration).toFixed(1)} per minute`} />
            <Tile label="Longest monologue" value={a.longest ? fmtLen(a.longest.seconds) : "—"} sub={a.longest?.speaker ?? ""} />
            <Tile label="Pace" value={`${a.switchesPerMinute}`} sub="speaker changes / min" />
            <Tile label="Key moments" value={String(moments.length)} sub={`${summary.decisions.length} decisions · ${summary.concerns.length} concerns`} className="col-span-2 md:col-span-1" />
          </div>

          {table ? (
            <TablesView a={a} moments={moments} onJump={jump} />
          ) : (
            <>
              {/* Conversation flow */}
              <section className={cn(card, "mt-5 p-4 sm:p-5")} aria-labelledby="flow-heading">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 id="flow-heading" className="text-h3">
                    Conversation flow
                  </h3>
                  <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-muted">
                    <li className="flex items-center gap-1.5">
                      <MomentGlyph kind="decision" /> Decision
                    </li>
                    <li className="flex items-center gap-1.5">
                      <MomentGlyph kind="concern" /> Concern
                    </li>
                    <li className="flex items-center gap-1.5">
                      <MomentGlyph kind="highlight" /> Highlight
                    </li>
                  </ul>
                </div>
                <p className="mt-1 text-small text-muted">Who spoke when. Select a bar or a moment to open it in the transcript.</p>
                <p className="mt-1 text-label text-muted sm:hidden">Scroll sideways to see the whole call →</p>

                <div className="mt-4 overflow-x-auto">
                  <div className="min-w-[560px]">
                    {/* Moments lane */}
                    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3">
                      <span className="text-label font-medium text-muted">Moments</span>
                      <div className="relative h-7">
                        {clusters.map((c) => {
                          const tipData = {
                            value: formatTimestamp(c.t),
                            label: c.items.map((m) => m.kind[0].toUpperCase() + m.kind.slice(1)).join(" · "),
                            detail: c.items.map((m) => m.label).join(" / "),
                          };
                          return (
                            <button
                              key={`${c.t}-${c.items.length}`}
                              type="button"
                              onClick={() => jump(c.t)}
                              onPointerMove={(e) => showTip(e, tipData)}
                              onFocus={(e) => showTip(e, tipData)}
                              onPointerLeave={() => setTip(null)}
                              onBlur={() => setTip(null)}
                              aria-label={`${formatTimestamp(c.t)}: ${c.items.map((m) => `${m.kind}, ${m.label}`).join("; ")}`}
                              className="absolute top-0 flex h-7 min-w-6 -translate-x-1/2 items-center justify-center gap-0.5 rounded px-1 hover:bg-surface-muted"
                              style={{ left: pct(c.t) }}
                            >
                              {c.items.map((m, i) => (
                                <MomentGlyph key={i} kind={m.kind} />
                              ))}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Speaker lanes */}
                    <div className="mt-2 space-y-2">
                      {a.speakers.map((s) => (
                        <div key={s.name} className="grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3">
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5 truncate text-label font-medium text-ink">
                              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: colors.get(s.name) }} aria-hidden="true" />
                              <span className="truncate">{s.name}</span>
                            </span>
                            <span className="block pl-4 font-mono text-stamp text-muted">{s.pct}%</span>
                          </span>
                          <div className="relative h-5 rounded-sm bg-surface-muted">
                            {ticks.map((t) => (
                              <span key={t} className="absolute inset-y-0 w-px bg-border" style={{ left: pct(t) }} aria-hidden="true" />
                            ))}
                            {a.segments
                              .filter((g) => g.speaker === s.name)
                              .map((g) => (
                                <SegmentBar
                                  key={g.start}
                                  g={g}
                                  color={colors.get(s.name)!}
                                  left={pct(g.start)}
                                  width={pct(g.end - g.start)}
                                  onJump={jump}
                                  onTip={showTip}
                                  onLeave={() => setTip(null)}
                                />
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Axis */}
                    <div className="mt-1 grid grid-cols-[132px_minmax(0,1fr)] gap-3">
                      <span />
                      <div className="relative h-5">
                        {ticks.map((t, i) => (
                          <span
                            key={t}
                            className={cn(
                              "absolute font-mono text-stamp text-muted",
                              i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2",
                            )}
                            style={{ left: pct(t) }}
                          >
                            {Math.round(t / 60)}m
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Talk time */}
                <section className={cn(card, "p-4 sm:p-5")} aria-labelledby="talk-heading-2">
                  <h3 id="talk-heading-2" className="text-h3">
                    Talk time
                  </h3>
                  <p className="mt-1 text-small text-muted">Share of speaking time, with turns taken.</p>
                  <ul className="mt-4 space-y-3">
                    {a.speakers.map((s) => (
                      <li key={s.name}>
                        <div className="flex items-baseline justify-between gap-3 text-label">
                          <span className="truncate font-medium text-ink">
                            {s.name}
                            {s.external && <span className="font-normal text-muted"> · guest</span>}
                          </span>
                          <span className="shrink-0 text-muted">
                            <span className="font-semibold text-ink">{s.pct}%</span> · {fmtLen(s.seconds)} · {s.turns} turns
                          </span>
                        </div>
                        <div className="mt-1 h-2.5 rounded-full bg-surface-muted">
                          <div className="h-full rounded-full" style={{ width: `${Math.max(s.pct, 1)}%`, background: colors.get(s.name) }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Topics over time */}
                <section className={cn(card, "p-4 sm:p-5")} aria-labelledby="topics-heading">
                  <h3 id="topics-heading" className="text-h3">
                    Topics over time
                  </h3>
                  <p className="mt-1 text-small text-muted">How often each topic came up through the call.</p>
                  {a.topics.length === 0 ? (
                    <p className="mt-4 text-small text-muted">No recurring topics detected.</p>
                  ) : (
                    <>
                      <div className="mt-4 space-y-1.5">
                        {a.topics.map((r) => (
                          <div key={r.label} className="grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3">
                            <span className="truncate text-label text-ink" title={r.label}>
                              {r.label}
                            </span>
                            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${r.buckets.length}, minmax(0, 1fr))` }}>
                              {r.buckets.map((n, i) => {
                                const from = i * a.bucketSeconds;
                                const to = Math.min(a.totalSeconds, (i + 1) * a.bucketSeconds);
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    disabled={n === 0}
                                    onClick={() => jump(from)}
                                    onPointerMove={(e) => showTip(e, { value: `${n} mention${n === 1 ? "" : "s"}`, label: r.label, detail: `${formatTimestamp(from)}–${formatTimestamp(to)}` })}
                                    onFocus={(e) => showTip(e, { value: `${n} mention${n === 1 ? "" : "s"}`, label: r.label, detail: `${formatTimestamp(from)}–${formatTimestamp(to)}` })}
                                    onPointerLeave={() => setTip(null)}
                                    onBlur={() => setTip(null)}
                                    aria-label={`${r.label}, ${formatTimestamp(from)} to ${formatTimestamp(to)}: ${n} mentions`}
                                    className="h-6 rounded-[3px] transition-[filter] duration-150 enabled:hover:brightness-95"
                                    style={{ background: heat(n, maxHeat) }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 grid grid-cols-[132px_minmax(0,1fr)] gap-3">
                        <span />
                        <div className="flex justify-between font-mono text-stamp text-muted">
                          <span>0m</span>
                          <span>{Math.round(a.totalSeconds / 120)}m</span>
                          <span>{Math.round(a.totalSeconds / 60)}m</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-label text-muted" aria-hidden="true">
                        Fewer
                        {HEAT.map((c) => (
                          <span key={c} className="h-3 w-5 rounded-[3px]" style={{ background: c }} />
                        ))}
                        More
                      </div>
                    </>
                  )}
                </section>
              </div>
            </>
          )}
        </div>

        {tip && (
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[60] max-w-xs -translate-x-1/2 -translate-y-full rounded-md border border-border bg-surface px-3 py-2 text-label shadow-card"
            style={{ left: tip.x, top: tip.y - 8 }}
          >
            <p className="font-semibold text-ink">{tip.value}</p>
            <p className="text-muted">{tip.label}</p>
            {tip.detail && <p className="mt-1 line-clamp-3 text-copy">{tip.detail}</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SegmentBar({
  g,
  color,
  left,
  width,
  onJump,
  onTip,
  onLeave,
}: {
  g: Segment;
  color: string;
  left: string;
  width: string;
  onJump: (t: number) => void;
  onTip: (e: React.PointerEvent, t: Omit<Tip, "x" | "y">) => void;
  onLeave: () => void;
}) {
  const tip = { value: `${formatTimestamp(g.start)}–${formatTimestamp(g.end)} · ${fmtLen(g.end - g.start)}`, label: g.speaker, detail: g.text };
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={() => onJump(g.start)}
      onPointerMove={(e) => onTip(e, tip)}
      onPointerLeave={onLeave}
      aria-label={`${g.speaker} at ${formatTimestamp(g.start)}`}
      className="absolute inset-y-0 rounded-[3px] transition-[filter] duration-150 hover:brightness-110"
      // 2px surface gap between neighbouring segments
      style={{ left, width: `calc(${width} - 2px)`, minWidth: 3, background: color }}
    />
  );
}

function MomentGlyph({ kind }: { kind: Moment["kind"] }) {
  if (kind === "decision") return <span className="block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#155eef]" aria-hidden="true" />;
  if (kind === "concern") return <AlertTriangle className="h-3.5 w-3.5 fill-amber-100 text-amber-600" aria-hidden="true" />;
  return <Flag className="h-3.5 w-3.5 text-muted" aria-hidden="true" />;
}

function Tile({ label, value, sub, className }: { label: string; value: string; sub: string; className?: string }) {
  return (
    <div className={cn(card, "p-4", className)}>
      <p className="text-label text-muted">{label}</p>
      <p className="mt-1 text-[22px] font-bold leading-tight tabular-nums text-ink">{value}</p>
      <p className="truncate text-label text-muted">{sub}</p>
    </div>
  );
}

function TablesView({ a, moments, onJump }: { a: ReturnType<typeof analyzeMeeting>; moments: Moment[]; onJump: (t: number) => void }) {
  const th = "py-2 pr-4 text-left text-label font-medium text-muted";
  const td = "py-2 pr-4 text-body text-copy";
  return (
    <div className="mt-5 space-y-5">
      <section className={cn(card, "overflow-x-auto p-4 sm:p-5")}>
        <h3 className="text-h3">Speakers</h3>
        <table className="mt-3 w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Speaker</th>
              <th className={th}>Talk time</th>
              <th className={th}>Share</th>
              <th className={th}>Turns</th>
              <th className={th}>Questions</th>
              <th className={th}>Longest turn</th>
            </tr>
          </thead>
          <tbody>
            {a.speakers.map((s) => (
              <tr key={s.name} className="border-b border-border last:border-0">
                <td className={cn(td, "font-medium text-ink")}>
                  {s.name}
                  {s.external && <span className="font-normal text-muted"> (guest)</span>}
                </td>
                <td className={td}>{fmtLen(s.seconds)}</td>
                <td className={td}>{s.pct}%</td>
                <td className={td}>{s.turns}</td>
                <td className={td}>{s.questions}</td>
                <td className={td}>{fmtLen(s.longestTurn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={cn(card, "overflow-x-auto p-4 sm:p-5")}>
        <h3 className="text-h3">Key moments</h3>
        <table className="mt-3 w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Time</th>
              <th className={th}>Type</th>
              <th className={th}>What happened</th>
            </tr>
          </thead>
          <tbody>
            {moments.map((m, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className={td}>
                  <button type="button" onClick={() => onJump(m.t)} className="font-mono text-stamp text-accent-ink hover:underline">
                    {formatTimestamp(m.t)}
                  </button>
                </td>
                <td className={cn(td, "capitalize")}>{m.kind}</td>
                <td className={td}>{m.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={cn(card, "overflow-x-auto p-4 sm:p-5")}>
        <h3 className="text-h3">Topics</h3>
        <table className="mt-3 w-full min-w-[420px]">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Topic</th>
              <th className={th}>Mentions</th>
              <th className={th}>Busiest stretch</th>
            </tr>
          </thead>
          <tbody>
            {a.topics.map((r) => {
              const peak = r.buckets.indexOf(Math.max(...r.buckets));
              return (
                <tr key={r.label} className="border-b border-border last:border-0">
                  <td className={cn(td, "font-medium text-ink")}>{r.label}</td>
                  <td className={td}>{r.total}</td>
                  <td className={td}>
                    {formatTimestamp(peak * a.bucketSeconds)}–{formatTimestamp(Math.min(a.totalSeconds, (peak + 1) * a.bucketSeconds))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
