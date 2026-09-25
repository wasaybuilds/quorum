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

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (q: string) => void;
  onRetry: () => void;
  suggestions: string[];
  placeholder: string;
  empty: React.ReactNode;
  onSeek?: (timestamp: number) => void;
  className?: string;
}

/** Ask AI for a single meeting: prose answers with inline, clickable sources. */
export function ChatThread({ messages, loading, onSend, onRetry, suggestions, placeholder, empty, onSeek, className }: Props) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the latest question at the top of the view so a long answer reads from its start.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const questions = el.querySelectorAll<HTMLElement>("[data-question]");
    const last = questions[questions.length - 1];
    el.scrollTo({ top: last ? last.offsetTop - 16 : el.scrollHeight, behavior: "smooth" });
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
      <div ref={scrollRef} className="scroll-thin relative min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-6" aria-live="polite">
        {messages.length === 0 && !loading ? (
          <div>
            {empty}
            <div className="mt-4 flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-left text-body text-copy transition-colors duration-150 hover:border-border-strong hover:bg-surface-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((m) =>
              m.role === "user" ? (
                <p key={m.id} data-question className="rounded-md bg-surface-muted px-3 py-2 text-body font-medium text-ink">
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
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-end gap-2 border-t border-border bg-surface px-4 py-3 lg:px-6"
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
    </div>
  );
}
