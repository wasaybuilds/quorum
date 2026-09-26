"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { AskPanel } from "@/components/ask/AskPanel";
import { TopBar } from "./TopBar";
import { hasOwnAsk } from "./nav";

/**
 * Top bar, page content and (on xl+) the persistent Ask Quorum panel. The panel
 * stays mounted while hidden so its conversation survives navigation.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const panel = !hasOwnAsk(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className={cn("flex-1", panel && "xl:grid xl:grid-cols-[minmax(0,1fr)_380px]")}>
        <main className="page-in min-w-0">{children}</main>
        <AskPanel className={cn("hidden", panel && "xl:sticky xl:top-28 xl:flex xl:h-[calc(100dvh-7rem)]")} />
      </div>
    </div>
  );
}
