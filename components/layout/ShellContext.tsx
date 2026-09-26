"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface Shell {
  collapsed: boolean;
  toggleSidebar: () => void;
  askOpen: boolean;
  toggleAsk: () => void;
}

const ShellContext = createContext<Shell>({ collapsed: false, toggleSidebar: () => {}, askOpen: false, toggleAsk: () => {} });

export const useShell = () => useContext(ShellContext);

const KEY = "quorum.shell";

/** Sidebar collapsed / Ask panel open, remembered per browser. */
export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      // Restore the viewer's layout after mount so server and client render the same defaults.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (typeof saved.collapsed === "boolean") setCollapsed(saved.collapsed);
      if (typeof saved.askOpen === "boolean") setAskOpen(saved.askOpen);
    } catch {
      // storage unavailable; keep defaults
    }
  }, []);

  const persist = (next: { collapsed: boolean; askOpen: boolean }) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => {
      persist({ collapsed: !c, askOpen });
      return !c;
    });
  }, [askOpen]);

  const toggleAsk = useCallback(() => {
    setAskOpen((o) => {
      persist({ collapsed, askOpen: !o });
      return !o;
    });
  }, [collapsed]);

  return <ShellContext.Provider value={{ collapsed, toggleSidebar, askOpen, toggleAsk }}>{children}</ShellContext.Provider>;
}
