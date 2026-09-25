"use client";

import { useEffect, useRef, useState } from "react";
import { CloudOff, Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { btn } from "@/lib/ui";
import { ErrorState, Loading } from "@/components/common/States";
import { StatusBadge } from "@/components/common/TypeBadge";
import { AnswerText } from "./AnswerText";
import { SourceLink } from "./SourceCard";
import type { ChatMessage } from "./useAskChat";

/**
 * The conversation for one meeting. It has no scroll container of its own:
 * it flows inside whichever area scrolls (the sidebar on desktop, the sheet on mobile).
 */
export function ChatMessages({
  messages,
  loading,
  onSend,
  onRetry,
  onSeek,
  suggestions,
  empty,
  className,
}: {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (q: string) => void;
  onRetry: () => void;
  onSeek?: (timestamp: number) => void;
  suggestions: string[];
  empty: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Bring the latest question to the top of the view so its answer reads from the start.
  useEffect(() => {
    const questions = rootRef.current?.querySelectorAll<HTMLElement>("[data-question]");
    questions?.[questions.length - 1]?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0 && !loading) {
    return (
      <div className={className}>
        {empty}
        <div className="mt-4 flex flex-col gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSend(s)}
              className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-left text-body text-copy transition-colors duration-150 hover:border-border-strong hover:bg-surface-muted"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("space-y-6", className)} aria-live="polite">
      {messages.map((m) =>
        m.role === "user" ? (
          <p key={m.id} data-question className="scroll-mt-20 rounded-md bg-surface-muted px-3 py-2 text-body font-medium text-ink">
            {m.content}
          </p>
        ) : m.error ? (
          <ErrorState key={m.id} message="Couldn't reach the assistant. Check your connection and try again." onRetry={onRetry} />
        ) : (
          <div key={m.id}>
            <AnswerText text={m.content} />
            {m.response && m.response.sources.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {m.response.sources.map((s) => (
                  <SourceLink key={`${s.meetingId}-${s.timestamp}`} source={s} onSeek={onSeek} />
                ))}
              </p>
            )}
            {m.response && (m.response.confidence || m.response.fallback) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.response.confidence && (
                  <StatusBadge tone={m.response.confidence === "high" ? "success" : m.response.confidence === "medium" ? "warning" : "neutral"}>
                    {m.response.confidence[0].toUpperCase() + m.response.confidence.slice(1)} confidence
                  </StatusBadge>
                )}
                {m.response.fallback && (
                  <StatusBadge tone="neutral">
                    <CloudOff className="mr-1 h-3 w-3" aria-hidden="true" /> Offline answer
                  </StatusBadge>
                )}
              </div>
            )}
          </div>
        ),
      )}
      {loading && <Loading message="Reading the transcript…" className="py-2" />}
    </div>
  );
}

/** Multi-line question input with a primary Send button (Enter sends, Shift+Enter adds a line). */
export function ChatInput({
  onSend,
  loading,
  placeholder,
  className,
}: {
  onSend: (q: string) => void;
  loading: boolean;
  placeholder: string;
  className?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  function submit() {
    if (!draft.trim() || loading) return;
    onSend(draft);
    setDraft("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn("flex items-end gap-2 bg-surface", className)}
    >
      <textarea
        ref={inputRef}
        rows={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field min-h-10 flex-1 resize-none rounded-md border border-border-strong bg-surface px-3 py-2 text-[16px] leading-6 text-copy outline-none transition-colors duration-150 sm:text-body"
      />
      <button type="submit" disabled={!draft.trim() || loading} className={cn(btn.primary, "h-10 px-4")}>
        <Send className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Send</span>
        <span className="sr-only sm:hidden">Send question</span>
      </button>
    </form>
  );
}
