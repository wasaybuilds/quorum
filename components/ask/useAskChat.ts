"use client";

import { useCallback, useRef, useState } from "react";
import type { AskResponse } from "@/lib/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: AskResponse;
  error?: boolean;
}

let counter = 0;
const nextId = () => `msg-${++counter}`;

/**
 * Chat state for Ask Quorum. `endpoint` is one of the /api/ai/ask-* routes and
 * `extraBody` carries the route-specific fields (meetingId, meetingIds).
 */
export function useAskChat(endpoint: string, extraBody: Record<string, unknown>) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (question: string, prior: ChatMessage[]) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      const history = prior
        .filter((m) => !m.error)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...extraBody, question, history }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data: AskResponse = await res.json();
        setMessages((ms) => [...ms, { id: nextId(), role: "assistant", content: data.answer, response: data }]);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setMessages((ms) => [
          ...ms,
          { id: nextId(), role: "assistant", content: "I couldn't reach the assistant just now.", error: true },
        ]);
      } finally {
        if (abortRef.current === controller) setLoading(false);
      }
    },
    [endpoint, extraBody],
  );

  const send = useCallback(
    (raw: string) => {
      const question = raw.trim();
      if (!question || loading) return;
      const prior = messages;
      setMessages((ms) => [...ms, { id: nextId(), role: "user", content: question }]);
      void run(question, prior);
    },
    [loading, messages, run],
  );

  /** Re-asks the question that produced a failed answer. */
  const retry = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser || loading) return;
    const idx = messages.lastIndexOf(lastUser);
    const prior = messages.slice(0, idx);
    setMessages(messages.slice(0, idx + 1));
    void run(lastUser.content, prior);
  }, [loading, messages, run]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
  }, []);

  return { messages, loading, send, retry, reset };
}
