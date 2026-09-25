"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CloudOff, MessageSquareText, Search } from "lucide-react";
import type { Meeting, MeetingType } from "@/lib/types";
import { btn, container, inputShell, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";
import { PageHeader } from "@/components/layout/PageHeader";
import { TabBar } from "@/components/common/TabBar";
import { EmptyState, ErrorState, Loading } from "@/components/common/States";
import { Badge, StatusBadge } from "@/components/common/TypeBadge";
import { AnswerText } from "./AnswerText";
import { SourceCard } from "./SourceCard";
import { useAskChat, type ChatMessage } from "./useAskChat";

type Scope = "all" | "sales" | "cs" | "internal";

const SCOPES: { key: Scope; label: string; types: MeetingType[] | null }[] = [
  { key: "all", label: "All meetings", types: null },
  { key: "sales", label: "Sales", types: ["sales"] },
  { key: "cs", label: "Customer success", types: ["cs"] },
  { key: "internal", label: "Internal", types: ["internal", "engineering"] },
];

const EXAMPLES: Record<Scope, string[]> = {
  all: ["What issues come up most in sales calls", "Which customers are worried about Salesforce sync", "What are our biggest open risks"],
  sales: ["What objections come up most often", "Where do deals get stuck on security", "How do prospects react to our pricing"],
  cs: ["Which accounts are at risk and why", "What are customers asking for most", "Where is there expansion potential"],
  internal: ["What did engineering decide about the migration", "What is on the Q4 roadmap", "What caused the sync incident"],
};

export function AskWorkspace({ meetings }: { meetings: Meeting[] }) {
  const params = useSearchParams();
  const [scope, setScope] = useState<Scope>("all");
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
      setDraft(initialQ);
      send(initialQ);
    }
  }, [initialQ, send]);

  function ask(q = draft) {
    if (!q.trim() || chat.loading) return;
    setDraft(q);
    send(q);
  }

  // Pair each question with its answer; newest first.
  const exchanges = useMemo(() => {
    const pairs: { q: ChatMessage; a?: ChatMessage }[] = [];
    chat.messages.forEach((m) => {
      if (m.role === "user") pairs.push({ q: m });
      else if (pairs.length) pairs[pairs.length - 1].a = m;
    });
    return pairs.reverse();
  }, [chat.messages]);

  return (
    <div className={container}>
      <PageHeader title="Ask Quorum" description={`Ask across ${count} meetings. Every answer links to the moment it was said.`} />

      <div className="scroll-thin mt-8 overflow-x-auto">
        <TabBar
          label="Scope"
          active={scope}
          onChange={(id) => {
            if (id === scope) return;
            setScope(id);
            chat.reset();
          }}
          tabs={SCOPES.map((sc) => ({ id: sc.key, label: sc.label }))}
          className="min-w-max"
        />
      </div>

      <form
        className="mt-6 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <div className={cn(inputShell, "h-12 flex-1 px-4")}>
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a question across your meetings"
            aria-label="Question"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-[16px] text-copy outline-none sm:text-body"
          />
        </div>
        <button type="submit" disabled={!draft.trim() || chat.loading} className={cn(btn.primary, size.lg)}>
          <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Ask Quorum
        </button>
      </form>

      {exchanges.length === 0 && !chat.loading && (
        <div className="mt-6">
          <p className="text-label text-muted">Try asking</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {EXAMPLES[scope].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className={cn(btn.secondary, "min-h-11 justify-start px-4 py-2 text-left")}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 space-y-12">
        {exchanges.map(({ q, a }) => (
            <section key={q.id} aria-label={q.content}>
              <h2 className="text-h2">{q.content}</h2>
              {!a ? (
                <Loading message="Searching across meetings…" />
              ) : a.error ? (
                <ErrorState className="mt-4" message="Couldn't reach the assistant. Check your connection and try again." onRetry={chat.retry} />
              ) : a.response && a.response.sources.length === 0 ? (
                <div className="mt-4 rounded-lg border border-border">
                  <EmptyState icon={Search} title="No results. Try a different question." description={a.content} />
                </div>
              ) : (
                <Answer message={a} />
              )}
            </section>
        ))}
      </div>
    </div>
  );
}

function Answer({ message }: { message: ChatMessage }) {
  const r = message.response;
  return (
    <div className="mt-4">
      <AnswerText text={message.content} />
      {r && (r.patterns?.length || r.fallback) ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {r.patterns?.map((p) => <Badge key={p}>{p}</Badge>)}
          {r.fallback && (
            <StatusBadge tone="neutral">
              <CloudOff className="mr-1 h-3 w-3" aria-hidden="true" /> Offline answer
            </StatusBadge>
          )}
        </div>
      ) : null}
      {r && r.sources.length > 0 && (
        <>
          <h3 className="mt-8 text-label font-medium text-muted">Sources · {r.sources.length}</h3>
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {r.sources.map((s) => (
              <SourceCard key={`${s.meetingId}-${s.timestamp}`} source={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
