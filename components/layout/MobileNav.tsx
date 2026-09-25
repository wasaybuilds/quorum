"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/components/search/SearchProvider";
import { Logo } from "./Logo";
import { NAV_ITEMS, isActive } from "./nav";
import { UserCard } from "./UserCard";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { openSearch } = useSearch();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/95 px-2 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface-muted"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <button
          type="button"
          onClick={openSearch}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface-muted"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-slate-900/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              aria-label="Main"
              className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-surface shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex h-14 items-center justify-between pl-5 pr-2">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-surface-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-3 pt-2">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center gap-3 rounded-lg px-3 text-[15px] font-medium",
                        active ? "bg-surface-muted text-foreground" : "text-muted hover:bg-surface-muted",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active && "text-accent")} />
                      {label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto border-t border-border p-3">
                <UserCard />
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
