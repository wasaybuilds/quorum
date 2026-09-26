"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarCheck2, CheckCircle2, FileText, MessageSquareText, Video } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SLIDES = [
  {
    icon: FileText,
    eyebrow: "Meeting notes",
    title: "Notes you can trust",
    text: "Summaries, decisions and risks, each linked to the exact moment it was said.",
    preview: <SummaryPreview />,
  },
  {
    icon: MessageSquareText,
    eyebrow: "Ask Quorum",
    title: "Ask across every call",
    text: "Spot patterns and find commitments across your whole meeting history.",
    preview: <AskPreview />,
  },
  {
    icon: CalendarCheck2,
    eyebrow: "Calendar",
    title: "Follows your calendar",
    text: "Pick which meetings get recorded, automatically or one by one.",
    preview: <CalendarPreview />,
  },
];

const INTERVAL = 5000;

/** Auto-rotating product previews for the sign-in page. Pauses on hover/focus and for reduced motion. */
export function LoginShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, reduce]);

  const slide = SLIDES[index];

  return (
    <div
      className="w-full max-w-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="What Quorum does"
    >
      <div className="relative h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}: ${slide.title}`}
          >
            {slide.preview}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 min-h-[112px]" aria-live="polite">
        <p className="flex items-center gap-2 text-label font-medium text-[#2dd4bf]">
          <slide.icon className="h-4 w-4" aria-hidden="true" /> {slide.eyebrow}
        </p>
        <h2 className="mt-2 text-[30px] font-semibold leading-tight text-white">{slide.title}</h2>
        <p className="mt-2 max-w-md text-body text-gray-400">{slide.text}</p>
      </div>

      <div className="mt-6 flex items-center gap-2" role="tablist" aria-label="Choose slide">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={s.title}
            onClick={() => setIndex(i)}
            className="group flex h-6 items-center"
          >
            <span className={cn("block h-1.5 rounded-full transition-all duration-300", i === index ? "w-8 bg-[#2dd4bf]" : "w-3 bg-white/20 group-hover:bg-white/40")} />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- previews (static UI, not screenshots) --------------------------------------

function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex h-9 items-center gap-1.5 border-b border-border bg-surface-muted px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]/70" />
        <span className="ml-2 truncate text-[11px] text-muted">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SummaryPreview() {
  return (
    <Frame title="Acme Product Demo · Summary">
      <p className="text-[13px] font-semibold text-ink">Acme Product Demo</p>
      <p className="text-[11px] text-muted">Acme Corporation · 30 min · Zoom</p>
      <div className="mt-3 flex h-6 gap-0.5 overflow-hidden rounded">
        <span className="basis-[36%] bg-[#0f766e]" />
        <span className="basis-[32%] bg-[#0d9488]" />
        <span className="basis-[21%] bg-[#5eead4]" />
        <span className="basis-[11%] bg-[#99f6e4]" />
      </div>
      <p className="mt-3 text-[11px] font-medium text-muted">Decisions</p>
      <ul className="mt-1.5 space-y-1.5">
        {[
          ["Run a two-week pilot on a Salesforce sandbox", "16:14"],
          ["Use the native Salesforce sync", "3:28"],
        ].map(([t, ts]) => (
          <li key={t} className="flex items-center justify-between gap-2 text-[12px] text-copy">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" /> {t}
            </span>
            <span className="rounded bg-highlight px-1 font-mono text-[10px] text-ink">{ts}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] font-medium text-muted">Concerns</p>
      <p className="mt-1 text-[12px] text-copy">Seven-week security review puts go-live at risk.</p>
    </Frame>
  );
}

function AskPreview() {
  return (
    <Frame title="Ask Quorum · All meetings">
      <p className="ml-auto w-fit rounded-md bg-surface-muted px-2.5 py-1.5 text-[12px] font-medium text-ink">What objections come up most in sales calls?</p>
      <p className="mt-3 text-[12px] leading-relaxed text-copy">
        Across three sales calls, the same themes repeat:
      </p>
      <ul className="mt-1.5 space-y-1 text-[12px] text-copy">
        <li>
          • <span className="font-semibold text-ink">Price vs. budget</span> in all 3 calls
        </li>
        <li>
          • <span className="font-semibold text-ink">Security review</span> slowing timelines
        </li>
        <li>
          • <span className="font-semibold text-ink">Salesforce duplicates</span> from past vendors
        </li>
      </ul>
      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-accent-ink">
        <span>[Michael Johnson @ 11:52]</span>
        <span>[Karen Whitfield @ 7:48]</span>
        <span>[Samir N. @ 5:15]</span>
      </div>
      <span className="mt-3 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">High confidence</span>
    </Frame>
  );
}

function CalendarPreview() {
  const rows = [
    ["Acme CTO deep-dive", "Tue 10:00 · Zoom", true],
    ["Globex CFO review", "Wed 13:30 · Teams", true],
    ["Platform standup", "Wed 9:15 · Meet", false],
  ] as const;
  return (
    <Frame title="Upcoming · Google Calendar">
      <p className="rounded-md bg-accent-soft/60 px-2.5 py-1.5 text-[11px] text-accent-hover">
        Quorum will auto-record starting with <span className="font-semibold">Acme CTO deep-dive</span>
      </p>
      <ul className="mt-3 divide-y divide-border">
        {rows.map(([title, meta, on]) => (
          <li key={title} className="flex items-center gap-3 py-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-muted text-muted">
              <Video className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-ink">{title}</p>
              <p className="text-[11px] text-muted">{meta}</p>
            </div>
            <span className={cn("relative h-4 w-7 rounded-full", on ? "bg-accent-ink" : "bg-disabled")}>
              <span className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white", on ? "left-[14px]" : "left-0.5")} />
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
