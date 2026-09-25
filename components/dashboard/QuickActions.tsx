"use client";

import Link from "next/link";
import { MessageSquareText, Search, Video } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { Kbd, useModKey } from "@/components/common/Kbd";

const BTN = "inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors";

export function QuickActions() {
  const { openSearch } = useSearch();
  const mod = useModKey();
  return (
    <>
      <Link href="/ask" className={`${BTN} bg-foreground text-white hover:bg-slate-800`}>
        <MessageSquareText className="h-4 w-4" /> Ask Quorum
      </Link>
      <Link href="/meetings" className={`${BTN} border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted/60`}>
        <Video className="h-4 w-4" /> All meetings
      </Link>
      <button
        type="button"
        onClick={openSearch}
        className={`${BTN} border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted/60`}
      >
        <Search className="h-4 w-4" /> Search <Kbd className="hidden sm:inline-flex">{mod}K</Kbd>
      </button>
    </>
  );
}
