"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, PanelLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/components/search/SearchProvider";
import { useModKey } from "@/components/common/Kbd";
import { useShell } from "./ShellContext";
import { hasOwnAsk, pageTitle } from "./nav";

const ICON_BTN =
  "flex h-10 w-10 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-surface-muted hover:text-ink";

/** Header inside the content panel (desktop): sidebar toggle, page title, search, Ask. */
export function PanelHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const { collapsed, toggleSidebar, askOpen, toggleAsk } = useShell();
  const { openSearch } = useSearch();
  const mod = useModKey();
  const showAsk = !hasOwnAsk(pathname);

  return (
    <header className={cn("h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4", className)}>
      <button
        type="button"
        onClick={toggleSidebar}
        className={ICON_BTN}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <PanelLeft className="h-5 w-5" />
      </button>
      <p className="text-h3 font-semibold text-ink">{pageTitle(pathname)}</p>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={openSearch}
          className="field hidden h-10 w-72 items-center gap-2 rounded-md border border-border bg-surface-muted px-3 text-body text-placeholder transition-colors duration-150 hover:border-border-strong xl:flex"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search meetings</span>
          <kbd className="inline-flex h-5 items-center rounded border border-border bg-surface px-1 font-sans text-[11px] font-medium text-muted">{mod}K</kbd>
        </button>
        <button type="button" onClick={openSearch} className={cn(ICON_BTN, "xl:hidden")} aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
        {showAsk && (
          <>
            <button
              type="button"
              onClick={toggleAsk}
              aria-pressed={askOpen}
              className={cn(
                "hidden h-10 items-center gap-2 rounded-md px-3.5 text-body font-medium transition-colors duration-150 xl:inline-flex",
                askOpen ? "bg-accent-soft text-accent-hover" : "bg-accent-ink text-white hover:bg-accent-hover",
              )}
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              {askOpen ? "Hide Ask Quorum" : "Ask Quorum"}
            </button>
            <Link href="/ask" className="inline-flex h-10 items-center gap-2 rounded-md bg-accent-ink px-3.5 text-body font-medium text-white transition-colors duration-150 hover:bg-accent-hover xl:hidden">
              <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Ask
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
