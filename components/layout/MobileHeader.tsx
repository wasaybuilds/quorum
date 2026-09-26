"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { pageTitle } from "./nav";

const ICON_BTN = "flex h-11 w-11 items-center justify-center rounded-md text-gray-300 transition-colors duration-150 hover:bg-white/5 hover:text-white";

/** Phones and tablets: dark top bar with a slide-out copy of the sidebar. */
export function MobileHeader() {
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
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 bg-[#111827] px-2 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className={ICON_BTN} aria-label="Open menu" aria-expanded={open}>
          <Menu className="h-5 w-5" />
        </button>
        <Logo tone="dark" />
        <span className="ml-1 truncate text-body text-gray-400">/ {pageTitle(pathname)}</span>
        <button type="button" onClick={openSearch} className={`${ICON_BTN} ml-auto`} aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-y-0 left-0 flex"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Sidebar collapsed={false} onNavigate={() => setOpen(false)} className="h-full w-72" />
              <button type="button" onClick={() => setOpen(false)} className={`${ICON_BTN} absolute right-2 top-3`} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
