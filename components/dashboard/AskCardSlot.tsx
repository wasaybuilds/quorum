"use client";

import { useShell } from "@/components/layout/ShellContext";
import { AskCard } from "./AskCard";

/** Shows the dashboard Ask card unless the Ask Quorum side panel is already open. */
export function AskCardSlot() {
  const { askOpen } = useShell();
  return (
    <div className={askOpen ? "xl:hidden" : undefined}>
      <AskCard />
    </div>
  );
}
