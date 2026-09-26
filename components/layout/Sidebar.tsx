"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LogIn, LogOut } from "lucide-react";
import { initials } from "@/lib/utils/format";
import { useSession } from "@/components/auth/SessionProvider";
import { LogoMark } from "./Logo";
import { NAV_ITEMS, isActive } from "./nav";

/**
 * Dark navigation rail. Expanded: icon + label (240px). Collapsed: icons only (64px),
 * with the label available as a tooltip and to screen readers.
 */
export function Sidebar({ collapsed, onNavigate, className }: { collapsed: boolean; onNavigate?: () => void; className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "flex shrink-0 flex-col bg-[#1c1c1c] py-4 transition-[width] duration-150 ease-in-out",
        collapsed ? "w-16 items-center px-2" : "w-60 px-3",
        className,
      )}
    >
      <Link href="/" onClick={onNavigate} className={cn("flex h-10 items-center gap-2.5 rounded-md", collapsed ? "justify-center" : "px-2")} aria-label="Quorum home">
        <LogoMark tone="dark" className="h-8 w-8" />
        {!collapsed && <span className="text-[16px] font-semibold tracking-tight text-white">Quorum</span>}
      </Link>

      <nav aria-label="Main" className={cn("mt-6 flex flex-col gap-1", collapsed && "items-center")}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              aria-label={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg text-body transition-colors duration-150",
                collapsed ? "w-11 justify-center" : "px-3",
                active ? "bg-[#155eef] font-medium text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <AccountSection collapsed={collapsed} />
    </aside>
  );
}

function AccountSection({ collapsed }: { collapsed: boolean }) {
  const { user, demo, loading, signOut } = useSession();
  const name = user ? user.name || user.email : "Demo workspace";
  const sub = user ? user.email : demo ? "Sample data · not saved" : "";
  const avatar = (
    <span
      title={user ? `${name} · ${user.email}` : name}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#155eef] text-label font-semibold text-white ring-2 ring-white/10"
    >
      {user ? initials(name) : "D"}
    </span>
  );
  const actionCls =
    "flex h-9 items-center justify-center gap-2 rounded-md text-label font-medium text-gray-300 transition-colors duration-150 hover:bg-white/5 hover:text-white";

  if (loading) return <div className="mt-auto h-9" />;

  if (collapsed) {
    return (
      <div className="mt-auto flex flex-col items-center gap-2 pt-4">
        {avatar}
        {user ? (
          <button type="button" onClick={signOut} className={cn(actionCls, "w-9")} title="Sign out" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <a href="/login" className={cn(actionCls, "w-9")} title="Sign in" aria-label="Sign in">
            <LogIn className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="mt-auto border-t border-white/10 px-2 pt-4">
      <div className="flex items-center gap-3">
        {avatar}
        <div className="min-w-0">
          <p className="truncate text-body font-medium text-white">{name}</p>
          <p className="truncate text-label text-gray-400">{sub}</p>
        </div>
      </div>
      {user ? (
        <button type="button" onClick={signOut} className={cn(actionCls, "mt-3 w-full border border-white/10")}>
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      ) : (
        <a href="/login" className={cn(actionCls, "mt-3 w-full bg-white/10 text-white hover:bg-white/15")}>
          <LogIn className="h-4 w-4" /> Sign in with Google
        </a>
      )}
    </div>
  );
}
