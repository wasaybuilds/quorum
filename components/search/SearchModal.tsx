"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CornerDownLeft, MessageSquareText, Quote, Search, Video } from "lucide-react";
import { meetings } from "@/lib/data/meetings";
import { search } from "@/lib/utils/search";
import { formatDate, formatTimestamp } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { TypeBadge } from "@/components/common/TypeBadge";
import { Kbd } from "@/components/common/Kbd";
import { Highlight } from "./Highlight";

interface Item {
  key: string;
  href: string;
  render: (active: boolean) => React.ReactNode;
}

interface Section {
  title: string;
  items: Item[];
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && <SearchDialog onClose={onClose} />}
    </AnimatePresence>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const deferred = useDeferredValue(query);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const sections = useMemo<Section[]>(() => buildSections(deferred), [deferred]);
  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const active = Math.min(activeIndex, Math.max(flat.length - 1, 0));

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) go(item.href);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  const offsets = sections.map((_, s) => sections.slice(0, s).reduce((n, sec) => n + sec.items.length, 0));

  return (
    <div className="fixed inset-0 z-50" onKeyDown={onKeyDown}>
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search meetings"
        className="absolute left-1/2 top-4 flex max-h-[calc(100dvh-2rem)] w-[90%] max-w-[600px] -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card sm:top-[12vh] sm:max-h-[70vh]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search meetings, people, or anything said…"
            className="h-14 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none"
            aria-label="Search query"
            aria-controls="search-results"
            aria-activedescendant={flat[active] ? `search-item-${active}` : undefined}
          />
          <button type="button" onClick={onClose} className="shrink-0" aria-label="Close search">
            <Kbd>Esc</Kbd>
          </button>
        </div>

        <div ref={listRef} id="search-results" role="listbox" className="scroll-thin flex-1 overflow-y-auto p-2">
          {sections.map((section, s) => (
            <div key={section.title} className="mb-1">
              <p className="px-3 pb-1 pt-2 text-label font-medium text-muted">{section.title}</p>
              {section.items.map((item, j) => {
                const i = offsets[s] + j;
                const isActive = i === active;
                return (
                  <button
                    key={item.key}
                    id={`search-item-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isActive}
                    type="button"
                    onMouseMove={() => setActiveIndex(i)}
                    onClick={() => go(item.href)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-150",
                      isActive ? "bg-surface-muted" : "",
                    )}
                  >
                    {item.render(isActive)}
                  </button>
                );
              })}
            </div>
          ))}
          {deferred.trim() && flat.length <= 2 && (
            <p className="px-3 pb-3 pt-1 text-small text-muted">
              No meetings or transcript lines match “{deferred.trim()}”. Try a name, company, or topic like “pricing”.
            </p>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-border bg-surface-muted px-4 py-2.5 text-label text-muted sm:flex">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>
              <CornerDownLeft className="h-3 w-3" />
            </Kbd>{" "}
            open
          </span>
          <span className="ml-auto">Searches {meetings.length} meetings and their transcripts</span>
        </div>
      </motion.div>
    </div>
  );
}

function buildSections(raw: string): Section[] {
  const q = raw.trim();

  if (!q) {
    return [
      {
        title: "Recent meetings",
        items: meetings.slice(0, 5).map((m) => ({
          key: m.id,
          href: `/meetings/${m.id}`,
          render: () => <MeetingRow title={m.title} sub={`${m.company} · ${formatDate(m.date)}`} type={m.type} />,
        })),
      },
      {
        title: "Jump to",
        items: [
          {
            key: "ask",
            href: "/ask",
            render: () => <ActionRow icon={MessageSquareText} label="Ask Quorum across all meetings" />,
          },
          {
            key: "all",
            href: "/meetings",
            render: () => <ActionRow icon={Video} label="View all meetings" />,
          },
        ],
      },
    ];
  }

  const results = search(meetings, q, 8);
  const sections: Section[] = [];

  if (results.meetings.length) {
    sections.push({
      title: "Meetings",
      items: results.meetings.slice(0, 5).map(({ meeting: m, matchedOn }) => ({
        key: `m-${m.id}`,
        href: `/meetings/${m.id}`,
        render: () => (
          <MeetingRow
            title={<Highlight text={m.title} query={q} />}
            sub={
              matchedOn.startsWith("Participant") ? (
                <Highlight text={`${matchedOn} · ${m.company}`} query={q} />
              ) : (
                <Highlight text={`${m.company} · ${formatDate(m.date)}`} query={q} />
              )
            }
            type={m.type}
          />
        ),
      })),
    });
  }

  if (results.lines.length) {
    sections.push({
      title: "In transcripts",
      items: results.lines.map(({ meeting: m, entry, snippet }) => ({
        key: `l-${m.id}-${entry.timestamp}`,
        href: `/meetings/${m.id}?t=${entry.timestamp}`,
        render: () => (
          <>
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-body text-copy">
                <Highlight text={snippet} query={q} />
              </span>
              <span className="mt-0.5 block truncate text-label text-muted">
                {entry.speaker} · {m.title} ·{" "}
                <span className="font-mono text-stamp">{formatTimestamp(entry.timestamp)}</span>
              </span>
            </span>
          </>
        ),
      })),
    });
  }

  sections.push({
    title: "Actions",
    items: [
      {
        key: "ask-q",
        href: `/ask?q=${encodeURIComponent(q)}`,
        render: () => <ActionRow icon={MessageSquareText} label={`Ask Quorum: “${q}”`} />,
      },
      {
        key: "all-results",
        href: `/search?q=${encodeURIComponent(q)}`,
        render: () => <ActionRow icon={Search} label="See all search results" />,
      },
    ],
  });

  return sections;
}

function MeetingRow({ title, sub, type }: { title: React.ReactNode; sub: React.ReactNode; type: Parameters<typeof TypeBadge>[0]["type"] }) {
  return (
    <>
      <Video className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block truncate text-label text-muted">{sub}</span>
      </span>
      <TypeBadge type={type} className="hidden sm:inline-flex" />
    </>
  );
}

function ActionRow({ icon: Icon, label }: { icon: typeof Search; label: string }) {
  return (
    <>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-body text-copy">{label}</span>
      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
    </>
  );
}
