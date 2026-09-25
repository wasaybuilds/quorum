"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils/cn";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface px-1 font-sans text-[11px] font-medium text-muted",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

const noop = () => () => {};

/** "⌘" on Apple platforms, "Ctrl " elsewhere. Server render assumes Ctrl. */
export function useModKey() {
  return useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl "),
    () => "Ctrl ",
  );
}
