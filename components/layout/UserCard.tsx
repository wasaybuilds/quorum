import { Avatar } from "@/components/common/Avatar";

/** Auth is stubbed: the workspace always belongs to one demo user. */
export function UserCard() {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
      <Avatar name="Abdul Wasay" size="md" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">Abdul Wasay</p>
        <p className="truncate text-xs text-muted">Lattice Labs · Demo workspace</p>
      </div>
    </div>
  );
}
