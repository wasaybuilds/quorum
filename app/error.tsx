"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { btn, container, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={container}>
      <div role="alert" className="flex flex-col items-center pt-20 text-center">
        <AlertTriangle className="mb-3 h-6 w-6 text-danger" aria-hidden="true" />
        <h1 className="text-h3">Something went wrong</h1>
        <p className="mt-1 max-w-sm text-small text-muted">This page hit an unexpected error. Your meetings are safe.</p>
        <button type="button" onClick={reset} className={cn(btn.primary, size.md, "mt-4")}>
          Try again
        </button>
      </div>
    </div>
  );
}
