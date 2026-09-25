import type { Metadata } from "next";
import { Suspense } from "react";
import { meetings } from "@/lib/data/meetings";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchResults } from "@/components/search/SearchResults";
import { SkeletonLines } from "@/components/common/States";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader title="Search" description="Find any meeting, person, or moment across every transcript." />
      <div className="mt-6">
        <Suspense fallback={<SkeletonLines lines={4} />}>
          <SearchResults meetings={meetings} />
        </Suspense>
      </div>
    </div>
  );
}
