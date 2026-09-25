"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp, CloudOff, Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ErrorState, Skeleton } from "@/components/common/States";
import { LogoMark } from "@/components/layout/Logo";
import { AnswerText } from "./AnswerText";
import { SourceCard } from "./SourceCard";
import type { ChatMessage } from "./useAskChat";

const CONFIDENCE: Record<string, string> = {
  high: "text-emerald-700 bg-emerald-50",
  medium: "text-amber-800 bg-amber-50",
  low: "text-slate-600 bg-slate-100",
};

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (q: string) => void;
  onRetry: () => void;
  suggestions: string[];
  placeholder: string;
  empty: React.ReactNode;
  onSeek?: (timestamp: number) => void;
  showMeeting?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function ChatThread({
  messages,
  loading,
  onSend,
  onRetry,
  suggestions,
  placeholder,
  empty,
  onSeek,
  showMeeting = false,
  autoFocus = false,
  className,
}: Props) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, loading]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [draft]);

  function submit(q = draft) {
    if (!q.trim() || loading) return;
    onSend(q);
    setDraft("");
  }

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.length === 0 && !loading ? (
          <div>
            {empty}
            <div className="mt-4 flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="min-h-11 rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted/60"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m) =>
              m.role === "user" ? (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm text-white"
                >
                  {m.content}
                </motion.div>
              ) : (
                <motion.div key={m.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                  <LogoMark className="mt-0.5 h-6 w-6 shrink-0" />
                  <div className="min-w-0 flex-1">
                    {m.error ? (
                      <ErrorState message="I couldn't reach the assistant just now. Check your connection and try again." onRetry={onRetry} />
                    ) : (
                      <AssistantAnswer message={m} onSeek={onSeek} showMeeting={showMeeting} />
                    )}
                  </div>
                </motion.div>
              ),
            )}
            {loading && (
              <div className="flex gap-2.5" role="status" aria-label="Thinking">
                <LogoMark className="mt-0.5 h-6 w-6 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <p className="text-xs text-muted">Reading the transcript…</p>
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-11/12" />
                  <Skeleton className="h-3.5 w-3/5" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="border-t border-border bg-surface p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-1.5 focus-within:border-border-strong focus-within:bg-surface">
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            autoFocus={autoFocus}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="max-h-36 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-base text-foreground outline-none placeholder:text-subtle sm:text-sm"
          />
          <button
            type="submit"
            disabled={!draft.trim() || loading}
            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-hover disabled:bg-border-strong"
            aria-label="Send question"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function AssistantAnswer({
  message,
  onSeek,
  showMeeting,
}: {
  message: ChatMessage;
  onSeek?: (t: number) => void;
  showMeeting: boolean;
}) {
  const r = message.response;
  return (
    <div>
      <AnswerText text={message.content} />
      {r?.patterns && r.patterns.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {r.patterns.map((p) => (
            <span key={p} className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-1 text-xs text-foreground">
              <Layers className="h-3 w-3 text-muted" />
              {p}
            </span>
          ))}
        </div>
      )}
      {r && r.sources.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-muted">
            {r.sources.length} {r.sources.length === 1 ? "source" : "sources"}
          </p>
          <div className="space-y-1.5">
            {r.sources.map((s) => (
              <SourceCard key={`${s.meetingId}-${s.timestamp}`} source={s} onSeek={onSeek} showMeeting={showMeeting} />
            ))}
          </div>
        </div>
      )}
      {r && (r.confidence || r.fallback) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          {r.confidence && (
            <span className={cn("rounded px-1.5 py-0.5 font-medium capitalize", CONFIDENCE[r.confidence])}>
              {r.confidence} confidence
            </span>
          )}
          {r.fallback && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-600" title="The AI service was unavailable, so this answer was built from the meeting notes and transcript.">
              <CloudOff className="h-3 w-3" /> Offline answer
            </span>
          )}
        </div>
      )}
    </div>
  );
}
