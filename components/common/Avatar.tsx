import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-label",
};

/** Initials only, no photos. Neutral so the single accent colour stays meaningful. */
export function Avatar({ name, size = "sm", className }: { name: string; size?: keyof typeof SIZES; className?: string }) {
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full bg-surface-disabled font-semibold text-copy",
        SIZES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ names, max = 4, size = "xs" }: { names: string[]; max?: number; size?: keyof typeof SIZES }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="flex -space-x-1.5">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={size} className="ring-2 ring-surface" />
      ))}
      {extra > 0 && (
        <span className={cn("inline-flex items-center justify-center rounded-full bg-surface-muted font-medium text-muted ring-2 ring-surface", SIZES[size])}>
          +{extra}
        </span>
      )}
    </div>
  );
}
