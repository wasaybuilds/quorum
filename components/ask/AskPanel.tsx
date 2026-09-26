"use client";

import { useMemo, useState } from "react";
import { MessageSquareText, RotateCcw } from "lucide-react";
import type { MeetingType } from "@/lib/types";
import { meetings } from "@/lib/data/meetings";
import { cn } from "@/lib/utils/cn";
import { Select } from "@/components/common/Select";
import { ChatInput, ChatMessages } from "./ChatThread";
import { useAskChat } from "./useAskChat";

type Scope = "all" | "sales" | "cs" | "internal";

const SCOPE_TYPES: Record<Scope, MeetingType[] | null> = {
  all: null,
  sales: ["sales"],
  cs: ["cs"],
  internal: ["internal", "engineering"],
};

const SUGGESTIONS = [
  "Summarize this week's meetings",
  "What issues come up most in sales calls?",
  "Which customers are worried about Salesforce sync?",
];

/**
 * Always-available Ask Quorum panel (Fathom's "Ask Fathom"). Lives in the app
 * frame so the conversation survives navigation between pages.
 */
export function AskPanel({ className }: { className?: string }) {
  const [scope, setScope] = useState<Scope>("all");
  const body = useMemo(() => {
    const types = SCOPE_TYPES[scope];
    return types ? { meetingIds: meetings.filter((m) => types.includes(m.type)).map((m) => m.id) } : {};
  }, [scope]);
  const chat = useAskChat("/api/ai/ask-multi-meeting", body);

  return (
    <aside aria-label="Ask Quorum" className={cn("flex-col border-l border-border bg-surface", className)}>
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-5">
        <h2 className="flex items-center gap-2 text-h3">
          <MessageSquareText className="h-4 w-4 text-accent" aria-hidden="true" /> Ask Quorum
        </h2>
        {chat.messages.length > 0 && (
          <button
            type="button"
            onClick={chat.reset}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-label font-medium text-muted transition-colors duration-150 hover:bg-surface-muted hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> New session
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <ChatMessages
          messages={chat.messages}
          loading={chat.loading}
          onSend={chat.send}
          onRetry={chat.retry}
          suggestions={SUGGESTIONS}
          showMeeting
          loadingText="Searching across meetings…"
          empty={
            <div>
              <h3 className="text-h3">Ask across your meetings</h3>
              <p className="mt-1 text-small text-muted">Answers link to the exact moment it was said.</p>
            </div>
          }
        />
      </div>

      <div className="shrink-0 space-y-2 border-t border-border px-5 py-3">
        <ChatInput onSend={chat.send} loading={chat.loading} placeholder="Ask anything…" />
        <Select
          label="Scope"
          value={scope}
          onChange={(s) => {
            setScope(s);
            chat.reset();
          }}
          className="h-9 w-48"
          options={[
            { value: "all", label: "All meetings" },
            { value: "sales", label: "Sales calls" },
            { value: "cs", label: "Customer success" },
            { value: "internal", label: "Internal" },
          ]}
        />
      </div>
    </aside>
  );
}
