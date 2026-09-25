"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/components/search/SearchProvider";
import { Logo } from "./Logo";
import { NAV_ITEMS, isActive } from "./nav";
import { UserCard } from "./UserCard";
import { Kbd, useModKey } from "@/components/common/Kbd";

export function Sidebar() {
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const mod = useModKey();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={openSearch}
          className="flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search</span>
          <Kbd>{mod}K</Kbd>
        </button>
      </div>

      <nav className="mt-4 flex flex-col gap-0.5 px-3" aria-label="Main">
        {NAV_ITEMS.filter((item) => item.href !== "/search").map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active ? "bg-surface-muted text-foreground" : "text-muted hover:bg-surface-muted/70 hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-accent" : "")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border p-3">
        <UserCard />
      </div>
    </aside>
  );
}
