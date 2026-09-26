"use client";

import { cn } from "@/lib/utils/cn";

/** Switch with a 44px touch target. */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="-m-2 flex h-11 w-14 shrink-0 items-center justify-center"
    >
      <span className={cn("relative h-6 w-10 rounded-full transition-colors duration-150", checked ? "bg-accent-ink" : "bg-disabled")}>
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-[left] duration-150",
            checked ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
