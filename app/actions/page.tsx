import type { Metadata } from "next";
import { allActionRows } from "@/lib/data/meetings";
import { container } from "@/lib/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { ActionsTable } from "@/components/actions/ActionsTable";

export const metadata: Metadata = { title: "Action items" };

export default function ActionsPage() {
  return (
    <div className={container}>
      <PageHeader title="Action items" description="Every follow-up committed to on a call, and who owns it." />
      <div className="mt-5">
        <ActionsTable rows={allActionRows()} />
      </div>
    </div>
  );
}
