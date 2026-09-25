import { initials } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/** Auth is stubbed: the workspace always belongs to one demo user. */
export function UserCard({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-label font-semibold",
          dark ? "bg-[#0f766e] text-white" : "bg-surface-disabled text-copy",
        )}
      >
        {initials("Abdul Wasay")}
      </span>
      <div className="min-w-0">
        <p className={cn("truncate text-body font-medium", dark ? "text-white" : "text-ink")}>Abdul Wasay</p>
        <p className={cn("truncate text-label", dark ? "text-gray-400" : "text-muted")}>Lattice Labs · Demo workspace</p>
      </div>
    </div>
  );
}
