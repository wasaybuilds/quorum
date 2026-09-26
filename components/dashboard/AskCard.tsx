"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, MessageSquareText } from "lucide-react";

const EXAMPLES = [
  "What concerns came up in customer calls this week?",
  "Which decisions are still pending action?",
  "What did we commit to in the sales pipeline?",
];

const ask = (q: string) => `/ask?q=${encodeURIComponent(q)}`;

/** Dark feature card: the entry point to cross-meeting questions. */
export function AskCard() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <section aria-labelledby="askcard-heading" className="rounded-lg bg-[#1c1c1c] p-5 text-white lg:p-6">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-[#528bff]" aria-hidden="true" />
        <h2 id="askcard-heading" className="text-h3 text-white">
          Ask Quorum
        </h2>
      </div>
      <p className="mt-1 text-small text-gray-400">Questions across every meeting, answered with sources.</p>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) router.push(ask(q.trim()));
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask a question about your meetings..."
          aria-label="Ask a question about your meetings"
          className="h-10 min-w-0 flex-1 rounded-md border border-white/15 bg-white/5 px-3 text-[16px] text-white outline-none transition-colors duration-150 placeholder:text-gray-500 focus:border-[#528bff] sm:text-body"
        />
        <button
          type="submit"
          disabled={!q.trim()}
          className="inline-flex h-10 items-center rounded-md bg-[#155eef] px-4 text-body font-medium text-white transition-colors duration-150 hover:bg-[#004eeb] disabled:bg-white/10 disabled:text-gray-500"
        >
          Ask
        </button>
      </form>

      <ul className="mt-4 space-y-1">
        {EXAMPLES.map((e) => (
          <li key={e}>
            <Link
              href={ask(e)}
              className="group -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-md px-2 text-small text-gray-300 transition-colors duration-150 hover:bg-white/5 hover:text-white"
            >
              {e}
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-500 group-hover:text-[#528bff]" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
