import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/common/States";
import { btn, container, size } from "@/lib/ui";
import { cn } from "@/lib/utils/cn";

export default function NotFound() {
  return (
    <div className={container}>
      <EmptyState
        className="pt-20"
        icon={SearchX}
        title="We couldn't find that page"
        description="The meeting may have been removed, or the link is mistyped."
        action={
          <Link href="/meetings" className={cn(btn.primary, size.md)}>
            Back to all meetings
          </Link>
        }
      />
    </div>
  );
}
