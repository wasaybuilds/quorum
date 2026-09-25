import { AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { btn, size } from "@/lib/ui";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6 animate-[spin_0.8s_linear_infinite]", className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="var(--border)" strokeWidth="2.5" />
      <path d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Loading({ message, className }: { message: string; className?: string }) {
  return (
    <div role="status" className={cn("flex items-center gap-3 py-6 text-body text-muted", className)}>
      <Spinner />
      {message}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <Icon className="mb-3 h-6 w-6 text-disabled" aria-hidden="true" />
      <h3 className="text-h3">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-small text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center", className)}>
      <AlertTriangle className="h-6 w-6 shrink-0 text-danger" aria-hidden="true" />
      <p className="flex-1 text-body text-copy">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={cn(btn.secondary, size.sm)}>
          Try again
        </button>
      )}
    </div>
  );
}
