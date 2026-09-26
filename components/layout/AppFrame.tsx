"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { AskPanel } from "@/components/ask/AskPanel";
import { ShellProvider, useShell } from "./ShellContext";
import { Sidebar } from "./Sidebar";
import { PanelHeader } from "./PanelHeader";
import { MobileHeader } from "./MobileHeader";
import { hasOwnAsk } from "./nav";

/*
 * Layout
 * - lg+: dark frame, collapsible sidebar on the left, and the page inside an inset
 *   rounded panel. The panel's header is fixed; `main` is the one scroll area.
 *   The Ask Quorum panel opens as a right-hand column on xl+.
 * - below lg: dark sticky top bar with a slide-out menu; the window scrolls.
 */
function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { collapsed, askOpen } = useShell();
  const panel = askOpen && !hasOwnAsk(pathname);

  return (
    <div className="min-h-screen bg-[#111827] lg:flex lg:h-dvh lg:overflow-hidden">
      <Sidebar collapsed={collapsed} className="hidden lg:flex" />
      <MobileHeader />
      <div className="flex min-h-[calc(100dvh-3.5rem)] min-w-0 flex-1 flex-col bg-page lg:my-2.5 lg:mr-2.5 lg:min-h-0 lg:overflow-hidden lg:rounded-xl">
        <PanelHeader className="hidden lg:flex" />
        <div className="flex min-h-0 flex-1">
          <main id="main" className="page-in @container min-w-0 flex-1 lg:overflow-y-auto">
            {children}
          </main>
          {/* Stays mounted so its conversation survives navigation */}
          <AskPanel className={cn("hidden w-[380px] shrink-0", panel && "xl:flex")} />
        </div>
      </div>
    </div>
  );
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <Frame>{children}</Frame>
    </ShellProvider>
  );
}
