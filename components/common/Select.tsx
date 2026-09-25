import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Native select styled like the inputs (40px, 12px padding, accent focus). */
export function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <label className={cn("field relative flex h-10 items-center rounded-md border border-border-strong bg-surface", className)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent pl-3 pr-9 text-[16px] text-copy outline-none sm:text-body"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted" aria-hidden="true" />
    </label>
  );
}
