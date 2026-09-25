"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { Logo } from "./Logo";
import { NavLinks } from "./Sidebar";
import { UserCard } from "./UserCard";

const ICON_BTN = "flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors duration-150 hover:bg-surface-muted";

export function MobileNav() {
  const [open, setOpen] = useState(false);
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
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-2 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className={ICON_BTN} aria-label="Open menu" aria-expanded={open}>
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <button type="button" onClick={openSearch} className={ICON_BTN} aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-[#111827] lg:hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 pl-4 pr-2">
              <Logo tone="dark" />
              <button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-md text-gray-300 transition-colors duration-150 hover:bg-white/5 hover:text-white" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 pt-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <div className="mt-auto border-t border-white/10 p-4">
              <UserCard tone="dark" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
