import type { Metadata } from "next";
import { Suspense } from "react";
import { meetings } from "@/lib/data/meetings";
import { AskWorkspace } from "@/components/ask/AskWorkspace";

export const metadata: Metadata = { title: "Ask Quorum" };

export default function AskPage() {
  return (
    <Suspense>
      <AskWorkspace meetings={meetings} />
    </Suspense>
  );
}
