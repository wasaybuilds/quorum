"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/components/search/SearchProvider";
import { useModKey } from "@/components/common/Kbd";
import { Logo } from "./Logo";
import { NAV_ITEMS, isActive } from "./nav";
import { UserCard } from "./UserCard";

/** Navigation for the dark sidebar and the dark mobile menu. */
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
              "relative flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-body transition-colors duration-150",
              active ? "bg-white/10 font-medium text-white" : "text-gray-300 hover:bg-white/5 hover:text-white",
            )}
          >
            {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#2dd4bf]" aria-hidden="true" />}
            <Icon className={cn("h-4 w-4", active ? "text-[#2dd4bf]" : "text-gray-400")} aria-hidden="true" />
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
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] flex-col bg-[#111827] lg:flex">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Logo tone="dark" />
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={openSearch}
          className="flex h-10 w-full items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-body text-gray-400 transition-colors duration-150 hover:border-white/20 hover:text-gray-200"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="inline-flex h-5 items-center rounded border border-white/15 px-1 font-sans text-[11px] font-medium text-gray-400">{mod}K</kbd>
        </button>
      </div>

      <div className="mt-4 px-4">
        <NavLinks />
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <UserCard tone="dark" />
      </div>
    </aside>
  );
}
