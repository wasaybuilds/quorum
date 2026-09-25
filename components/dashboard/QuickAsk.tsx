"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { btn, inputShell, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

const EXAMPLES = [
  "What concerns came up in customer calls this week?",
  "Which decisions are still pending action?",
  "What did we commit to in the sales pipeline?",
];

const ask = (q: string) => `/ask?q=${encodeURIComponent(q)}`;

/** Entry point to Ask Quorum: submitting opens /ask with the question pre-filled and asked. */
export function QuickAsk() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <div>
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) router.push(ask(q.trim()));
        }}
      >
        <div className={cn(inputShell, "h-12 flex-1 px-4")}>
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask a question about your meetings..."
            aria-label="Ask a question about your meetings"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-copy outline-none sm:text-body"
          />
        </div>
        <button type="submit" disabled={!q.trim()} className={cn(btn.primary, size.lg)}>
          Ask Quorum
        </button>
      </form>
      <ul className="mt-4 flex flex-col gap-1">
        {EXAMPLES.map((e) => (
          <li key={e}>
            <Link
              href={ask(e)}
              className="group -mx-3 flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-body text-copy transition-colors duration-150 hover:bg-surface-muted hover:text-accent-ink"
            >
              {e}
              <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent-ink" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
