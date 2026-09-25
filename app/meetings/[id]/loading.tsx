import { Skeleton, SkeletonLines } from "@/components/common/States";

export default function Loading() {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="mx-auto w-full max-w-4xl space-y-5 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <Skeleton className="h-24 rounded-xl" />
        <div className="rounded-xl border border-border bg-surface p-5">
          <SkeletonLines lines={4} />
        </div>
      </div>
      <div className="hidden border-l border-border bg-surface p-4 xl:block">
        <SkeletonLines lines={10} />
      </div>
    </div>
  );
}
