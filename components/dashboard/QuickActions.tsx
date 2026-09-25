"use client";

import Link from "next/link";
import { MessageSquareText, Search } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { Kbd, useModKey } from "@/components/common/Kbd";
import { btn, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

export function QuickActions() {
  const { openSearch } = useSearch();
  const mod = useModKey();
  return (
    <>
      <button type="button" onClick={openSearch} className={cn(btn.secondary, size.md)}>
        <Search className="h-4 w-4" aria-hidden="true" /> Search <Kbd className="hidden sm:inline-flex">{mod}K</Kbd>
      </button>
      <Link href="/ask" className={cn(btn.primary, size.md)}>
        <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Ask Quorum
      </Link>
    </>
  );
}
