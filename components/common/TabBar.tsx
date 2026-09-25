import { cn } from "@/lib/utils/cn";

export interface Tab<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  /** small accent dot, e.g. "has new messages" */
  dot?: boolean;
}

/**
 * 48px tab bar: 14px labels, active tab 600 weight with a 2px teal underline.
 * `fill` stretches tabs to share the width (mobile).
 */
export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  label,
  fill = false,
  className,
}: {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  label: string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex border-b border-border bg-surface", className)}>
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap border-b-2 text-body transition-colors duration-150",
              fill ? "min-w-0 flex-1 px-1" : "px-4",
              selected ? "border-accent-ink font-semibold text-accent-ink" : "border-transparent font-medium text-muted hover:text-ink",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.dot && !selected && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="new" />}
          </button>
        );
      })}
    </div>
  );
}
