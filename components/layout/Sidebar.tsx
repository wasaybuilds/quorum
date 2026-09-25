"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/components/search/SearchProvider";
import { Kbd, useModKey } from "@/components/common/Kbd";
import { Logo } from "./Logo";
import { NAV_ITEMS, isActive } from "./nav";
import { UserCard } from "./UserCard";

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Main">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-body transition-colors duration-150 hover:bg-border",
              active ? "bg-border font-medium text-accent-ink" : "text-copy",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const { openSearch } = useSearch();
  const mod = useModKey();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] flex-col border-r border-border bg-surface-muted lg:flex">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Logo />
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={openSearch}
          className="field flex h-10 w-full items-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-body text-placeholder transition-colors duration-150 hover:border-muted"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search</span>
          <Kbd>{mod}K</Kbd>
        </button>
      </div>

      <div className="mt-4 px-4">
        <NavLinks />
      </div>

      <div className="mt-auto border-t border-border p-4">
        <UserCard />
      </div>
    </aside>
  );
}
