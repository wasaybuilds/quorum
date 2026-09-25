import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/common/States";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 pt-20">
      <EmptyState
        icon={SearchX}
        title="We couldn't find that page"
        description="The meeting may have been removed, or the link is mistyped."
        action={
          <Link href="/meetings" className="inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-white hover:bg-slate-800">
            Back to meetings
          </Link>
        }
      />
    </div>
  );
}
