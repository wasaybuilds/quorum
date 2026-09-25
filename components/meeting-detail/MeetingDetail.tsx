"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MessageSquareText, X } from "lucide-react";
import type { Meeting, MeetingSummary } from "@/lib/types";
import { buildAnchors } from "@/lib/utils/anchors";
import { btn } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { ChatThread } from "@/components/ask/ChatThread";
import { useAskChat } from "@/components/ask/useAskChat";
import { MeetingHeader } from "./MeetingHeader";
import { SpeakerTimeline } from "./SpeakerTimeline";
import { Summary, type SummaryOrigin } from "./Summary";
import { ActionItems } from "./ActionItems";
import { Transcript, type SeekRequest } from "./Transcript";

/** Right sidebar tabs on desktop. */
type Panel = "summary" | "actions" | "ask";
/** Tab bar below xl, where the sidebar is hidden and Ask AI is a bottom sheet. */
type MobileView = "summary" | "actions" | "transcript";

const SUGGESTIONS: Record<Meeting["type"], string[]> = {
  sales: ["What were the customer's concerns?", "What did we agree on pricing?", "What are the next steps and owners?"],
  cs: ["How is the account doing?", "What risks came up?", "What did we commit to?"],
  internal: ["What was decided?", "What are the open risks?", "Who owns which follow-ups?"],
  engineering: ["What was decided?", "What are the main technical risks?", "What are the next steps?"],
};

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [panel, setPanel] = useState<Panel>("summary");
  const [view, setView] = useState<MobileView>("summary");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seek, setSeek] = useState<SeekRequest | null>(null);
  const [hoverSpeaker, setHoverSpeaker] = useState<string | null>(null);
  const [pinnedSpeaker, setPinnedSpeaker] = useState<string | null>(null);
  const nonce = useRef(0);

  const [summary, setSummary] = useState<MeetingSummary>(meeting.summary);
  const [summaryVersion, setSummaryVersion] = useState(0);
  const [origin, setOrigin] = useState<SummaryOrigin>("seed");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const anchors = useMemo(() => buildAnchors(meeting, summary), [meeting, summary]);
  const chatBody = useMemo(() => ({ meetingId: meeting.id }), [meeting.id]);
  const chat = useAskChat("/api/ai/ask-meeting", chatBody);

  const onSeek = useCallback(
    (requested: number, opts: { updateUrl?: boolean } = {}) => {
      // Snap to the line being spoken at that moment.
      const line = [...meeting.transcript].reverse().find((e) => e.timestamp <= requested) ?? meeting.transcript[0];
      setView("transcript");
      setSheetOpen(false);
      nonce.current += 1;
      setSeek({ timestamp: line.timestamp, nonce: nonce.current });
      if (opts.updateUrl !== false) {
        const url = new URL(window.location.href);
        url.searchParams.set("t", String(line.timestamp));
        window.history.replaceState(window.history.state, "", url);
      }
    },
    [meeting.transcript],
  );
  const seekFromUi = useCallback((t: number) => onSeek(t), [onSeek]);
  const revealTranscript = useCallback(() => setView("transcript"), []);

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
        <h3 className="text-h3">Ask about this meeting</h3>
        <p className="mt-1 text-small text-muted">Answers cite the transcript lines they come from. Select a source to jump to it.</p>
      </div>
    ),
  };

  // Mobile visibility comes from `view`; desktop (xl) visibility from `panel`.
  const show = (m: MobileView | null, p: Panel | null) =>
    cn(view === m ? "block" : "hidden", panel === p ? "xl:block" : "xl:hidden");

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,3fr)_minmax(380px,2fr)]">
      <Suspense fallback={null}>
        <SeekFromUrl onSeek={onSeek} />
      </Suspense>

      {/* Left: header, talk time, transcript */}
      <div className="min-w-0 px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <MeetingHeader meeting={meeting} />
        <div className="mt-6">
          <SpeakerTimeline
            meeting={meeting}
            focused={hoverSpeaker}
            onFocus={setHoverSpeaker}
            pinned={pinnedSpeaker}
            onPin={setPinnedSpeaker}
          />
        </div>

        <div className="sticky top-14 z-20 -mx-4 mt-6 border-b border-border bg-surface px-4 sm:-mx-6 sm:px-6 lg:top-0 xl:hidden" role="tablist" aria-label="Meeting sections">
          <div className="flex gap-1">
            {(
              [
                ["summary", "Summary"],
                ["actions", "Action items"],
                ["transcript", "Transcript"],
              ] as [MobileView, string][]
            ).map(([key, label]) => (
              <TabButton key={key} active={view === key} onClick={() => setView(key)}>
                {label}
              </TabButton>
            ))}
          </div>
        </div>

        <Transcript
          meeting={meeting}
          seek={seek}
          onSeek={seekFromUi}
          anchors={anchors}
          speaker={hoverSpeaker ?? pinnedSpeaker}
          onReveal={revealTranscript}
          className={cn("mt-6 xl:mt-8", view === "transcript" ? "block" : "hidden xl:block")}
        />
      </div>

      {/* Right: sidebar with tabs on xl; below xl its sections follow the tab bar */}
      <aside className="min-w-0 px-4 pb-24 sm:px-6 lg:px-8 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:border-l xl:border-border xl:bg-surface xl:px-0 xl:pb-0">
        <div className="hidden h-16 shrink-0 items-end gap-1 border-b border-border px-6 xl:flex" role="tablist" aria-label="Meeting sidebar">
          <TabButton active={panel === "summary"} onClick={() => setPanel("summary")}>
            Summary
          </TabButton>
          <TabButton active={panel === "actions"} onClick={() => setPanel("actions")}>
            Action items
          </TabButton>
          <TabButton active={panel === "ask"} onClick={() => setPanel("ask")} dot={chat.messages.length > 0}>
            Ask AI
          </TabButton>
        </div>

        <div className={cn("scroll-thin min-h-0 xl:flex-1 xl:overflow-y-auto xl:px-6 xl:py-6", panel === "ask" && "xl:hidden")}>
          <Summary
            summary={summary}
            decisionAnchors={anchors.decisions}
            concernAnchors={anchors.concerns}
            loading={summaryLoading}
            error={summaryError}
            origin={origin}
            onRegenerate={regenerate}
            onSeek={seekFromUi}
            className={cn("pt-6 xl:pt-0", show("summary", "summary"))}
          />
          <ActionItems key={summaryVersion} items={summary.action_items} className={cn("pt-6 xl:pt-0", show("actions", "actions"))} />
        </div>

        <div className={cn("hidden min-h-0 flex-1", panel === "ask" && "xl:flex xl:flex-col")}>
          <ChatThread {...chatProps} className="flex-1" />
        </div>
      </aside>

      {/* Below xl: Ask AI in a bottom sheet */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className={cn(btn.primary, "fixed right-4 z-30 h-12 px-5 xl:hidden", view === "transcript" ? "bottom-20" : "bottom-5")}
      >
        <MessageSquareText className="h-4 w-4" aria-hidden="true" />
        Ask AI
      </button>

      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Ask AI about this meeting"
              className="absolute inset-x-0 bottom-0 flex h-[60dvh] min-h-[420px] origin-bottom flex-col rounded-t-lg border-t border-border bg-surface md:inset-x-auto md:bottom-4 md:right-4 md:w-[440px] md:rounded-lg md:border"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-border pl-4 pr-2">
                <div className="min-w-0">
                  <p className="text-body font-semibold text-ink">Ask AI</p>
                  <p className="truncate text-label text-muted">{meeting.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-surface-muted hover:text-ink"
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

function TabButton({ active, onClick, children, dot }: { active: boolean; onClick: () => void; children: React.ReactNode; dot?: boolean }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative -mb-px inline-flex h-12 items-center gap-1.5 border-b-2 px-3 text-body font-medium transition-colors duration-150",
        active ? "border-accent text-accent-ink" : "border-transparent text-muted hover:text-ink",
      )}
    >
      {children}
      {dot && !active && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="has messages" />}
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
    const id = requestAnimationFrame(() => onSeek(ts, { updateUrl: false }));
    return () => cancelAnimationFrame(id);
  }, [t, onSeek]);
  return null;
}
