import { Loading } from "@/components/common/States";

export default function MeetingLoading() {
  return (
    <div className="px-4 pt-8 sm:px-6 lg:px-8">
      <Loading message="Loading meeting…" />
    </div>
  );
}
