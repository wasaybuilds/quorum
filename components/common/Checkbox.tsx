"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** 18px box inside a 44px touch target. */
export function Checkbox({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`Mark "${label}" as ${checked ? "pending" : "completed"}`}
      onClick={onToggle}
      className="-m-3 flex h-11 w-11 shrink-0 items-center justify-center"
    >
      <span
        className={cn(
          "flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors duration-150",
          checked ? "border-accent-ink bg-accent-ink text-white" : "border-border-strong bg-surface hover:border-muted",
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </button>
  );
}
