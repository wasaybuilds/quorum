import type { Metadata } from "next";
import { Suspense } from "react";
import { meetings } from "@/lib/data/meetings";
import { container } from "@/lib/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchResults } from "@/components/search/SearchResults";
import { Loading } from "@/components/common/States";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className={container}>
      <PageHeader title="Search" description="Find any meeting, person, or moment across every transcript." />
      <div className="mt-5">
        <Suspense fallback={<Loading message="Loading search…" />}>
          <SearchResults meetings={meetings} />
        </Suspense>
      </div>
    </div>
  );
}
