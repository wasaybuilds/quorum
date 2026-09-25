"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/common/States";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 pt-20">
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        description="This page hit an unexpected error. Your meetings are safe; try loading it again."
        action={
          <button type="button" onClick={reset} className="inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-white hover:bg-slate-800">
            Try again
          </button>
        }
      />
    </div>
  );
}
