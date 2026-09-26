"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";
import { useSearch } from "@/components/search/SearchProvider";
import { useModKey } from "@/components/common/Kbd";
import { Logo } from "./Logo";
import { NAV_ITEMS, isActive } from "./nav";

function Tabs({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={cn("flex h-12 items-stretch gap-1 overflow-x-auto px-2 lg:px-4", className)}>
      {NAV_ITEMS.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-3 text-body transition-colors duration-150",
              active ? "border-[#2dd4bf] font-semibold text-white" : "border-transparent font-medium text-gray-300 hover:text-white",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Dark app bar in the spirit of Fathom: logo, global search and account on one
 * row, section tabs underneath. The whole bar is sticky from lg; on phones only
 * the top row sticks and the tabs scroll away to save height.
 */
export function TopBar() {
  const { openSearch } = useSearch();
  const mod = useModKey();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#111827]">
        <div className="flex h-14 items-center gap-4 px-4 lg:h-16 lg:px-6">
          <Logo tone="dark" />

          <button
            type="button"
            onClick={openSearch}
            className="ml-2 hidden h-10 w-full max-w-md items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-body text-gray-400 transition-colors duration-150 hover:border-white/20 hover:text-gray-200 md:flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1 text-left">Search meetings, people, or anything said</span>
            <kbd className="inline-flex h-5 items-center rounded border border-white/15 px-1 font-sans text-[11px] font-medium">{mod}K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="flex h-11 w-11 items-center justify-center rounded-md text-gray-300 transition-colors duration-150 hover:bg-white/5 hover:text-white md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5" title="Abdul Wasay · Lattice Labs (demo workspace)">
              <span className="hidden text-right lg:block">
                <span className="block text-label font-medium leading-tight text-white">Abdul Wasay</span>
                <span className="block text-[11px] leading-tight text-gray-400">Lattice Labs</span>
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f766e] text-label font-semibold text-white">
                {initials("Abdul Wasay")}
              </span>
            </div>
          </div>
        </div>
        <Tabs className="hidden border-t border-white/10 lg:flex" />
      </header>
      <div className="border-t border-white/10 bg-[#111827] lg:hidden">
        <Tabs />
      </div>
    </>
  );
}
