"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import type { Meeting, MeetingType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ChatThread } from "./ChatThread";
import { useAskChat } from "./useAskChat";

type Scope = "all" | "sales" | "cs" | "team";

const SCOPES: { key: Scope; label: string; types: MeetingType[] | null }[] = [
  { key: "all", label: "All meetings", types: null },
  { key: "sales", label: "Sales calls", types: ["sales"] },
  { key: "cs", label: "Customer success", types: ["cs"] },
  { key: "team", label: "Internal & engineering", types: ["internal", "engineering"] },
];

const SUGGESTIONS: Record<Scope, string[]> = {
  all: [
    "What issues come up repeatedly in sales calls?",
    "Which customers are worried about Salesforce sync?",
    "What are our biggest open risks right now?",
  ],
  sales: ["What objections come up most often?", "Where do deals get stuck on security?", "How do prospects react to our pricing?"],
  cs: ["Which accounts are at risk and why?", "What are customers asking for most?", "Where is there expansion potential?"],
  team: ["What did engineering decide about the migration?", "What's on the Q4 roadmap?", "What caused the sync incident?"],
};

export function AskWorkspace({ meetings }: { meetings: Meeting[] }) {
  const params = useSearchParams();
  const [scope, setScope] = useState<Scope>("all");

  const body = useMemo<{ meetingIds?: string[] }>(() => {
    const types = SCOPES.find((s) => s.key === scope)?.types;
    return types ? { meetingIds: meetings.filter((m) => types.includes(m.type)).map((m) => m.id) } : {};
  }, [scope, meetings]);
  const chat = useAskChat("/api/ai/ask-multi-meeting", body);
  const { send } = chat;

  const count = body.meetingIds?.length ?? meetings.length;

  // Ask the ?q= question once (dashboard suggestions and the search palette link here).
  const initialQ = params.get("q");
  const asked = useRef(false);
  useEffect(() => {
    if (initialQ && !asked.current) {
      asked.current = true;
      send(initialQ);
    }
  }, [initialQ, send]);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col lg:h-dvh">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Ask Quorum</h1>
              <p className="mt-0.5 text-sm text-muted">Questions across {count} meetings. Every answer cites the moments it came from.</p>
            </div>
            {chat.messages.length > 0 && (
              <button
                type="button"
                onClick={chat.reset}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted hover:bg-surface-muted hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> New chat
              </button>
            )}
          </div>
          <div className="scroll-thin -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Scope">
            {SCOPES.map((s) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={scope === s.key}
                onClick={() => {
                  if (scope === s.key) return;
                  setScope(s.key);
                  chat.reset();
                }}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-sm transition-colors",
                  scope === s.key
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
        <ChatThread
          messages={chat.messages}
          loading={chat.loading}
          onSend={chat.send}
          onRetry={chat.retry}
          suggestions={SUGGESTIONS[scope]}
          placeholder="Ask across your meetings…"
          showMeeting
          autoFocus
          className="flex-1"
          empty={
            <div className="pt-4 sm:pt-10">
              <p className="text-lg font-semibold text-foreground">What do you want to know?</p>
              <p className="mt-1 text-sm text-muted">
                Spot patterns across calls, find who said what, or check what was promised. Try one of these:
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
