"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { Meeting, MeetingSummary } from "@/lib/types";
import { buildAnchors } from "@/lib/utils/anchors";
import { cn } from "@/lib/utils/cn";
import { TabBar } from "@/components/common/TabBar";
import { ChatInput, ChatMessages } from "@/components/ask/ChatThread";
import { useAskChat } from "@/components/ask/useAskChat";
import { MeetingHeader } from "./MeetingHeader";
import { SpeakerTimeline } from "./SpeakerTimeline";
import { Summary, type SummaryOrigin } from "./Summary";
import { ActionItems } from "./ActionItems";
import { Transcript, type SeekRequest } from "./Transcript";

/** Right-column tabs on desktop (xl+). */
type Panel = "summary" | "actions" | "ask";
/** Tabs below xl. "ask" opens the bottom sheet rather than a view. */
type MobileTab = "summary" | "actions" | "transcript" | "ask";

const SUGGESTIONS: Record<Meeting["type"], string[]> = {
  sales: ["What were the customer's concerns?", "What did we agree on pricing?", "What are the next steps and owners?"],
  cs: ["How is the account doing?", "What risks came up?", "What did we commit to?"],
  internal: ["What was decided?", "What are the open risks?", "Who owns which follow-ups?"],
  engineering: ["What was decided?", "What are the main technical risks?", "What are the next steps?"],
};

/*
 * Scrolling model
 * - xl+: the page fills the content panel. The header row is fixed; the left
 *   column (talk time + transcript) and the right column (tab content) each have
 *   exactly one scroll area. The Ask AI input is docked under the right column.
 * - below xl: only the window scrolls. The tab bar and each section's toolbar are
 *   sticky; Ask AI opens as a 60dvh bottom sheet.
 */
const STICKY = "top-[104px] lg:top-12 xl:top-0"; // under the tab bar: 56px app bar + 48px tabs on phones; inside the panel scroll area on lg; xl columns scroll on their own

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [panel, setPanel] = useState<Panel>("summary");
  const [view, setView] = useState<Exclude<MobileTab, "ask">>("summary");
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

  const ask = useCallback(
    (q: string) => {
      setPanel("ask");
      chat.send(q);
    },
    [chat],
  );

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

  const messagesProps = {
    messages: chat.messages,
    loading: chat.loading,
    onSend: ask,
    onRetry: chat.retry,
    onSeek: seekFromUi,
    suggestions: SUGGESTIONS[meeting.type],
    empty: (
      <div>
        <h3 className="text-h3">Ask about this meeting</h3>
        <p className="mt-1 text-small text-muted">Answers cite the transcript lines they come from. Select a source to jump to it.</p>
      </div>
    ),
  };

  // Below xl visibility follows `view`; on xl it follows `panel`.
  const show = (v: typeof view, p: Panel) => cn(view === v ? "block" : "hidden", panel === p ? "xl:block" : "xl:hidden");
  const timeline = (
    <SpeakerTimeline meeting={meeting} focused={hoverSpeaker} onFocus={setHoverSpeaker} pinned={pinnedSpeaker} onPin={setPinnedSpeaker} />
  );

  return (
    <div className="xl:flex xl:h-full xl:flex-col">
      <Suspense fallback={null}>
        <SeekFromUrl onSeek={onSeek} />
      </Suspense>

      {/* Header: fixed row on xl, scrolls away below xl */}
      <div className="border-b border-border bg-surface px-4 pb-6 pt-4 sm:px-6 xl:shrink-0 xl:pb-5 xl:pt-3">
        <MeetingHeader meeting={meeting} />
        <div className="mt-6 xl:hidden">{timeline}</div>
      </div>

      {/* Below xl: one tab bar, one visible section */}
      <TabBar
        label="Meeting sections"
        fill
        className="sticky top-14 z-20 px-2 sm:px-4 lg:top-0 xl:hidden"
        active={sheetOpen ? "ask" : view}
        onChange={(id) => (id === "ask" ? setSheetOpen(true) : setView(id))}
        tabs={[
          { id: "summary", label: "Summary" },
          { id: "actions", label: "Action items" },
          { id: "transcript", label: "Transcript" },
          { id: "ask", label: "Ask AI", dot: chat.messages.length > 0 },
        ]}
      />

      <div className="xl:grid xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,3fr)_minmax(380px,2fr)]">
        {/* Left column: the transcript's one scroll area on xl */}
        <div className={cn("scroll-thin min-w-0 px-4 pb-8 sm:px-6 xl:block xl:min-h-0 xl:overflow-y-auto", view === "transcript" ? "block" : "hidden")}>
          <Transcript
            meeting={meeting}
            seek={seek}
            onSeek={seekFromUi}
            anchors={anchors}
            speaker={hoverSpeaker ?? pinnedSpeaker}
            onReveal={revealTranscript}
            toolbarHeader={<div className="mb-4 hidden xl:block">{timeline}</div>}
            toolbarClassName={STICKY}
          />
        </div>

        {/* Right column: tab bar, one scroll area, docked Ask AI input */}
        <aside className="min-w-0 bg-surface xl:flex xl:min-h-0 xl:flex-col xl:border-l xl:border-border">
          <TabBar
            label="Meeting sidebar"
            className="hidden shrink-0 px-2 xl:flex"
            active={panel}
            onChange={setPanel}
            tabs={[
              { id: "summary", label: "Summary" },
              { id: "actions", label: "Action items" },
              { id: "ask", label: "Ask AI", dot: chat.messages.length > 0 },
            ]}
          />

          <div className="scroll-thin px-4 pb-8 sm:px-6 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
            <Summary
              summary={summary}
              decisionAnchors={anchors.decisions}
              concernAnchors={anchors.concerns}
              loading={summaryLoading}
              error={summaryError}
              origin={origin}
              onRegenerate={regenerate}
              onSeek={seekFromUi}
              stickyClassName={STICKY}
              className={show("summary", "summary")}
            />
            <ActionItems key={summaryVersion} items={summary.action_items} stickyClassName={STICKY} className={show("actions", "actions")} />
            <div className={cn("hidden pt-6", panel === "ask" && "xl:block")}>
              <ChatMessages {...messagesProps} />
            </div>
          </div>

          <div className="hidden shrink-0 border-t border-border px-6 py-3 xl:block">
            <p className="mb-2 text-label font-medium text-muted">Ask AI about this meeting</p>
            <ChatInput onSend={ask} loading={chat.loading} placeholder="Ask about this meeting…" />
          </div>
        </aside>
      </div>

      {/* Below xl: Ask AI bottom sheet */}
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
              <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-5">
                <ChatMessages {...messagesProps} />
              </div>
              <ChatInput onSend={ask} loading={chat.loading} placeholder="Ask about this meeting…" className="border-t border-border px-4 py-3" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
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
