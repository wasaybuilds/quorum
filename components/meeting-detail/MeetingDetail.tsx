"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { FileText, MessageSquareText, X } from "lucide-react";
import type { Meeting, MeetingSummary } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ChatThread } from "@/components/ask/ChatThread";
import { useAskChat } from "@/components/ask/useAskChat";
import { MeetingHeader } from "./MeetingHeader";
import { SpeakerTimeline } from "./SpeakerTimeline";
import { Summary, type SummaryOrigin } from "./Summary";
import { ActionItems } from "./ActionItems";
import { Transcript, type SeekRequest } from "./Transcript";

type Tab = "transcript" | "ask";

const SUGGESTIONS: Record<Meeting["type"], string[]> = {
  sales: ["What were the customer's concerns?", "What did we agree on pricing?", "What are the next steps and owners?"],
  cs: ["How is the account doing?", "What risks came up?", "What did we commit to?"],
  internal: ["What was decided?", "What are the open risks?", "Who owns which follow-ups?"],
  engineering: ["What was decided?", "What are the main technical risks?", "What are the next steps?"],
};

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [tab, setTab] = useState<Tab>("transcript");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seek, setSeek] = useState<SeekRequest | null>(null);
  const nonce = useRef(0);

  const [summary, setSummary] = useState<MeetingSummary>(meeting.summary);
  const [summaryVersion, setSummaryVersion] = useState(0);
  const [origin, setOrigin] = useState<SummaryOrigin>("seed");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const chatBody = useMemo(() => ({ meetingId: meeting.id }), [meeting.id]);
  const chat = useAskChat("/api/ai/ask-meeting", chatBody);

  const onSeek = useCallback(
    (requested: number, opts: { updateUrl?: boolean } = {}) => {
      // Snap to the line being spoken at that moment.
      const line = [...meeting.transcript].reverse().find((e) => e.timestamp <= requested) ?? meeting.transcript[0];
      const timestamp = line.timestamp;
      setTab("transcript");
      setSheetOpen(false);
      nonce.current += 1;
      setSeek({ timestamp, nonce: nonce.current });
      if (opts.updateUrl !== false) {
        const url = new URL(window.location.href);
        url.searchParams.set("t", String(timestamp));
        window.history.replaceState(window.history.state, "", url);
      }
    },
    [meeting.transcript],
  );
  const seekFromUi = useCallback((t: number) => onSeek(t), [onSeek]);
  const revealTranscript = useCallback(() => setTab("transcript"), []);

  async function regenerate() {
    setSummaryLoading(true);
    setSummaryError(false);
    try {
      const res = await fetch("/api/ai/analyze-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: meeting.id }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data: MeetingSummary & { fallback: boolean } = await res.json();
      const { fallback, ...next } = data;
      setSummary(next);
      setSummaryVersion((v) => v + 1);
      setOrigin(fallback ? "fallback" : "ai");
    } catch {
      setSummaryError(true);
    } finally {
      setSummaryLoading(false);
    }
  }

  const chatProps = {
    messages: chat.messages,
    loading: chat.loading,
    onSend: chat.send,
    onRetry: chat.retry,
    onSeek: seekFromUi,
    suggestions: SUGGESTIONS[meeting.type],
    placeholder: "Ask about this meeting…",
    empty: (
      <div>
        <p className="text-sm font-medium text-foreground">Ask anything about this meeting</p>
        <p className="mt-1 text-sm text-muted">Answers cite the exact transcript lines they come from. Tap a source to jump there.</p>
      </div>
    ),
  };

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_440px]">
      <Suspense fallback={null}>
        <SeekFromUrl onSeek={onSeek} />
      </Suspense>

      {/* Main column */}
      <div className="mx-auto w-full max-w-4xl space-y-5 px-4 pb-8 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <MeetingHeader meeting={meeting} />
        <SpeakerTimeline meeting={meeting} activeTimestamp={seek?.timestamp ?? null} onSeek={seekFromUi} />
        <Summary
          summary={summary}
          transcript={meeting.transcript}
          loading={summaryLoading}
          error={summaryError}
          origin={origin}
          onRegenerate={regenerate}
          onSeek={seekFromUi}
        />
        <ActionItems key={summaryVersion} items={summary.action_items} />
      </div>

      {/* Transcript + Ask panel: right rail on xl, inline section below */}
      <aside className="border-t border-border bg-surface xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:border-l xl:border-t-0">
        <div className="hidden h-14 shrink-0 items-center gap-1 border-b border-border px-3 xl:flex" role="tablist">
          <PanelTab active={tab === "transcript"} onClick={() => setTab("transcript")} icon={FileText} label="Transcript" />
          <PanelTab active={tab === "ask"} onClick={() => setTab("ask")} icon={MessageSquareText} label="Ask AI" badge={chat.messages.length > 0} />
        </div>

        <div className="flex items-center justify-between px-4 pb-1 pt-5 sm:px-6 xl:hidden">
          <h2 className="text-base font-semibold text-foreground">Transcript</h2>
          <span className="text-xs text-muted">{meeting.transcript.length} entries</span>
        </div>

        <Transcript
          meeting={meeting}
          seek={seek}
          onSeek={seekFromUi}
          onReveal={revealTranscript}
          className={cn("xl:flex-1", tab === "ask" && "xl:hidden")}
        />

        <div className={cn("hidden min-h-0 flex-1", tab === "ask" && "xl:flex xl:flex-col")}>
          <ChatThread {...chatProps} className="flex-1" />
        </div>
      </aside>

      {/* Mobile / tablet: Ask AI bottom sheet */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-5 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition-transform active:scale-95 xl:hidden"
      >
        <MessageSquareText className="h-4 w-4" />
        Ask AI
      </button>

      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            <motion.div
              className="absolute inset-0 bg-slate-900/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Ask AI about this meeting"
              className="absolute inset-x-0 bottom-0 flex h-[85dvh] flex-col rounded-t-2xl bg-surface shadow-2xl md:inset-x-auto md:right-4 md:bottom-4 md:h-[min(720px,calc(100dvh-2rem))] md:w-[420px] md:rounded-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-border pl-4 pr-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Ask AI</p>
                  <p className="truncate text-xs text-muted">{meeting.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-surface-muted"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ChatThread {...chatProps} className="flex-1" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelTab({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof FileText;
  label: string;
  badge?: boolean;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
        active ? "bg-surface-muted text-foreground" : "text-muted hover:text-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4", active && "text-accent")} />
      {label}
      {badge && !active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
    </button>
  );
}

/** Applies ?t=<seconds> from the URL (search results and cited sources link here). */
function SeekFromUrl({ onSeek }: { onSeek: (t: number, opts?: { updateUrl?: boolean }) => void }) {
  const params = useSearchParams();
  const t = params.get("t");
  useEffect(() => {
    if (t === null) return;
    const ts = Number(t);
    if (!Number.isFinite(ts)) return;
    // Wait a frame so the transcript is laid out before scrolling.
    const id = requestAnimationFrame(() => onSeek(ts, { updateUrl: false }));
    return () => cancelAnimationFrame(id);
  }, [t, onSeek]);
  return null;
}
