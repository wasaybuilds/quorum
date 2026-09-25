import { Avatar } from "@/components/common/Avatar";

/** Auth is stubbed: the workspace always belongs to one demo user. */
export function UserCard() {
  return (
    <div className="flex items-center gap-3">
      <Avatar name="Abdul Wasay" size="md" />
      <div className="min-w-0">
        <p className="truncate text-body font-medium text-ink">Abdul Wasay</p>
        <p className="truncate text-label text-muted">Lattice Labs · Demo workspace</p>
      </div>
    </div>
  );
}
